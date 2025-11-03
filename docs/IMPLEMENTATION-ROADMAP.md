# Property Valuation Platform - Implementation Roadmap

## Executive Summary

This roadmap outlines the step-by-step implementation plan for adding property valuation capabilities to the AcquiSmart platform. The implementation leverages existing microservices architecture and follows an organized, phased approach.

## Project Status

### ✅ Completed
- [x] Architecture analysis and audit
- [x] Comprehensive workflow documentation created
- [x] Property data types added to shared types system
- [x] Navbar authentication flow (Dashboard/Sign In button)

### 🔄 In Progress
- [ ] Backend API endpoints
- [ ] Frontend components
- [ ] ML model integration

### 📋 Planned
- [ ] Database migrations
- [ ] Authentication integration
- [ ] Testing suite
- [ ] Deployment

## Architecture Overview

### Leveraging Existing Infrastructure

**✅ What We Already Have:**
- Microservices architecture with API gateway
- JWT-based authentication system
- Role-based authorization middleware
- TypeScript shared types
- ML/AI services infrastructure
- Next.js frontend with dashboard
- PostgreSQL database with audit trails

**🎯 What We're Building:**
- Property search and catalog
- AI-powered property valuations
- User property management
- Valuation history tracking

## Implementation Phases

### Phase 1: Backend Foundation (Days 1-5)

#### Day 1-2: Catalog Service Extensions
**File**: `backend/svc-catalog/src/routes/properties.ts`

```typescript
import express from 'express';
import { authenticate } from '../../../shared/middleware/auth';
import { Property, ApiResponse } from '../../../shared/types';

const router = express.Router();

// Public endpoints
router.get('/search', searchProperties);
router.get('/:id', getPropertyDetails);

// Protected endpoints
router.post('/:id/save', authenticate, saveProperty);
router.get('/users/me/properties', authenticate, getUserProperties);

export default router;
```

**Tasks:**
- [x] Create routes/properties.ts
- [ ] Implement property search logic
- [ ] Add PostgreSQL queries
- [ ] Create property service layer
- [ ] Add validation middleware

#### Day 3-4: Valuation Service Integration
**File**: `backend/svc-valuation/src/routes/propertyValuation.ts`

```typescript
import express from 'express';
import { authenticate } from '../../../shared/middleware/auth';
import { PropertyValuation } from '../../../shared/types';

const router = express.Router();

router.post('/property', authenticate, async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user!.id;

  // Call AI service
  const aiValuation = await callAIValuationService(propertyId);

  // Store results
  const valuation = await saveValuation({
    propertyId,
    userId,
    ...aiValuation
  });

  res.json({
    success: true,
    data: valuation
  });
});

export default router;
```

**Tasks:**
- [ ] Create property valuation endpoint
- [ ] Integrate with svc-ai-valuation
- [ ] Implement result storage
- [ ] Add error handling
- [ ] Create valuation history endpoint

#### Day 5: API Gateway Configuration
**File**: `backend/platform-gateway/src/index.ts`

**Update routes:**
```typescript
app.use('/api/v1/catalog/properties', createProxy('http://svc-catalog:3002/properties'));
app.use('/api/v1/valuation/property', authenticate, createProxy('http://svc-valuation:3004/property'));
```

**Tasks:**
- [ ] Add property routes to gateway
- [ ] Configure rate limiting
- [ ] Test authentication flow
- [ ] Update API documentation

### Phase 2: Frontend Components (Days 6-10)

#### Day 6-7: Property Search
**File**: `frontend/app/properties/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertySearch } from '@/components/properties/PropertySearch';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({});

  const handleSearch = async (query: string) => {
    const response = await fetch(`/api/v1/catalog/properties/search?q=${query}`);
    const data = await response.json();
    setProperties(data.data);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Property Search</h1>
      <PropertySearch onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
```

**Tasks:**
- [ ] Create PropertySearch component
- [ ] Create PropertyCard component
- [ ] Implement filter functionality
- [ ] Add pagination
- [ ] Responsive design

#### Day 8-9: Property Details & Valuation
**File**: `frontend/app/properties/[id]/page.tsx`

