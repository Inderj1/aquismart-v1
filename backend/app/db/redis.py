from typing import Optional
import redis.asyncio as redis
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Global Redis connection pool
_redis_pool: Optional[redis.Redis] = None


async def init_redis() -> None:
    """Initialize Redis connection pool."""
    global _redis_pool

    _redis_pool = redis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
    )

    # Test connection
    await _redis_pool.ping()
    logger.info("Redis connection pool initialized")


async def get_redis() -> redis.Redis:
    """Get Redis connection from pool."""
    if _redis_pool is None:
        await init_redis()
    return _redis_pool


async def close_redis() -> None:
    """Close Redis connection pool."""
    global _redis_pool

    if _redis_pool is not None:
        await _redis_pool.close()
        _redis_pool = None
        logger.info("Redis connection pool closed")
