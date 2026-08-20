-- ============================================================================
-- SUFFAT-UL HUFFAZ: STRICT ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- This migration script enforces the hierarchical security model directly at 
-- the PostgreSQL engine level, guaranteeing data isolation even if the API fails.

-- Enable RLS on all tenant-scoped tables
ALTER TABLE halqas ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- We assume the API will set a local transaction variable for the active user ID and Role:
-- SET LOCAL app.current_user_id = 'user-uuid';
-- SET LOCAL app.current_user_role = 'NAZIM';
-- SET LOCAL app.current_center_id = 'center-uuid';

-- ============================================================================
-- SUPER ADMIN (GLOBAL GOD-MODE)
-- Super Admins bypass all row-level restrictions.
-- ============================================================================
CREATE POLICY super_admin_bypass ON halqas FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');
CREATE POLICY super_admin_bypass ON students FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');
CREATE POLICY super_admin_bypass ON daily_logs FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');
CREATE POLICY super_admin_bypass ON financial_ledger FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');
CREATE POLICY super_admin_bypass ON complaints FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');

-- ============================================================================
-- NAZIM (CENTER-LEVEL MANAGER)
-- Nazims have full CRUD access, but strictly scoped to their assigned Center.
-- ============================================================================
CREATE POLICY nazim_halqas_policy ON halqas FOR ALL 
USING (
  current_setting('app.current_user_role', true) = 'NAZIM' 
  AND center_id = current_setting('app.current_center_id', true)::uuid
);

CREATE POLICY nazim_students_policy ON students FOR ALL 
USING (
  current_setting('app.current_user_role', true) = 'NAZIM' 
  AND center_id = current_setting('app.current_center_id', true)::uuid
);

CREATE POLICY nazim_daily_logs_policy ON daily_logs FOR ALL 
USING (
  current_setting('app.current_user_role', true) = 'NAZIM' 
  AND center_id = current_setting('app.current_center_id', true)::uuid
);

CREATE POLICY nazim_financial_ledger_policy ON financial_ledger FOR ALL 
USING (
  current_setting('app.current_user_role', true) = 'NAZIM' 
  AND center_id = current_setting('app.current_center_id', true)::uuid
);

-- ============================================================================
-- USTAD (HALQA-LEVEL TEACHER)
-- Ustads can only view their own halqas, their own students, and write daily logs.
-- ============================================================================
CREATE POLICY ustad_halqas_select ON halqas FOR SELECT 
USING (
  current_setting('app.current_user_role', true) = 'USTAD' 
  AND ustad_id = current_setting('app.current_user_id', true)::uuid
);

CREATE POLICY ustad_students_select ON students FOR SELECT 
USING (
  current_setting('app.current_user_role', true) = 'USTAD' 
  AND halqa_id IN (
    SELECT id FROM halqas WHERE ustad_id = current_setting('app.current_user_id', true)::uuid
  )
);

CREATE POLICY ustad_daily_logs_policy ON daily_logs FOR ALL 
USING (
  current_setting('app.current_user_role', true) = 'USTAD' 
  AND ustad_id = current_setting('app.current_user_id', true)::uuid
);

-- ============================================================================
-- COMPLAINTS (ANONYMOUS & ESCALATION LOGIC)
-- ============================================================================
-- Nazims can only see complaints that are NOT filed against them.
CREATE POLICY nazim_complaints_view ON complaints FOR SELECT 
USING (
  current_setting('app.current_user_role', true) = 'NAZIM' 
  AND center_id = current_setting('app.current_center_id', true)::uuid
  AND (against_user_id IS NULL OR against_user_id != current_setting('app.current_user_id', true)::uuid)
);

-- Anyone can INSERT a complaint (including anonymous users, where submitted_by_id is NULL)
CREATE POLICY all_insert_complaints ON complaints FOR INSERT 
WITH CHECK (true);
