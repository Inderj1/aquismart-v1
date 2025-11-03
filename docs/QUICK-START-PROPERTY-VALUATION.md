# Quick Start: Property Valuation Feature

## Overview

This guide will help you quickly get started with implementing the property valuation feature in the AcquiSmart platform.

## What We've Already Done

✅ **Architecture Analysis**
- Audited existing microservices
- Identified reusable components
- Mapped integration points

✅ **Documentation**
- Created comprehensive workflow documentation
- Built implementation roadmap
- Defined data models

✅ **Code Foundation**
- Added Property types to shared types system
- Updated navbar with authentication flow
- Prepared type definitions

## File Structure Created

```
docs/
├── PROPERTY-VALUATION-WORKFLOW.md      # Detailed workflow and architecture
├── IMPLEMENTATION-ROADMAP.md           # 20-day implementation plan
└── QUICK-START-PROPERTY-VALUATION.md  # This file

backend/
└── shared/
    └── types/
        └── index.ts                     # ✅ Updated with Property types
```

## What's Next: 5 Implementation Tracks

### Track 1: Backend API (Priority 1)
**Estimated time**: 5 days

**Files to create:**
```
backend/svc-catalog/src/
├── routes/
│   └── properties.ts                   # Property search & details
├── services/
│   └── propertyService.ts              # Business logic
└── schema/
    └── properties.sql                  # Database schema
```

**Key endpoints:**
- `GET /api/v1/catalog/properties/search` - Property search
- `GET /api/v1/catalog/properties/:id` - Property details
- `POST /api/v1/catalog/properties/:id/save` - Save property (protected)
- `GET /api/v1/catalog/users/me/properties` - User's saved properties (protected)

### Track 2: Valuation Service (Priority 1)
**Estimated time**: 3 days

**Files to create:**
```
backend/svc-valuation/src/
└── routes/
    └── propertyValuation.ts            # Valuation endpoint
```

**Key endpoint:**
- `POST /api/v1/valuation/property` - Generate valuation (protected)

### Track 3: Frontend Components (Priority 2)
**Estimated time**: 5 days

**Files to create:**
```
frontend/
├── app/
│   └── properties/
│       ├── page.tsx                    # Search page
│       └── [id]/
│           ├── page.tsx               # Property details
│           └── valuation/
│               └── page.tsx           # Valuation results
├── components/
│   └── properties/
│       ├── PropertyCard.tsx
│       ├── PropertySearch.tsx
│       ├── PropertyDetails.tsx
│       └── ValuationResults.tsx
└── lib/
    └── api/
        └── properties.ts               # API client
```

### Track 4: ML Model (Priority 2)
**Estimated time**: 4 days

**Files to create:**
```
ml/
├── models/
│   └── property_valuation/
│       ├── model.py
│       └── feature_config.json
└── training/
    └── scripts/
        └── train_property_model.py
```

### Track 5: Database (Priority 1)
**Estimated time**: 2 days

**Files to create:**
```
backend/svc-catalog/
└── migrations/
    └── 001_create_properties.sql
```

## Quick Implementation Commands

### 1. Start Development Environment

```bash
# Terminal 1: Frontend
cd frontend
npm install
npm run dev

# Terminal 2: API Gateway
cd backend/platform-gateway
npm install
npm run dev

# Terminal 3: Database
docker-compose up postgres redis
```

### 2. Create Database Tables

```bash
# Run migrations
docker-compose exec postgres psql -U acquismart -d acquismart -f /path/to/properties.sql
```

### 3. Install Dependencies

```bash
# Backend services (if new dependencies needed)
cd backend/svc-catalog
npm install express pg drizzle-orm zod

# ML service
cd ml/models/property_valuation
pip install scikit-learn shap pandas numpy
```

## Development Workflow

### Day 1: Database Setup
```bash
# 1. Create migration file
touch backend/svc-catalog/migrations/001_create_properties.sql

# 2. Copy schema from IMPLEMENTATION-ROADMAP.md

# 3. Apply migration
docker-compose exec postgres psql -U acquismart -d acquismart -f /migrations/001_create_properties.sql

# 4. Verify tables
docker-compose exec postgres psql -U acquismart -d acquismart -c "\dt"
```

### Day 2-3: Backend Catalog Service
```bash
# 1. Create routes file
mkdir -p backend/svc-catalog/src/routes
touch backend/svc-catalog/src/routes/properties.ts

# 2. Create service file
mkdir -p backend/svc-catalog/src/services
touch backend/svc-catalog/src/services/propertyService.ts

# 3. Implement endpoints (see IMPLEMENTATION-ROADMAP.md for code)

# 4. Test endpoints
curl http://localhost:3002/properties/search?q=boston
```

