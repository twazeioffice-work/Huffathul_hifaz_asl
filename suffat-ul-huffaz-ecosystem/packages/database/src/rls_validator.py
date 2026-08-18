# Mock logic to parse SQL and validate that Row-Level Security checks are applied
import os

def check_rls_compliance():
    """
    Scans the SQL migration to ensure RLS is enabled and policies are mapped
    to app.current_tenant_id exactly as requested by Phase 1 blueprint.
    """
    migration_path = os.path.join(os.path.dirname(__file__), "migrations/0000_phase1_init.sql")
    with open(migration_path, "r") as f:
        content = f.read()

    assert "ENABLE ROW LEVEL SECURITY" in content
    assert "tenant_isolation" in content
    assert "app.current_tenant_id" in content
    assert "get_session_tenant_id()" in content

    return True
