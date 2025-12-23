from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.db.session import get_db
from app.config import settings

router = APIRouter()


@router.get("")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "environment": settings.environment,
    }


@router.get("/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check including database connectivity."""
    health_status = {
        "status": "healthy",
        "service": settings.app_name,
        "environment": settings.environment,
        "checks": {},
    }

    # Check PostgreSQL
    try:
        await db.execute(text("SELECT 1"))
        health_status["checks"]["postgresql"] = "healthy"
    except Exception as e:
        health_status["checks"]["postgresql"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"

    # Check Redis
    try:
        from app.db.redis import get_redis
        redis = await get_redis()
        await redis.ping()
        health_status["checks"]["redis"] = "healthy"
    except Exception as e:
        health_status["checks"]["redis"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"

    # Check OpenSearch
    try:
        from app.db.opensearch import get_opensearch
        opensearch = get_opensearch()
        if opensearch.ping():
            health_status["checks"]["opensearch"] = "healthy"
        else:
            health_status["checks"]["opensearch"] = "unhealthy: ping failed"
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["checks"]["opensearch"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"

    return health_status
