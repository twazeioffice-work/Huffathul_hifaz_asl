import datetime
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class StudentEnrollment(BaseModel):
    __tablename__ = "student_enrollments"
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_name = Column(String(255), nullable=False)
    roll_number = Column(String(50), nullable=False)
    halqa_id = Column(UUID(as_uuid=True), nullable=True) # Scoped grouping for academic progression
    assigned_ustad_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    sabaq_records = relationship("SabaqRecord", back_populates="student", cascade="all, delete-orphan")
    prayer_attendance = relationship("PrayerAttendance", back_populates="student", cascade="all, delete-orphan")
    behavior_logs = relationship("BehaviorLog", back_populates="student", cascade="all, delete-orphan")


class SabaqRecord(BaseModel):
    __tablename__ = "hifz_sabaq_records"
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    staff_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, default=datetime.date.today, nullable=False)
    juz_number = Column(Integer, nullable=False)
    page_start = Column(Integer, nullable=False)
    page_end = Column(Integer, nullable=False)
    grade = Column(String(50), nullable=False) # 'EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT'
    teacher_notes = Column(String(500), nullable=True)
    last_modified_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("StudentEnrollment", back_populates="sabaq_records")


class PrayerAttendance(BaseModel):
    __tablename__ = "prayer_attendance"
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, default=datetime.date.today, nullable=False)
    fajr = Column(Boolean, default=False, nullable=False)
    dhuhr = Column(Boolean, default=False, nullable=False)
    asr = Column(Boolean, default=False, nullable=False)
    maghrib = Column(Boolean, default=False, nullable=False)
    isha = Column(Boolean, default=False, nullable=False)
    last_modified_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("StudentEnrollment", back_populates="prayer_attendance")


class BehaviorLog(BaseModel):
    __tablename__ = "behavior_logs"
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    staff_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, default=datetime.date.today, nullable=False)
    adab_score = Column(Integer, nullable=False) # Scale 1 - 10
    cleanliness_score = Column(Integer, nullable=False) # Scale 1 - 10
    respect_score = Column(Integer, nullable=False) # Scale 1 - 10
    last_modified_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("StudentEnrollment", back_populates="behavior_logs")
