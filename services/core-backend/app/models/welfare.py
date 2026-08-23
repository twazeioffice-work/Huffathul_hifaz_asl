import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class WelfareCaseStatus(str, Enum):
    PENDING_LOCAL_RESPONSE = 'PENDING_LOCAL_RESPONSE'
    RESPONDED_BY_LOCAL = 'RESPONDED_BY_LOCAL'
    APPEALED_TO_HQ = 'APPEALED_TO_HQ'
    DIVERTED_WITH_DEADLINE = 'DIVERTED_WITH_DEADLINE'
    RESOLVED = 'RESOLVED'

class StudentWelfareCase(Base):
    __tablename__ = "student_welfare_cases"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    
    sender_profile_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="SET NULL"), nullable=True)
    initial_content = Column(Text, nullable=False)
    
    status = Column(String(50), default='PENDING_LOCAL_RESPONSE', nullable=False)
    ustad_resolved = Column(Boolean, default=False, nullable=False)
    admin_resolved = Column(Boolean, default=False, nullable=False)
    
    appealed_at = Column(DateTime(timezone=True), nullable=True)
    appeal_reason = Column(Text, nullable=True)
    
    diverted_at = Column(DateTime(timezone=True), nullable=True)
    hq_special_message = Column(Text, nullable=True)
    resolution_deadline = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class WelfareCaseMessage(Base):
    __tablename__ = "welfare_case_messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("student_welfare_cases.id", ondelete="CASCADE"), nullable=False)
    sender_profile_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False)
    message_body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
