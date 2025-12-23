from fastapi import APIRouter

from app.api import health, auth, users, listings, documents, ndas, payments, webhooks

api_router = APIRouter()

# Health check
api_router.include_router(health.router, prefix="/health", tags=["Health"])

# Auth endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# User endpoints
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Listing endpoints
api_router.include_router(listings.router, prefix="/listings", tags=["Listings"])

# Document endpoints
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])

# NDA endpoints
api_router.include_router(ndas.router, prefix="/ndas", tags=["NDAs"])

# Payment endpoints
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])

# Webhook endpoints
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])

# TODO: Add more routers as we implement them
# api_router.include_router(inquiries.router, prefix="/inquiries", tags=["Inquiries"])
# api_router.include_router(valuations.router, prefix="/valuations", tags=["Valuations"])
# api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
# api_router.include_router(education.router, prefix="/education", tags=["Education"])
