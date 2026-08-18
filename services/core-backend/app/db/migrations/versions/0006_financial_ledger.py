"""Financial Ledger and Billing

Revision ID: 0006
Revises: 0005
Create Date: 2026-08-18 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0006'
down_revision = '0005'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Types
    op.execute("CREATE TYPE account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');")
    op.execute("CREATE TYPE voucher_type AS ENUM ('journal', 'receipt', 'payment', 'contra');")

    # Account Heads
    op.execute("""
    CREATE TABLE account_heads (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        parent_id UUID REFERENCES account_heads(id) ON DELETE SET NULL,
        code VARCHAR(32) NOT NULL,
        name VARCHAR(128) NOT NULL,
        type account_type NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_branch_account_code UNIQUE (branch_id, code)
    );
    CREATE INDEX idx_account_heads_lookup ON account_heads(branch_id, code);
    """)

    # Vouchers
    op.execute("""
    CREATE TABLE vouchers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        voucher_number VARCHAR(64) NOT NULL,
        type voucher_type NOT NULL,
        narration TEXT,
        posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
        transaction_date DATE DEFAULT CURRENT_DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_branch_voucher_number UNIQUE (branch_id, voucher_number)
    );
    CREATE INDEX idx_vouchers_timeline ON vouchers(branch_id, transaction_date);
    """)

    # Voucher Lines
    op.execute("""
    CREATE TABLE voucher_lines (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
        account_head_id UUID REFERENCES account_heads(id) ON DELETE RESTRICT NOT NULL,
        debit NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CONSTRAINT chk_debit_positive CHECK (debit >= 0),
        credit NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CONSTRAINT chk_credit_positive CHECK (credit >= 0),
        CONSTRAINT chk_debit_credit_mutual_exclusion CHECK (
            (debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)
        )
    );
    CREATE INDEX idx_voucher_lines_account ON voucher_lines(account_head_id);
    """)

    # Fee Categories
    op.execute("""
    CREATE TABLE fee_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        name VARCHAR(128) NOT NULL,
        description TEXT,
        default_amount NUMERIC(12, 2) NOT NULL,
        is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    """)

    # Student Due Schedules
    op.execute("""
    CREATE TABLE student_due_schedules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        student_id UUID NOT NULL,
        enrollment_id UUID NOT NULL,
        fee_category_id UUID REFERENCES fee_categories(id) ON DELETE RESTRICT NOT NULL,
        due_amount NUMERIC(12, 2) NOT NULL,
        paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        due_date DATE NOT NULL,
        is_fully_paid BOOLEAN GENERATED ALWAYS AS (paid_amount >= due_amount) STORED,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    CREATE INDEX idx_due_schedules_lookup ON student_due_schedules(branch_id, student_id);
    """)

    # Fee Receipts
    op.execute("""
    CREATE TABLE fee_receipts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
        due_schedule_id UUID REFERENCES student_due_schedules(id) ON DELETE RESTRICT NOT NULL,
        voucher_id UUID REFERENCES vouchers(id) ON DELETE RESTRICT NOT NULL,
        amount_paid NUMERIC(12, 2) NOT NULL,
        payment_method VARCHAR(64) NOT NULL,
        pdf_receipt_hash VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    """)

    # RLS Policies
    op.execute("""
    ALTER TABLE account_heads ENABLE ROW LEVEL SECURITY;
    ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE student_due_schedules ENABLE ROW LEVEL SECURITY;
    ALTER TABLE fee_receipts ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_accounts ON account_heads
        FOR ALL USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

    CREATE POLICY tenant_isolation_vouchers ON vouchers
        FOR ALL USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

    CREATE POLICY tenant_isolation_dues ON student_due_schedules
        FOR ALL USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

    CREATE POLICY tenant_isolation_receipts ON fee_receipts
        FOR ALL USING (institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
    """)

def downgrade() -> None:
    op.execute("DROP POLICY tenant_isolation_receipts ON fee_receipts;")
    op.execute("DROP POLICY tenant_isolation_dues ON student_due_schedules;")
    op.execute("DROP POLICY tenant_isolation_vouchers ON vouchers;")
    op.execute("DROP POLICY tenant_isolation_accounts ON account_heads;")

    op.execute("ALTER TABLE fee_receipts DISABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE student_due_schedules DISABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE vouchers DISABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE account_heads DISABLE ROW LEVEL SECURITY;")

    op.drop_table('fee_receipts')
    op.drop_table('student_due_schedules')
    op.drop_table('fee_categories')
    op.drop_table('voucher_lines')
    op.drop_table('vouchers')
    op.drop_table('account_heads')

    op.execute("DROP TYPE voucher_type;")
    op.execute("DROP TYPE account_type;")
