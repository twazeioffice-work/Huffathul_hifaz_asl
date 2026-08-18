# Location: services/core-backend/app/models/affiliation.py
import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import enum
from app.db.base_class import Base

class AffiliationStatus(str, enum.Enum):
    PENDING = "PENDING"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class AffiliatedInstitution(Base):
    __tablename__ = "affiliated_institutions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(32), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True)
    address = Column(JSONB, default={}, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class AffiliationRequest(Base):
    __tablename__ = "affiliation_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    target_affiliated_institution_id = Column(UUID(as_uuid=True), ForeignKey("affiliated_institutions.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(AffiliationStatus, name="affiliation_status", create_type=False), default=AffiliationStatus.PENDING, nullable=False)
    submitted_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    review_notes = Column(Text)
    document_url = Column(String(512))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
