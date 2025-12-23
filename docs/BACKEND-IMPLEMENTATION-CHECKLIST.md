# AcquiSmart Backend Implementation Checklist

## Overview

Consolidating 9 microservices into 1 unified Python FastAPI service.

**Target Stack:**
- Python FastAPI (single service)
- AWS Cognito (auth)
- Plunk (emails)
- Stripe (payments)
- PostgreSQL + Redis + OpenSearch

---

## Pre-Implementation Setup

### External Services
- [ ] **AWS Cognito** - Create User Pool, configure Google IdP
  - [ ] Get `COGNITO_USER_POOL_ID`
  - [ ] Get `COGNITO_CLIENT_ID`
  - [ ] Get `COGNITO_CLIENT_SECRET`
- [ ] **Stripe** - Create account and products
  - [ ] Get `STRIPE_SECRET_KEY`
  - [ ] Get `STRIPE_WEBHOOK_SECRET`
  - [ ] Create subscription product → `STRIPE_PRICE_SUBSCRIPTION`
  - [ ] Create valuation product → `STRIPE_PRICE_VALUATION`
- [ ] **Plunk** - Create account, verify domain
  - [ ] Get `PLUNK_API_KEY`
- [ ] **AWS S3** - Create bucket
  - [ ] Get `AWS_ACCESS_KEY_ID`
  - [ ] Get `AWS_SECRET_ACCESS_KEY`
  - [ ] Create bucket → `S3_BUCKET`
- [ ] **OpenAI** - Get `OPENAI_API_KEY`
- [ ] **Anthropic** - Get `ANTHROPIC_API_KEY`

### Environment Setup
- [ ] Create `.env` file from template
- [ ] Verify all environment variables set
- [ ] Test `docker-compose up` with databases only

---

## Sprint 1: Foundation & Auth

### Project Setup
- [x] Create `backend/` directory structure
- [x] Create `backend/app/__init__.py`
- [x] Create `backend/app/main.py` - FastAPI entry point
- [x] Create `backend/app/config.py` - Pydantic settings
- [x] Create `backend/requirements.txt`
- [x] Create `backend/Dockerfile`
- [x] Create `backend/pyproject.toml`

### Database Setup
- [x] Create `backend/app/db/__init__.py`
- [x] Create `backend/app/db/session.py` - SQLAlchemy async session
- [x] Create `backend/app/db/redis.py` - Redis connection
- [x] Create `backend/app/db/opensearch.py` - OpenSearch client
- [x] Create `backend/alembic.ini`
- [x] Create `backend/migrations/env.py`

### Database Models
- [x] Create `backend/app/models/__init__.py`
- [x] Create `backend/app/models/user.py`
- [x] Create `backend/app/models/listing.py`
- [x] Create `backend/app/models/document.py` (part of listing.py)
- [x] Create `backend/app/models/inquiry.py`
- [x] Create `backend/app/models/nda.py`
- [x] Create `backend/app/models/subscription.py`
- [x] Create `backend/app/models/valuation.py`
- [x] Create `backend/app/models/analytics.py`

### Initial Migration
- [x] Generate initial Alembic migration
- [ ] Run migration successfully
- [ ] Verify tables created in PostgreSQL

### API Foundation
- [x] Create `backend/app/api/__init__.py`
- [x] Create `backend/app/api/router.py` - Main router
- [x] Create `backend/app/api/deps.py` - Dependencies (db session, auth)
- [x] Create `backend/app/api/health.py` - Health check endpoint
- [ ] Test health endpoint works

### Auth - Cognito Integration
- [x] Create `backend/app/services/auth/__init__.py`
- [x] Create `backend/app/services/auth/cognito.py` - Cognito SDK
- [x] Create `backend/app/services/auth/tokens.py` - JWT verification
- [x] Create `backend/app/api/auth.py` - Auth endpoints
- [x] Create `backend/app/schemas/user.py` - User schemas

