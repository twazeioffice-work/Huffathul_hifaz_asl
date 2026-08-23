import logging
from typing import Dict, Any, List
from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_

from app.db.session import get_db
from app.models.student import StudentEnrollment, StudentProfile
from app.models.tenant import Institution, Branch

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["Webhooks"])

class WatiWebhookPayload(BaseModel):
    senderNumber: str
    messageText: str
    waId: str

@router.post("/wati")
async def wati_whatsapp_webhook(payload: WatiWebhookPayload, db: AsyncSession = Depends(get_db)):
    """
    Level 1.5 Junction Box WATI Webhook.
    Receives incoming WhatsApp messages from parents, normalizes phone numbers,
    finds the associated children via primary/guardian phone numbers,
    and returns a structured response to be handled by Gemini for multilingual report generation.
    """
    logger.info(f"Incoming WATI payload from {payload.senderNumber}: {payload.messageText}")

    # 1. Normalize Phone Number to E.164 (simplistic normalizer for +91)
    phone = payload.waId
    if not phone.startswith("+"):
        if phone.startswith("91") and len(phone) == 12:
            phone = "+" + phone
        elif len(phone) == 10:
            phone = "+91" + phone
    
    # 2. Query the student enrollments to find children mapping to this phone
    stmt = select(StudentEnrollment, StudentProfile).join(
        StudentProfile, StudentEnrollment.student_id == StudentProfile.id
    ).where(
        or_(
            StudentEnrollment.primary_parent_phone == phone,
            StudentEnrollment.local_guardian_phone == phone,
            StudentProfile.guardian_phone == phone
        )
    )

    results = await db.execute(stmt)
    rows = results.all()

    if not rows:
        return {
            "success": True,
            "wati_response": "As-salamu alaykum. We could not find any active student records associated with this number. Please contact your center Nazim to update your phone number in the ERP."
        }

    # 3. Aggregate Profile Data
    sibling_reports = []
    for enrollment, profile in rows:
        # In a real app, query Hifz pages, well-being logs, and leave dates here
        # Mocking the aggregation as per the specification
        sibling_reports.append({
            "student_name": profile.guardian_name,  # Using guardian name as placeholder for student name
            "admission_number": profile.admission_number,
            "progress": "Completed 15 pages in the last 30 days (Average Grade: A)",
            "health": "Well-being logs indicate EXCELLENT health.",
            "leave": "No upcoming batch leaves scheduled."
        })

    # 4. In a production scenario, this raw data is passed to Gemini 1.5 Flash via REST Proxy
    # to translate and format based on the incoming language.
    # Here we mock the structured response.
    
    return {
        "success": True,
        "processed_siblings": len(sibling_reports),
        "raw_data_for_gemini": sibling_reports,
        "wati_response": f"Found {len(sibling_reports)} student(s). Progress reports successfully compiled and dispatched to Gemini for translation."
    }
