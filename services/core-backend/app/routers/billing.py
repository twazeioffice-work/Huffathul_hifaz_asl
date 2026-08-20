# FastAPI Mock Router for Phase 6
# In production this handles POST /api/v1/billing/collect

from decimal import Decimal
from app.models.ledger import FinancialLedgerMock

def collect_student_fees(student_id: str, amount: Decimal) -> dict:
    """
    Constructs the ACID transaction for collecting student fees.
    Debit: Cash/Bank Asset
    Credit: Tuition Revenue
    """
    voucher_lines = [
        {"account": "Cash Asset", "debit": amount, "credit": Decimal('0.00')},
        {"account": "Tuition Revenue", "debit": Decimal('0.00'), "credit": amount}
    ]
    
    try:
        FinancialLedgerMock.validate_double_entry(voucher_lines)
        return {"status": "SUCCESS", "receipt_id": "RCPT-12345", "amount": str(amount)}
    except ValueError as e:
        return {"status": "FAILED", "error": str(e)}
