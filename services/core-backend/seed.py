import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from app.models.identity import User
from app.models.rbac import Role, UserRoleAssignment
from app.models.tenant import Institution, Branch
from app.core.security import hash_password

DATABASE_URL = "postgresql+asyncpg://suffat_admin:suffat_password@localhost:5432/suffat_erp"
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed():
    async with async_session() as db:
        inst = Institution(id=uuid.uuid4(), name="Suffat-ul Huffaz", code="SUFFAT")
        db.add(inst)
        
        branch = Branch(id=uuid.uuid4(), institution_id=inst.id, name="Main Campus", code="MAIN")
        db.add(branch)

        role = Role(id=uuid.uuid4(), institution_id=inst.id, name="Admin", is_system_role=True)
        db.add(role)
        
        user = User(
            id=uuid.uuid4(),
            email="ustadh@suffat.com",
            password_hash=hash_password("1234"),
            full_name="Ustadh (System Admin)",
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
        
        await db.commit()
        print("Database seeded with ustadh@suffat.com / 1234")

asyncio.run(seed())
