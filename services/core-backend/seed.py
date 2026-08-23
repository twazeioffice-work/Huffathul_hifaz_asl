import asyncio
import asyncpg
import uuid
from app.core.security import hash_password

async def seed():
    conn = await asyncpg.connect("postgresql://suffat_admin:suffat_password@localhost:5432/suffat_erp")
    
    inst_id = await conn.fetchval("SELECT id FROM institutions WHERE code = 'SUF'")
    branch_id = await conn.fetchval("SELECT id FROM branches WHERE code = 'MAIN'")
    role_id = await conn.fetchval("SELECT id FROM roles WHERE name = 'Admin'")
    
    user_id = uuid.uuid4()
    hashed = hash_password("1234")
    try:
        await conn.execute(
            "INSERT INTO users (id, email, password_hash, full_name, is_active, is_verified) VALUES ($1, $2, $3, $4, $5, $6)",
            user_id, "ustadh@suffat.com", hashed, "Ustadh (System Admin)", True, True
        )
        
        await conn.execute(
            "INSERT INTO user_role_assignments (id, user_id, role_id, institution_id, branch_id) VALUES ($1, $2, $3, $4, $5)",
            uuid.uuid4(), user_id, role_id, inst_id, branch_id
        )
        print("Database seeded with ustadh@suffat.com / 1234")
    except Exception as e:
        print("Error inserting user:", e)
    
    await conn.close()

asyncio.run(seed())
