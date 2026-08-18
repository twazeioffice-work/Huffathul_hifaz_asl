# Location: services/core-backend/app/routers/affiliation.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, UUID4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.db.session import get_db_session
from app.models.affiliation import AffiliationRequest, AffiliationStatus
from app.core.tasks.broadcast_worker import send_workflow_alert_task

router = APIRouter(prefix="/api/v1/affiliations")

class AffiliationTransitionRequest(BaseModel):
    request_id: UUID4
    new_status: AffiliationStatus
    notes: str | None = None

VALID_TRANSITIONS = {
    AffiliationStatus.PENDING: [AffiliationStatus.UNDER_REVIEW, AffiliationStatus.REJECTED],
    AffiliationStatus.UNDER_REVIEW: [AffiliationStatus.APPROVED, AffiliationStatus.REJECTED],
    AffiliationStatus.APPROVED: [AffiliationStatus.REJECTED],
    AffiliationStatus.REJECTED: [AffiliationStatus.UNDER_REVIEW]
}

@router.post("/transition", status_code=status.HTTP_200_OK)
async def transition_affiliation_status(
    payload: AffiliationTransitionRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_db_session)
):
    async with session.begin():
        # Fetch current target record with row-level transaction locks
        query = select(AffiliationRequest).filter(
            AffiliationRequest.id == payload.request_id
        ).with_for_update()
        result = await session.execute(query)
        record = result.scalar_one_or_none()
        
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Affiliation request ID not found."
            )
            
        current = record.status
        target = payload.new_status
        
        # Enforce validation checks on transition loops
        if target not in VALID_TRANSITIONS.get(current, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid transition step from state {current} to {target}."
            )
            
        # Perform modification updates
        record.status = target
        record.review_notes = payload.notes
        
        # Dispatch background update notifications via celery queue tasks
        background_tasks.add_task(
            send_workflow_alert_task,
            str(record.id),
            str(record.institution_id),
            target.value
        )
        
        return {"status": "success", "previous": current.value, "current": target.value}
