# Location: services/core-backend/app/models/ledger.py
import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Numeric, Date, Enum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class AccountHead(Base):
    __tablename__ = "account_heads"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("account_heads.id", ondelete="SET NULL"), nullable=True)
    
    code = Column(String(32), nullable=False)
    name = Column(String(128), nullable=False)
    type = Column(Enum('asset', 'liability', 'equity', 'revenue', 'expense', name='account_type'), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    parent = relationship("AccountHead", remote_side=[id])

class Voucher(Base):
    __tablename__ = "vouchers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    
    voucher_number = Column(String(64), nullable=False)
    type = Column(Enum('journal', 'receipt', 'payment', 'contra', name='voucher_type'), nullable=False)
    narration = Column(String)
    posted_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    transaction_date = Column(Date, nullable=False)

    lines = relationship("VoucherLine", back_populates="voucher", cascade="all, delete-orphan")

class VoucherLine(Base):
    __tablename__ = "voucher_lines"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    voucher_id = Column(UUID(as_uuid=True), ForeignKey("vouchers.id", ondelete="CASCADE"), nullable=False)
    account_head_id = Column(UUID(as_uuid=True), ForeignKey("account_heads.id", ondelete="RESTRICT"), nullable=False)
    
    debit = Column(Numeric(12, 2), nullable=False, default=0.00)
    credit = Column(Numeric(12, 2), nullable=False, default=0.00)

    voucher = relationship("Voucher", back_populates="lines")
    
    __table_args__ = (
        CheckConstraint('debit >= 0', name='chk_debit_positive'),
        CheckConstraint('credit >= 0', name='chk_credit_positive'),
        CheckConstraint('(debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)', name='chk_debit_credit_mutual_exclusion'),
    )
