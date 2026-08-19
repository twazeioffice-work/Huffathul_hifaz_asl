import { Redis } from "@upstash/redis";

// Graceful fallback for local development or environments without Upstash credentials
class MemoryRateLimiter {
  private cache: Map<string, { count: number; expiresAt: number }> = new Map();

  async incr(key: string): Promise<number> {
    const now = Date.now();
    const existing = this.cache.get(key);

    if (!existing || existing.expiresAt < now) {
      this.cache.set(key, { count: 1, expiresAt: now + 60000 });
      return 1;
    }

    existing.count += 1;
    return existing.count;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const existing = this.cache.get(key);
    if (existing) {
      existing.expiresAt = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }
}

const hasUpstashCredentials =
  Boolean(process.env.REDIS_REST_URL) && Boolean(process.env.REDIS_REST_TOKEN);

export const redis = hasUpstashCredentials
  ? new Redis({
      url: process.env.REDIS_REST_URL || "",
      token: process.env.REDIS_REST_TOKEN || "",
    })
  : (new MemoryRateLimiter() as unknown as Redis);
