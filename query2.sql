SELECT name, count(*) FROM roles JOIN user_role_assignments ON roles.id = user_role_assignments.role_id GROUP BY name;
