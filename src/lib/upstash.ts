/**
 * Upstash Serverless Redis Client
 * ================================
 * Edge-compatible REST-based Redis client for:
 *   - Tenant subdomain cache lookups (sub-5ms)
 *   - Rate limiter backing store
 *   - Session/token caching
 *
 * Environment Variables Required:
 *   UPSTASH_REDIS_REST_URL   — Upstash REST endpoint
 *   UPSTASH_REDIS_REST_TOKEN — Upstash REST auth token
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ── Singleton Redis Client ──────────────────────────────────────────────────

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      console.warn(
        "⚠️  UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. " +
        "Redis operations will fail gracefully."
      );
    }

    _redis = new Redis({
      url: url || "",
      token: token || "",
    });
  }
  return _redis;
}

// ── Rate Limiter Factory ────────────────────────────────────────────────────

let _ratelimit: Ratelimit | null = null;

/**
 * Returns a sliding-window rate limiter: 5 requests per 60 seconds per key.
 * Used in edge middleware to protect intake/mutation endpoints.
 */
export function getRateLimiter(): Ratelimit {
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "suh_rate_limit",
    });
  }
  return _ratelimit;
}

// ── Tenant Cache Helpers ────────────────────────────────────────────────────

/**
 * Looks up a tenant ID by custom domain hostname from Upstash cache.
 * Returns null if not found or on connection failure (graceful degradation).
 */
export async function getCachedTenantId(
  hostname: string
): Promise<string | null> {
  try {
    const redis = getRedis();
    const tenantId = await redis.get<string>(`tenant_domain:${hostname}`);
    return tenantId;
  } catch (error) {
    console.error("Upstash tenant lookup failed, falling through:", error);
    return null;
  }
}

/**
 * Caches a tenant domain → tenant ID mapping with a 5-minute TTL.
 */
export async function cacheTenantMapping(
  hostname: string,
  tenantId: string
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.set(`tenant_domain:${hostname}`, tenantId, { ex: 300 });
  } catch (error) {
    console.error("Upstash tenant cache write failed:", error);
  }
}
