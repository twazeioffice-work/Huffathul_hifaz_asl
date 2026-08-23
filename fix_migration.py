import glob
import os

migration_files = glob.glob("services/core-backend/app/db/migrations/versions/*add_soft_delete.py")
if not migration_files:
    print("No migration file found")
else:
    path = migration_files[0]
    with open(path, 'r') as f:
        lines = f.readlines()
    
    with open(path, 'w') as f:
        for line in lines:
            if 'op.drop_table' not in line and 'op.drop_index' not in line and 'op.drop_constraint' not in line and 'op.drop_column' not in line:
                f.write(line)
    print("Migration fixed!")
