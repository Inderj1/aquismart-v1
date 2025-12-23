from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database connections."""
    logger.info("Initializing database connections...")

    # Test PostgreSQL connection
    try:
        async with engine.begin() as conn:
            from sqlalchemy import text
            await conn.execute(text("SELECT 1"))
        logger.info("PostgreSQL connection established")
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {e}")
        raise

    # Initialize Redis
    try:
        from app.db.redis import init_redis
        await init_redis()
        logger.info("Redis connection established")
    except Exception as e:
        logger.warning(f"Failed to connect to Redis: {e}")

    # Initialize OpenSearch
    try:
        from app.db.opensearch import init_opensearch
        init_opensearch()
        logger.info("OpenSearch connection established")
    except Exception as e:
        logger.warning(f"Failed to connect to OpenSearch: {e}")


async def close_db() -> None:
    """Close database connections."""
    logger.info("Closing database connections...")

    # Close PostgreSQL
    await engine.dispose()
    logger.info("PostgreSQL connection closed")

    # Close Redis
    try:
        from app.db.redis import close_redis
        await close_redis()
        logger.info("Redis connection closed")
    except Exception as e:
        logger.warning(f"Error closing Redis: {e}")
