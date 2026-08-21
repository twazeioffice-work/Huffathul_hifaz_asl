from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class StaffProfile(BaseModel):
    __tablename__ = "staff_profiles"
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    clerk_id = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False) # 'SUPER_ADMIN', 'NAZIM', 'USTAD'
    phone_number = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    complaints = relationship("Complaint", back_populates="submitter", cascade="all, delete-orphan")


class Complaint(BaseModel):
    __tablename__ = "complaints"
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    
    complaint_type = Column(String(50), nullable=False) # 'OPEN', 'ANONYMOUS'
    submitter_profile_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="SET NULL"), nullable=True)
    obfuscated_submitter_hash = Column(String(64), nullable=True) # SHA-256 signature
    
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)
    severity = Column(String(50), default="STANDARD", nullable=False) # 'STANDARD', 'SEVERE'
    status = Column(String(50), default="OPEN", nullable=False) # 'OPEN', 'IN_PROGRESS', 'RESOLVED'
    is_escalated = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    submitter = relationship("StaffProfile", back_populates="complaints")
