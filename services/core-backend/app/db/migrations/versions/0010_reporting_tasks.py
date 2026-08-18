"""Reporting tasks tracking

Revision ID: 0010
Revises: 0009
Create Date: 2026-08-18 16:25:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0010'
down_revision = '0009'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
    CREATE TYPE task_status AS ENUM ('pending', 'running', 'completed', 'failed');
    """)

    op.execute("""
    CREATE TABLE report_tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        task_type VARCHAR(64) NOT NULL,
        status task_status NOT NULL DEFAULT 'pending',
        progress INT NOT NULL DEFAULT 0,
        file_url VARCHAR(512),
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX idx_report_tasks_tenant ON report_tasks(institution_id, branch_id);
    CREATE INDEX idx_report_tasks_user ON report_tasks(user_id, status);

    ALTER TABLE report_tasks ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_report_tasks ON report_tasks
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
    """)


def downgrade() -> None:
    pass
