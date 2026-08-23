import asyncio
import asyncpg

async def check():
    try:
        conn = await asyncpg.connect("postgresql://suffat_admin:suffat_password@localhost:5432/suffat_erp")
        rows = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        print("TABLES:", [r['table_name'] for r in rows])
        await conn.close()
    except Exception as e:
        print("ERROR:", e)

asyncio.run(check())
