"""health_leave_guardian_scopes

Revision ID: 0016
Revises: 0015
Create Date: 2026-08-23 17:03:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0016'
down_revision = '0015'
branch_labels = None
depends_on = None

def upgrade():
    # 1. Extend Student Enrollments to Separate Primary and Local Guardian Numbers
    op.execute("""
        ALTER TABLE student_enrollments 
            ADD COLUMN primary_parent_phone VARCHAR(50) NOT NULL DEFAULT '+910000000000',
            ADD COLUMN local_guardian_phone VARCHAR(50) NOT NULL DEFAULT '+910000000000',
            ADD COLUMN blood_group VARCHAR(10) NULL,
            ADD COLUMN medical_history TEXT NULL;
    """)

    # 2. Create the Batch Leave Schedule Table
    op.execute("""
        CREATE TABLE batch_leave_schedules (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
            branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
            batch_name VARCHAR(100) NOT NULL,
            leave_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
            leave_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
            reporting_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    """)

    # 3. Create the Student Well-Being & Health Logs Table
    op.execute("""
        CREATE TABLE student_well_being_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
            branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
            student_enrollment_id UUID NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
            checked_by_ustad_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
            date DATE DEFAULT CURRENT_DATE NOT NULL,
            health_status VARCHAR(50) NOT NULL,
            temperature_fahrenheit NUMERIC(4, 1) NULL,
            mental_energy VARCHAR(50) NOT NULL,
            ustad_notes VARCHAR(500) NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    """)

    # Junction table for Global Operations
    op.execute("""
        CREATE TABLE global_junction_mappings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            staff_profile_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE UNIQUE,
            functional_scope VARCHAR(50) NOT NULL,
            allowed_branches UUID[] DEFAULT '{}' NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    """)

    # 4. Enable Row Level Security on New Tables
    op.execute("ALTER TABLE batch_leave_schedules ENABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE student_well_being_logs ENABLE ROW LEVEL SECURITY;")
    
    # 5. Define Branch-Level RLS Policies for Leave Schedules
    op.execute("""
        CREATE POLICY leave_schedule_branch_isolation ON batch_leave_schedules
            FOR ALL
            TO authenticated
            USING (
                institution_id = current_setting('app.current_tenant_id')::UUID AND
                branch_id = current_setting('app.current_branch_id')::UUID
            );
    """)

    # 6. Define Branch-Level RLS Policies for Well-Being Logs
    op.execute("""
        CREATE POLICY well_being_branch_isolation ON student_well_being_logs
            FOR ALL
            TO authenticated
            USING (
                institution_id = current_setting('app.current_tenant_id')::UUID AND
                branch_id = current_setting('app.current_branch_id')::UUID
            );
    """)

def downgrade():
    op.execute("DROP TABLE global_junction_mappings;")
    op.execute("DROP TABLE student_well_being_logs;")
    op.execute("DROP TABLE batch_leave_schedules;")
    op.execute("""
        ALTER TABLE student_enrollments 
            DROP COLUMN medical_history,
            DROP COLUMN blood_group,
            DROP COLUMN local_guardian_phone,
            DROP COLUMN primary_parent_phone;
    """)
