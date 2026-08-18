# Location: services/core-backend/app/routers/sync.py
import datetime
from typing import Dict, Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert
from app.db.session import get_db_session
from app.models.hifz import SabaqRecord
from app.models.sync import DeletedRecord

router = APIRouter(prefix="/api/v1/sync")

class PushPayload(BaseModel):
    last_pulled_at: float
    changes: Dict[str, Dict[str, List[Dict[str, Any]]]] = Field(
        ..., 
        example={
            "hifz_sabaq_records": {
                "created": [{"id": "uuid-here", "student_enrollment_id": "...", "juz_number": 1}],
                "updated": [{"id": "uuid-here", "grade": "excellent"}],
                "deleted": ["uuid-here"]
            }
        }
    )

@router.get("/pull")
async def pull_delta(
    last_pulled_at: float, 
    institution_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    # Convert epoch float to localized timezone-aware datetime
    sync_time = datetime.datetime.fromtimestamp(last_pulled_at, tz=datetime.timezone.utc)
    
    # 1. Fetch created/updated records
    sabaq_query = select(SabaqRecord).where(
        SabaqRecord.institution_id == institution_id,
        SabaqRecord.last_modified_at > sync_time
    )
    sabaq_result = await db.execute(sabaq_query)
    sabaq_records = sabaq_result.scalars().all()
    
    # 2. Query tombstone deletions
    tombstone_query = select(DeletedRecord).where(
        DeletedRecord.institution_id == institution_id,
        DeletedRecord.deleted_at > sync_time
    )
    tombstone_result = await db.execute(tombstone_query)
    deleted_records = tombstone_result.scalars().all()
    
    server_time = datetime.datetime.now(datetime.timezone.utc).timestamp()
    
    return {
        "timestamp": server_time,
        "changes": {
            "hifz_sabaq_records": {
                "created": [r.to_dict() for r in sabaq_records if r.created_at > sync_time],
                "updated": [r.to_dict() for r in sabaq_records if r.created_at <= sync_time],
                "deleted": [d.record_id for d in deleted_records if d.table_name == "hifz_sabaq_records"]
            }
        }
    }

@router.post("/push")
async def push_delta(
    payload: PushPayload,
    institution_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    async with db.begin(): # ACID-compliant transaction block
        changes = payload.changes
        sabaq_changes = changes.get("hifz_sabaq_records", {})
        
        # PROCESS CREATED RECORDS
        for record_data in sabaq_changes.get("created", []):
            record_data["institution_id"] = institution_id
            await db.execute(insert(SabaqRecord).values(record_data))
            
        # PROCESS UPDATED RECORDS WITH LAST-WRITE-WINS (LWW) CONFLICT CHECKS
        for record_data in sabaq_changes.get("updated", []):
            db_record = await db.get(SabaqRecord, record_data["id"])
            if db_record:
                # Compare server model last_modified_at to payload timestamp
                client_modified = datetime.datetime.fromtimestamp(
                    record_data.get("last_modified_at", 0), 
                    tz=datetime.timezone.utc
                )
                if db_record.last_modified_at > client_modified:
                    # Server has newer state; discard update to preserve audit integrity
                    continue
                
                # Update attributes
                for key, val in record_data.items():
                    if hasattr(db_record, key) and key not in ['id', 'institution_id']:
                        setattr(db_record, key, val)
                    
        # PROCESS DELETED RECORDS & POPULATE TOMBSTONES
        for record_id in sabaq_changes.get("deleted", []):
            db_record = await db.get(SabaqRecord, record_id)
            if db_record:
                await db.delete(db_record)
                # Register tombstone for peer devices
                tombstone = DeletedRecord(
                    institution_id=institution_id,
                    table_name="hifz_sabaq_records",
                    record_id=record_id
                )
                db.add(tombstone)
                
    return {"status": "success", "timestamp": datetime.datetime.now(datetime.timezone.utc).timestamp()}
