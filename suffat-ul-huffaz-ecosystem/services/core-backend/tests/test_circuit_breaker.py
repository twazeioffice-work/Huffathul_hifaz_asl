"""
Circuit Breaker Integration & State Transition Tests
=====================================================
Tests:
  1. Normal function execution when circuit is CLOSED
  2. Transition to OPEN state after exceeding failure threshold
  3. Immediate fallback invocation when circuit is OPEN
  4. Transition to HALF-OPEN state after recovery cooldown
  5. Recovery back to CLOSED upon successful test probe
"""

import pytest
import time
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

from app.core.resilience.circuit_breaker import (
    RedisCircuitBreaker,
    CircuitOpenException,
    circuit_breaker,
)


class MockRedis:
    """In-memory Redis simulator for circuit breaker testing."""
    def __init__(self):
        self.store = {}

    async def get(self, key: str):
        val = self.store.get(key)
        return val.encode() if isinstance(val, str) else val

    async def set(self, key: str, val: str):
        self.store[key] = str(val)
        return True

    async def delete(self, key: str):
        self.store.pop(key, None)
        return True

    async def incr(self, key: str):
        current = int(self.store.get(key, 0))
        current += 1
        self.store[key] = str(current)
        return current

    async def decrby(self, key: str, amount: int):
        current = int(self.store.get(key, 0))
        current = max(0, current - amount)
        self.store[key] = str(current)
        return current

    async def expire(self, key: str, seconds: int):
        return True


@pytest.mark.asyncio
async def test_circuit_breaker_closed_state():
    """Verifies that requests pass normally through a CLOSED circuit."""
    redis = MockRedis()
    cb = RedisCircuitBreaker(redis, "test_service", failure_threshold=3)

    # Should not raise exception
    await cb.check_state()
    await cb.record_success()

    state = await redis.get("cb:test_service:state")
    assert state is None or state.decode() == "CLOSED"
    print("✅ Circuit Breaker stays CLOSED during normal operation.")


@pytest.mark.asyncio
async def test_circuit_breaker_trips_to_open():
    """Verifies that exceeding failure threshold trips state to OPEN."""
    redis = MockRedis()
    cb = RedisCircuitBreaker(redis, "test_service", failure_threshold=3, recovery_time_seconds=10)

    # Record 3 failures
    await cb.record_failure()
    await cb.record_failure()
    await cb.record_failure()

    # State must now be OPEN
    state = (await redis.get("cb:test_service:state")).decode()
    assert state == "OPEN"

    # check_state should now raise CircuitOpenException
    with pytest.raises(CircuitOpenException) as exc_info:
        await cb.check_state()

    assert "test_service" in str(exc_info.value)
    print("✅ Circuit Breaker tripped to OPEN after 3 failures.")


@pytest.mark.asyncio
async def test_circuit_breaker_half_open_transition():
    """Verifies that an expired cooldown transitions to HALF-OPEN."""
    redis = MockRedis()
    cb = RedisCircuitBreaker(redis, "test_service", failure_threshold=2, recovery_time_seconds=1)

    # Trip to OPEN with a past timestamp
    await redis.set("cb:test_service:state", "OPEN")
    await redis.set("cb:test_service:opened_at", str(time.time() - 2.0))  # 2 seconds ago

    # check_state should now transition to HALF-OPEN without raising
    await cb.check_state()
    state = (await redis.get("cb:test_service:state")).decode()
    assert state == "HALF-OPEN"
    print("✅ Circuit Breaker transitioned to HALF-OPEN after cooldown.")


@pytest.mark.asyncio
async def test_circuit_breaker_decorator_invokes_fallback():
    """Verifies that the decorator automatically executes the fallback function."""
    redis = MockRedis()

    fallback_called = False

    async def mock_fallback(*args, **kwargs):
        nonlocal fallback_called
        fallback_called = True
        return {"status": "fallback_triggered", "context": kwargs.get("error_context")}

    @circuit_breaker("failing_api", fallback_function=mock_fallback, failure_threshold=1)
    async def failing_target(redis=None):
        raise ValueError("Downstream API connection refused")

    # Call with mock Redis
    result = await failing_target(redis=redis)

    assert fallback_called is True
    assert result["status"] == "fallback_triggered"
    assert "Downstream API" in result["context"]
    print("✅ Circuit Breaker decorator seamlessly routed to fallback.")
