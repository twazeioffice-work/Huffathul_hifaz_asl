from decimal import Decimal
from typing import List, Dict

class FinancialLedgerMock:
    """
    Mock Service for Phase 6 Pipeline Execution.
    In production, this translates to SQLAlchemy ORM operations.
    """
    
    @staticmethod
    def validate_double_entry(lines: List[Dict[str, Decimal]]) -> bool:
        """
        Enforces the primary ACID rule of double-entry accounting:
        Sum of Debits MUST equal Sum of Credits.
        """
        total_debit = Decimal('0.00')
        total_credit = Decimal('0.00')
        
        for line in lines:
            if line.get("debit", 0) > 0 and line.get("credit", 0) > 0:
                raise ValueError("Mutual Exclusion Failed: Line cannot have both Debit and Credit")
            
            total_debit += Decimal(str(line.get("debit", '0.00')))
            total_credit += Decimal(str(line.get("credit", '0.00')))
            
        if total_debit != total_credit:
            raise ValueError(f"Asymmetric Voucher: Debit {total_debit} != Credit {total_credit}")
            
        return True
