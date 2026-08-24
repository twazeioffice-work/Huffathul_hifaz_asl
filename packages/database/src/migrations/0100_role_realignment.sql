-- migrations/0100_role_realignment.sql

-- 1. Modify user_role ENUM (if possible without dropping, but safer to rename and recreate)
ALTER TYPE user_role RENAME TO user_role_old;

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'GLOBAL_JUNCTION',
  'CENTER_ADMIN',
  'NAZIM',
  'USTAD',
  'STUDENT',
  'PARENT'
);

-- Note: In a real production migration, we would alter the table column type
-- using a USING clause to map old values to new values.
ALTER TABLE users 
  ALTER COLUMN role TYPE user_role 
  USING (
    CASE role::text
      WHEN 'SUPER_ADMIN' THEN 'SUPER_ADMIN'::user_role
      WHEN 'NAZIM' THEN 'NAZIM'::user_role
      WHEN 'USTAD' THEN 'USTAD'::user_role
      WHEN 'STUDENT' THEN 'STUDENT'::user_role
      ELSE 'STUDENT'::user_role
    END
  );

DROP TYPE user_role_old;

-- 2. Create Permission Engine Tables
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(128) UNIQUE NOT NULL,
    module VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    is_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(role, permission_id)
);

CREATE TABLE user_permission_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    is_allowed BOOLEAN NOT NULL,
    reason TEXT,
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, permission_id)
);

-- 3. Create Global Junction Scope Mapping Table
CREATE TABLE global_junction_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    center_id UUID REFERENCES centers(id) ON DELETE CASCADE, -- NULL means ALL centers
    scope VARCHAR(64) NOT NULL, -- 'FINANCE', 'ACADEMICS', 'WELFARE', etc.
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(user_id, center_id, scope)
);

-- Enable RLS on new tables
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permission_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_junction_mappings ENABLE ROW LEVEL SECURITY;

-- Allow super admins to bypass restrictions
CREATE POLICY super_admin_bypass_permissions ON permissions FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');
CREATE POLICY super_admin_bypass_role_perms ON role_permissions FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');
CREATE POLICY super_admin_bypass_overrides ON user_permission_overrides FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');
CREATE POLICY super_admin_bypass_junction ON global_junction_mappings FOR ALL USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN');

-- Anyone can read permissions
CREATE POLICY all_read_permissions ON permissions FOR SELECT USING (true);
CREATE POLICY all_read_role_perms ON role_permissions FOR SELECT USING (true);

-- User can read their own overrides
CREATE POLICY user_read_overrides ON user_permission_overrides FOR SELECT USING (user_id = current_setting('app.current_user_id', true)::uuid);
