"""profiles and assignments

Revision ID: 0005
Revises: 0004
Create Date: 2026-08-17 19:55:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0005'
down_revision = '0004'
branch_labels = None
depends_on = None

def upgrade():
    op.execute("""
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'transferred', 'suspended');
CREATE TYPE staff_status AS ENUM ('active', 'suspended', 'terminated', 'on_leave');

CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    admission_number VARCHAR(64) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(16) NOT NULL,
    guardian_name VARCHAR(128) NOT NULL,
    guardian_phone VARCHAR(32) NOT NULL,
    guardian_email VARCHAR(255) NULL,
    digital_documents JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_student_profiles_search ON student_profiles(branch_id, admission_number);

CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    status enrollment_status NOT NULL DEFAULT 'active',
    enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_student_enrollments_lookup ON student_enrollments(student_id, batch_id, academic_year_id);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_branch_department_name UNIQUE (branch_id, name)
);

CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    employee_code VARCHAR(64) UNIQUE NOT NULL,
    designation VARCHAR(128) NOT NULL,
    status staff_status NOT NULL DEFAULT 'active',
    payroll_details JSONB NOT NULL DEFAULT '{}'::JSONB,
    salary_records JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_staff_profiles_search ON staff_profiles(branch_id, employee_code);

CREATE TABLE staff_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_staff_assignments_lookup ON staff_assignments(staff_id, department_id);

CREATE TABLE batch_subject_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_batch_subject_staff UNIQUE (batch_id, subject_id, staff_id)
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_subject_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_student_profiles ON student_profiles FOR ALL 
    USING (branch_id IN (SELECT id FROM branches))
    WITH CHECK (branch_id IN (SELECT id FROM branches));

CREATE POLICY rls_student_enrollments ON student_enrollments FOR ALL 
    USING (student_id IN (SELECT id FROM student_profiles))
    WITH CHECK (student_id IN (SELECT id FROM student_profiles));
    
CREATE POLICY rls_departments ON departments FOR ALL 
    USING (branch_id IN (SELECT id FROM branches))
    WITH CHECK (branch_id IN (SELECT id FROM branches));
    
CREATE POLICY rls_staff_profiles ON staff_profiles FOR ALL 
    USING (branch_id IN (SELECT id FROM branches))
    WITH CHECK (branch_id IN (SELECT id FROM branches));

CREATE POLICY rls_staff_assignments ON staff_assignments FOR ALL 
    USING (staff_id IN (SELECT id FROM staff_profiles))
    WITH CHECK (staff_id IN (SELECT id FROM staff_profiles));
    
CREATE POLICY rls_batch_subject_assignments ON batch_subject_assignments FOR ALL 
    USING (batch_id IN (SELECT id FROM batches))
    WITH CHECK (batch_id IN (SELECT id FROM batches));
    """)

def downgrade():
    op.execute("""
DROP POLICY IF EXISTS rls_batch_subject_assignments ON batch_subject_assignments;
DROP POLICY IF EXISTS rls_staff_assignments ON staff_assignments;
DROP POLICY IF EXISTS rls_staff_profiles ON staff_profiles;
DROP POLICY IF EXISTS rls_departments ON departments;
DROP POLICY IF EXISTS rls_student_enrollments ON student_enrollments;
DROP POLICY IF EXISTS rls_student_profiles ON student_profiles;

ALTER TABLE batch_subject_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;

DROP TABLE batch_subject_assignments CASCADE;
DROP TABLE staff_assignments CASCADE;
DROP TABLE staff_profiles CASCADE;
DROP TABLE departments CASCADE;
DROP TABLE student_enrollments CASCADE;
DROP TABLE student_profiles CASCADE;

DROP TYPE staff_status;
DROP TYPE enrollment_status;
    """)
