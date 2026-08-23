import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, Text, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import BaseModel

class FacilityType(enum.Enum):
    HALQA = 'HALQA'
    NAMAZ = 'NAMAZ'
    CLEANLINESS = 'CLEANLINESS'
    KITHAB = 'KITHAB'
    OTHER = 'OTHER'

class FacilityStatus(enum.Enum):
    PENDING_SUPER_ADMIN_APPROVAL = 'PENDING_SUPER_ADMIN_APPROVAL'
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'

class ComplaintRecipientType(enum.Enum):
    CENTER_ADMIN = 'CENTER_ADMIN'
    SUPER_ADMIN = 'SUPER_ADMIN'

class ComplaintTargetType(enum.Enum):
    USTAD = 'USTAD'
    NAZIM = 'NAZIM'
    STUDENT = 'STUDENT'

class StudentFacility(BaseModel):
    __tablename__ = 'student_facilities'
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(SQLEnum(FacilityType), nullable=False)
    status = Column(SQLEnum(FacilityStatus), default=FacilityStatus.PENDING_SUPER_ADMIN_APPROVAL, nullable=False)
    is_enabled_for_students = Column(Boolean, default=False, nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id"), nullable=False)

class SystemNotification(BaseModel):
    __tablename__ = 'system_notifications'
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=True)
    recipient_role = Column(String(50), default='SUPER_ADMIN', nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    action_url = Column(String(500), nullable=True)

class CampusNotice(BaseModel):
    __tablename__ = 'campus_notices'
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

class Complaint(BaseModel):
    __tablename__ = 'complaints'
    __table_args__ = {'extend_existing': True}
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    
    against_role = Column(SQLEnum(ComplaintTargetType), nullable=False)
    against_profile_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="SET NULL"), nullable=True)
    against_student_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="SET NULL"), nullable=True)
    
    recipient = Column(SQLEnum(ComplaintRecipientType), nullable=False)
    is_anonymous = Column(Boolean, default=False, nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    status = Column(String(50), default='OPEN', nullable=False)
    resolution_notes = Column(Text, nullable=True)
    resolved_by_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="SET NULL"), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
