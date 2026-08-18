# Location: services/core-backend/app/models/sync.py
import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base

class DeletedRecord(Base):
    __tablename__ = "sync_deleted_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    table_name = Column(String(64), nullable=False)
    record_id = Column(UUID(as_uuid=True), nullable=False)
    deleted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
