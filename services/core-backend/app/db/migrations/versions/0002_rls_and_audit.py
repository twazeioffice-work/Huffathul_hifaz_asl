"""RLS and audit

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-17 19:25:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None

def upgrade():
    op.execute("""
-- Enforce security isolation levels
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Define security tenant check functions (Database level bouncers)
CREATE OR REPLACE FUNCTION get_session_tenant_id() 
RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

-- Bind policies to structural databases
CREATE POLICY tenant_isolation_policy ON user_role_assignments
    FOR ALL
    USING (institution_id = get_session_tenant_id())
    WITH CHECK (institution_id = get_session_tenant_id());

CREATE POLICY tenant_session_policy ON user_sessions
    FOR ALL
    USING (institution_id = get_session_tenant_id())
    WITH CHECK (institution_id = get_session_tenant_id());
    
-- Build SQL audit_logs triggers
CREATE OR REPLACE FUNCTION audit_trigger_func() RETURNS trigger AS $$
BEGIN
    INSERT INTO audit_logs (institution_id, verb, resource_accessed, ip_address, user_agent, payload_snapshot)
    VALUES (
        get_session_tenant_id(),
        TG_OP,
        TG_TABLE_NAME,
        '0.0.0.0',
        'db-trigger',
        row_to_json(NEW)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
    """)

def downgrade():
    op.execute("""
DROP FUNCTION IF EXISTS audit_trigger_func() CASCADE;
DROP POLICY IF EXISTS tenant_session_policy ON user_sessions;
DROP POLICY IF EXISTS tenant_isolation_policy ON user_role_assignments;
DROP FUNCTION IF EXISTS get_session_tenant_id() CASCADE;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments DISABLE ROW LEVEL SECURITY;
    """)
