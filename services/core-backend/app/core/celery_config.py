"""
Celery Background Task Queue Separation (Bulkhead Pattern)
==========================================================
Enforces queue isolation across different background task profiles:
  - telemetry_queue: Real-time IoT/GPS telemetry
  - financial_queue: Heavy double-entry calculations & reconciliation
  - whatsapp_queue: Bulk outbound WhatsApp notification broadcasts
  - critical_sync_queue: Real-time high-priority LMS sync
"""

import os
from celery import Celery

REDIS_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
REDIS_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

celery_app = Celery("suffat_tasks", broker=REDIS_URL, backend=REDIS_BACKEND)

# Configure routing keys and absolute queue limits to prevent starvation cascades
celery_app.conf.task_routes = {
    "app.core.tasks.telemetry.*": {"queue": "telemetry_queue"},
    "app.core.tasks.billing.*": {"queue": "financial_queue"},
    "app.core.tasks.notifications.*": {"queue": "whatsapp_queue"},
    "app.core.tasks.sync.*": {"queue": "critical_sync_queue"},
}

# Enforce prefetch limits to maintain processing bulkheads
celery_app.conf.task_acks_late = True
celery_app.conf.worker_prefetch_multiplier = 1  # Fair distribution across worker nodes
celery_app.conf.task_track_started = True
