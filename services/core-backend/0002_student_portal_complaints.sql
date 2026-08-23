-- Migration: 0002_student_portal_complaints.sql

-- 1. Create Enums for Dynamic Student Facilities & Complaint Targets
CREATE TYPE facility_type AS ENUM ('HALQA', 'NAMAZ', 'CLEANLINESS', 'KITHAB', 'OTHER');
CREATE TYPE facility_status AS ENUM ('PENDING_SUPER_ADMIN_APPROVAL', 'APPROVED', 'REJECTED');
CREATE TYPE complaint_recipient_type AS ENUM ('CENTER_ADMIN', 'SUPER_ADMIN');
CREATE TYPE complaint_target_type AS ENUM ('USTAD', 'NAZIM', 'STUDENT');

-- 2. Dynamic Student Facilities/Grades Table (Configured by Center Admin, Approved by Super Admin)
CREATE TABLE student_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type facility_type NOT NULL,
    status facility_status DEFAULT 'PENDING_SUPER_ADMIN_APPROVAL' NOT NULL,
    is_enabled_for_students BOOLEAN DEFAULT FALSE NOT NULL,
    created_by_id UUID NOT NULL REFERENCES staff_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexing for multi-tenant isolation
CREATE INDEX idx_facilities_tenancy ON student_facilities(institution_id, branch_id);

-- 3. Super Admin & System Notifications Table
CREATE TABLE system_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    recipient_role VARCHAR(50) DEFAULT 'SUPER_ADMIN' NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    action_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Upcoming Notice Board Events (Competitions & Functions)
CREATE TABLE campus_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'COMPETITION', 'FUNCTION', 'GENERAL_NOTICE'
    event_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Complete Complaint Registry Table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    -- Submitter Profile ID (Always stored, but hidden from Center Admins via Postgres Views/RLS)
    student_enrollment_id UUID NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
    
    -- Complaint Context
    against_role complaint_target_type NOT NULL,
    against_profile_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    against_student_id UUID REFERENCES student_enrollments(id) ON DELETE SET NULL,
    
    recipient complaint_recipient_type NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Resolution Audit State
    status VARCHAR(50) DEFAULT 'OPEN' NOT NULL, -- 'OPEN', 'IN_PROGRESS', 'RESOLVED'
    resolution_notes TEXT,
    resolved_by_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_complaints_tenancy ON complaints(institution_id, branch_id);

-- ==============================================================================
-- DATABASE LEVEL ROW-LEVEL SECURITY (RLS) FOR ASYMMETRIC COMPLAINTS
-- ==============================================================================

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Policy 1: Super Admin can SELECT and UPDATE all complaints
CREATE POLICY super_admin_all_complaints_select ON complaints
    FOR SELECT
    TO authenticated
    USING (
        (SELECT role FROM staff_profiles WHERE id = (current_setting('app.current_user_id')::UUID)) = 'SUPER_ADMIN'
    );

CREATE POLICY super_admin_all_complaints_update ON complaints
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT role FROM staff_profiles WHERE id = (current_setting('app.current_user_id')::UUID)) = 'SUPER_ADMIN'
    );

-- Policy 2: Center Admin (Nazim) can only read complaints routed to CENTER_ADMIN 
-- where they match the tenant bounds.
CREATE POLICY center_admin_complaints_access ON complaints
    FOR SELECT
    TO authenticated
    USING (
        (SELECT role FROM staff_profiles WHERE id = (current_setting('app.current_user_id')::UUID)) = 'NAZIM'
        AND branch_id = (current_setting('app.current_branch_id')::UUID)
        AND recipient = 'CENTER_ADMIN'
    );

-- Policy 3: Center Admin can only UPDATE complaints routed to them to resolve them
CREATE POLICY center_admin_complaints_update ON complaints
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT role FROM staff_profiles WHERE id = (current_setting('app.current_user_id')::UUID)) = 'NAZIM'
        AND branch_id = (current_setting('app.current_branch_id')::UUID)
        AND recipient = 'CENTER_ADMIN'
    )
    WITH CHECK (
        status IN ('IN_PROGRESS', 'RESOLVED')
    );

-- Policy 4: Students can SELECT their own complaints
CREATE POLICY student_own_complaints_select ON complaints
    FOR SELECT
    TO authenticated
    USING (
        student_enrollment_id = (current_setting('app.current_student_enrollment_id')::UUID)
    );

-- Policy 5: Students can INSERT their own complaints (Cannot spoof student_enrollment_id)
CREATE POLICY student_own_complaints_insert ON complaints
    FOR INSERT
    TO authenticated
    WITH CHECK (
        student_enrollment_id = (current_setting('app.current_student_enrollment_id')::UUID)
    );

-- ==============================================================================
-- OBFUSCATION VIEW FOR CENTER ADMINS (MASKS STUDENT IDENTITY)
-- ==============================================================================

-- When a Center Admin queries complaints, they must query this View instead of 
-- the raw table to automatically mask the submitter's identity if is_anonymous is True.
CREATE OR REPLACE VIEW scoped_center_complaints AS
SELECT 
    c.id,
    c.institution_id,
    c.branch_id,
    CASE 
        WHEN c.is_anonymous = TRUE THEN NULL 
        ELSE c.student_enrollment_id 
    END AS student_enrollment_id,
    CASE 
        WHEN c.is_anonymous = TRUE THEN 'Anonymous Student' 
        ELSE s.student_name 
    END AS submitter_name,
    c.against_role,
    c.against_profile_id,
    c.against_student_id,
    c.recipient,
    c.is_anonymous,
    c.title,
    c.description,
    c.status,
    c.resolution_notes,
    c.resolved_by_id,
    c.resolved_at,
    c.created_at
FROM complaints c
JOIN student_enrollments s ON c.student_enrollment_id = s.id
WHERE 
    c.branch_id = (current_setting('app.current_branch_id')::UUID)
    AND c.recipient = 'CENTER_ADMIN';
