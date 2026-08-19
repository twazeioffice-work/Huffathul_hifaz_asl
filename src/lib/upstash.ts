import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ── Singleton Upstash Redis REST Client ─────────────────────────────────────
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://placeholder-url.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "placeholder-token",
});

// ── Sliding-Window Rate Limiter (5 requests per 60 seconds per IP) ──────────
export const publicFormLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "suh_ratelimit",
});

// ── Cache TTL Definitions ───────────────────────────────────────────────────
export const CACHE_TTL_TENANT = 3600; // 1 Hour cache for domain resolution

// ── Backward Compatible Factory Methods ─────────────────────────────────────

export function getRedis(): Redis {
  return redis;
}

export function getRateLimiter(): Ratelimit {
  return publicFormLimiter;
}

export async function getCachedTenantId(hostname: string): Promise<string | null> {
  try {
    const tenantData = await redis.get<string>(`tenant_domain:${hostname}`);
    return tenantData;
  } catch (error) {
    console.error("Upstash tenant lookup failed, falling through:", error);
    return null;
  }
}

export async function cacheTenantMapping(
  hostname: string,
  tenantId: string
): Promise<void> {
  try {
    await redis.set(`tenant_domain:${hostname}`, tenantId, { ex: CACHE_TTL_TENANT });
  } catch (error) {
    console.error("Upstash tenant cache write failed:", error);
  }
}
