import asyncio
import asyncpg

async def check():
    try:
        conn = await asyncpg.connect("postgresql://suffat_admin:suffat_password@localhost:5432/suffat_erp")
        rows = await conn.fetch("SELECT version_num FROM alembic_version")
        print("ALEMBIC VERSION:", [r['version_num'] for r in rows])
        await conn.close()
    except Exception as e:
        print("ERROR:", e)

asyncio.run(check())