### Auth Endpoints
- [x] `POST /auth/register` - Email registration
- [x] `POST /auth/login` - Email/password login
- [x] `POST /auth/verify-email` - Email verification
- [x] `GET /auth/google` - Google OAuth redirect
- [x] `GET /auth/google/callback` - OAuth callback
- [x] `POST /auth/refresh` - Token refresh
- [x] `POST /auth/logout` - Logout
- [x] `POST /auth/logout/global` - Global logout (invalidate all sessions)

### Sprint 1 Verification
- [ ] Can register with email
- [ ] Email verification works (via Cognito)
- [ ] Can login with email/password
- [ ] Can login with Google
- [ ] JWT tokens validated correctly
- [ ] Protected routes require auth

---

## Sprint 2: Users & Listings

### User Endpoints
- [x] Create `backend/app/api/users.py`
- [x] `GET /users/me` - Get current user profile
- [x] `PUT /users/me` - Update profile
- [x] `GET /users/me/saved` - Get saved listings
- [x] `GET /users/me/history` - Get browsing history

### Listings Service
- [ ] Create `backend/app/services/listings/__init__.py`
- [ ] Create `backend/app/services/listings/crud.py`
- [ ] Create `backend/app/services/listings/featured.py`
- [x] Create `backend/app/schemas/listing.py`

### Listings Endpoints
- [x] Create `backend/app/api/listings.py`
- [x] `GET /listings` - Search with filters
- [x] `GET /listings/featured` - Featured for landing page
- [x] `GET /listings/:id` - Get listing details
- [x] `POST /listings` - Create listing (seller)
- [x] `PUT /listings/:id` - Update listing (seller)
- [x] `DELETE /listings/:id` - Delete listing (seller)
- [x] `POST /listings/:id/save` - Save/star listing (buyer) (via `/users/me/saved/:id`)
- [x] `DELETE /listings/:id/save` - Unsave listing (via `/users/me/saved/:id`)

### Analytics Tracking
- [ ] Create `backend/app/services/analytics/__init__.py`
- [ ] Create `backend/app/services/analytics/tracking.py`
- [ ] Create `backend/app/api/analytics.py`
- [ ] `POST /analytics/view` - Track listing view

### Sprint 2 Verification
- [ ] Users can view/update profile
- [ ] Sellers can create listings
- [ ] Buyers can search listings
- [ ] Buyers can save/unsave listings
- [ ] Browsing history tracked

---

## Sprint 3: Documents & NDA Security

### S3 Integration
- [x] Create `backend/app/services/documents/__init__.py`
- [x] Create `backend/app/services/documents/s3.py` - S3 operations
- [x] Create `backend/app/services/documents/upload.py`
- [ ] Create `backend/app/services/documents/encryption.py` (using S3 server-side encryption)
- [x] Create `backend/app/schemas/document.py`

### Document Endpoints
- [x] Create `backend/app/api/documents.py`
- [x] `POST /documents/upload` - Upload document
- [x] `GET /documents/:id` - Get document (with auth check)
- [x] `DELETE /documents/:id` - Delete document
- [x] `GET /documents/listing/:id` - List documents for listing

### NDA Workflow
- [x] Create `backend/app/services/nda/__init__.py`
- [x] Create `backend/app/services/nda/workflow.py` - State machine
- [x] Create `backend/app/schemas/nda.py`

### NDA Endpoints
- [x] Create `backend/app/api/ndas.py`
- [x] `POST /ndas/request` - Request NDA
- [x] `GET /ndas` - List user's NDAs
- [x] `POST /ndas/:id/sign` - Sign NDA
- [x] `POST /ndas/:id/send` - Send NDA (seller)
- [x] `POST /ndas/:id/reject` - Reject NDA (seller)
- [x] `GET /ndas/:id` - Get NDA details
- [x] `GET /ndas/listing/:id/status` - Check NDA status
- [x] `GET /ndas/listing/:id/financials` - Get financials (NDA required)

