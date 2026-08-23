from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class StaffProfile(BaseModel):
    __tablename__ = "staff_profiles"
    __table_args__ = {'extend_existing': True}
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    clerk_id = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False) # 'SUPER_ADMIN', 'NAZIM', 'USTAD'
    phone_number = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


