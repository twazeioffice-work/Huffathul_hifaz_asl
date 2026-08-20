import { Pool } from 'pg';

// Database Singleton Pool
export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware Helper: Tenant Injection Promise
export async function withTenantContext<T>(
  tenantId: string, 
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await dbPool.connect();
  try {
    // Inject the active Tenant ID dynamically into the PostgreSQL Session
    await client.query(`SET app.current_tenant_id = $1`, [tenantId]);
    return await callback(client);
  } finally {
    // Sanitize the session block on exit
    await client.query(`RESET app.current_tenant_id`);
    client.release();
  }
}
