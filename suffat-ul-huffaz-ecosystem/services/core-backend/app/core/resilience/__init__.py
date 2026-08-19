"""
Resilience & Fault Tolerance Package
====================================
Contains:
  - Redis-backed distributed Circuit Breakers
  - Dynamic Request Chain Timeout Budgets
"""

from app.core.resilience.circuit_breaker import (
    circuit_breaker,
    RedisCircuitBreaker,
    CircuitOpenException,
)
from app.core.resilience.timeout_budget import (
    TimeoutBudgetTracker,
    get_timeout_budget,
)

__all__ = [
    "circuit_breaker",
    "RedisCircuitBreaker",
    "CircuitOpenException",
    "TimeoutBudgetTracker",
    "get_timeout_budget",
]
