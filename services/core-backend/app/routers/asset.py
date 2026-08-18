# Location: services/core-backend/app/routers/asset.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import date
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db_session
from app.models.asset import Asset, AssetCategory
from app.models.ledger import Voucher, VoucherLine

router = APIRouter(prefix="/api/v1/assets")

class AssetRegisterRequest(BaseModel):
    category_id: UUID
    code: str = Field(..., max_length=64)
    name: str = Field(..., max_length=255)
    acquisition_date: date
    acquisition_cost: float = Field(..., gt=0.0)
    metadata: Dict[str, Any] = {}
    tracker_token: Optional[str] = None

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_physical_asset(
    req: AssetRegisterRequest,
    institution_id: UUID,
    branch_id: UUID,
    session: AsyncSession = Depends(get_db_session)
):
    async with session.begin():
        # 1. Fetch category properties to configure asset values
        category_query = await session.execute(
            select(AssetCategory).where(AssetCategory.id == req.category_id)
        )
        category = category_query.scalar_one_or_none()
        if not category:
            raise HTTPException(status_code=404, detail="Asset classification category not found.")

        # Calculate salvage and current book values
        salvage_percentage = float(category.salvage_value_percentage) / 100.0
        salvage_val = round(req.acquisition_cost * salvage_percentage, 2)
        
        # 2. Instantiate and insert Asset record
        new_asset = Asset(
            institution_id=institution_id,
            branch_id=branch_id,
            category_id=req.category_id,
            code=req.code,
            name=req.name,
            acquisition_date=req.acquisition_date,
            acquisition_cost=req.acquisition_cost,
            current_book_value=req.acquisition_cost,
            salvage_value=salvage_val,
            metadata_=req.metadata,
            tracker_token=req.tracker_token,
            status="active"
        )
        session.add(new_asset)
        await session.flush() # Generate new asset ID before double-entry ledger execution

        # 3. Create Balanced Double-Entry Financial Voucher
        new_voucher = Voucher(
            institution_id=institution_id,
            branch_id=branch_id,
            voucher_number=f"VCH-AST-{new_asset.code}",
            type="journal",
            narration=f"Automated physical ledger entry for acquisition of asset: {new_asset.name}."
        )
        session.add(new_voucher)
        await session.flush()

        # Debit: Asset Account
        debit_line = VoucherLine(
            voucher_id=new_voucher.id,
            account_head_id=category.asset_account_head_id,
            debit=req.acquisition_cost,
            credit=0.00
        )
        # Credit: Cash/Bank Account (assumed standard placeholder for transaction context)
        credit_line = VoucherLine(
            voucher_id=new_voucher.id,
            account_head_id=category.depr_account_head_id, # Maps to acquisition credit ledger
            debit=0.00,
            credit=req.acquisition_cost
        )
        session.add_all([debit_line, credit_line])

        return {"status": "success", "asset_id": str(new_asset.id), "voucher_id": str(new_voucher.id)}
