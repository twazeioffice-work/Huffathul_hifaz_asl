import asyncio
import asyncpg
import uuid
from app.core.security import hash_password

async def seed():
    conn = await asyncpg.connect("postgresql://suffat_admin:suffat_password@localhost:5432/suffat_erp")
    
    inst_id = uuid.uuid4()
    await conn.execute("INSERT INTO institutions (id, name, code) VALUES ($1, $2, $3)", inst_id, "Suffat", "SUF")
    
    branch_id = uuid.uuid4()
    await conn.execute("INSERT INTO branches (id, institution_id, name, code) VALUES ($1, $2, $3, $4)", branch_id, inst_id, "Main", "MAIN")
    
    role_id = uuid.uuid4()
    await conn.execute("INSERT INTO roles (id, institution_id, name) VALUES ($1, $2, $3)", role_id, inst_id, "Admin")
    
    user_id = uuid.uuid4()
    await conn.execute(
        "INSERT INTO users (id, email, password_hash, full_name, is_active, is_verified) VALUES ($1, $2, $3, $4, $5, $6)",
        user_id, "ustadh@suffat.com", hash_password("1234"), "Ustadh (System Admin)", True, True
    )
    
    await conn.execute(
        "INSERT INTO user_role_assignments (id, user_id, role_id, institution_id, branch_id) VALUES ($1, $2, $3, $4, $5)",
        uuid.uuid4(), user_id, role_id, inst_id, branch_id
    )
    
    print("Database seeded with ustadh@suffat.com / 1234")
    await conn.close()

asyncio.run(seed())
