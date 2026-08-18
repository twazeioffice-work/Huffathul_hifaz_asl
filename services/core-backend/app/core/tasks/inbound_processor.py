import asyncio
from typing import Dict, Any
from app.db.session import async_session_maker
from sqlalchemy import select
from app.models.communication import CommunicationLog
from app.models.student import StudentProfile
from app.models.identity import User

async def process_inbound_webhook(payload: Dict[str, Any]):
    """
    Background task to process inbound WhatsApp messages.
    Resolves the phone number to a tenant identity and logs it.
    """
    try:
        entries = payload.get("entry", [])
        for entry in entries:
            changes = entry.get("changes", [])
            for change in changes:
                value = change.get("value", {})
                
                # Handle Messages
                messages = value.get("messages", [])
                for message in messages:
                    sender_phone = message.get("from")
                    msg_id = message.get("id")
                    
                    async with async_session_maker() as session:
                        # 1. Resolve Identity
                        # Very simplified identity resolution:
                        stmt = select(User).where(User.phone_number == sender_phone)
                        result = await session.execute(stmt)
                        user = result.scalar_one_or_none()
                        
                        student_profile_id = None
                        if user:
                            # Assume user is a student for this simplified demo
                            prof_stmt = select(StudentProfile).where(StudentProfile.user_id == user.id)
                            prof_result = await session.execute(prof_stmt)
                            profile = prof_result.scalar_one_or_none()
                            if profile:
                                student_profile_id = profile.id
                        
                        # 2. Log Communication
                        log = CommunicationLog(
                            student_profile_id=student_profile_id,
                            direction="inbound",
                            status="received",
                            sender_phone=sender_phone or "unknown",
                            whatsapp_message_id=msg_id,
                            payload=message
                        )
                        session.add(log)
                        await session.commit()
                        
                # Handle Status Updates (sent, delivered, read, failed)
                statuses = value.get("statuses", [])
                for status_update in statuses:
                    msg_id = status_update.get("id")
                    new_status = status_update.get("status") # sent, delivered, read, failed
                    
                    async with async_session_maker() as session:
                        stmt = select(CommunicationLog).where(CommunicationLog.whatsapp_message_id == msg_id)
                        result = await session.execute(stmt)
                        log = result.scalar_one_or_none()
                        
                        if log:
                            log.status = new_status
                            await session.commit()
                            
    except Exception as e:
        print(f"Error processing inbound webhook: {e}")