### Sprint 3 Verification
- [ ] Documents upload to S3
- [ ] Documents encrypted at rest (S3 server-side)
- [ ] NDA request creates pending NDA
- [ ] NDA signing updates status
- [ ] Financial docs only accessible after NDA signed

---

## Sprint 4: Payments & Subscriptions

### Stripe Integration
- [x] Create `backend/app/services/payments/__init__.py`
- [x] Create `backend/app/services/payments/stripe_service.py`
- [x] Create `backend/app/services/payments/subscriptions.py`
- [x] Create `backend/app/schemas/payment.py`

### Payment Endpoints
- [x] Create `backend/app/api/payments.py`
- [x] `POST /payments/subscribe` - Create subscription checkout
- [x] `GET /payments/subscription` - Get subscription status
- [x] `POST /payments/cancel` - Cancel subscription
- [x] `POST /payments/reactivate` - Reactivate subscription
- [x] `POST /payments/billing-portal` - Stripe billing portal
- [x] `POST /payments/valuation/:id` - Pay for valuation
- [x] `GET /payments/valuation/:id/access` - Check valuation access
- [x] Create `backend/app/api/webhooks.py`
- [x] `POST /webhooks/stripe` - Stripe webhook handler

### Premium Feature Gating
- [x] Subscription check in subscription_service.has_valuation_access()
- [x] Gate valuation behind payment/subscription

### Sprint 4 Verification
- [ ] Can create Stripe subscription
- [ ] Webhook updates subscription status
- [ ] Premium features gated correctly
- [ ] One-time valuation payment works

---

## Sprint 5: Inquiries & Communication

### Plunk Integration
- [ ] Create `backend/app/services/inquiries/__init__.py`
- [ ] Create `backend/app/services/inquiries/messaging.py`
- [ ] Create `backend/app/services/inquiries/notifications.py` - Plunk
- [ ] Create `backend/app/schemas/inquiry.py`

### Inquiry Endpoints
- [ ] Create `backend/app/api/inquiries.py`
- [ ] `POST /listings/:id/inquire` - Start inquiry
- [ ] `GET /inquiries` - List inquiries
- [ ] `GET /inquiries/:id` - Get inquiry thread
- [ ] `POST /inquiries/:id/reply` - Reply to inquiry

### Email Notifications
- [ ] New inquiry notification to seller
- [ ] New reply notification
- [ ] NDA request notification
- [ ] NDA signed notification

### Sprint 5 Verification
- [ ] Buyers can inquire on listings
- [ ] Sellers can reply to inquiries
- [ ] Email notifications sent via Plunk
- [ ] Inquiry history preserved

---

## Sprint 6: AI Integration

### OCR & Classification
- [ ] Create `backend/app/ai/__init__.py`
- [ ] Create `backend/app/ai/ocr/__init__.py`
- [ ] Create `backend/app/ai/ocr/paddle_ocr.py`
- [ ] Create `backend/app/ai/ocr/tesseract.py`
- [ ] Create `backend/app/ai/classification/__init__.py`
- [ ] Create `backend/app/ai/classification/layoutlm.py`

### Entity Extraction
- [ ] Create `backend/app/ai/entities/__init__.py`
- [ ] Create `backend/app/ai/entities/ner.py` - spaCy NER
- [ ] Create `backend/app/ai/entities/resolution.py`

### AI Valuation
- [ ] Create `backend/app/ai/valuation/__init__.py`
- [ ] Create `backend/app/ai/valuation/llm_analysis.py`

### Recommendations
- [ ] Create `backend/app/ai/recommendations/__init__.py`
- [ ] Create `backend/app/ai/recommendations/engine.py`
- [ ] Create `backend/app/ai/recommendations/embeddings.py`

### AI Endpoints (Internal)
- [ ] `POST /ai/document/classify`
- [ ] `POST /ai/document/ocr`
- [ ] `POST /ai/document/extract-fields`
- [ ] `POST /ai/entities/extract`
- [ ] `POST /ai/valuation/analyze`
- [ ] `POST /ai/recommendations/generate`

