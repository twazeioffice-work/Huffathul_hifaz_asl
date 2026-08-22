import asyncio
import sys
import os

# Add the parent directory to sys.path so we can import 'app'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import CoreSessionLocal, core_transactional_engine
from app.db.base_class import Base as IdentityBase
from app.models.base import Base as TenantBase
from app.models.identity import User
from app.models.rbac import Role, UserRoleAssignment
from app.models.tenant import Institution, Branch
from app.core.security import hash_password
import uuid

# Import all models to ensure they are registered with their respective Base.metadata
import app.models.identity
import app.models.rbac
import app.models.tenant
import app.models.academics
import app.models.staff
import app.models.student

from sqlalchemy import text

async def seed_users():
    print("Connecting to database to seed default users...")
    
    # 0. Alter table to ensure 'code' column exists (safe against existing columns)
    print("Ensuring 'code' columns exist in tenant tables...")
    async with core_transactional_engine.begin() as conn:
        await conn.execute(text("ALTER TABLE institutions ADD COLUMN IF NOT EXISTS code VARCHAR(50) DEFAULT '' NOT NULL;"))
        await conn.execute(text("ALTER TABLE branches ADD COLUMN IF NOT EXISTS code VARCHAR(50) DEFAULT '' NOT NULL;"))
        # Make code unique if possible, but safely ignore if it already is
        try:
            await conn.execute(text("ALTER TABLE institutions ADD CONSTRAINT uq_institutions_code UNIQUE (code);"))
        except Exception:
            pass

    async with CoreSessionLocal() as session:
        # 1. Ensure a default institution and branch exists for the assignments
        inst_query = await session.execute(select(Institution).where(Institution.code == "aim-kerala"))
        institution = inst_query.scalar_one_or_none()
        if not institution:
            institution = Institution(
                id=uuid.UUID("8821901a-8bc2-4ccb-8e10-cf123abcf01a"),
                name="AIM Kerala",
                code="aim-kerala"
            )
            session.add(institution)
        
        branch_query = await session.execute(select(Branch).where(Branch.code == "trv-main"))
        branch = branch_query.scalar_one_or_none()
        if not branch:
            branch = Branch(
                id=uuid.UUID("11111111-2222-3333-4444-555555555555"),
                institution_id=institution.id,
                name="Trivandrum Main",
                code="trv-main"
            )
            session.add(branch)
            
        await session.commit()
        
        # 2. Define the default users
        users_data = [
            {"email": "superadmin@suffat.com", "full_name": "Super Admin", "role_name": "SUPER_ADMIN"},
            {"email": "centeradmin@suffat.com", "full_name": "Center Admin", "role_name": "CENTER_ADMIN"},
            {"email": "nazim@suffat.com", "full_name": "Nazim", "role_name": "NAZIM"},
            {"email": "usthad@suffat.com", "full_name": "Usthad", "role_name": "USTAD"},
            {"email": "student@suffat.com", "full_name": "Student", "role_name": "STUDENT"},
        ]
        
        default_password = hash_password("0000")
        
        for data in users_data:
            # Create or get Role
            role_query = await session.execute(select(Role).where(Role.name == data["role_name"]))
            role = role_query.scalar_one_or_none()
            if not role:
                role = Role(
                    name=data["role_name"],
                    description=f"Default role for {data['role_name']}"
                )
                if data["role_name"] != "SUPER_ADMIN":
                    role.institution_id = institution.id
                session.add(role)
                await session.flush()
                
            # Create or get User
            user_query = await session.execute(select(User).where(User.email == data["email"]))
            user = user_query.scalar_one_or_none()
            if not user:
                user = User(
                    email=data["email"],
                    password_hash=default_password,
                    full_name=data["full_name"],
                    is_active=True,
                    is_verified=True
                )
                session.add(user)
                await session.flush()
                print(f"Created user: {data['email']} (Password: 0000)")
            else:
                user.password_hash = default_password
                print(f"Updated existing user: {data['email']} (Password reset to 0000)")
                
            # Assign Role to User
            assignment_query = await session.execute(
                select(UserRoleAssignment)
                .where(UserRoleAssignment.user_id == user.id)
                .where(UserRoleAssignment.role_id == role.id)
            )
            assignment = assignment_query.scalar_one_or_none()
            if not assignment:
                assignment = UserRoleAssignment(
                    user_id=user.id,
                    institution_id=institution.id,
                    branch_id=branch.id,
                    role_id=role.id
                )
                session.add(assignment)
                
        await session.commit()
        print("Database seeding completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_users())