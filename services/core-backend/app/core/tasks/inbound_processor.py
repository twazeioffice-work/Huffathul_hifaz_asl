# Location: services/core-backend/app/core/tasks/inbound_processor.py

import json
from celery import Celery
import logging
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.student import StudentProfile
from app.models.staff import StaffProfile
from app.models.communication import CommunicationLog
from hashlib import sha256

logger = logging.getLogger(__name__)

async def process_inbound_payload(payload: dict):
    """
    Parses WhatsApp payload, verifies deduplication, resolves the sender to a tenant/profile, and logs the event.
    """
    db = SessionLocal()
    try:
        entries = payload.get("entry", [])
        for entry in entries:
            changes = entry.get("changes", [])
            for change in changes:
                value = change.get("value", {})
                messages = value.get("messages", [])
                
                for msg in messages:
                    msg_id = msg.get("id")
                    sender_phone = msg.get("from")
                    body = msg.get("text", {}).get("body")
                    
                    # 1. Deduplicate: Assert message ID does not already exist
                    existing_log = db.query(CommunicationLog).filter(
                        CommunicationLog.whatsapp_message_id == msg_id
                    ).first()
                    
                    if existing_log:
                        continue # Message already processed, skip
                        
                    # 2. Multi-Tenant Identity Resolution: Check Student and Staff profiles
                    student = db.query(StudentProfile).filter(
                        StudentProfile.phone_number == sender_phone
                    ).first()
                    
                    staff = db.query(StaffProfile).filter(
                        StaffProfile.phone_number == sender_phone
                    ).first()
                    
                    resolved_inst_id = None
                    resolved_branch_id = None
                    
                    if student:
                        resolved_inst_id = student.institution_id
                        resolved_branch_id = student.branch_id
                    elif staff:
                        resolved_inst_id = staff.institution_id
                        resolved_branch_id = staff.branch_id
                        
                    # 3. Log the message inside the multi-tenant ledger
                    new_log = CommunicationLog(
                        institution_id=resolved_inst_id,
                        branch_id=resolved_branch_id,
                        sender_phone=sender_phone,
                        recipient_phone="system_gateway",
                        direction="inbound",
                        status="received",
                        message_body=body,
                        whatsapp_message_id=msg_id
                    )
                    db.add(new_log)
                    db.commit()
                    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed processing payload: {e}")
    finally:
        db.close()
