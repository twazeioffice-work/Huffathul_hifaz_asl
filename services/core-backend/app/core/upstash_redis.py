"""
Upstash Redis Async Client for FastAPI Backend
================================================
Provides an async Redis connection layer targeting Upstash serverless Redis
for caching, session management, and pub/sub operations.

Environment Variables Required:
  - UPSTASH_REDIS_REST_URL: Upstash REST endpoint URL
  - UPSTASH_REDIS_REST_TOKEN: Upstash REST auth token
"""

import os
from typing import Optional
from upstash_redis import AsyncRedis


_client: Optional[AsyncRedis] = None


def get_redis_client() -> AsyncRedis:
    """
    Returns a singleton async Upstash Redis client.
    Raises RuntimeError if credentials are not configured.
    """
    global _client

    if _client is None:
        url = os.getenv("UPSTASH_REDIS_REST_URL", "")
        token = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")

        if not url or not token:
            raise RuntimeError(
                "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set. "
                "Redis operations are unavailable."
            )

        _client = AsyncRedis(url=url, token=token)

    return _client


async def health_check() -> dict:
    """
    Pings Upstash Redis and returns connectivity status.
    Used by the /api/v1/health/dependencies endpoint.
    """
    try:
        client = get_redis_client()
        result = await client.ping()
        return {"upstash_redis": "healthy", "ping": result}
    except RuntimeError as e:
        return {"upstash_redis": "not_configured", "error": str(e)}
    except Exception as e:
        return {"upstash_redis": "unhealthy", "error": str(e)}


async def cache_get(key: str) -> Optional[str]:
    """Get a cached value by key. Returns None on miss or error."""
    try:
        client = get_redis_client()
        return await client.get(key)
    except Exception:
        return None


async def cache_set(key: str, value: str, ttl_seconds: int = 300) -> bool:
    """Set a cached value with TTL. Returns True on success."""
    try:
        client = get_redis_client()
        await client.set(key, value, ex=ttl_seconds)
        return True
    except Exception:
        return False
