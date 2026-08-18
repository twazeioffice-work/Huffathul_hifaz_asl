"""Community and Affiliations

Revision ID: 0009
Revises: 0008
Create Date: 2026-08-18 13:25:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0009'
down_revision = '0008'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. ENUMS
    op.execute("""
    CREATE TYPE affiliation_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
    CREATE TYPE competition_status AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED');
    """)

    # 2. AFFILIATED INSTITUTIONS TABLE
    op.execute("""
    CREATE TABLE affiliated_institutions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        code VARCHAR(32) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) UNIQUE,
        address JSONB NOT NULL DEFAULT '{}',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    """)

    # 3. AFFILIATION REQUESTS TABLE
    op.execute("""
    CREATE TABLE affiliation_requests (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        target_affiliated_institution_id UUID REFERENCES affiliated_institutions(id) ON DELETE CASCADE NOT NULL,
        status affiliation_status NOT NULL DEFAULT 'PENDING',
        submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
        review_notes TEXT,
        document_url VARCHAR(512),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_tenant_affiliation UNIQUE (institution_id, target_affiliated_institution_id)
    );
    CREATE INDEX idx_aff_requests_lookup ON affiliation_requests(institution_id, branch_id);
    """)

    # 4. ALUMNI PROFILES TABLE
    op.execute("""
    CREATE TABLE alumni_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        graduation_year INT NOT NULL,
        current_employment VARCHAR(255),
        position VARCHAR(255),
        is_public BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    CREATE INDEX idx_alumni_tenant_grad ON alumni_profiles(institution_id, branch_id, graduation_year);
    """)

    # 5. COMPETITIONS EVENT TABLE
    op.execute("""
    CREATE TABLE competitions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        title VARCHAR(128) NOT NULL,
        description TEXT,
        venue_name VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status competition_status NOT NULL DEFAULT 'DRAFT',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    CREATE INDEX idx_competitions_timeline ON competitions(institution_id, branch_id, start_date);
    """)

    # 6. COMPETITION REGISTRATIONS BRIDGE
    op.execute("""
    CREATE TABLE competition_registrations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE NOT NULL,
        student_enrollment_id UUID REFERENCES student_enrollments(id) ON DELETE CASCADE NOT NULL,
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_comp_student UNIQUE (competition_id, student_enrollment_id)
    );
    """)

    # 7. ROW LEVEL SECURITY (RLS)
    op.execute("""
    ALTER TABLE affiliation_requests ENABLE ROW LEVEL SECURITY;
    ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_affiliations ON affiliation_requests
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

    CREATE POLICY tenant_isolation_alumni ON alumni_profiles
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
        
    CREATE POLICY tenant_isolation_competitions ON competitions
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
    """)

def downgrade() -> None:
    pass
