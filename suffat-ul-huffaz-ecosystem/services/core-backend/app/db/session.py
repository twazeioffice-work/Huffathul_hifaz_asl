"""
Database Connection Pool Segregation (Bulkhead Pattern)
========================================================
Configures distinct connection pools for different application workloads:
  - Core Transactional Engine (pool_size=20, timeout=5s)
  - Analytical & Heavy Reporting Engine (pool_size=5, timeout=30s)
"""

import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://railway_admin:local_secret@localhost:5432/aimantiss_db",
)

# Replace standard postgresql:// prefix if present with postgresql+asyncpg://
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# ── BULKHEAD 1: Core Transactional Connection Pool ───────────────────────────
# Reserved solely for Auth, Admissions, Attendance, and fast ledger updates.
core_transactional_engine = create_async_engine(
    DATABASE_URL,
    pool_size=int(os.getenv("DB_CORE_POOL_SIZE", "20")),
    max_overflow=int(os.getenv("DB_CORE_MAX_OVERFLOW", "10")),
    pool_recycle=1800,  # Recycle connections every 30 minutes
    pool_timeout=5,     # Wait maximum 5 seconds (immediate rejection under starvation)
    pool_pre_ping=True,
)

CoreSessionLocal = async_sessionmaker(
    bind=core_transactional_engine,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)

# ── BULKHEAD 2: Analytical & Heavy Report Queries Connection Pool ────────────
# Separated to ensure slow aggregate SELECT loops never block transactional threads.
analytical_reporting_engine = create_async_engine(
    DATABASE_URL,
    pool_size=int(os.getenv("DB_ANALYTICAL_POOL_SIZE", "5")),
    max_overflow=int(os.getenv("DB_ANALYTICAL_MAX_OVERFLOW", "2")),
    pool_recycle=900,
    pool_timeout=30,    # Allow up to 30 seconds wait for reporting pipelines
    pool_pre_ping=True,
)

ReportingSessionLocal = async_sessionmaker(
    bind=analytical_reporting_engine,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def get_core_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency provider for transactional DB sessions."""
    async with CoreSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_reporting_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency provider for heavy analytical / reporting DB sessions."""
    async with ReportingSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
