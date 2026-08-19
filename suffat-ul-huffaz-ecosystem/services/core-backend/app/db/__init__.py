"""
Database Module
===============
Exports core and analytical database session providers.
"""

from app.db.session import (
    get_core_db,
    get_reporting_db,
    CoreSessionLocal,
    ReportingSessionLocal,
    core_transactional_engine,
    analytical_reporting_engine,
)

__all__ = [
    "get_core_db",
    "get_reporting_db",
    "CoreSessionLocal",
    "ReportingSessionLocal",
    "core_transactional_engine",
    "analytical_reporting_engine",
]
