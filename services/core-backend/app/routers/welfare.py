import datetime
from uuid import UUID
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, and_
from app.db.session import get_db_session
from app.core.security import set_db_tenant_context, get_current_user
from app.models.welfare import StudentWelfareCase as CaseModel, WelfareCaseMessage as MsgModel

router = APIRouter(prefix="/api/v1/welfare-cases", tags=["Student Welfare Cases"])

class CaseCreateSchema(BaseModel):
    title: str = Field(..., max_length=255)
    student_enrollment_id: Optional[UUID] = None
    initial_content: str
    branch_id: UUID

class ReplyCreateSchema(BaseModel):
    message_body: str

class AppealSchema(BaseModel):
    appeal_reason: str

class DiversionSchema(BaseModel):
    hq_special_message: str
    hours_deadline: int = Field(24, ge=12, le=168) # Strict bounds (half day to 1 week)

@router.get("/", response_model=dict)
async def get_all_cases(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    query = select(CaseModel)
    if current_user["role"] == "USTAD":
        query = query.where(CaseModel.sender_profile_id == current_user["id"])
    elif current_user["role"] in ["MANAGER", "NAZIM"]:
        # In a real scenario you would have the branch_id in current_user context
        pass
    
    result = await db.execute(query)
    cases = result.scalars().all()
    return {"data": cases}

@router.get("/{case_id}", response_model=dict)
async def get_case_by_id(
    case_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    query = select(CaseModel).where(CaseModel.id == case_id)
    result = await db.execute(query)
    case_record = result.scalar_one_or_none()
    
    if not case_record:
        raise HTTPException(status_code=404, detail="Case not found")
        
    msg_query = select(MsgModel).where(MsgModel.case_id == case_id).order_by(MsgModel.created_at)
    msg_result = await db.execute(msg_query)
    messages = msg_result.scalars().all()
    
    case_dict = {
        "id": case_record.id,
        "title": case_record.title,
        "initial_content": case_record.initial_content,
        "status": case_record.status,
        "ustad_resolved": case_record.ustad_resolved,
        "admin_resolved": case_record.admin_resolved,
        "hq_special_message": case_record.hq_special_message,
        "resolution_deadline": case_record.resolution_deadline,
        "sender_profile_id": case_record.sender_profile_id,
        "messages": [
            {
                "id": m.id,
                "sender_profile_id": m.sender_profile_id,
                "sender_name": "User", # Mocked
                "message_body": m.message_body,
                "created_at": m.created_at
            } for m in messages
        ]
    }
    return case_dict

@router.post("/", response_model=dict, status_code=201)
async def create_welfare_case(
    payload: CaseCreateSchema,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Creates an official student welfare case. Only accessible by registered Ustads.
    """
    if current_user["role"] != "USTAD":
        raise HTTPException(status_code=403, detail="Only teachers (Ustads) can open welfare cases.")

    await set_db_tenant_context(db, current_user["tenant_id"], payload.branch_id, current_user["id"])
    
    new_case = CaseModel(
        institution_id=current_user["tenant_id"],
        branch_id=payload.branch_id,
        sender_profile_id=current_user["id"],
        title=payload.title,
        student_enrollment_id=payload.student_enrollment_id,
        initial_content=payload.initial_content,
        status="PENDING_LOCAL_RESPONSE"
    )
    
    db.add(new_case)
    await db.commit()
    return {"status": "created", "case_id": new_case.id}

@router.post("/{case_id}/reply")
async def reply_to_case(
    case_id: UUID,
    payload: ReplyCreateSchema,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Appends a chronological reply message to the official welfare case.
    Also auto-transitions state from PENDING to RESPONDED_BY_LOCAL if reply is from Nazim/Manager.
    """
    case_query = await db.execute(select(CaseModel).where(CaseModel.id == case_id))
    case_record = case_query.scalar_one_or_none()
    
    if not case_record:
        raise HTTPException(status_code=404, detail="Welfare case not found.")
        
    await set_db_tenant_context(db, case_record.institution_id, case_record.branch_id, current_user["id"])
    
    new_reply = MsgModel(
        case_id=case_id,
        sender_profile_id=current_user["id"],
        message_body=payload.message_body
    )
    db.add(new_reply)
    
    # Auto-update status if replied to by Center Management
    if current_user["role"] in ["NAZIM", "MANAGER"] and case_record.status == "PENDING_LOCAL_RESPONSE":
        case_record.status = "RESPONDED_BY_LOCAL"
        case_record.updated_at = datetime.datetime.utcnow()
        
    await db.commit()
    return {"status": "reply_recorded"}

@router.post("/{case_id}/appeal")
async def appeal_case_to_hq(
    case_id: UUID,
    payload: AppealSchema,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Escalates an unresolved or poorly managed local case directly to HQ Super Admins.
    """
    if current_user["role"] != "USTAD":
        raise HTTPException(status_code=403, detail="Only the initial submitter can trigger an appeal.")

    case_query = await db.execute(
        select(CaseModel).where(
            and_(CaseModel.id == case_id, CaseModel.sender_profile_id == current_user["id"])
        )
    )
    case_record = case_query.scalar_one_or_none()
    
    if not case_record:
        raise HTTPException(status_code=404, detail="Authorized case not found.")
        
    case_record.status = "APPEALED_TO_HQ"
    case_record.appeal_reason = payload.appeal_reason
    case_record.appealed_at = datetime.datetime.utcnow()
    case_record.updated_at = datetime.datetime.utcnow()
    
    await db.commit()
    return {"status": "appealed_to_hq"}

@router.post("/{case_id}/divert")
async def divert_case_to_branch(
    case_id: UUID,
    payload: DiversionSchema,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Executed strictly by HQ / Super Admin. Diverts the appealed case back to the 
    responsible local Center Admin with a strict deadline and mandatory instructions.
    """
    if current_user["role"] not in ["SUPER_ADMIN", "GLOBAL_OPERATIONS"]:
        raise HTTPException(status_code=403, detail="Unauthorized action context.")

    case_query = await db.execute(select(CaseModel).where(CaseModel.id == case_id))
    case_record = case_query.scalar_one_or_none()
    
    if not case_record:
        raise HTTPException(status_code=404, detail="Welfare case not found.")
        
    deadline_timestamp = datetime.datetime.utcnow() + datetime.timedelta(hours=payload.hours_deadline)
    
    case_record.status = "DIVERTED_WITH_DEADLINE"
    case_record.hq_special_message = payload.hq_special_message
    case_record.resolution_deadline = deadline_timestamp
    case_record.diverted_at = datetime.datetime.utcnow()
    case_record.updated_at = datetime.datetime.utcnow()
    
    # Auto-inject diversion details as a message in the thread
    system_msg = MsgModel(
        case_id=case_id,
        sender_profile_id=current_user["id"],
        message_body=f"🚨 [HQ OFFICIAL DIRECTIVE]: {payload.hq_special_message} (Resolution required before {deadline_timestamp.strftime('%Y-%m-%d %H:%M UTC')})"
    )
    db.add(system_msg)
    
    await db.commit()
    return {"status": "diverted_back_to_branch", "deadline": deadline_timestamp.isoformat()}

@router.post("/{case_id}/resolve")
async def resolve_case_handshake(
    case_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Executes the double-party resolution gate. Set status to 'RESOLVED' only 
    when both ustad_resolved AND admin_resolved parameters equal True.
    """
    case_query = await db.execute(select(CaseModel).where(CaseModel.id == case_id))
    case_record = case_query.scalar_one_or_none()
    
    if not case_record:
        raise HTTPException(status_code=404, detail="Welfare case not found.")
        
    if current_user["role"] == "USTAD" and case_record.sender_profile_id == current_user["id"]:
        case_record.ustad_resolved = True
    elif current_user["role"] == "NAZIM":
        case_record.admin_resolved = True
    else:
        raise HTTPException(status_code=403, detail="You do not have permission to resolve this case.")
        
    if case_record.ustad_resolved and case_record.admin_resolved:
        case_record.status = "RESOLVED"
        
    case_record.updated_at = datetime.datetime.utcnow()
    await db.commit()
    
    return {
        "status": "handshake_updated",
        "ustad_resolved": case_record.ustad_resolved,
        "admin_resolved": case_record.admin_resolved,
        "is_fully_resolved": case_record.status == "RESOLVED"
    }
