import asyncio
import asyncpg

async def add_cols():
    try:
        conn = await asyncpg.connect("postgresql://suffat_admin:suffat_password@localhost:5432/suffat_erp")
        tables = await conn.fetch("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
        for t in tables:
            name = t['tablename']
            print(f"Adding columns to {name}...")
            try:
                await conn.execute(f"ALTER TABLE public.{name} ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE")
                await conn.execute(f"ALTER TABLE public.{name} ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE")
            except Exception as e:
                print(f"Skipped {name}: {e}")
        await conn.close()
        print("Success")
    except Exception as e:
        print("Error:", e)

asyncio.run(add_cols())
