import asyncio
import asyncpg
import subprocess

async def reset_db():
    try:
        print("Connecting to database...")
        conn = await asyncpg.connect("postgresql://suffat_admin:suffat_password@localhost:5432/suffat_erp")
        print("Dropping public schema...")
        await conn.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
        print("Schema recreated.")
        await conn.close()
        
        print("Running alembic upgrade head...")
        result = subprocess.run(["venv/bin/alembic", "upgrade", "head"], capture_output=True, text=True)
        print("ALEMBIC STDOUT:")
        print(result.stdout)
        if result.stderr:
            print("ALEMBIC STDERR:")
            print(result.stderr)
            
    except Exception as e:
        print("ERROR:", e)

asyncio.run(reset_db())
