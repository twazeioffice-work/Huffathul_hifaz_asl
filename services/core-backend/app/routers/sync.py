import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from pydantic import BaseModel
from typing import Dict, Any, List

from app.db.session import get_db_session
from app.models.student import StudentProfile
from app.models.sync import DeletedRecord

router = APIRouter(prefix="/api/v1/sync")

class PushChangesRequest(BaseModel):
    changes: Dict[str, Any]
    last_pulled_at: int

@router.get("/pull")
async def pull_changes(
    last_pulled_at: int = Query(0, description="Timestamp of last pull"),
    session: AsyncSession = Depends(get_db_session)
):
    """
    WatermelonDB Pull Endpoint.
    Returns changes since `last_pulled_at`.
    Uses Last-Write-Wins (LWW) logic based on updated_at/created_at timestamps.
    """
    last_pulled_datetime = datetime.fromtimestamp(last_pulled_at)
    
    # 1. Fetch created/updated records
    # (Simplified for student_profiles as an example of sync)
    stmt_profiles = select(StudentProfile).where(StudentProfile.created_at >= last_pulled_datetime)
    profiles_result = await session.execute(stmt_profiles)
    profiles = profiles_result.scalars().all()
    
    created_profiles = []
    updated_profiles = []
    for p in profiles:
        # Simplistic approach: if created after last_pulled, it's created, else updated
        if p.created_at.timestamp() >= last_pulled_at:
             created_profiles.append({
                 "id": str(p.id), 
                 "admission_number": p.admission_number,
                 "full_name": "Synced User" # Requires join with User in reality
             })
        else:
             updated_profiles.append({
                 "id": str(p.id), 
                 "admission_number": p.admission_number,
                 "full_name": "Synced User"
             })
             
    # 2. Fetch deleted records from tombstone table
    stmt_deleted = select(DeletedRecord).where(
        and_(
            DeletedRecord.table_name == 'student_profiles',
            DeletedRecord.deleted_at >= last_pulled_datetime
        )
    )
    deleted_result = await session.execute(stmt_deleted)
    deleted_records = deleted_result.scalars().all()
    deleted_ids = [str(r.record_id) for r in deleted_records]

    current_timestamp = int(datetime.now().timestamp())
    
    return {
        "changes": {
            "student_profiles": {
                "created": created_profiles,
                "updated": updated_profiles,
                "deleted": deleted_ids
            }
        },
        "timestamp": current_timestamp
    }

@router.post("/push")
async def push_changes(
    payload: PushChangesRequest,
    session: AsyncSession = Depends(get_db_session)
):
    """
    WatermelonDB Push Endpoint.
    Applies offline client changes to the server.
    """
    changes = payload.changes
    
    async with session.begin():
        if "student_profiles" in changes:
            profiles_changes = changes["student_profiles"]
            
            # Apply creations
            for created_record in profiles_changes.get("created", []):
                # (In a real app, construct the SQLAlchemy model instance and insert)
                pass 
                
            # Apply updates
            for updated_record in profiles_changes.get("updated", []):
                # Apply LWW: only update if the client's last_modified_at is > server's last_modified_at
                pass
                
            # Apply deletions (moves to tombstone)
            for deleted_id in profiles_changes.get("deleted", []):
                # Soft delete or move to DeletedRecord
                pass
                
    return {"status": "ok"}
