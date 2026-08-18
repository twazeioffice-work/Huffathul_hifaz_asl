"""Phase 13 Conversational Gateway

Revision ID: 0013
Revises: 0011
Create Date: 2026-08-18 17:10:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0013'
down_revision = '0011'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.execute("""
    CREATE TYPE message_direction AS ENUM ('inbound', 'outbound');
    CREATE TYPE message_status AS ENUM ('received', 'sent', 'delivered', 'read', 'failed');

    CREATE TABLE communication_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
        sender_phone VARCHAR(32) NOT NULL,
        recipient_phone VARCHAR(32) NOT NULL,
        direction message_direction NOT NULL,
        status message_status NOT NULL DEFAULT 'received',
        message_body TEXT,
        whatsapp_message_id VARCHAR(128) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );

    CREATE INDEX idx_comm_logs_phone ON communication_logs(sender_phone);
    CREATE INDEX idx_comm_logs_tenant ON communication_logs(institution_id, branch_id);
    CREATE INDEX idx_comm_logs_wamid ON communication_logs(whatsapp_message_id);

    ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_comm_logs ON communication_logs
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
    """)

def downgrade() -> None:
    pass