```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleGetValuation = async () => {
    if (!user) {
      sessionStorage.setItem('returnTo', `/properties/${params.id}/valuation`);
      router.push('/early-access?action=signin');
      return;
    }

    // Proceed with valuation
    router.push(`/properties/${params.id}/valuation`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Property details */}
      <Button onClick={handleGetValuation} size="lg">
        Get AI Valuation
      </Button>
    </div>
  );
}
```

**Tasks:**
- [ ] Create property details page
- [ ] Add photo gallery
- [ ] Implement valuation button
- [ ] Add authentication gate
- [ ] Create valuation results page

#### Day 10: Dashboard Integration
**File**: `frontend/app/dashboard/page.tsx`

**Add saved properties section:**
```typescript
// Add to existing dashboard
<Card className="mt-6">
  <CardHeader>
    <CardTitle>Saved Properties</CardTitle>
    <CardDescription>Properties you've saved for later</CardDescription>
  </CardHeader>
  <CardContent>
    <SavedPropertiesList />
  </CardContent>
</Card>
```

**Tasks:**
- [ ] Add saved properties section
- [ ] Create valuation history section
- [ ] Link to property pages
- [ ] Add quick actions

### Phase 3: ML Model Integration (Days 11-14)

#### Day 11-12: Property Valuation Model
**File**: `ml/models/property_valuation/model.py`

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
import shap

class PropertyValuationModel:
    def __init__(self):
        self.model = None
        self.feature_names = [
            'sqft', 'bedrooms', 'bathrooms', 'year_built',
            'lot_size', 'latitude', 'longitude'
        ]

    def extract_features(self, property_data: dict) -> np.ndarray:
        features = []
        for feature in self.feature_names:
            features.append(property_data.get(feature, 0))
        return np.array(features).reshape(1, -1)

    def predict(self, property_data: dict) -> dict:
        features = self.extract_features(property_data)
        prediction = self.model.predict(features)[0]

        # Calculate confidence
        confidence = self.calculate_confidence(features)

        # SHAP values for explainability
        explainer = shap.TreeExplainer(self.model)
        shap_values = explainer.shap_values(features)

        return {
            'estimated_value': float(prediction),
            'confidence': float(confidence),
            'driver_attribution': self.format_shap_values(shap_values[0])
        }
```

**Tasks:**
- [ ] Train/adapt ML model
- [ ] Implement feature engineering
- [ ] Add SHAP explainability
- [ ] Create comparable selection
- [ ] Model evaluation and tuning

#### Day 13: Deploy to AI Service
**File**: `backend/svc-ai-valuation/src/routes/property.ts`

```python
from fastapi import FastAPI, Depends
from models.property_valuation import PropertyValuationModel

app = FastAPI()
model = PropertyValuationModel()

@app.post("/api/valuation/property")
async def valuate_property(
    request: PropertyValuationRequest,
    user: User = Depends(get_current_user)
):
    property_data = await fetch_property(request.property_id)
    valuation = model.predict(property_data)

    return PropertyValuationResponse(
        property_id=request.property_id,
        **valuation
    )
```

**Tasks:**
- [ ] Create FastAPI endpoint
- [ ] Load trained model
- [ ] Add caching layer
- [ ] Implement error handling
- [ ] Performance optimization

#### Day 14: Testing & Validation
**Tasks:**
- [ ] Unit tests for model
- [ ] Integration tests
- [ ] Validate predictions
- [ ] Performance benchmarks
- [ ] Load testing

### Phase 4: Database & Migrations (Days 15-16)

#### Database Schema
**File**: `backend/svc-catalog/schema/properties.sql`

```sql
-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,

    property_type VARCHAR(50) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms NUMERIC(3,1) NOT NULL,
    sqft INTEGER NOT NULL,
    lot_size INTEGER,
    year_built INTEGER,

    latitude NUMERIC(10,7) NOT NULL,
    longitude NUMERIC(10,7) NOT NULL,
    neighborhood VARCHAR(200),

    list_price NUMERIC(15,2),
    last_sale_price NUMERIC(15,2),
    last_sale_date DATE,

    features JSONB,
    photos TEXT[],
    description TEXT,

    status VARCHAR(50) NOT NULL,
    listed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,

    CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_city ON properties(city, state);
CREATE INDEX idx_properties_status ON properties(status);

