"""temporal time and batches

Revision ID: 0004
Revises: 0003
Create Date: 2026-08-17 19:50:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0004'
down_revision = '0003'
branch_labels = None
depends_on = None

def upgrade():
    op.execute("""
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_institution_year_name UNIQUE (institution_id, name),
    CONSTRAINT chk_academic_dates CHECK (start_date < end_date)
);
CREATE INDEX idx_academic_years_tenant ON academic_years(institution_id, is_active);

CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 40,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_batches_search ON batches(branch_id, academic_year_id, course_id);

ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_academic_years ON academic_years FOR ALL 
    USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
    WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY rls_batches ON batches FOR ALL 
    USING (branch_id IN (SELECT id FROM branches))
    WITH CHECK (branch_id IN (SELECT id FROM branches));
    """)

def downgrade():
    op.execute("""
DROP POLICY IF EXISTS rls_batches ON batches;
DROP POLICY IF EXISTS rls_academic_years ON academic_years;

ALTER TABLE batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years DISABLE ROW LEVEL SECURITY;

DROP TABLE batches CASCADE;
DROP TABLE academic_years CASCADE;
    """)