### Day 4: Valuation Service
```bash
# 1. Create valuation route
mkdir -p backend/svc-valuation/src/routes
touch backend/svc-valuation/src/routes/propertyValuation.ts

# 2. Implement endpoint

# 3. Test
curl -X POST http://localhost:3004/property \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"propertyId": "123"}'
```

### Day 5-7: Frontend
```bash
# 1. Create property search page
mkdir -p frontend/app/properties
touch frontend/app/properties/page.tsx

# 2. Create components
mkdir -p frontend/components/properties
touch frontend/components/properties/PropertyCard.tsx
touch frontend/components/properties/PropertySearch.tsx

# 3. Test in browser
# Navigate to http://localhost:3344/properties
```

### Day 8-10: ML Model
```bash
# 1. Create model directory
mkdir -p ml/models/property_valuation

# 2. Implement model (see IMPLEMENTATION-ROADMAP.md)

# 3. Train model
cd ml/training
python scripts/train_property_model.py

# 4. Test predictions
python -c "from models.property_valuation import PropertyValuationModel; print(model.predict({}))"
```

## Testing Checklist

### Backend Tests
```bash
cd backend/svc-catalog
npm test

# Test specific endpoint
npm test -- properties.test.ts
```

### Frontend Tests
```bash
cd frontend
npm test

# E2E tests
npm run e2e
```

### Integration Tests
```bash
# Full workflow test
npm run test:integration
```

## Common Issues & Solutions

### Issue 1: Authentication Errors
**Problem**: 401 Unauthorized when calling protected endpoints

**Solution**:
```typescript
// Make sure to include JWT token
const response = await fetch('/api/v1/valuation/property', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Issue 2: CORS Errors
**Problem**: Frontend can't call backend APIs

**Solution**: Check `backend/platform-gateway/src/index.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3344',
  credentials: true
}));
```

### Issue 3: Type Errors
**Problem**: TypeScript errors with Property types

**Solution**: Import from shared types:
```typescript
import { Property, PropertyValuation } from '@/backend/shared/types';
```

## Environment Variables

Add to `.env` file:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acquismart
DB_USER=acquismart
DB_PASSWORD=changeme

# API
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Auth
JWT_SECRET=your-secret-key

# ML Model
MODEL_PATH=./ml/models/property_valuation/model.pkl
```

## Useful Commands

```bash
# Check service health
curl http://localhost:3000/health

# View logs
docker-compose logs -f

# Restart service
docker-compose restart svc-catalog

# Database console
docker-compose exec postgres psql -U acquismart -d acquismart

# Run all tests
npm run test:all

# Build for production
npm run build
```

## Key Resources

### Documentation
1. [Workflow Documentation](./PROPERTY-VALUATION-WORKFLOW.md) - Detailed workflow
2. [Implementation Roadmap](./IMPLEMENTATION-ROADMAP.md) - Day-by-day plan
3. [Main README](../README.md) - Project overview

### Code References
1. Shared Types: `backend/shared/types/index.ts`
2. Auth Middleware: `backend/shared/middleware/auth.ts`
3. API Gateway: `backend/platform-gateway/src/index.ts`
4. Existing Dashboard: `frontend/app/dashboard/page.tsx`

### Example Code
All example code is in the IMPLEMENTATION-ROADMAP.md document under each phase.

## Progress Tracking

Use this checklist to track your progress:

**Week 1: Backend Foundation**
- [ ] Database migrations
- [ ] Property search endpoint
- [ ] Property details endpoint
- [ ] Save property endpoint
- [ ] Valuation endpoint

**Week 2: Frontend**
- [ ] Property search page
- [ ] Property card component
- [ ] Property details page
- [ ] Valuation results page
- [ ] Dashboard integration

**Week 3: ML & Integration**
- [ ] ML model trained
- [ ] Model deployed to service
- [ ] End-to-end testing
- [ ] Performance optimization

**Week 4: Testing & Deployment**
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Production deployment

## Getting Help

- Review workflow documentation for architecture details
- Check implementation roadmap for code examples
- Review existing services for patterns
- Test endpoints incrementally

---

**Ready to start?** Begin with Track 5 (Database) and Track 1 (Backend API) as they're the foundation for everything else.

**Questions?** Refer to the detailed documentation in:
- `docs/PROPERTY-VALUATION-WORKFLOW.md`
- `docs/IMPLEMENTATION-ROADMAP.md`
