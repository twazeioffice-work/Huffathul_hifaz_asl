"""Phase 8 Community Events and Fundraising

Revision ID: 0018_community_events
Revises: 0017_previous_revision
Create Date: 2026-08-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0018_community_events'
down_revision = '0017_previous_revision'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # ---------------------------------------------------------
    # COMPONENT 1: Community Event Orchestrator
    # ---------------------------------------------------------
    
    op.create_table('community_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('branch_code', sa.String(length=32), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('venue_capacity', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table('event_rsvps',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('event_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('community_events.id', ondelete='CASCADE'), nullable=False),
        sa.Column('guest_identity', sa.String(length=255), nullable=False),
        sa.Column('confirmation_state', sa.String(length=32), nullable=False), # Attending, Declined, Tentative
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # ---------------------------------------------------------
    # COMPONENT 2: Fundraising & Community Donations Engine
    # ---------------------------------------------------------
    
    op.create_table('fundraising_campaigns',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('target_amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('collected_amount', sa.Numeric(12, 2), server_default='0.00', nullable=False),
        sa.Column('deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table('donors',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True), # null for anonymous
        sa.Column('is_anonymous', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('contact_reference', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table('donation_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('campaign_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('fundraising_campaigns.id'), nullable=True),
        sa.Column('donor_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('donors.id'), nullable=True),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('transaction_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('ledger_voucher_id', sa.String(length=64), nullable=False), # Enforces link to double-entry ledger
    )

    # ---------------------------------------------------------
    # ZERO-TRUST RLS ENFORCEMENT
    # ---------------------------------------------------------
    
    tables = [
        'community_events', 'event_rsvps', 
        'fundraising_campaigns', 'donors', 'donation_transactions'
    ]
    
    for table in tables:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
        op.execute(f"""
            CREATE POLICY {table}_tenant_isolation_policy ON {table}
            FOR ALL
            USING (tenant_id = current_setting('app.current_tenant_id', TRUE));
        """)


def downgrade() -> None:
    tables = [
        'donation_transactions', 'donors', 'fundraising_campaigns', 
        'event_rsvps', 'community_events'
    ]
    for table in tables:
        op.execute(f"DROP POLICY IF EXISTS {table}_tenant_isolation_policy ON {table};")
        op.drop_table(table)
