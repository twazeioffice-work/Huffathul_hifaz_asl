# Location: services/core-backend/app/models/hifz.py
import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Numeric, Date, Enum, CheckConstraint, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base

class SabaqRecord(Base):
    __tablename__ = "hifz_sabaq_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    staff_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False)
    
    date = Column(Date, nullable=False, server_default=func.current_date())
    juz_number = Column(Integer, nullable=False)
    page_start = Column(Integer, nullable=False)
    page_end = Column(Integer, nullable=False)
    grade = Column(Enum('excellent', 'good', 'average', 'needs_improvement', name='hifz_grade_type'), nullable=False)
    teacher_notes = Column(Text)
    
    last_modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint('juz_number BETWEEN 1 AND 30', name='chk_juz_number'),
        CheckConstraint('page_start BETWEEN 1 AND 604', name='chk_page_start'),
        CheckConstraint('page_end >= page_start AND page_end <= 604', name='chk_page_end'),
        {'extend_existing': True}
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "institution_id": str(self.institution_id),
            "branch_id": str(self.branch_id),
            "student_enrollment_id": str(self.student_enrollment_id),
            "staff_id": str(self.staff_id),
            "date": self.date.isoformat(),
            "juz_number": self.juz_number,
            "page_start": self.page_start,
            "page_end": self.page_end,
            "grade": self.grade,
            "teacher_notes": self.teacher_notes,
            "last_modified_at": self.last_modified_at.timestamp(),
            "created_at": self.created_at.timestamp()
        }

class SabqiRecord(Base):
    __tablename__ = "hifz_sabqi_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, server_default=func.current_date())
    juz_number = Column(Integer, nullable=False)
    grade = Column(Enum('excellent', 'good', 'average', 'needs_improvement', name='hifz_grade_type', create_type=False), nullable=False)
    last_modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class ManzilRecord(Base):
    __tablename__ = "hifz_manzil_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    student_enrollment_id = Column(UUID(as_uuid=True), ForeignKey("student_enrollments.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, server_default=func.current_date())
    juz_number = Column(Integer, nullable=False)
    grade = Column(Enum('excellent', 'good', 'average', 'needs_improvement', name='hifz_grade_type', create_type=False), nullable=False)
    last_modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

