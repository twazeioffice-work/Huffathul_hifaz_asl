import asyncio
import uuid
import random
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select

from app.models.tenant import Institution, Branch
from app.models.identity import User
from app.models.rbac import Role, UserRoleAssignment
from app.core.security import hash_password

DATABASE_URL = "postgresql+asyncpg://suffat_admin:suffat_password@localhost:5432/suffat_erp"
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

ROLES = [
    "Branch Admin",
    "Ustadh (Teacher)",
    "Student",
    "Parent",
    "Accountant"
]

async def seed():
    async with async_session() as db:
        # Get existing institution & branch
        inst = (await db.execute(select(Institution).limit(1))).scalar_one_or_none()
        branch = (await db.execute(select(Branch).limit(1))).scalar_one_or_none()

        if not inst or not branch:
            print("Institution/Branch missing. Did you run the basic seed first?")
            return

        # Pre-hash password for speed
        hashed_pw = hash_password("1234")

        created_users = []

        for role_name in ROLES:
            # Check or create role
            role = (await db.execute(select(Role).where(Role.name == role_name))).scalar_one_or_none()
            if not role:
                role = Role(id=uuid.uuid4(), institution_id=inst.id, name=role_name)
                db.add(role)
                await db.flush()

            # Create 3 users for each category
            for i in range(1, 4):
                prefix = role_name.split(' ')[0].lower()
                email = f"{prefix}{i}@suffat.com"
                
                # Check if exists
                existing_user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
                if not existing_user:
                    user = User(
                        id=uuid.uuid4(),
                        email=email,
                        password_hash=hashed_pw,
                        full_name=f"{role_name} {i}",
                        is_active=True,
                        is_verified=True
                    )
                    db.add(user)
                    await db.flush()

                    assignment = UserRoleAssignment(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        role_id=role.id,
                        institution_id=inst.id,
                        branch_id=branch.id
                    )
                    db.add(assignment)
                    created_users.append(email)

        await db.commit()
        
        print("\n--- Additional Users Seeded Successfully ---")
        for u in created_users:
            print(f"- {u} (Password: 1234)")
        print("------------------------------------------\n")

asyncio.run(seed())
