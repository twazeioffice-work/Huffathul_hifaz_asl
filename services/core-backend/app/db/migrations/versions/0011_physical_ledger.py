"""Phase 11 Physical Ledger

Revision ID: 0011
Revises: 0010
Create Date: 2026-08-18 16:50:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0011'
down_revision = '0010'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.execute("""
    CREATE TYPE asset_status AS ENUM ('active', 'decommissioned', 'maintenance', 'disposed');
    CREATE TYPE depreciation_method AS ENUM ('straight_line', 'double_declining');

    CREATE TABLE asset_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        code VARCHAR(32) NOT NULL,
        name VARCHAR(128) NOT NULL,
        useful_life_years INT NOT NULL CHECK (useful_life_years > 0),
        depr_method depreciation_method NOT NULL DEFAULT 'straight_line',
        salvage_value_percentage NUMERIC(5, 2) DEFAULT 10.00,
        asset_account_head_id UUID REFERENCES account_heads(id) ON DELETE RESTRICT NOT NULL,
        depr_account_head_id UUID REFERENCES account_heads(id) ON DELETE RESTRICT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_institution_cat_code UNIQUE (institution_id, code)
    );

    CREATE TABLE assets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        category_id UUID REFERENCES asset_categories(id) ON DELETE RESTRICT NOT NULL,
        code VARCHAR(64) NOT NULL,
        name VARCHAR(255) NOT NULL,
        acquisition_date DATE NOT NULL DEFAULT CURRENT_DATE,
        acquisition_cost NUMERIC(12, 2) NOT NULL CHECK (acquisition_cost >= 0.00),
        current_book_value NUMERIC(12, 2) NOT NULL CHECK (current_book_value >= 0.00),
        salvage_value NUMERIC(12, 2) NOT NULL CHECK (salvage_value >= 0.00),
        status asset_status NOT NULL DEFAULT 'active',
        metadata JSONB NOT NULL DEFAULT '{}',
        tracker_token VARCHAR(128),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_branch_asset_code UNIQUE (branch_id, code)
    );
    CREATE INDEX idx_assets_tracker ON assets(tracker_token) WHERE tracker_token IS NOT NULL;
    CREATE INDEX idx_assets_composite ON assets(institution_id, branch_id);

    CREATE TABLE asset_maintenance_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
        service_date DATE NOT NULL DEFAULT CURRENT_DATE,
        cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (cost >= 0.00),
        description TEXT NOT NULL,
        performed_by VARCHAR(128) NOT NULL,
        next_scheduled_service DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );

    CREATE TABLE gps_telemetry_logs (
        id BIGSERIAL PRIMARY KEY,
        asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        latitude NUMERIC(9, 6) NOT NULL,
        longitude NUMERIC(9, 6) NOT NULL,
        speed_kmh NUMERIC(5, 2) NOT NULL,
        heading INT NOT NULL CHECK (heading BETWEEN 0 AND 360)
    );
    CREATE INDEX idx_telemetry_time ON gps_telemetry_logs(asset_id, timestamp DESC);

    ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
    ALTER TABLE asset_maintenance_logs ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_assets ON assets
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
        
    CREATE POLICY tenant_isolation_maintenance ON asset_maintenance_logs
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
    """)

def downgrade() -> None:
    pass
