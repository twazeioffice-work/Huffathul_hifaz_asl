"""Hifz Sync Engine

Revision ID: 0007
Revises: 0006
Create Date: 2026-08-18 12:35:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0007'
down_revision = '0006'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Enums
    op.execute("CREATE TYPE hifz_grade_type AS ENUM ('excellent', 'good', 'average', 'needs_improvement');")

    # Hifz Sabaq Records
    op.execute("""
    CREATE TABLE hifz_sabaq_records (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
        branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        student_enrollment_id UUID NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
        staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        juz_number INT NOT NULL CHECK (juz_number BETWEEN 1 AND 30),
        page_start INT NOT NULL CHECK (page_start BETWEEN 1 AND 604),
        page_end INT NOT NULL CHECK (page_end >= page_start AND page_end <= 604),
        grade hifz_grade_type NOT NULL,
        teacher_notes TEXT,
        last_modified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_student_sabaq_date UNIQUE (student_enrollment_id, date)
    );
    CREATE INDEX idx_sabaq_sync_time ON hifz_sabaq_records (last_modified_at, institution_id);
    CREATE INDEX idx_sabaq_student ON hifz_sabaq_records (student_enrollment_id);
    """)

    # Tombstones
    op.execute("""
    CREATE TABLE sync_deleted_records (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
        table_name VARCHAR(64) NOT NULL,
        record_id UUID NOT NULL,
        deleted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    CREATE INDEX idx_tombstone_lookup ON sync_deleted_records (deleted_at, institution_id);
    """)

    # Triggers
    op.execute("""
    CREATE OR REPLACE FUNCTION update_last_modified_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.last_modified_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_update_sabaq_time
        BEFORE UPDATE ON hifz_sabaq_records
        FOR EACH ROW
        EXECUTE FUNCTION update_last_modified_timestamp();
    """)

    # RLS Policies
    op.execute("""
    ALTER TABLE hifz_sabaq_records ENABLE ROW LEVEL SECURITY;
    ALTER TABLE sync_deleted_records ENABLE ROW LEVEL SECURITY;

    CREATE POLICY sabaq_isolation_policy ON hifz_sabaq_records
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
        
    CREATE POLICY tombstone_isolation_policy ON sync_deleted_records
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
    """)

def downgrade() -> None:
    op.execute("DROP POLICY tombstone_isolation_policy ON sync_deleted_records;")
    op.execute("DROP POLICY sabaq_isolation_policy ON hifz_sabaq_records;")
    op.execute("ALTER TABLE sync_deleted_records DISABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE hifz_sabaq_records DISABLE ROW LEVEL SECURITY;")

    op.execute("DROP TRIGGER trg_update_sabaq_time ON hifz_sabaq_records;")
    op.execute("DROP FUNCTION update_last_modified_timestamp();")

    op.drop_table('sync_deleted_records')
    op.drop_table('hifz_sabaq_records')
    op.execute("DROP TYPE hifz_grade_type;")
