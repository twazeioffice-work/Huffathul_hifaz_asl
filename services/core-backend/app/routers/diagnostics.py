from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Optional
from uuid import UUID

# Adjusting imports safely for the mock environment
class MockDep:
    pass

def get_db_session():
    pass

def get_current_user():
    return {"id": "00000000-0000-0000-0000-000000000000", "role": "USTAD", "tenant_id": "mock_tenant"}

from app.models.academics import StudentEnrollment
from app.models.auth import StaffProfile

router = APIRouter(prefix="/api/v1/diagnostics", tags=["Configuration Auditing"])

@router.get("/self-heal")
async def audit_user_configuration(
    student_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Scans configurations under current RLS tenants to catch common local user mistakes.
    Bypasses direct codebase fixes by mapping setting mismatches to clear alerts.
    """
    alerts = []

    # 1. Check if Teacher is assigned to active students
    if current_user["role"] == "USTAD":
        assigned_students = await db.execute(
            select(StudentEnrollment).where(
                and_(
                    StudentEnrollment.assigned_ustad_id == current_user["id"],
                    StudentEnrollment.is_active == True
                )
            )
        )
        if not assigned_students.scalars().all():
            alerts.append({
                "severity": "WARN",
                "code": "NO_STUDENTS_ASSIGNED",
                "message": "You are logged in, but no active student profiles are currently assigned to your Halqa.",
                "fix": "Ask your campus Nazim to navigate to the 'Staff Roster' panel and assign students to your Ustad profile."
            })

    # 2. Check Specific Student Configuration (e.g. if grading dropdown has missing inputs)
    if student_id:
        student_query = await db.execute(
            select(StudentEnrollment).where(StudentEnrollment.id == student_id)
        )
        student = student_query.scalar_one_or_none()
        
        if student:
            if not student.is_active:
                alerts.append({
                    "severity": "FAIL",
                    "code": "STUDENT_INACTIVE",
                    "message": f"Student '{student.student_name}' is currently flagged as INACTIVE in the database.",
                    "fix": "This student cannot be graded until marked active. Go to ERP -> Students -> Edit, toggle status to 'Active', and tap Save."
                })
            
            if not student.halqa_id:
                alerts.append({
                    "severity": "WARN",
                    "code": "MISSING_HALQA_GROUPING",
                    "message": f"Student '{student.student_name}' does not have an assigned Halqa category.",
                    "fix": "This prevents grouped progress tracking. Assign them to a Halqa group via their Student 360 profile."
                })

    return {
        "verified_by_user_id": current_user["id"],
        "tenant_id": current_user["tenant_id"],
        "healthy": len(alerts) == 0,
        "alerts": alerts
    }
