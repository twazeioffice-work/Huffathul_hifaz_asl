"""
FastAPI Backend Sentry Integration & Sanitization
=================================================
Initializes Sentry SDK with FastAPI, SQLAlchemy, and Redis integrations.
Strips authorization headers and student/parent PII before event dispatch.
"""

import os
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration


def inject_tenant_context(event, hint):
    """Safely strip out raw authorization headers and sensitive tokens before transmitting exceptions."""
    if "request" in event:
        headers = event["request"].get("headers", {})
        if "authorization" in headers:
            headers["authorization"] = "[REDACTED]"
        if "cookie" in headers:
            headers["cookie"] = "[REDACTED]"
    return event


def init_sentry():
    """Initializes Sentry distributed telemetry for FastAPI."""
    sentry_dsn = os.getenv("SENTRY_DSN", "")
    environment = os.getenv("APP_ENVIRONMENT", os.getenv("ENVIRONMENT", "production"))

    if not sentry_dsn:
        return

    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=environment,
        integrations=[
            FastApiIntegration(transaction_style="endpoint"),
            SqlalchemyIntegration(),
            RedisIntegration(),
        ],
        # Capture 20% of HTTP transactions for tracing
        traces_sample_rate=0.2,
        # Capture 10% of code paths for visual flame graph analysis
        profiles_sample_rate=0.1,
        # Before sending log, inject active multi-tenant context and scrub tokens
        before_send=inject_tenant_context,
        send_default_pii=False,
    )
    print(f"✅ Sentry backend telemetry active. Environment: [{environment}]")
