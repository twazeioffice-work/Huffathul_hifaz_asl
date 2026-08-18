"""academic hierarchy

Revision ID: 0003
Revises: 0002
Create Date: 2026-08-17 19:45:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0003'
down_revision = '0002'
branch_labels = None
depends_on = None

def upgrade():
    op.execute("""
CREATE TYPE course_grading AS ENUM ('GPA', 'Percentage', 'Letter');
CREATE TYPE subject_category AS ENUM ('Core', 'Elective', 'Practical');

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    duration_months INT NOT NULL DEFAULT 12,
    grading_system course_grading NOT NULL DEFAULT 'Percentage',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_branch_course_code UNIQUE (branch_id, code)
);
CREATE INDEX idx_courses_lookup ON courses(branch_id, code);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject_type subject_category NOT NULL DEFAULT 'Core',
    credits INT NOT NULL DEFAULT 1,
    CONSTRAINT uq_branch_subject_code UNIQUE (branch_id, code)
);
CREATE INDEX idx_subjects_lookup ON subjects(branch_id, code);

CREATE TABLE course_subjects (
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    semester_or_term INT NOT NULL DEFAULT 1,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (course_id, subject_id)
);

CREATE TABLE syllabus_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    module_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    estimated_hours INT NOT NULL DEFAULT 0,
    CONSTRAINT uq_subject_module_number UNIQUE (subject_id, module_number)
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_courses ON courses FOR ALL 
    USING (branch_id IN (SELECT id FROM branches))
    WITH CHECK (branch_id IN (SELECT id FROM branches));

CREATE POLICY rls_subjects ON subjects FOR ALL 
    USING (branch_id IN (SELECT id FROM branches))
    WITH CHECK (branch_id IN (SELECT id FROM branches));
    """)

def downgrade():
    op.execute("""
DROP POLICY IF EXISTS rls_subjects ON subjects;
DROP POLICY IF EXISTS rls_courses ON courses;

ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

DROP TABLE syllabus_modules CASCADE;
DROP TABLE course_subjects CASCADE;
DROP TABLE subjects CASCADE;
DROP TABLE courses CASCADE;

DROP TYPE subject_category;
DROP TYPE course_grading;
    """)
