# Location: services/core-backend/app/models/lms.py
import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base

class LMSCourse(Base):
    __tablename__ = "lms_courses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class LMSMaterial(Base):
    __tablename__ = "lms_materials"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("lms_courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    asset_url = Column(String(1024), nullable=False)
    is_encrypted = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class LMSQuiz(Base):
    __tablename__ = "lms_quizzes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("lms_courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    total_score = Column(Integer, default=100)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
