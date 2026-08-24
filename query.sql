SELECT u.email, u.full_name, r.name FROM users u JOIN user_role_assignments ura ON u.id = ura.user_id JOIN roles r ON ura.role_id = r.id WHERE r.name NOT IN ('Student', 'Usthad') LIMIT 20;
