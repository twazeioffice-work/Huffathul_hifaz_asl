-- Create Enum for Case Status Tracking
CREATE TYPE welfare_case_status AS ENUM (
    'PENDING_LOCAL_RESPONSE',
    'RESPONDED_BY_LOCAL',
    'APPEALED_TO_HQ',
    'DIVERTED_WITH_DEADLINE',
    'RESOLVED'
);

-- Main Case Table
CREATE TABLE student_welfare_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    -- Submitter (Ustad)
    sender_profile_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    
    -- High-Density Metadata
    title VARCHAR(255) NOT NULL,
    student_enrollment_id UUID REFERENCES student_enrollments(id) ON DELETE SET NULL, -- Optional Student association
    initial_content TEXT NOT NULL,
    
    -- Status and Resolution States (Dual-Locking)
    status welfare_case_status DEFAULT 'PENDING_LOCAL_RESPONSE' NOT NULL,
    ustad_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    admin_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Escalation Attributes
    appealed_at TIMESTAMP WITH TIME ZONE,
    appeal_reason TEXT,
    
    -- Higher Authority Mandates
    diverted_at TIMESTAMP WITH TIME ZONE,
    hq_special_message TEXT,
    resolution_deadline TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Case Messages / Reply Ledger (Thread Messages)
CREATE TABLE welfare_case_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES student_welfare_cases(id) ON DELETE CASCADE,
    sender_profile_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    message_body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexing for Sub-1ms Dashboard Notifications
CREATE INDEX idx_welfare_cases_branch ON student_welfare_cases(branch_id);
CREATE INDEX idx_welfare_cases_sender ON student_welfare_cases(sender_profile_id);
CREATE INDEX idx_welfare_cases_status ON student_welfare_cases(status);

-- Enable Row-Level Security
ALTER TABLE student_welfare_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_case_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- 1. Ustads can read/write cases they created.
CREATE POLICY ustad_case_policy ON student_welfare_cases
    FOR ALL
    TO authenticated
    USING (
        sender_profile_id = (current_setting('app.current_user_id')::UUID)
    )
    WITH CHECK (
        sender_profile_id = (current_setting('app.current_user_id')::UUID)
    );

-- 2. Local Managers and Center Admins (Nazims) can access cases in their branch.
CREATE POLICY local_admin_case_policy ON student_welfare_cases
    FOR ALL
    TO authenticated
    USING (
        branch_id = (current_setting('app.current_branch_id')::UUID)
        AND (current_setting('app.current_user_role') IN ('NAZIM', 'MANAGER'))
    );

-- 3. Super Admins and HQ Junction Box can access all cases globally.
CREATE POLICY super_admin_case_policy ON student_welfare_cases
    FOR ALL
    TO authenticated
    USING (
        current_setting('app.current_user_role') IN ('SUPER_ADMIN', 'GLOBAL_OPERATIONS')
    );
