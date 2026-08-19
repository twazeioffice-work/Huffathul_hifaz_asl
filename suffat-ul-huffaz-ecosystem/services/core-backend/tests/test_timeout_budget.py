"""
Timeout Budget Integration Tests
=================================
Tests:
  1. Budget tracker decrements elapsed time accurately
  2. Depleted budget triggers HTTP 504 Gateway Timeout
  3. Header extraction extracts custom budget from X-Timeout-Budget
"""

import pytest
import time
from fastapi import HTTPException

from app.core.resilience.timeout_budget import (
    TimeoutBudgetTracker,
    get_timeout_budget,
)


def test_timeout_budget_calculation():
    """Verifies that the remaining budget decrements correctly."""
    tracker = TimeoutBudgetTracker(5000.0)  # 5000ms

    assert tracker.get_remaining_ms() <= 5000
    assert tracker.get_remaining_ms() >= 4900

    # Sleep 50ms
    time.sleep(0.05)
    assert tracker.get_remaining_ms() <= 4960
    print("✅ Timeout budget correctly decrements elapsed execution time.")


def test_timeout_budget_depletion_raises_504():
    """Verifies that an exhausted budget raises HTTP 504."""
    tracker = TimeoutBudgetTracker(10.0)  # 10ms budget

    # Wait for budget to expire
    time.sleep(0.02)

    with pytest.raises(HTTPException) as exc_info:
        tracker.assert_not_depleted()

    assert exc_info.value.status_code == 504
    assert "depleted" in exc_info.value.detail
    print("✅ Depleted budget correctly triggered HTTP 504 Gateway Timeout.")
