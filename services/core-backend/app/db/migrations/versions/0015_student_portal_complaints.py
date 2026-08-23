"""student_portal_complaints

Revision ID: 0015_student_portal_complaints
Revises: 0014_branding_engine
Create Date: 2026-08-23 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import os

# revision identifiers, used by Alembic.
revision: str = '0015_student_portal_complaints'
down_revision: Union[str, None] = '0014_branding_engine'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Get the path to the raw SQL file
    migration_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    sql_path = os.path.join(migration_dir, '0002_student_portal_complaints.sql')
    
    with open(sql_path, 'r') as f:
        sql_commands = f.read()
        
    op.execute(sql_commands)

def downgrade() -> None:
    # Drop the RLS Policies and View
    op.execute("DROP VIEW IF EXISTS scoped_center_complaints;")
    op.execute("DROP POLICY IF EXISTS super_admin_all_complaints_select ON complaints;")
    op.execute("DROP POLICY IF EXISTS super_admin_all_complaints_update ON complaints;")
    op.execute("DROP POLICY IF EXISTS center_admin_complaints_access ON complaints;")
    op.execute("DROP POLICY IF EXISTS center_admin_complaints_update ON complaints;")
    op.execute("DROP POLICY IF EXISTS student_own_complaints_select ON complaints;")
    op.execute("DROP POLICY IF EXISTS student_own_complaints_insert ON complaints;")
    
    # Drop Tables
    op.execute("DROP TABLE IF EXISTS complaints CASCADE;")
    op.execute("DROP TABLE IF EXISTS campus_notices CASCADE;")
    op.execute("DROP TABLE IF EXISTS system_notifications CASCADE;")
    op.execute("DROP TABLE IF EXISTS student_facilities CASCADE;")
    
    # Drop Enums
    op.execute("DROP TYPE IF EXISTS complaint_target_type;")
    op.execute("DROP TYPE IF EXISTS complaint_recipient_type;")
    op.execute("DROP TYPE IF EXISTS facility_status;")
    op.execute("DROP TYPE IF EXISTS facility_type;")
