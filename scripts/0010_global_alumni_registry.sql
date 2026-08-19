-- DDL Migration Script: 0010_global_alumni_registry.sql
-- Description: Schema for the Global Alumni Registry (Phase 8).
-- Security Controls: RLS (Tenant Isolation), AES-256-GCM (Encrypted PII).

-- Ensure cryptographic extension is present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Alumni Profiles Table
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    student_id UUID NULL, -- Reference to historical student record if applicable
    
    full_name VARCHAR(255) NOT NULL,
    graduation_year INT NOT NULL CHECK (graduation_year >= 1900 AND graduation_year <= 2100),
    hifz_completion_para INT NOT NULL CHECK (hifz_completion_para >= 1 AND hifz_completion_para <= 30),
    
    current_city VARCHAR(128) NOT NULL,
    current_country VARCHAR(128) NOT NULL,
    
    -- PII encrypted with AES-256-GCM via application layer (stored as bytea/hex)
    encrypted_phone_number VARCHAR(512) NULL,
    encrypted_email_address VARCHAR(512) NULL,
    
    career_status VARCHAR(128) NULL,
    higher_education_details TEXT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Alumni Contributions / Engagements
CREATE TABLE IF NOT EXISTS alumni_engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumni_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    engagement_type VARCHAR(64) NOT NULL, -- e.g., 'GUEST_LECTURE', 'DONATION', 'MENTORSHIP'
    engagement_date DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce Composite Indexes for fast O(1) multi-tenant queries
CREATE INDEX IF NOT EXISTS idx_alumni_tenant ON alumni_profiles(institution_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_alumni_grad_year ON alumni_profiles(graduation_year);
CREATE INDEX IF NOT EXISTS idx_alumni_engagement ON alumni_engagements(alumni_id);

-- Enforce Row-Level Security (RLS) bound to session app.current_tenant_id
ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_engagements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY tenant_isolation_alumni ON alumni_profiles FOR ALL TO app_user
    USING ( institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID )
    WITH CHECK ( institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY tenant_isolation_alumni_engagements ON alumni_engagements FOR ALL TO app_user
    USING ( institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID )
    WITH CHECK ( institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID );
EXCEPTION WHEN duplicate_object THEN null; END $$;
