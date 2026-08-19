-- DDL Migration Script: 0009_community_affiliations_verification.sql

-- =============================================================================
-- 0. MOCK BASE SCHEMA (Auto-creation for testing environment)
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
    CREATE ROLE app_user NOLOGIN;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
);

-- =============================================================================
-- 1. AFFILIATION VERIFICATION SCHEMA
-- =============================================================================
DO $$ BEGIN
    CREATE TYPE affiliation_stage AS ENUM (
        'DRAFT',
        'SUBMITTED',
        'DOCUMENTS_VERIFIED',
        'PHYSICAL_INSPECTION_SCHEDULED',
        'INSPECTION_COMPLETED',
        'APPROVED',
        'REJECTED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_criteria_type AS ENUM (
        'REGISTRATION_VERIFIED',
        'CURRICULUM_COMPLIANCE',
        'TEACHER_TAJWEED_CERTIFIED',
        'FACILITY_FIRE_SAFETY',
        'INTERNET_UPLINK_STABLE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Main Affiliation Requests Table
CREATE TABLE IF NOT EXISTS affiliation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_location VARCHAR(255) NOT NULL,
    principal_name VARCHAR(128) NOT NULL,
    student_capacity INT NOT NULL DEFAULT 0,
    current_stage affiliation_stage NOT NULL DEFAULT 'DRAFT',
    
    -- Cryptographic hash of compiled submission dossier for tamper-evidence
    submission_integrity_hash VARCHAR(64) NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Criteria Checklist Table
CREATE TABLE IF NOT EXISTS affiliation_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES affiliation_requests(id) ON DELETE CASCADE,
    criteria_key verification_criteria_type NOT NULL,
    is_fulfilled BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    comments TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_request_criteria UNIQUE (request_id, criteria_key)
);

-- 3. Document and Media Attachments Register (Photos, Videos, PDF Credentials)
CREATE TABLE IF NOT EXISTS affiliation_media_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES affiliation_requests(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(64) NOT NULL, -- e.g., 'application/pdf', 'image/jpeg', 'video/mp4'
    gcs_bucket_url TEXT NOT NULL,
    sha256_file_hash VARCHAR(64) NOT NULL, -- Cryptographic verification hash
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    comments TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Physical On-Site Field Inspection Log
CREATE TABLE IF NOT EXISTS affiliation_physical_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES affiliation_requests(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    scheduled_date DATE NOT NULL,
    safety_grade NUMERIC(3,2) NULL CHECK (safety_grade BETWEEN 0.00 AND 10.00),
    classroom_grade NUMERIC(3,2) NULL CHECK (classroom_grade BETWEEN 0.00 AND 10.00),
    dorm_grade NUMERIC(3,2) NULL CHECK (dorm_grade BETWEEN 0.00 AND 10.00), -- NULL if non-residential
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    inspection_notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce Composite Indexes for fast O(1) multi-tenant audit checks
CREATE INDEX IF NOT EXISTS idx_aff_request_tenant ON affiliation_requests(institution_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_aff_request_stage ON affiliation_requests(current_stage);
CREATE INDEX IF NOT EXISTS idx_aff_media_request ON affiliation_media_attachments(request_id);
CREATE INDEX IF NOT EXISTS idx_aff_inspect_request ON affiliation_physical_inspections(request_id);

-- Enforce Row-Level Security (RLS) bound to session app.current_tenant_id
ALTER TABLE affiliation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliation_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliation_media_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliation_physical_inspections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY tenant_isolation_affiliations ON affiliation_requests FOR ALL TO app_user
    USING ( institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID )
    WITH CHECK ( institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY tenant_isolation_aff_checklist ON affiliation_checklist FOR ALL TO app_user
    USING ( EXISTS (
        SELECT 1 FROM affiliation_requests r 
        WHERE r.id = request_id AND r.institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
    ));
EXCEPTION WHEN duplicate_object THEN null; END $$;