-- Property valuations table
CREATE TABLE property_valuations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    user_id UUID NOT NULL,

    method VARCHAR(50) NOT NULL,
    estimated_value NUMERIC(15,2) NOT NULL,
    confidence NUMERIC(5,4) NOT NULL,

    comparables JSONB,
    driver_attribution JSONB,
    price_range JSONB,

    model_version VARCHAR(50) NOT NULL,
    valuation_date TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,

    CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Saved properties junction table
CREATE TABLE user_saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    property_id UUID NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    tags TEXT[],

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT unique_user_property UNIQUE(user_id, property_id)
);
```

**Tasks:**
- [ ] Create migration scripts
- [ ] Test migrations
- [ ] Seed sample data
- [ ] Create indexes
- [ ] Set up backups

### Phase 5: Testing & Quality Assurance (Days 17-18)

#### Testing Strategy

**Unit Tests:**
```bash
backend/svc-catalog/tests/
├── unit/
│   ├── propertyService.test.ts
│   ├── searchLogic.test.ts
│   └── validation.test.ts
```

**Integration Tests:**
```bash
backend/tests/integration/
├── propertySearch.test.ts
├── valuationFlow.test.ts
└── authentication.test.ts
```

**E2E Tests:**
```bash
frontend/e2e/
├── propertySearch.spec.ts
├── valuationFlow.spec.ts
└── dashboard.spec.ts
```

**Tasks:**
- [ ] Write unit tests (80%+ coverage)
- [ ] Integration tests
- [ ] E2E tests with Playwright
- [ ] Load testing with k6
- [ ] Security testing

### Phase 6: Deployment (Days 19-20)

#### Deployment Checklist

**Infrastructure:**
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Secrets management setup
- [ ] Load balancer configured

**Services:**
- [ ] API Gateway deployed
- [ ] Catalog service deployed
- [ ] Valuation service deployed
- [ ] AI service deployed
- [ ] Frontend deployed

**Monitoring:**
- [ ] Application logs configured
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (DataDog/New Relic)
- [ ] Uptime monitoring

**Security:**
- [ ] SSL certificates
- [ ] Rate limiting active
- [ ] Authentication verified
- [ ] CORS configured
- [ ] Security headers

## Success Criteria

### Performance Metrics
- Property search: < 200ms response time
- Valuation generation: < 3 seconds
- Dashboard load: < 1 second
- ML model accuracy: > 85%

### User Experience
- Seamless authentication flow
- Clear valuation results
- Easy property saving
- Fast search experience

### Technical
- 80%+ test coverage
- Zero critical vulnerabilities
- API documentation complete
- Monitoring in place

## Risk Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| ML model accuracy | High | Extensive testing, confidence scores |
| API performance | Medium | Caching, optimization, load testing |
| Data quality | High | Validation, data cleansing |
| Authentication issues | High | Thorough testing, fallback mechanisms |

### Timeline Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | Medium | Strict MVP definition |
| Dependencies | Low | Parallel development where possible |
| Testing delays | Medium | Early testing, automated tests |

## Next Actions

### Immediate (This Week)
1. ✅ Review and approve workflow documentation
2. 🔄 Set up database migrations
3. 🔄 Implement catalog service endpoints
4. 🔄 Begin frontend property search page

### Short Term (Next 2 Weeks)
1. Complete backend API implementation
2. Build frontend components
3. Integrate ML model
4. Comprehensive testing

### Medium Term (Weeks 3-4)
1. User acceptance testing
2. Performance optimization
3. Documentation finalization
4. Production deployment

## Resources

### Documentation
- [Workflow Documentation](./PROPERTY-VALUATION-WORKFLOW.md)
- [API Architecture](./AI-ARCHITECTURE.md)
- [Shared Types](../backend/shared/types/index.ts)

### Key Files
- Shared types: `backend/shared/types/index.ts`
- API Gateway: `backend/platform-gateway/src/index.ts`
- Auth middleware: `backend/shared/middleware/auth.ts`

### Team
- Backend: Node.js/TypeScript developers
- Frontend: React/Next.js developers
- ML: Python/ML engineers
- DevOps: Infrastructure and deployment

---

**Document Version**: 1.0
**Last Updated**: 2025-11-01
**Status**: Active Development
**Next Review**: Weekly during implementation
