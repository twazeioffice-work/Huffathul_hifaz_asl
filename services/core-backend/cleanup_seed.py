import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://suffat_admin:suffat_password@localhost:5432/suffat_erp"
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def cleanup():
    async with async_session() as db:
        # Delete hallucinated accounts
        emails = [
            'parent1@suffat.com', 'parent2@suffat.com', 'parent3@suffat.com',
            'accountant1@suffat.com', 'accountant2@suffat.com', 'accountant3@suffat.com',
            'branch1@suffat.com', 'branch2@suffat.com', 'branch3@suffat.com',
            'ustadh1@suffat.com', 'ustadh2@suffat.com', 'ustadh3@suffat.com'
        ]
        
        for email in emails:
            await db.execute(text("DELETE FROM users WHERE email = :email"), {"email": email})
        
        # Delete hallucinated roles
        bad_roles = ['Parent', 'Accountant', 'Branch Admin', 'Ustadh (Teacher)']
        for role in bad_roles:
            await db.execute(text("DELETE FROM roles WHERE name = :name"), {"name": role})
            
        await db.commit()
        print("Hallucinated data purged.")

asyncio.run(cleanup())
