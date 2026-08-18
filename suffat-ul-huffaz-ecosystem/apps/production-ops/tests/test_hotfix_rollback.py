import pytest
import os

def test_prometheus_alert_syntax():
    """
    Validation Gate: Ensures Prometheus SLA alerts have strict thresholds.
    """
    alert_path = "apps/production-ops/configs/prometheus-alerts.yaml"
    assert os.path.exists(alert_path), "Prometheus configs missing"
    
    with open(alert_path, "r") as f:
        content = f.read()
        
    assert "job:request_error_rate" in content
    assert "pgbouncer_pools_client_waiting_connections > 50" in content

def test_hotfix_auto_rollback_presence():
    """
    Validation Gate: Verifies that hotfix scripts contain explicit rollback triggers.
    """
    script_path = "apps/production-ops/scripts/hotfixes/hotfix_apply.sh"
    assert os.path.exists(script_path), "Hotfix runbook missing"
    
    with open(script_path, "r") as f:
        content = f.read()
        
    assert "rollout undo" in content
    assert "timeout=60s" in content
