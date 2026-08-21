import datetime
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.db.session import get_db_session
from app.core.security import set_db_tenant_context, get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert

# Note: student_facilities, system_notifications, and complaints 
# need to be imported from your SQLAlchemy models definition.
# Assuming they exist in app.models
# from app.models import student_facilities, system_notifications, complaints

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
    # Using raw SQL or a defined model. Here we assume 'student_facilities' is a SQLAlchemy model/table object.
    facility_id = await db.execute(
        insert(student_facilities).values(
            institution_id=current_user["tenant_id"],
            branch_id=current_user["branch_id"],
            name=payload.name,
            type=payload.type,
            status="PENDING_SUPER_ADMIN_APPROVAL",
            is_enabled_for_students=False,
            created_by_id=current_user["id"]
        ).returning(student_facilities.c.id)
    )
    
    # 2. Trigger Notification for Super Admin
    await db.execute(
        insert(system_notifications).values(
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
        insert(complaints).values(
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
        update(complaints)
        .where(complaints.c.id == complaint_id)
        .values(
            status="RESOLVED",
            resolution_notes=payload.resolution_notes,
            resolved_by_id=current_user["id"],
            resolved_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow()
        )
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Complaint not found or unauthorized to resolve.")
        
    await db.commit()
    return {"status": "success", "message": "Complaint marked as resolved and logged to audit ledger."}
