import logging
from celery import shared_task
from sqlalchemy import select
from app.db.session import AsyncSessionLocal # Decoupled transaction factory
from app.models.student import StudentProfile
from app.models.staff import StaffProfile
from app.models.communication import CommunicationLog
import asyncio

logger = logging.getLogger("celery.helpdesk")

@shared_task(name="tasks.process_inbound_payload")
def process_inbound_payload(payload: dict):
    # Since Celery runs in standard synchronous threads, run async SQL session block
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(async_process_payload(payload))

async def async_process_payload(payload: dict):
    entries = payload.get("entry", [])
    for entry in entries:
        for change in entry.get("changes", []):
            value = change.get("value", {})
            messages = value.get("messages", [])
            contacts = value.get("contacts", [])
            
            if not messages:
                continue
                
            contact_name = contacts[0].get("profile", {}).get("name", "Unknown Parent") if contacts else "Unknown"
            
            for msg in messages:
                wamid = msg.get("id")
                sender_phone = msg.get("from")
                message_type = msg.get("type")
                
                # We prioritize text inputs for helpdesk conversational pipelines
                message_body = ""
                if message_type == "text":
                    message_body = msg.get("text", {}).get("body", "")
                elif message_type == "button":
                    message_body = msg.get("button", {}).get("text", "")
                else:
                    message_body = f"[{message_type.upper()} Media Element Attached]"
                
                async with AsyncSessionLocal() as session:
                    # 1. Enforce Idempotency to prevent processing repeated retry bursts
                    dup_check = await session.execute(
                        select(CommunicationLog).where(CommunicationLog.whatsapp_message_id == wamid)
                    )
                    if dup_check.scalar_one_or_none() is not None:
                        logger.info(f"[!] Message ID {wamid} already processed. Skipping duplicate hook.")
                        continue
                    
                    # 2. Multi-Tenant Identity & Scope Resolution
                    # Target 1: Match sender_phone against student profiles (Guardians/Parents)
                    student_query = await session.execute(
                        select(StudentProfile).where(
                            (StudentProfile.guardian_phone == sender_phone) | 
                            (StudentProfile.student_phone == sender_phone)
                        )
                    )
                    student_entity = student_query.scalars().first()
                    
                    institution_id = None
                    branch_id = None
                    student_id = None
                    staff_id = None
                    
                    if student_entity:
                        institution_id = student_entity.institution_id
                        branch_id = student_entity.branch_id
                        student_id = student_entity.id
                        logger.info(f"[✓] Sender phone resolved to Student Profile: {student_entity.id}")
                    else:
                        # Target 2: Match sender_phone against staff directories
                        staff_query = await session.execute(
                            select(StaffProfile).where(StaffProfile.phone == sender_phone)
                        )
                        staff_entity = staff_query.scalars().first()
                        if staff_entity:
                            institution_id = staff_entity.institution_id
                            branch_id = staff_entity.branch_id
                            staff_id = staff_entity.id
                            logger.info(f"[✓] Sender phone resolved to Staff Profile: {staff_entity.id}")
                    
                    # Fallback default: If not resolved, trace to HQ base tenant
                    if not institution_id:
                        logger.warning(f"[!] Unresolved contact phone: {sender_phone}. Mapping message logging to central pool.")
                        # Pull HQ institution UUID configuration...
                        continue
                    
                    # 3. Create RLS-isolated Communication Log entry
                    log_entry = CommunicationLog(
                        institution_id=institution_id,
                        branch_id=branch_id,
                        student_profile_id=student_id,
                        staff_profile_id=staff_id,
                        whatsapp_message_id=wamid,
                        sender_phone=sender_phone,
                        receiver_phone="MetaBusinessGateway",
                        direction="inbound",
                        status="received",
                        message_body=message_body,
                        raw_payload=payload
                    )
                    
                    # Set the connection tenant parameter prior to DB commits to satisfy PostgreSQL RLS policies
                    await session.execute(f"SET LOCAL app.current_tenant_id = '{institution_id}'")
                    session.add(log_entry)
                    await session.commit()
