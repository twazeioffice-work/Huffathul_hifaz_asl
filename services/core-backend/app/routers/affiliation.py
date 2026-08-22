from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

# Assuming these are available in the app's structure
from app.db.session import get_db_session
from app.models.affiliation import AffiliationRequest, AffiliationChecklist, AffiliationMedia
from app.core.security import log_security_event

router = APIRouter(prefix="/api/v1/affiliations", tags=["Affiliation Operations"])

# Schema models
class TransitionStageRequest(BaseModel):
    request_id: UUID
    target_stage: str # e.g., 'DOCUMENTS_VERIFIED', 'PHYSICAL_INSPECTION_SCHEDULED'
    reviewer_comments: Optional[str] = None

class ScheduleInspectionRequest(BaseModel):
    request_id: UUID
    inspector_id: UUID
    scheduled_date: date

# Core Transition State machine logic
@router.post("/transition", status_code=status.HTTP_200_OK)
async def transition_affiliation_state(
    req: TransitionStageRequest, 
    session: AsyncSession = Depends(get_db_session)
):
    """
    Transition affiliation requests between stages. Enforces verification boundaries
    to ensure the state cannot skip phases or bypass audits.
    """
    async with session.begin(): # Enforce Distributed ACID boundaries
        # 1. Fetch current request status
        query = select(AffiliationRequest).where(AffiliationRequest.id == req.request_id).with_for_update()
        res = await session.execute(query)
        request_record = res.scalar_one_or_none()
        
        if not request_record:
            raise HTTPException(status_code=404, detail="Affiliation record not found")
            
        current = request_record.current_stage
        target = req.target_stage
        
        # Define strict legal transition bounds
        allowed_transitions = {
            'DRAFT': ['SUBMITTED'],
            'SUBMITTED': ['DOCUMENTS_VERIFIED', 'REJECTED'],
            'DOCUMENTS_VERIFIED': ['PHYSICAL_INSPECTION_SCHEDULED', 'REJECTED'],
            'PHYSICAL_INSPECTION_SCHEDULED': ['INSPECTION_COMPLETED', 'REJECTED'],
            'INSPECTION_COMPLETED': ['APPROVED', 'REJECTED'],
            'APPROVED': [],
            'REJECTED': ['DRAFT'] # Allow re-applying from draft stage
        }
        
        if target not in allowed_transitions.get(current, []):
            raise HTTPException(
                status_code=422, 
                detail=f"Illegal state transition from '{current}' to '{target}'"
            )
            
        # 2. Gatekeeper: Ensure ALL 5 checklist criteria are met before shifting to DOCUMENTS_VERIFIED
        if target == 'DOCUMENTS_VERIFIED':
            checklist_query = select(AffiliationChecklist).where(
                AffiliationChecklist.request_id == req.request_id,
                AffiliationChecklist.is_fulfilled == False
            )
            unfulfilled = await session.execute(checklist_query)
            if len(unfulfilled.all()) > 0:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot verify: Not all verification criteria checklist cards have been cleared."
                )
                
        # 3. Gatekeeper: Ensure media documents are validated before dispatching physically
        if target == 'PHYSICAL_INSPECTION_SCHEDULED':
            media_query = select(AffiliationMedia).where(
                AffiliationMedia.request_id == req.request_id,
                AffiliationMedia.is_approved == False
            )
            unapproved_media = await session.execute(media_query)
            if len(unapproved_media.all()) > 0:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot schedule inspection: Some uploaded facility photos or videos are unapproved."
                )

        # Apply transition
        request_record.current_stage = target
        request_record.updated_at = date.today()
        
        # Log to secure audit ledger
        await log_security_event(
            session=session,
            action="AFFILIATION.STATE_TRANSITION",
            resource_type="affiliation_request",
            resource_id=str(req.request_id),
            old_state={"stage": current},
            new_state={"stage": target, "comments": req.reviewer_comments}
        )
        
        return {"status": "SUCCESS", "current_stage": target}
