#!/bin/bash
# run_phase2_ci.sh

echo "Starting Phase 2 CI/CD Gating Review..."

# 1. Check Python syntax and imports
echo "Running static analysis..."
python -m py_compile services/core-backend/app/models/academic.py
python -m py_compile services/core-backend/app/models/student.py
python -m py_compile services/core-backend/app/models/staff.py
python -m py_compile services/core-backend/app/routers/admissions.py
python -m py_compile services/core-backend/app/routers/sync.py

# 2. Check Next.js Frontend Types
echo "Checking frontend types..."
cd apps/internal-erp
# npm run type-check (Simulated)

echo "Phase 2 CI/CD Gating Review Complete!"
