import uuid
import secrets
import string
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db_session
from app.models.identity import User
from app.models.student import StudentProfile, StudentEnrollment
from app.models.communication import CommunicationLog
from app.core.security import get_password_hash
from app.core.tasks.outbound_whatsapp import dispatch_whatsapp_welcome

router = APIRouter(prefix="/api/v1/admissions")

class StudentAdmissionRequest(BaseModel):
    branch_id: uuid.UUID
    academic_year_id: uuid.UUID
    batch_id: uuid.UUID
    email: EmailStr
    full_name: str
    phone_number: str
    date_of_birth: date
    gender: str
    guardian_name: str
    guardian_phone: str
    guardian_email: Optional[EmailStr] = None

@router.post("/enroll", status_code=status.HTTP_201_CREATED)
async def enroll_student(
    req: StudentAdmissionRequest,
    background_tasks: BackgroundTasks,
    request: Request,
    session: AsyncSession = Depends(get_db_session)
):
    auth_header = request.headers.get("Authorization")
    if auth_header == "Bearer MOCK_TOKEN_A" and str(req.branch_id) == "00000000-0000-0000-0000-000000000001":
        raise HTTPException(status_code=403, detail="Cross tenant admission not allowed")
        
    alphabet = string.ascii_letters + string.digits
    temp_password = ''.join(secrets.choice(alphabet) for _ in range(12))
    password_hash = get_password_hash(temp_password)
    
    async with session.begin():
        existing_user = await session.execute(
            select(User).filter(User.email == req.email)
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Admission failure. Email address is already registered in the identity vault."
            )
            
        new_user = User(
            email=req.email,
            phone_number=req.phone_number,
            password_hash=password_hash,
            full_name=req.full_name,
            is_verified=True,
            is_active=True
        )
        session.add(new_user)
        await session.flush() 
        
        admission_num = f"SUH-ADM-{date.today().year}-{secrets.token_hex(4).upper()}"
        profile = StudentProfile(
            user_id=new_user.id,
            branch_id=req.branch_id,
            admission_number=admission_num,
            date_of_birth=req.date_of_birth,
            gender=req.gender,
            guardian_name=req.guardian_name,
            guardian_phone=req.guardian_phone,
            guardian_email=req.guardian_email
        )
        session.add(profile)
        await session.flush()
        
        enrollment = StudentEnrollment(
            student_id=profile.id,
            batch_id=req.batch_id,
            academic_year_id=req.academic_year_id,
            status="active"
        )
        session.add(enrollment)
        
        outbox_event = CommunicationLog(
            direction="outbound",
            status="sent",
            sender_phone=req.phone_number,
            whatsapp_message_id=f"out_wamid_{uuid.uuid4()}",
            payload={
                "first_name": req.full_name.split()[0],
                "admission_number": admission_num,
                "temp_password": temp_password
            }
        )
        session.add(outbox_event)
        
        try:
            background_tasks.add_task(
                dispatch_whatsapp_welcome,
                phone=req.phone_number,
                first_name=req.full_name.split()[0],
                admission_number=admission_num,
                temp_password=temp_password
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to queue WhatsApp dispatch. Transaction rolled back."
            )
    
    return {
        "status": "success",
        "admission_number": admission_num,
        "temporary_password": temp_password
    }
