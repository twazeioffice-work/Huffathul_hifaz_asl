from sqlalchemy import Column, String, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class FinancialVoucher(BaseModel):
    __tablename__ = "financial_vouchers"
    
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    narration = Column(String(500), nullable=False)
    
    # Relationships
    transactions = relationship("LedgerTransaction", back_populates="voucher", cascade="all, delete-orphan")


class LedgerTransaction(BaseModel):
    __tablename__ = "ledger_transactions"
    
    voucher_id = Column(UUID(as_uuid=True), ForeignKey("financial_vouchers.id", ondelete="CASCADE"), nullable=False)
    account_head = Column(String(255), nullable=False) # 'CASH', 'BANK', 'SADAQAH_REVENUE', 'TUITION_REVENUE'
    debit = Column(Numeric(12, 2), default=0.00, nullable=False)
    credit = Column(Numeric(12, 2), default=0.00, nullable=False)
    
    # Relationships
    voucher = relationship("FinancialVoucher", back_populates="transactions")
