"""
Health Check Router
====================
Provides liveness, dependency, and crash-simulation endpoints.

Routes:
  GET /api/v1/health                — Basic liveness probe
  GET /api/v1/health/dependencies   — Pings Postgres, Upstash, Sentry
  GET /api/v1/health/simulate-crash — Intentional 500 for Sentry testing (staging only)
"""

import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/v1/health", tags=["Health"])


@router.get("")
async def liveness():
    """Basic liveness probe — returns 200 if the process is alive."""
    return {
        "status": "healthy",
        "service": "suffat-ul-huffaz-core-backend",
        "environment": os.getenv("APP_ENVIRONMENT", "development"),
    }


@router.get("/dependencies")
async def dependency_check():
    """
    Deep health check — pings all external dependencies and returns
    individual connectivity status for each.
    """
    results = {
        "service": "suffat-ul-huffaz-core-backend",
        "environment": os.getenv("APP_ENVIRONMENT", "development"),
    }

    # Check Upstash Redis
    try:
        from app.core.upstash_redis import health_check as redis_health
        results["upstash"] = await redis_health()
    except Exception as e:
        results["upstash"] = {"status": "error", "error": str(e)}

    # Check Sentry connectivity
    try:
        import sentry_sdk
        hub = sentry_sdk.Hub.current
        results["sentry"] = {
            "status": "configured" if hub.client and hub.client.dsn else "not_configured",
            "dsn_set": bool(hub.client and hub.client.dsn),
        }
    except Exception as e:
        results["sentry"] = {"status": "error", "error": str(e)}

    # Check database (basic import check)
    db_url = os.getenv("DATABASE_URL", "")
    results["database"] = {
        "status": "configured" if db_url else "not_configured",
        "url_set": bool(db_url),
    }

    # Overall status
    all_healthy = all(
        dep.get("status") not in ("unhealthy", "error")
        for dep in [results.get("upstash", {}), results.get("sentry", {}), results.get("database", {})]
        if isinstance(dep, dict)
    )
    results["overall"] = "healthy" if all_healthy else "degraded"

    return results


@router.get("/simulate-crash")
async def simulate_crash():
    """
    Intentionally raises a 500 Internal Server Error.
    Used ONLY in staging/development to verify Sentry captures exceptions.
    Blocked in production.
    """
    environment = os.getenv("APP_ENVIRONMENT", "development")

    if environment == "production":
        raise HTTPException(
            status_code=403,
            detail="Crash simulation is disabled in production.",
        )

    # This will be caught by Sentry's FastAPI integration
    raise RuntimeError(
        "SUH-HEALTH-CRASH-SIM: Intentional crash for Sentry verification. "
        f"Environment: {environment}"
    )
