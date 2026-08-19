-- DDL Migration Script: 0013_conversational_gateway.sql
-- Enables strict transactional tracking with idempotent checks

CREATE TYPE message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE message_status AS ENUM ('received', 'sent', 'delivered', 'read', 'failed');

CREATE TABLE IF NOT EXISTS communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    student_profile_id UUID NULL REFERENCES student_profiles(id) ON DELETE SET NULL,
    staff_profile_id UUID NULL REFERENCES staff_profiles(id) ON DELETE SET NULL,
    whatsapp_message_id VARCHAR(255) UNIQUE NOT NULL, -- Used to enforce API idempotency
    sender_phone VARCHAR(32) NOT NULL,
    receiver_phone VARCHAR(32) NOT NULL,
    direction message_direction NOT NULL,
    status message_status NOT NULL DEFAULT 'received',
    message_body TEXT NOT NULL,
    raw_payload JSONB NOT NULL DEFAULT '{}',
    is_automated_response BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Optimize for fast query lookups and high concurrency indexing
CREATE INDEX IF NOT EXISTS idx_comm_logs_phone ON communication_logs(sender_phone);
CREATE INDEX IF NOT EXISTS idx_comm_logs_tenant ON communication_logs(institution_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_wamid ON communication_logs(whatsapp_message_id);

-- Apply RLS Boundaries
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY tenant_isolation_comms ON communication_logs
        FOR ALL TO app_user
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
