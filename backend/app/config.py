from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    environment: str = "development"
    debug: bool = False
    app_name: str = "AcquiSmart API"
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str = "postgresql+asyncpg://acquismart:changeme@localhost:5432/acquismart"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # OpenSearch
    opensearch_url: str = "http://localhost:9200"

    # AWS General
    aws_region: str = "us-east-1"
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None

    # AWS Cognito
    cognito_user_pool_id: Optional[str] = None
    cognito_client_id: Optional[str] = None
    cognito_client_secret: Optional[str] = None
    cognito_domain: Optional[str] = None  # e.g., "acquismart.auth.us-east-1.amazoncognito.com"
    cognito_redirect_uri: str = "http://localhost:3000/auth/callback"

    # AWS S3
    s3_bucket: str = "acquismart-documents"

    # Stripe
    stripe_secret_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None
    stripe_price_subscription: Optional[str] = None
    stripe_price_valuation: Optional[str] = None

    # Plunk (Email)
    plunk_api_key: Optional[str] = None
    from_email: str = "noreply@acquismart.ai"

    # LLM APIs
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None

    # Security
    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3344"]

    @property
    def cognito_issuer(self) -> str:
        """Get Cognito issuer URL."""
        return f"https://cognito-idp.{self.aws_region}.amazonaws.com/{self.cognito_user_pool_id}"

    @property
    def cognito_jwks_url(self) -> str:
        """Get Cognito JWKS URL for token verification."""
        return f"{self.cognito_issuer}/.well-known/jwks.json"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
