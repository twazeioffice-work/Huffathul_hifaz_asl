# Location: services/core-backend/app/routers/billing.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, condecimal, Field
from uuid import UUID
from app.db.session import get_db
from app.models.ledger import Voucher, VoucherLine
from app.models.billing import StudentDueSchedule, FeeReceipt
from decimal import Decimal
import uuid
import datetime

router = APIRouter(prefix="/api/v1/billing")

class FeeCollectionRequest(BaseModel):
    due_schedule_id: UUID
    payment_method: str = Field(..., pattern="^(Cash|UPI|Bank_Transfer)$")
    amount_paid: condecimal(ge=Decimal("0.01"), decimal_places=2) # type: ignore
    cash_account_id: UUID # Target asset account head
    revenue_account_id: UUID # Target income account head
    posted_by: UUID

@router.post("/collect", status_code=status.HTTP_201_CREATED)
async def collect_fee(req: FeeCollectionRequest, db: AsyncSession = Depends(get_db)):
    # 1. Acquire transaction session block
    async with db.begin():
        # A. Fetch student due schedule and lock the row to prevent double-charging race conditions
        # Note: Using SQLAlchemy 2.0 select with with_for_update()
        due_record_query = await db.execute(
            select(StudentDueSchedule).where(StudentDueSchedule.id == req.due_schedule_id).with_for_update()
        )
        due_record = due_record_query.scalars().first()
        if not due_record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Due schedule not found.")
            
        remaining_balance = due_record.due_amount - due_record.paid_amount
        if req.amount_paid > remaining_balance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Overpayment prohibited. Maximum balance is {remaining_balance}."
            )
            
        # B. Perform transaction logic update
        due_record.paid_amount += req.amount_paid
        
        # C. Write Double-Entry Voucher
        voucher = Voucher(
            institution_id=due_record.institution_id,
            branch_id=due_record.branch_id,
            voucher_number=f"REC-{uuid.uuid4().hex[:12].upper()}",
            type="receipt",
            narration=f"Fee collection. Student ID: {due_record.student_id}. Method: {req.payment_method}",
            posted_by=req.posted_by,
            transaction_date=datetime.date.today()
        )
        db.add(voucher)
        await db.flush() # Yield voucher ID for line mapping
        
        # D. Ledger lines: Debit Cash (Asset Account Head)
        debit_line = VoucherLine(
            voucher_id=voucher.id,
            account_head_id=req.cash_account_id,
            debit=req.amount_paid,
            credit=Decimal("0.00")
        )
        # Ledger lines: Credit Revenue (Income Account Head)
        credit_line = VoucherLine(
            voucher_id=voucher.id,
            account_head_id=req.revenue_account_id,
            debit=Decimal("0.00"),
            credit=req.amount_paid
        )
        db.add_all([debit_line, credit_line])
        
        # E. Log Fee Receipt Entity
        receipt = FeeReceipt(
            institution_id=due_record.institution_id,
            branch_id=due_record.branch_id,
            due_schedule_id=due_record.id,
            voucher_id=voucher.id,
            amount_paid=req.amount_paid,
            payment_method=req.payment_method
        )
        db.add(receipt)
        
    # Transaction commit automatically processed at the exit of db.begin() context.
    # Safe fallback: Any error triggers automatic ROLLBACK.
    
    return {"status": "success", "receipt_id": receipt.id}
