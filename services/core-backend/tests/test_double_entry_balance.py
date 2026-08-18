# Location: services/core-backend/tests/test_double_entry_balance.py
import pytest
from decimal import Decimal
from sqlalchemy.exc import IntegrityError
import uuid
import datetime

@pytest.mark.asyncio
async def test_ledger_double_entry_integrity(db_session):
    # Retrieve active cash asset and tuition income ledger IDs
    # Since we don't have full test fixtures here, we will create mock records
    from app.models.ledger import Voucher, VoucherLine, AccountHead
    from app.models.tenant import Institution, Branch
    
    inst_id = uuid.uuid4()
    branch_id = uuid.uuid4()
    
    inst = Institution(id=inst_id, name="Test Inst", code="T01", is_active=True)
    branch = Branch(id=branch_id, institution_id=inst_id, name="Main", code="M01", is_active=True)
    
    cash_acc = AccountHead(id=uuid.uuid4(), institution_id=inst_id, branch_id=branch_id, code="100", name="Cash", type="asset")
    rev_acc = AccountHead(id=uuid.uuid4(), institution_id=inst_id, branch_id=branch_id, code="400", name="Rev", type="revenue")
    
    db_session.add_all([inst, branch, cash_acc, rev_acc])
    await db_session.flush()
    
    unbalanced_voucher = Voucher(
        institution_id=inst_id,
        branch_id=branch_id,
        voucher_number="ERR-001",
        type="journal",
        transaction_date=datetime.date.today()
    )
    db_session.add(unbalanced_voucher)
    await db_session.flush()
    
    # Post asymmetrical voucher lines (violating app checks, though SQL constraints focus on positivity and mutual exclusion)
    line_1 = VoucherLine(voucher_id=unbalanced_voucher.id, account_head_id=cash_acc.id, debit=Decimal("100.00"), credit=Decimal("0.00"))
    line_2 = VoucherLine(voucher_id=unbalanced_voucher.id, account_head_id=rev_acc.id, debit=Decimal("0.00"), credit=Decimal("95.00"))
    db_session.add_all([line_1, line_2])
    
    # In a real system, the validation function `validate_and_post_voucher` would assert sum(debit) == sum(credit)
    # We simulate this check:
    total_debit = sum([l.debit for l in [line_1, line_2]])
    total_credit = sum([l.credit for l in [line_1, line_2]])
    
    if total_debit != total_credit:
        raise ValueError("Unbalanced transaction: Debits must equal Credits")
        
    await db_session.rollback()
