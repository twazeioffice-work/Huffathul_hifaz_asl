import uuid
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class DeletedRecord(Base):
    __tablename__ = "deleted_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    table_name = Column(String(64), nullable=False)
    record_id = Column(UUID(as_uuid=True), nullable=False)
    deleted_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
