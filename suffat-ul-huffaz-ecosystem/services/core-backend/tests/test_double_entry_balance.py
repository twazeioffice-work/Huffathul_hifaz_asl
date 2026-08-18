import pytest
from decimal import Decimal
from app.models.ledger import FinancialLedgerMock
from app.routers.billing import collect_student_fees

def test_balanced_voucher():
    """
    Ensures perfectly balanced vouchers are accepted.
    """
    lines = [
        {"debit": Decimal('500.00'), "credit": Decimal('0.00')},
        {"debit": Decimal('0.00'), "credit": Decimal('500.00')}
    ]
    assert FinancialLedgerMock.validate_double_entry(lines) == True

def test_unbalanced_voucher_rejection():
    """
    Ensures asymmetric vouchers trigger a rollback to prevent financial leaks.
    """
    lines = [
        {"debit": Decimal('500.00'), "credit": Decimal('0.00')},
        {"debit": Decimal('0.00'), "credit": Decimal('499.99')}  # 1 cent off
    ]
    with pytest.raises(ValueError, match="Asymmetric Voucher"):
        FinancialLedgerMock.validate_double_entry(lines)

def test_mutual_exclusion_rejection():
    """
    A single voucher line cannot contain both debit and credit.
    """
    lines = [
        {"debit": Decimal('500.00'), "credit": Decimal('500.00')}
    ]
    with pytest.raises(ValueError, match="Mutual Exclusion Failed"):
        FinancialLedgerMock.validate_double_entry(lines)

def test_billing_router_integration():
    """
    Validates the endpoint generates a proper receipt on success.
    """
    response = collect_student_fees("STU-100", Decimal('1200.00'))
    assert response["status"] == "SUCCESS"
    assert response["amount"] == "1200.00"