### Sprint 6 Verification
- [ ] OCR extracts text from documents
- [ ] Documents classified correctly
- [ ] Entities extracted from text
- [ ] LLM analysis generates insights
- [ ] Recommendations generated

---

## Sprint 7: Analytics & Recommendations

### Search Analytics
- [ ] Create `backend/app/services/analytics/demand.py`
- [ ] Create `backend/app/services/analytics/insights.py`
- [ ] `POST /analytics/search` - Track search query

### Listing Matching
- [ ] Create `backend/app/services/search/__init__.py`
- [ ] Create `backend/app/services/search/matching.py`
- [ ] Create `backend/app/services/search/opensearch.py`
- [ ] Create `backend/app/services/listings/categorization.py`

### Recommendation Endpoints
- [ ] `GET /listings/matches` - AI-matched listings
- [ ] `GET /users/me/recommendations` - User recommendations
- [ ] `GET /analytics/insights` - Market insights (seller)

### Sprint 7 Verification
- [ ] Search queries tracked
- [ ] Demand analysis from search data
- [ ] Listing matching works
- [ ] Recommendations personalized
- [ ] Seller insights available

---

## Sprint 8: Valuation & Education

### Valuation Service
- [ ] Create `backend/app/services/valuation/__init__.py`
- [ ] Create `backend/app/services/valuation/dcf.py`
- [ ] Create `backend/app/services/valuation/comparables.py`
- [ ] Create `backend/app/services/valuation/pricing.py`
- [ ] Create `backend/app/schemas/valuation.py`

### Valuation Endpoints
- [ ] Create `backend/app/api/valuations.py`
- [ ] `POST /valuations` - Request valuation
- [ ] `GET /valuations/:id` - Get valuation (if paid)
- [ ] `POST /valuations/:id/memo` - Generate memo

### Education Content
- [ ] Create `backend/app/services/education/__init__.py`
- [ ] Create `backend/app/services/education/content.py`
- [ ] Create `backend/app/api/education.py`
- [ ] `GET /education/articles` - List articles
- [ ] `GET /education/articles/:slug` - Get article

### Sprint 8 Verification
- [ ] DCF valuation calculates correctly
- [ ] Comparable analysis works
- [ ] AI pricing recommendations generate
- [ ] Valuation memo generated
- [ ] Education content accessible

---

## Sprint 9: Frontend Integration

### API Proxy Setup
- [ ] Update `app/api/[...path]/route.ts` to proxy to FastAPI
- [ ] Configure `API_SERVICE_URL` environment variable
- [ ] Test proxy works for all HTTP methods

### Auth Integration
- [ ] Update login page to use Cognito
- [ ] Update signup page to use Cognito
- [ ] Handle Google OAuth flow
- [ ] Store tokens in httpOnly cookies or secure storage
- [ ] Update auth context/provider

### API Client Updates
- [ ] Update API client to use new endpoints
- [ ] Handle new error response formats
- [ ] Update TypeScript types for new schemas

### Feature Integration
- [ ] Connect marketplace to new listings API
- [ ] Connect search to new search API
- [ ] Connect document upload to new documents API
- [ ] Connect valuation workspace to new valuation API
- [ ] Connect user profile to new users API

### Sprint 9 Verification
- [ ] All frontend pages work with new backend
- [ ] Auth flow works end-to-end
- [ ] No console errors
- [ ] All user flows tested

---

## Sprint 10: Cleanup & Launch Prep

### Remove Old Services
- [ ] Delete `backend/platform-gateway/`
- [ ] Delete `backend/svc-catalog/`
- [ ] Delete `backend/svc-ingestion/`
- [ ] Delete `backend/svc-valuation/`
- [ ] Delete `backend/svc-monitoring/`
- [ ] Delete `backend/svc-reporting/`
- [ ] Delete `backend/svc-ai-document/`
- [ ] Delete `backend/svc-ai-entities/`
- [ ] Delete `backend/svc-ai-valuation/`
- [ ] Delete `backend/svc-ai-risk/`

