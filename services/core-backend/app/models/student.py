import uuid
from sqlalchemy import Column, String, Boolean, Date, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base_class import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(32), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)

class Batch(Base):
    __tablename__ = "batches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    academic_year_id = Column(UUID(as_uuid=True), ForeignKey("academic_years.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    admission_number = Column(String(64), unique=True, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(16), nullable=False)
    guardian_name = Column(String(128), nullable=False)
    guardian_phone = Column(String(32), nullable=False)
    guardian_email = Column(String(255), nullable=True)
    digital_documents = Column(JSONB, default={}, nullable=True)

class StudentEnrollment(Base):
    __tablename__ = "student_enrollments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    academic_year_id = Column(UUID(as_uuid=True), ForeignKey("academic_years.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(Date, nullable=False)
    primary_parent_phone = Column(String(50), nullable=False, default='+910000000000')
    local_guardian_phone = Column(String(50), nullable=False, default='+910000000000')
    blood_group = Column(String(10), nullable=True)
    medical_history = Column(String, nullable=True)
    __table_args__ = {'extend_existing': True}

from sqlalchemy import DateTime, Numeric, Text
from sqlalchemy.sql import func

class BatchLeaveSchedule(Base):
    __tablename__ = "batch_leave_schedules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    batch_name = Column(String(100), nullable=False)
    leave_start_date = Column(DateTime(timezone=True), nullable=False)
    leave_end_date = Column(DateTime(timezone=True), nullable=False)
    reporting_date_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), nullable=False, default='SCHEDULED')
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class StudentWellBeingLog(Base):
    __tablename__ = "student_well_being_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    checked_by_ustad_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, server_default=func.current_date(), nullable=False)
    health_status = Column(String(50), nullable=False)
    temperature_fahrenheit = Column(Numeric(4, 1), nullable=True)
    mental_energy = Column(String(50), nullable=False)
    ustad_notes = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

