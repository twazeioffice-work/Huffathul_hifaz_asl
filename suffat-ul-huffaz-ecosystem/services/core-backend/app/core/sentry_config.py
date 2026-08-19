"""
Sentry SDK Initialization for FastAPI Core Backend
===================================================
Configures distributed error tracking and performance tracing with
strict GDPR/student privacy compliance (send_default_pii=False).

Environment Variables Required:
  - SENTRY_DSN: Sentry project DSN string
  - APP_ENVIRONMENT: deployment stage (development|staging|production)
"""

import os
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration


def initialize_sentry() -> None:
    """
    Initializes Sentry Error Tracking & Distributed Tracing.
    Safe to call even if SENTRY_DSN is not set — will log a warning and skip.
    """
    environment = os.getenv("APP_ENVIRONMENT", "development")
    sentry_dsn = os.getenv("SENTRY_DSN", "")

    if not sentry_dsn:
        print("⚠️  WARNING: SENTRY_DSN not configured. Telemetry is offline.")
        return

    # Adjust traces sample rates based on target deployment stage
    traces_sample_rate = 1.0 if environment in ("development", "staging") else 0.1

    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=environment,
        integrations=[
            FastApiIntegration(transaction_style="endpoint"),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=traces_sample_rate,
        profiles_sample_rate=traces_sample_rate,
        send_default_pii=False,  # Strict GDPR and student privacy compliance
    )
    print(
        f"✅ Sentry telemetry active. Environment: [{environment}] "
        f"(Sampling: {traces_sample_rate})"
    )
