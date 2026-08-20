"""
Distributed Circuit Breaker with Edge-Aware Fallbacks
======================================================
Asynchronous, Redis-backed distributed Circuit Breaker pattern to protect
outbound integrations (Meta Cloud API, SMS Gateways, PDF renderers, S3).

States:
  - CLOSED: Normal operation. Failures decay slowly.
  - OPEN: Tripped. Requests immediately divert to fallback function.
  - HALF-OPEN: Probe state after cooldown expiry to test downstream recovery.
"""

import functools
import time
import asyncio
from typing import Callable, Any, Optional
from fastapi import HTTPException, status


class CircuitOpenException(Exception):
    def __init__(self, service_name: str, cooldown_remaining: float):
        self.service_name = service_name
        self.cooldown_remaining = cooldown_remaining
        super().__init__(
            f"Circuit for service '{service_name}' is OPEN. "
            f"Cooldown remaining: {cooldown_remaining:.1f}s"
        )


class RedisCircuitBreaker:
    def __init__(
        self,
        redis_client: Any,
        service_name: str,
        failure_threshold: int = 5,
        recovery_time_seconds: int = 60,
        latency_threshold_ms: float = 2000.0,
    ):
        self.redis = redis_client
        self.service = service_name
        self.failure_threshold = failure_threshold
        self.recovery_time = recovery_time_seconds
        self.latency_threshold = latency_threshold_ms / 1000.0  # Convert to seconds

        # Redis Key definitions
        self.key_failures = f"cb:{service_name}:failures"
        self.key_state = f"cb:{service_name}:state"  # "CLOSED", "OPEN", "HALF-OPEN"
        self.key_opened_at = f"cb:{service_name}:opened_at"

    async def _get_val(self, key: str) -> Optional[str]:
        val = await self.redis.get(key)
        if val is None:
            return None
        if isinstance(val, bytes):
            return val.decode("utf-8")
        return str(val)

    async def check_state(self) -> None:
        state = await self._get_val(self.key_state)
        state = state if state else "CLOSED"

        if state == "OPEN":
            opened_at_str = await self._get_val(self.key_opened_at)
            if opened_at_str:
                opened_at = float(opened_at_str)
                elapsed = time.time() - opened_at
                if elapsed > self.recovery_time:
                    # Transition to HALF-OPEN to test downstream recovery
                    await self.redis.set(self.key_state, "HALF-OPEN")
                    return
                raise CircuitOpenException(self.service, self.recovery_time - elapsed)
            else:
                # If timestamp is missing, default force reset to CLOSED
                await self.redis.set(self.key_state, "CLOSED")

    async def record_success(self) -> None:
        state = await self._get_val(self.key_state)
        state = state if state else "CLOSED"

        if state == "HALF-OPEN":
            # Direct transition back to CLOSED on successful probe execution
            await self.redis.set(self.key_state, "CLOSED")
            await self.redis.delete(self.key_failures)
            await self.redis.delete(self.key_opened_at)
        elif state == "CLOSED":
            # Decay failures slowly under normal operations
            failures = await self._get_val(self.key_failures)
            if failures and int(failures) > 0:
                await self.redis.decrby(self.key_failures, 1)

    async def record_failure(self) -> None:
        failures = await self.redis.incr(self.key_failures)
        if int(failures) >= self.failure_threshold:
            # Trip the circuit breaker to OPEN state
            await self.redis.set(self.key_state, "OPEN")
            await self.redis.set(self.key_opened_at, str(time.time()))
            await self.redis.expire(self.key_state, self.recovery_time * 2)


def circuit_breaker(
    service_name: str,
    fallback_function: Callable[..., Any],
    failure_threshold: int = 5,
    recovery_time_seconds: int = 30,
    latency_threshold_ms: float = 1500.0,
):
    """
    Asynchronous circuit breaker decorator with Redis coordination.
    Wraps outbound integration calls and catches failures or latency violations.
    """
    def decorator(func: Callable[..., Any]):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Dependency resolution for Redis instance from kwargs or default module
            redis_conn = kwargs.get("redis")
            if not redis_conn:
                # Fallback to internal upstash/redis module if available
                try:
                    from app.core.upstash_redis import get_redis_client
                    redis_conn = get_redis_client()
                except Exception:
                    # In-memory mock or graceful skip if Redis is unconfigured
                    redis_conn = None

            if not redis_conn:
                # If Redis is completely unavailable, bypass circuit breaker and execute directly
                return await func(*args, **kwargs)

            cb = RedisCircuitBreaker(
                redis_client=redis_conn,
                service_name=service_name,
                failure_threshold=failure_threshold,
                recovery_time_seconds=recovery_time_seconds,
                latency_threshold_ms=latency_threshold_ms,
            )

            try:
                # 1. Assert circuit state is not OPEN
                await cb.check_state()
            except CircuitOpenException as exc:
                # Immediate short-circuit fallback return
                return await fallback_function(*args, **kwargs, error_context=str(exc))

            start_time = time.time()
            try:
                # 2. Execute target function
                result = await func(*args, **kwargs)
                elapsed = time.time() - start_time

                # Check for SLA threshold slowness breaches
                if elapsed > cb.latency_threshold:
                    await cb.record_failure()
                else:
                    await cb.record_success()

                return result
            except Exception as exc:
                # Increment failure score and trigger fallback
                await cb.record_failure()
                return await fallback_function(*args, **kwargs, error_context=str(exc))

        return wrapper
    return decorator
