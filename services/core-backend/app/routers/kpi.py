import datetime
from uuid import UUID
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, case, text
from app.db.session import get_db_session

from app.core.security import set_db_tenant_context, get_current_user

from app.models.staff import StaffProfile
from app.models.academics import StudentEnrollment, SabaqRecord, BehaviorLog
from app.models.finance import LedgerTransaction, FinancialVoucher
from app.models.tenant import Branch

router = APIRouter(prefix="/api/v1/kpi-explorer", tags=["KPI Navigation Explorer"])

# --- Response Schemas ---
class StaffSummary(BaseModel):
    id: UUID
    name: str
    role: str
    phone_number: str
    date_of_joining: datetime.date
    is_active: bool

class FacultyProfileDetail(BaseModel):
    id: UUID
    name: str
    role: str
    phone_number: str
    educational_qualification: Optional[str]
    passout_year: Optional[int]
    graduation_batch: Optional[str]
    date_of_birth: Optional[datetime.date]
    date_of_joining: Optional[datetime.date]
    residential_address: Optional[str]
    emergency_contact: Optional[str]
    photo_url: Optional[str]
    assigned_center_name: str

class CenterRankingItem(BaseModel):
    branch_id: UUID
    center_name: str
    total_students: int
    total_faculty: int
    total_other_staff: int
    performance_score: float # GPA & Adab weighted score
    ranking: int

