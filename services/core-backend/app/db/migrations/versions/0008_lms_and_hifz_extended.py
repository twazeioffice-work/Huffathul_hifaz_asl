"""LMS and Hifz Extended

Revision ID: 0008
Revises: 0007
Create Date: 2026-08-18 12:42:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0008'
down_revision = '0007'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # LMS Tables
    op.execute("""
    CREATE TABLE lms_courses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    CREATE TABLE lms_materials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        asset_url VARCHAR(1024) NOT NULL,
        is_encrypted BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    CREATE TABLE lms_quizzes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        total_score INT DEFAULT 100,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    """)

    # Hifz Sabqi and Manzil
    op.execute("""
    CREATE TABLE hifz_sabqi_records (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
        student_enrollment_id UUID NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        juz_number INT NOT NULL,
        grade hifz_grade_type NOT NULL,
        last_modified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    CREATE TABLE hifz_manzil_records (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
        student_enrollment_id UUID NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        juz_number INT NOT NULL,
        grade hifz_grade_type NOT NULL,
        last_modified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    
    CREATE TRIGGER trg_update_sabqi_time
        BEFORE UPDATE ON hifz_sabqi_records
        FOR EACH ROW EXECUTE FUNCTION update_last_modified_timestamp();
        
    CREATE TRIGGER trg_update_manzil_time
        BEFORE UPDATE ON hifz_manzil_records
        FOR EACH ROW EXECUTE FUNCTION update_last_modified_timestamp();
    """)
    
    # RLS Policies
    op.execute("""
    ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE hifz_sabqi_records ENABLE ROW LEVEL SECURITY;
    ALTER TABLE hifz_manzil_records ENABLE ROW LEVEL SECURITY;

    CREATE POLICY lms_courses_isolation_policy ON lms_courses
        FOR ALL USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
        
    CREATE POLICY sabqi_isolation_policy ON hifz_sabqi_records
        FOR ALL USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
        
    CREATE POLICY manzil_isolation_policy ON hifz_manzil_records
        FOR ALL USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
    """)

def downgrade() -> None:
    pass
