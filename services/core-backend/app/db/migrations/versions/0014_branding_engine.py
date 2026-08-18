"""Phase 14 Branding Engine

Revision ID: 0014
Revises: 0013
Create Date: 2026-08-18 17:15:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0014'
down_revision = '0013'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.execute("""
    CREATE TYPE tenant_theme_mode AS ENUM ('dark', 'light', 'custom');

    -- 1. TENANT BRANDING CONFIGURATION TABLE
    CREATE TABLE tenant_branding_configs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
        branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        theme_mode tenant_theme_mode NOT NULL DEFAULT 'light',
        primary_color VARCHAR(7) NOT NULL DEFAULT '#0D9488',   
        background_color VARCHAR(7) NOT NULL DEFAULT '#FAF9F6',
        text_color VARCHAR(7) NOT NULL DEFAULT '#1A202C',      
        logo_url VARCHAR(512) NOT NULL,                        
        favicon_url VARCHAR(512),                              
        module_toggles JSONB NOT NULL DEFAULT '{"lms": true, "transport": false}', 
        last_modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_branch_branding UNIQUE (branch_id)
    );
    CREATE INDEX idx_branding_tenant ON tenant_branding_configs(institution_id, branch_id);

    -- 2. TENANT CUSTOM INTERNET DOMAINS REGISTRY
    CREATE TABLE tenant_custom_domains (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
        branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        custom_domain VARCHAR(255) NOT NULL UNIQUE,            
        verification_token VARCHAR(64) NOT NULL,               
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_at TIMESTAMPTZ,
        last_modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX idx_custom_domain_lookup ON tenant_custom_domains(custom_domain);

    -- 3. APPLY ROW-LEVEL SECURITY POLICY GUARDS
    ALTER TABLE tenant_branding_configs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tenant_custom_domains ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_branding_isolation ON tenant_branding_configs
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

    CREATE POLICY tenant_domain_isolation ON tenant_custom_domains
        FOR ALL
        USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
        WITH CHECK (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
    """)

def downgrade() -> None:
    pass