### Docker Compose Update
- [x] Update `docker-compose.yml` to new single service
- [x] Remove old service definitions
- [ ] Test `docker-compose up` works

### Testing
- [ ] Write integration tests for critical paths
- [ ] Test auth flow
- [ ] Test payment flow
- [ ] Test NDA flow
- [ ] Test document upload flow

### Performance
- [ ] Profile API response times
- [ ] Optimize slow endpoints
- [ ] Add caching where needed

### Security
- [ ] Review authentication
- [ ] Review authorization (role checks)
- [ ] Review input validation
- [ ] Check for SQL injection
- [ ] Check for XSS
- [ ] Review S3 bucket permissions

### Documentation
- [ ] Update README with new setup instructions
- [ ] Document API endpoints
- [ ] Document environment variables
- [ ] Create deployment guide

### Sprint 10 Verification
- [ ] Old services removed
- [ ] Single service runs correctly
- [ ] All tests pass
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Documentation complete

---

## Launch Checklist

### Final Verification
- [ ] All sprints completed
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security reviewed

### Deployment
- [ ] Production environment variables set
- [ ] Database migrations run in production
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Monitoring set up
- [ ] Logging configured
- [ ] Backup strategy in place

### Go Live
- [ ] Deploy to production
- [ ] Smoke test all features
- [ ] Monitor for errors
- [ ] Ready for users!

---

## Notes

_Add implementation notes, decisions, and learnings here as you progress._

### Decisions Made
- Using Python FastAPI instead of Go (team comfort, AI integration)
- Using AWS Cognito for auth (Google + Email)
- Using Plunk for transactional emails
- Using single consolidated service (not microservices)
- Document model merged into listing.py as ListingDocument
- Save/unsave endpoints placed under `/users/me/saved/:id` instead of `/listings/:id/save`

### Files Created (Sprint 1-4)
- `backend/app/main.py` - FastAPI entry point with CORS middleware
- `backend/app/config.py` - Pydantic settings with all env vars
- `backend/app/db/session.py` - Async SQLAlchemy session management
- `backend/app/db/redis.py` - Redis connection helper
- `backend/app/db/opensearch.py` - OpenSearch client
- `backend/app/models/*.py` - All SQLAlchemy models
- `backend/app/schemas/*.py` - Pydantic request/response schemas
- `backend/app/services/auth/cognito.py` - Full Cognito SDK integration
- `backend/app/services/auth/tokens.py` - JWT verification with JWKS
- `backend/app/services/documents/s3.py` - S3 operations (upload, download, presigned URLs)
- `backend/app/services/documents/upload.py` - Document service with NDA access control
- `backend/app/services/nda/workflow.py` - Full NDA workflow (request, send, sign, reject)
- `backend/app/api/deps.py` - Auth dependencies (get_current_user, etc.)
- `backend/app/api/auth.py` - Auth endpoints (register, login, Google OAuth, logout, etc.)
- `backend/app/api/users.py` - User profile and saved listings endpoints
- `backend/app/api/listings.py` - Full CRUD + search for listings
- `backend/app/api/documents.py` - Document upload/download with access control
- `backend/app/api/ndas.py` - Full NDA workflow endpoints
- `backend/app/api/payments.py` - Subscription and payment endpoints
- `backend/app/api/webhooks.py` - Stripe webhook handler
- `backend/app/services/payments/stripe_service.py` - Stripe API integration
- `backend/app/services/payments/subscriptions.py` - Subscription management
- `backend/app/schemas/payment.py` - Payment request/response schemas
- `backend/migrations/versions/001_initial_schema.py` - All table definitions
- `backend/Dockerfile` - Production-ready container
- `backend/requirements.txt` - All Python dependencies
- `docker-compose.yml` - Updated to single FastAPI service
- `.env.example` - Environment variable template

### Issues Encountered
- N/A (clean implementation so far)

### Lessons Learned
- N/A
