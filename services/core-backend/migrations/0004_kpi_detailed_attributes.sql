-- Migration: 0004_kpi_detailed_attributes.sql

-- 1. Extend Staff Profiles to support education, demographics, and contact info
ALTER TABLE staff_profiles 
    ADD COLUMN IF NOT EXISTS educational_qualification VARCHAR(255),
    ADD COLUMN IF NOT EXISTS passout_year INT,
    ADD COLUMN IF NOT EXISTS graduation_batch VARCHAR(100),
    ADD COLUMN IF NOT EXISTS date_of_birth DATE,
    ADD COLUMN IF NOT EXISTS date_of_joining DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS residential_address TEXT,
    ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(100),
    ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Modify Role Constraint to support non-faculty (Other Staff) categories
-- Roles supported: 'SUPER_ADMIN', 'NAZIM', 'USTAD', 'CLERK', 'ACCOUNTANT', 'DRIVER', 'COOK', 'CLEANER', 'SWEEPER'
ALTER TABLE staff_profiles DROP CONSTRAINT IF EXISTS check_staff_role;
ALTER TABLE staff_profiles ADD CONSTRAINT check_staff_role CHECK (
    role IN ('SUPER_ADMIN', 'NAZIM', 'USTAD', 'CLERK', 'ACCOUNTANT', 'DRIVER', 'COOK', 'CLEANER', 'SWEEPER')
);

-- 3. Double-Entry Ledger Category Identifiers
-- Financial heads supported: 'TUITION_REVENUE', 'KAFALATH_SPONSORSHIP', 'HADIYA', 'SADAQAH', 'GENERAL_EXPENSE', 'SALARIES_EXPENSE'
ALTER TABLE ledger_transactions DROP CONSTRAINT IF EXISTS check_account_head;
ALTER TABLE ledger_transactions ADD CONSTRAINT check_account_head CHECK (
    account_head IN ('CASH_ON_HAND', 'BANK_SCB', 'TUITION_REVENUE', 'KAFALATH_SPONSORSHIP', 'HADIYA', 'SADAQAH', 'GENERAL_EXPENSE', 'SALARIES_EXPENSE')
);

-- 4. Create Sponsorship/Kafalath Student Tracking Table
CREATE TABLE IF NOT EXISTS student_sponsorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    sponsor_name VARCHAR(255) NOT NULL,
    student_enrollment_id UUID NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
    monthly_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE student_sponsorships ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_sponsorship_policy ON student_sponsorships
    FOR ALL
    TO authenticated
    USING (institution_id = (current_setting('app.current_tenant_id')::UUID));
