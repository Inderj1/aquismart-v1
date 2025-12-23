from typing import Optional
from opensearchpy import OpenSearch
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Global OpenSearch client
_opensearch_client: Optional[OpenSearch] = None


def init_opensearch() -> None:
    """Initialize OpenSearch client."""
    global _opensearch_client

    # Parse URL to get host and port
    url = settings.opensearch_url
    if url.startswith("http://"):
        url = url[7:]
    elif url.startswith("https://"):
        url = url[8:]

    host, port = url.split(":") if ":" in url else (url, 9200)

    _opensearch_client = OpenSearch(
        hosts=[{"host": host, "port": int(port)}],
        http_compress=True,
        use_ssl=False,
        verify_certs=False,
        ssl_show_warn=False,
    )

    # Test connection
    if not _opensearch_client.ping():
        raise ConnectionError("Failed to connect to OpenSearch")

    logger.info("OpenSearch client initialized")


def get_opensearch() -> OpenSearch:
    """Get OpenSearch client."""
    if _opensearch_client is None:
        init_opensearch()
    return _opensearch_client


def close_opensearch() -> None:
    """Close OpenSearch client."""
    global _opensearch_client

    if _opensearch_client is not None:
        _opensearch_client.close()
        _opensearch_client = None
        logger.info("OpenSearch client closed")
