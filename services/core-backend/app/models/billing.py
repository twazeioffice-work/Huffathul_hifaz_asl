# Location: services/core-backend/app/models/billing.py
import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Numeric, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class FeeCategory(Base):
    __tablename__ = "fee_categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(128), nullable=False)
    description = Column(String)
    default_amount = Column(Numeric(12, 2), nullable=False)
    is_recurring = Column(Boolean, default=False, nullable=False)

class StudentDueSchedule(Base):
    __tablename__ = "student_due_schedules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    
    student_id = Column(UUID(as_uuid=True), nullable=False)
    enrollment_id = Column(UUID(as_uuid=True), nullable=False)
    fee_category_id = Column(UUID(as_uuid=True), ForeignKey("fee_categories.id", ondelete="RESTRICT"), nullable=False)
    
    due_amount = Column(Numeric(12, 2), nullable=False)
    paid_amount = Column(Numeric(12, 2), nullable=False, default=0.00)
    due_date = Column(Date, nullable=False)
    # is_fully_paid is a generated column in DB, we could map it or omit from basic SQLAlchemy model

class FeeReceipt(Base):
    __tablename__ = "fee_receipts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    
    due_schedule_id = Column(UUID(as_uuid=True), ForeignKey("student_due_schedules.id", ondelete="RESTRICT"), nullable=False)
    voucher_id = Column(UUID(as_uuid=True), ForeignKey("vouchers.id", ondelete="RESTRICT"), nullable=False)
    
    amount_paid = Column(Numeric(12, 2), nullable=False)
    payment_method = Column(String(64), nullable=False)
    pdf_receipt_hash = Column(String(64))
