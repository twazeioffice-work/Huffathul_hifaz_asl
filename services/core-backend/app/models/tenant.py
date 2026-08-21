from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Institution(BaseModel):
    __tablename__ = "institutions"
    name = Column(String(255), nullable=False)
    
    # Relationships
    branches = relationship("Branch", back_populates="institution", cascade="all, delete-orphan")


class Branch(BaseModel):
    __tablename__ = "branches"
    name = Column(String(255), nullable=False)
    
    # Foreign Keys
    from sqlalchemy import ForeignKey
    from sqlalchemy.dialects.postgresql import UUID
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    
    # Relationships
    institution = relationship("Institution", back_populates="branches")
