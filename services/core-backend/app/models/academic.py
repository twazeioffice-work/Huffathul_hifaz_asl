import uuid
from sqlalchemy import Column, String, Integer, Boolean, Text, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Course(Base):
    __tablename__ = "courses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(32), nullable=False)
    name = Column(String(255), nullable=False)
    duration_months = Column(Integer, default=12, nullable=False)
    grading_system = Column(Enum('GPA', 'Percentage', 'Letter', name='course_grading'), default='Percentage', nullable=False)
    
    subjects = relationship("CourseSubject", back_populates="course", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(32), nullable=False)
    name = Column(String(255), nullable=False)
    subject_type = Column(Enum('Core', 'Elective', 'Practical', name='subject_category'), default='Core', nullable=False)
    credits = Column(Integer, default=1, nullable=False)

    courses = relationship("CourseSubject", back_populates="subject", cascade="all, delete-orphan")
    modules = relationship("SyllabusModule", back_populates="subject", cascade="all, delete-orphan")

class CourseSubject(Base):
    __tablename__ = "course_subjects"
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), primary_key=True)
    semester_or_term = Column(Integer, default=1, nullable=False)
    is_mandatory = Column(Boolean, default=True, nullable=False)
    
    course = relationship("Course", back_populates="subjects")
    subject = relationship("Subject", back_populates="courses")

class SyllabusModule(Base):
    __tablename__ = "syllabus_modules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    module_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    estimated_hours = Column(Integer, default=0, nullable=False)

    subject = relationship("Subject", back_populates="modules")