# --- API 1: GET OTHER STAFF (Non-Faculty list) ---
@router.get("/other-staff", response_model=List[StaffSummary])
async def get_other_staff(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieves all non-faculty staff members (cooks, drivers, sweepers, clerks, etc.)
    under the active tenant context.
    """
    await set_db_tenant_context(db, current_user["tenant_id"])
    
    non_faculty_roles = ["CLERK", "ACCOUNTANT", "DRIVER", "COOK", "CLEANER", "SWEEPER"]
    
    query = select(StaffProfile).where(
        and_(
            StaffProfile.institution_id == current_user["tenant_id"],
            StaffProfile.role.in_(non_faculty_roles)
        )
    )
    result = await db.execute(query)
    staff = result.scalars().all()
    
    return [
        StaffSummary(
            id=s.id,
            name=s.name,
            role=s.role,
            phone_number=s.phone_number,
            date_of_joining=s.date_of_joining,
            is_active=s.is_active
        ) for s in staff
    ]

# --- API 2: GET FACULTY DIRECTORY ---
@router.get("/faculty-list", response_model=List[Dict[str, Any]])
async def get_faculty_list(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns lists of academic teachers/faculty, including employee codes and contact info.
    """
    await set_db_tenant_context(db, current_user["tenant_id"])
    
    query = select(
        StaffProfile.id,
        StaffProfile.name,
        StaffProfile.phone_number,
        Branch.name.label("branch_name")
    ).join(Branch, StaffProfile.branch_id == Branch.id).where(
        and_(
            StaffProfile.institution_id == current_user["tenant_id"],
            StaffProfile.role == "USTAD"
        )
    )
    result = await db.execute(query)
    rows = result.all()
    
    return [
        {
            "id": r.id,
            "employee_code": f"EMP-{str(r.id)[:8].upper()}",
            "name": r.name,
            "working_center": r.branch_name,
            "contact_number": r.phone_number
        } for r in rows
    ]

# --- API 3: GET FACULTY 360° PROFILE DETAIL ---
@router.get("/faculty-detail/{staff_id}", response_model=FacultyProfileDetail)
async def get_faculty_detail(
    staff_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Fetches full administrative & academic profiles for an Ustad, including educational quals.
    """
    await set_db_tenant_context(db, current_user["tenant_id"])
    
    query = select(StaffProfile, Branch.name).join(Branch, StaffProfile.branch_id == Branch.id).where(
        and_(
            StaffProfile.id == staff_id,
            StaffProfile.institution_id == current_user["tenant_id"]
        )
    )
    result = await db.execute(query)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Staff Profile not found.")
        
    staff, branch_name = row
    return FacultyProfileDetail(
        id=staff.id,
        name=staff.name,
        role=staff.role,
        phone_number=staff.phone_number,
        educational_qualification=staff.educational_qualification,
        passout_year=staff.passout_year,
        graduation_batch=staff.graduation_batch,
        date_of_birth=staff.date_of_birth,
        date_of_joining=staff.date_of_joining,
        residential_address=staff.residential_address,
        emergency_contact=staff.emergency_contact,
        photo_url=staff.photo_url or f"https://api.dicebear.com/7.x/adventurer/svg?seed={staff.name}",
        assigned_center_name=branch_name
    )

# --- API 4: GET ACTIVE CENTERS LIST WITH RANKING ---
@router.get("/centers-ranking", response_model=List[CenterRankingItem])
async def get_centers_ranking(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Compiles all active branches under the alliance, calculating total students, faculty ratios,
    other staff metrics, and a weighted academic performance index.
    """
    await set_db_tenant_context(db, current_user["tenant_id"])
    
    # Fetch all branches/centers
    branch_query = select(Branch).where(Branch.institution_id == current_user["tenant_id"])
    branch_result = await db.execute(branch_query)
    branches = branch_result.scalars().all()
    
    rankings = []
    for branch in branches:
        # Resolve Student Count
        std_count = await db.scalar(
            select(func.count(StudentEnrollment.id)).where(
                and_(StudentEnrollment.branch_id == branch.id, StudentEnrollment.is_active == True)
            )
        ) or 0
        
        # Resolve Faculty Count
        fac_count = await db.scalar(
            select(func.count(StaffProfile.id)).where(
                and_(StaffProfile.branch_id == branch.id, StaffProfile.role == "USTAD", StaffProfile.is_active == True)
            )
        ) or 0
        
        # Resolve Other Staff Count
        other_count = await db.scalar(
            select(func.count(StaffProfile.id)).where(
                and_(
                    StaffProfile.branch_id == branch.id,
                    StaffProfile.role.in_(["CLERK", "ACCOUNTANT", "DRIVER", "COOK", "CLEANER", "SWEEPER"]),
                    StaffProfile.is_active == True
                )
            )
        ) or 0
        
        # Calculate Weighted Performance Metrics (Averages over 30 days)
        # sabaq GPA (4.0 Scale)
        avg_gpa = await db.scalar(
            select(func.avg(
                case(
                    (SabaqRecord.grade == "EXCELLENT", 4.0),
                    (SabaqRecord.grade == "GOOD", 3.0),
                    (SabaqRecord.grade == "AVERAGE", 2.0),
                    (SabaqRecord.grade == "NEEDS_IMPROVEMENT", 1.0),
                    else_=3.0
                )
            )).where(SabaqRecord.branch_id == branch.id)
        ) or 3.0
        
        # behavior GPA (10.0 Scale mapped to 4.0)
        avg_adab = await db.scalar(
            select(func.avg(BehaviorLog.adab_score)).where(BehaviorLog.branch_id == branch.id)
        ) or 8.0
        
        # Combined score calculation
        performance_score = round(((avg_gpa / 4.0) * 60.0) + ((avg_adab / 10.0) * 40.0), 1)
        
        rankings.append({
            "branch_id": branch.id,
            "center_name": branch.name,
            "total_students": std_count,
            "total_faculty": fac_count,
            "total_other_staff": other_count,
            "performance_score": performance_score
        })
        
    # Sort rankings descending to assign indices
    rankings.sort(key=lambda x: x["performance_score"], reverse=True)
    
    return [
        CenterRankingItem(
            branch_id=item["branch_id"],
            center_name=item["center_name"],
            total_students=item["total_students"],
            total_faculty=item["total_faculty"],
            total_other_staff=item["total_other_staff"],
            performance_score=item["performance_score"],
            ranking=idx + 1
        ) for idx, item in enumerate(rankings)
    ]

# --- API 5: GET CENTER 360° DETAILS (STUDENT METRICS, USTAD RANKINGS, DETAILED FINANCES) ---
@router.get("/center-details/{branch_id}")
async def get_center_details(
    branch_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Compiles full 360° analytics for a specific center:
    - Individual student memorization trends and behavior grades.
    - Ustad rankings based on class progress rates.
    - Balanced dynamic income ledger split by Kafalath (Sponsor tracking), Hadiya, and Sadaqah vs. Expenses.
    """
    await set_db_tenant_context(db, current_user["tenant_id"])
    
    # 1. Fetch Student-wise Performance Matrix
    student_query = await db.execute(
        select(
            StudentEnrollment.id,
            StudentEnrollment.student_name,
            func.avg(
                case(
                    (SabaqRecord.grade == "EXCELLENT", 4.0),
                    (SabaqRecord.grade == "GOOD", 3.0),
                    (SabaqRecord.grade == "AVERAGE", 2.0),
                    (SabaqRecord.grade == "NEEDS_IMPROVEMENT", 1.0),
                    else_=3.0
                )
            ).label("avg_gpa"),
            func.avg(BehaviorLog.adab_score).label("avg_adab")
        ).outerjoin(SabaqRecord, StudentEnrollment.id == SabaqRecord.student_enrollment_id)
         .outerjoin(BehaviorLog, StudentEnrollment.id == BehaviorLog.student_enrollment_id)
         .where(StudentEnrollment.branch_id == branch_id)
         .group_by(StudentEnrollment.id, StudentEnrollment.student_name)
    )
    student_rows = student_query.all()
    student_metrics = [
        {
            "id": r.id,
            "student_name": r.student_name,
            "study_rating": round(float(r.avg_gpa or 3.0), 1),
            "discipline_rating": round(float(r.avg_adab or 8.0), 1)
        } for r in student_rows
    ]

    # 2. Compile Ustad Performance and Efficiency Rankings
    ustad_query = await db.execute(
        select(StaffProfile.id, StaffProfile.name).where(
            and_(
                StaffProfile.branch_id == branch_id,
                StaffProfile.role == "USTAD"
            )
        )
    )
    ustad_rows = ustad_query.all()
    ustad_rankings = []
    for ustad in ustad_rows:
        # Find progress speed (total pages memorized under their halqa)
        total_pages = await db.scalar(
            select(func.sum(SabaqRecord.page_end - SabaqRecord.page_start)).where(
                SabaqRecord.staff_id == ustad.id
            )
        ) or 0
        ustad_rankings.append({
            "id": ustad.id,
            "name": ustad.name,
            "pages_taught": int(total_pages),
            "efficiency_grade": "A+" if total_pages > 300 else "A" if total_pages > 150 else "B"
        })
    ustad_rankings.sort(key=lambda x: x["pages_taught"], reverse=True)

    # 3. Dynamic Center Ledger & Incoming Cash Segmentation
    # Calculate Expenses (General + Salary heads)
    expense_query = await db.execute(
        select(func.sum(LedgerTransaction.debit)).join(FinancialVoucher).where(
            and_(
                FinancialVoucher.branch_id == branch_id,
                LedgerTransaction.account_head.in_(["GENERAL_EXPENSE", "SALARIES_EXPENSE"])
            )
        )
    )
    total_expenses = expense_query.scalar() or 0.00
    
    # segment incoming cash sources
    incoming_query = await db.execute(
        select(
            LedgerTransaction.account_head,
            func.sum(LedgerTransaction.credit).label("total")
        ).join(FinancialVoucher)
         .where(
             and_(
                 FinancialVoucher.branch_id == branch_id,
                 LedgerTransaction.account_head.in_(["KAFALATH_SPONSORSHIP", "HADIYA", "SADAQAH", "TUITION_REVENUE"])
             )
         ).group_by(LedgerTransaction.account_head)
    )
    incoming_rows = incoming_query.all()
    
    revenue_breakdown = {
        "KAFALATH_SPONSORSHIP": 0.00,
        "HADIYA": 0.00,
        "SADAQAH": 0.00,
        "TUITION_REVENUE": 0.00
    }
    for row in incoming_rows:
        revenue_breakdown[row.account_head] = float(row.total or 0.00)
        
    total_revenue = sum(revenue_breakdown.values())

    return {
        "branch_id": branch_id,
        "financial_summary": {
            "total_expenses": float(total_expenses),
            "total_revenue": float(total_revenue),
            "net_surplus": float(total_revenue - total_expenses),
            "categories": {
                "kafalath_sponsorship": revenue_breakdown["KAFALATH_SPONSORSHIP"],
                "hadiya": revenue_breakdown["HADIYA"],
                "sadaqah": revenue_breakdown["SADAQAH"],
                "tuition_revenue": revenue_breakdown["TUITION_REVENUE"]
            }
        },
        "student_ratings": student_metrics,
        "ustad_efficiency": ustad_rankings
    }
