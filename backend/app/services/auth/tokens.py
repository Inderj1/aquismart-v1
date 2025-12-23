from typing import Optional, Dict, Any
import httpx
from jose import jwt, jwk, JWTError
from jose.utils import base64url_decode
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Cache for JWKS
_jwks_cache: Optional[Dict[str, Any]] = None


async def get_jwks() -> Dict[str, Any]:
    """Fetch and cache Cognito JWKS."""
    global _jwks_cache

    if _jwks_cache is not None:
        return _jwks_cache

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.cognito_jwks_url)
            response.raise_for_status()
            _jwks_cache = response.json()
            return _jwks_cache
    except Exception as e:
        logger.error(f"Failed to fetch JWKS: {e}")
        raise


def get_signing_key(token: str, jwks: Dict[str, Any]) -> Optional[str]:
    """Get the signing key for a token from JWKS."""
    try:
        headers = jwt.get_unverified_headers(token)
        kid = headers.get("kid")

        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                return jwk.construct(key).to_pem().decode("utf-8")

        return None
    except Exception as e:
        logger.error(f"Failed to get signing key: {e}")
        return None


async def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify a Cognito JWT token.

    Returns the decoded payload if valid, None otherwise.
    """
    if not settings.cognito_user_pool_id or not settings.cognito_client_id:
        # Cognito not configured, skip verification in development
        if settings.environment == "development":
            logger.warning("Cognito not configured, skipping token verification")
            # Return a mock payload for development
            return {"sub": "dev-user", "email": "dev@example.com"}
        return None

    try:
        # Get JWKS
        jwks = await get_jwks()

        # Get signing key
        signing_key = get_signing_key(token, jwks)
        if signing_key is None:
            logger.warning("No matching signing key found")
            return None

        # Decode and verify token
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=settings.cognito_client_id,
            issuer=settings.cognito_issuer,
        )

        # Verify token_use claim
        token_use = payload.get("token_use")
        if token_use not in ["id", "access"]:
            logger.warning(f"Invalid token_use: {token_use}")
            return None

        return payload

    except JWTError as e:
        logger.warning(f"JWT verification failed: {e}")
        return None
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return None
