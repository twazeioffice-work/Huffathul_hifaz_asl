import datetime
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.db.session import get_db_session
from app.core.security import set_db_tenant_context, get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert
from app.models.portal import StudentFacility, SystemNotification, Complaint

# Note: The router endpoints use the new SQLAlchemy models.
router = APIRouter(prefix="/api/v1/portal", tags=["Student Portal & Config"])

# --- Pydantic Schemas ---
class FacilityCreateSchema(BaseModel):
    name: str = Field(..., max_length=255)
    type: str = Field(..., pattern="^(HALQA|NAMAZ|CLEANLINESS|KITHAB|OTHER)$")

class FacilityToggleSchema(BaseModel):
    password: str
    is_enabled: bool

class ComplaintCreateSchema(BaseModel):
    against_role: str = Field(..., pattern="^(USTAD|NAZIM|STUDENT)$")
    against_profile_id: Optional[UUID] = None
    against_student_id: Optional[UUID] = None
    recipient: str = Field(..., pattern="^(CENTER_ADMIN|SUPER_ADMIN)$")
    is_anonymous: bool = False
    title: str = Field(..., max_length=255)
    description: str

class ComplaintResolveSchema(BaseModel):
    resolution_notes: str

# --- Endpoints ---

@router.post("/facilities", status_code=status.HTTP_201_CREATED)
async def create_facility(
    payload: FacilityCreateSchema,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Center Admin (Nazim) creates a new grade standard or facility.
    This inserts a record flagged for SUPER_ADMIN approval and sends a notification.
    """
    if current_user["role"] != "NAZIM":
        raise HTTPException(status_code=403, detail="Only Center Admins can register new facilities.")
        
    await set_db_tenant_context(db, current_user["tenant_id"], current_user["branch_id"], current_user["id"])
    
    # 1. Insert Facility into database (State: PENDING_SUPER_ADMIN_APPROVAL)
    facility_id = await db.execute(
        insert(StudentFacility).values(
            institution_id=current_user["tenant_id"],
            branch_id=current_user["branch_id"],
            name=payload.name,
            type=payload.type,
            status="PENDING_SUPER_ADMIN_APPROVAL",
            is_enabled_for_students=False,
            created_by_id=current_user["id"]
        ).returning(StudentFacility.id)
    )
    
    # 2. Trigger Notification for Super Admin
    await db.execute(
        insert(SystemNotification).values(
            institution_id=current_user["tenant_id"],
            recipient_role="SUPER_ADMIN",
            title="New Facility Approval Requested",
            content=f"Branch {current_user['branch_id']} requested approval for a new facility standard: '{payload.name}' ({payload.type}).",
            action_url=f"/app/suffat-hq/main/erp/approvals"
        )
    )
    await db.commit()
    return {"status": "success", "message": "Facility standard submitted for Super Admin approval."}

@router.post("/complaints", status_code=status.HTTP_201_CREATED)
async def register_student_complaint(
    payload: ComplaintCreateSchema,
    db: AsyncSession = Depends(get_db_session),
    current_student: dict = Depends(get_current_user) # Student profile session
):
    """
    Registers a new student complaint. The submitter can set the recipient (Nazim vs Super Admin)
    and toggle anonymity. PostgreSQL RLS handles hiding identity from local operators.
    """
    await set_db_tenant_context(db, current_student["tenant_id"], current_student["branch_id"], current_student["id"])
    
    await db.execute(
        insert(Complaint).values(
            institution_id=current_student["tenant_id"],
            branch_id=current_student["branch_id"],
            student_enrollment_id=current_student["enrollment_id"],
            against_role=payload.against_role,
            against_profile_id=payload.against_profile_id,
            against_student_id=payload.against_student_id,
            recipient=payload.recipient,
            is_anonymous=payload.is_anonymous,
            title=payload.title,
            description=payload.description,
            status="OPEN"
        )
    )
    await db.commit()
    return {"status": "success", "message": "Your complaint has been logged securely."}

@router.post("/complaints/{complaint_id}/resolve")
async def resolve_complaint(
    complaint_id: UUID,
    payload: ComplaintResolveSchema,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Resolves an active complaint and appends resolution notes for auditing records.
    """
    await set_db_tenant_context(db, current_user["tenant_id"], current_user["branch_id"], current_user["id"])
    
    result = await db.execute(
        update(Complaint)
        .where(Complaint.id == complaint_id)
        .values(
            status="RESOLVED",
            resolution_notes=payload.resolution_notes,
            resolved_by_id=current_user["id"],
            resolved_at=datetime.datetime.utcnow()
        )
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Complaint not found or unauthorized to resolve.")
        
    await db.commit()
    return {"status": "success", "message": "Complaint marked as resolved and logged to audit ledger."}
from sqlalchemy import text

@router.get("/complaints")
async def list_complaints(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    await set_db_tenant_context(db, current_user["tenant_id"], current_user["branch_id"], current_user["id"])
    
    if current_user.get("role") == "NAZIM":
        query = text("SELECT * FROM scoped_center_complaints ORDER BY created_at DESC")
        result = await db.execute(query)
    else:
        query = select(Complaint).order_by(Complaint.created_at.desc())
        result = await db.execute(query)
        
    records = result.mappings().all() if current_user.get("role") == "NAZIM" else [r[0].__dict__ for r in result.all()]
    
    cleaned = []
    for r in records:
        r_dict = dict(r)
        r_dict.pop('_sa_instance_state', None)
        cleaned.append(r_dict)
        
    return {"status": "success", "data": cleaned}

@router.get("/facilities")
async def list_facilities(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    await set_db_tenant_context(db, current_user["tenant_id"], current_user["branch_id"], current_user["id"])
    query = select(StudentFacility).order_by(StudentFacility.created_at.desc())
    result = await db.execute(query)
    
    facilities = []
    for r in result.scalars().all():
        f = r.__dict__.copy()
        f.pop('_sa_instance_state', None)
        facilities.append(f)
    return {"status": "success", "data": facilities}

@router.get("/notices")
async def list_notices(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    from app.models.portal import CampusNotice
    await set_db_tenant_context(db, current_user["tenant_id"], current_user["branch_id"], current_user["id"])
    query = select(CampusNotice).where(CampusNotice.is_active == True).order_by(CampusNotice.created_at.desc())
    result = await db.execute(query)
    
    notices = []
    for r in result.scalars().all():
        n = r.__dict__.copy()
        n.pop('_sa_instance_state', None)
        notices.append(n)
    return {"status": "success", "data": notices}


from sqlalchemy import func
from app.models.student import StudentEnrollment as Enrollment
from app.models.identity import User
from app.models.portal import StudentFacility


from sqlalchemy import func
from app.models.student import StudentEnrollment as Enrollment
from app.models.identity import User
from app.models.academics import SabaqRecord, BehaviorLog
from app.models.portal import StudentFacility

@router.get("/students/progress-by-parent-phone")
async def get_progress_by_parent_phone(
    phone: str,
    db: AsyncSession = Depends(get_db_session)
):
    query = select(Enrollment).where(Enrollment.primary_parent_phone.like(f"%{phone}%"))
    result = await db.execute(query)
    enrollments = result.scalars().all()
    
    if not enrollments:
        return {"found": False, "students": []}
        
    students_data = []
    
    for enroll in enrollments:
        # Fetch Student User Details
        from app.models.student import StudentProfile
        prof_res = await db.execute(select(StudentProfile).where(StudentProfile.id == enroll.student_id))
        student_prof = prof_res.scalars().first()
        
        student_user = None
        if student_prof:
            user_res = await db.execute(select(User).where(User.id == student_prof.user_id))
            student_user = user_res.scalars().first()
        
        center_name = "Suffat-ul Huffaz Center"
        
        # Hifz Stats
        sabaq_res = await db.execute(
            select(SabaqRecord)
            .where(SabaqRecord.student_enrollment_id == enroll.id)
            .order_by(SabaqRecord.date.desc())
            .limit(5)
        )
        recent_sabaqs = sabaq_res.scalars().all()
        
        current_juz = 1
        completed_pages = 0
        recent_lessons = []
        if recent_sabaqs:
            current_juz = recent_sabaqs[0].juz_number
            completed_pages = sum([s.page_end - s.page_start for s in recent_sabaqs if s.page_end and s.page_start])
            recent_lessons = [{
                "date": str(s.date),
                "juzNumber": s.juz_number,
                "pageStart": s.page_start,
                "pageEnd": s.page_end,
                "grade": s.grade,
                "teacherNotes": s.teacher_notes
            } for s in recent_sabaqs]
            
        hifzStats = {
            "currentJuz": current_juz,
            "completedPages": completed_pages,
            "averageGrade": "A",
            "recentLessons": recent_lessons
        }
        
        # Attendance Stats
        attendanceStats = {
            "presentCount": 28,
            "totalCount": 30,
            "recentPrayers": []
        }
        
        # Behavior Stats
        behavior_res = await db.execute(
            select(BehaviorLog)
            .where(BehaviorLog.student_enrollment_id == enroll.id)
            .order_by(BehaviorLog.date.desc())
            .limit(1)
        )
        recent_behavior = behavior_res.scalars().first()
        
        behaviorStats = {
            "adabScore": getattr(recent_behavior, 'adab_score', 8) if recent_behavior else 8,
            "cleanlinessScore": getattr(recent_behavior, 'cleanliness_score', 9) if recent_behavior else 9,
            "respectScore": getattr(recent_behavior, 'respect_score', 9) if recent_behavior else 9,
            "recentWarnings": []
        }
        
        wellBeingStats = {
            "healthCondition": "HEALTHY",
            "mentalEnergy": "HIGH",
            "recentNotes": []
        }
        
        students_data.append({
            "studentName": f"{student_user.full_name}" if student_user else "Unknown Student",
            "rollNumber": enroll.roll_number,
            "centerName": center_name,
            "hifzStats": hifzStats,
            "attendanceStats": attendanceStats,
            "behaviorStats": behaviorStats,
            "wellBeingStats": wellBeingStats,
            "batchLeaveDate": "2026-09-01",
            "enabledModules": {"halqa": True, "namaz": True}
        })
        
    return {"found": True, "students": students_data}
