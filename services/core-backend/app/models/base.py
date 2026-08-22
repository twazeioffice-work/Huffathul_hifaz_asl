import datetime
from uuid import uuid4
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    
    # GDPR / SOC 2 Tombstoning Data Lifecycle Pipeline
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

