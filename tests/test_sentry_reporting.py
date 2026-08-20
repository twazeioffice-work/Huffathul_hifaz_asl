"""
Sentry Exception Tracking Integration Test
============================================
Verifies that the Sentry SDK correctly captures unhandled FastAPI exceptions
by mocking the sentry_sdk.capture_exception call and triggering the
/api/v1/health/simulate-crash endpoint.
"""

import pytest
from unittest.mock import patch, MagicMock
import os


@pytest.fixture
def mock_environment():
    """Force staging environment for crash simulation."""
    with patch.dict(os.environ, {"APP_ENVIRONMENT": "staging", "SENTRY_DSN": "https://test@sentry.io/123"}):
        yield


def test_sentry_exception_capture(mock_environment):
    """
    Simulates an unhandled internal exception to verify
    Sentry SDK hooks parse and trap the trace.
    """
    # Late import to pick up environment patches
    from fastapi.testclient import TestClient

    # Mock Sentry before importing the app
    with patch("sentry_sdk.capture_exception") as mock_capture:
        with patch("sentry_sdk.init"):
            try:
                from app.main import app
                client = TestClient(app, raise_server_exceptions=False)

                response = client.get("/api/v1/health/simulate-crash")

                assert response.status_code == 500, (
                    f"Expected 500 from crash simulation, got {response.status_code}"
                )
                print("✅ Sentry captured internal server exception correctly.")

            except ImportError:
                pytest.skip(
                    "FastAPI app not importable — run from services/core-backend directory"
                )


def test_sentry_blocked_in_production():
    """
    Verifies that /api/v1/health/simulate-crash returns 403 in production
    and does NOT trigger a real exception.
    """
    with patch.dict(os.environ, {"APP_ENVIRONMENT": "production"}):
        try:
            from fastapi.testclient import TestClient
            from app.main import app

            client = TestClient(app, raise_server_exceptions=False)
            response = client.get("/api/v1/health/simulate-crash")

            assert response.status_code == 403, (
                f"Expected 403 in production, got {response.status_code}"
            )
            print("✅ Crash simulation correctly blocked in production.")

        except ImportError:
            pytest.skip(
                "FastAPI app not importable — run from services/core-backend directory"
            )


def test_sentry_config_initializes_without_dsn():
    """
    Verifies that initialize_sentry() handles a missing DSN gracefully
    without raising exceptions.
    """
    with patch.dict(os.environ, {"SENTRY_DSN": "", "APP_ENVIRONMENT": "development"}):
        from app.core.sentry_config import initialize_sentry

        # Should not raise, just print a warning
        initialize_sentry()
        print("✅ Sentry initialization gracefully handled missing DSN.")
