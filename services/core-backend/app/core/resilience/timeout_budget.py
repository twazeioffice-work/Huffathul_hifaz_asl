"""
Dynamic Request Chain Timeout Budget Tracker
=============================================
Propagates and computes remaining execution budget across client -> Next.js BFF ->
FastAPI backend -> PostgreSQL / outbound HTTP calls.
"""

import time
from fastapi import Request, Header, HTTPException, status
from typing import Optional


class TimeoutBudgetTracker:
    def __init__(self, budget_ms: float):
        self.start_time = time.time()
        self.total_budget_seconds = budget_ms / 1000.0

    def get_remaining_seconds(self) -> float:
        elapsed = time.time() - self.start_time
        remaining = self.total_budget_seconds - elapsed
        if remaining <= 0:
            return 0.001  # Minimal non-zero float to trigger fast-abort on consumer
        return remaining

    def get_remaining_ms(self) -> int:
        return int(self.get_remaining_seconds() * 1000)

    def assert_not_depleted(self) -> None:
        if self.get_remaining_seconds() <= 0.005:  # 5ms buffer
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Request Timeout Budget depleted before execution segment.",
            )


async def get_timeout_budget(
    request: Request = None,
    x_timeout_budget: Optional[str] = Header(None),
) -> TimeoutBudgetTracker:
    """
    FastAPI dependency extracting X-Timeout-Budget header (in milliseconds).
    Defaults to 8000ms if not explicitly provided.
    """
    initial_budget = 8000.0
    if x_timeout_budget:
        try:
            initial_budget = float(x_timeout_budget)
        except ValueError:
            initial_budget = 8000.0

    tracker = TimeoutBudgetTracker(initial_budget)
    tracker.assert_not_depleted()
    return tracker
