# Property Valuation Platform - Workflow Documentation

## Overview

This document outlines the organized workflow for adding property valuation capabilities to the AcquiSmart platform using the existing microservices architecture.

## Current Architecture Analysis

### Existing Services
- **Frontend**: Next.js app running on port 3344
- **API Gateway**: Express gateway on port 3000 with rate limiting and auth
- **Microservices**:
  - `svc-catalog`: Entity management (port 3002)
  - `svc-valuation`: Valuation logic (port 3004)
  - `svc-ai-valuation`: ML-powered valuations (port 8003)
- **Shared Infrastructure**:
  - JWT-based authentication
  - Role-based authorization
  - Comprehensive type system
  - Audit trail support

### Technology Stack
- **Frontend**: React/Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Node.js/TypeScript, Express
- **ML**: Python, FastAPI, ML models
- **Database**: PostgreSQL with row-level security
- **Auth**: JWT tokens

## Property Valuation Workflow

### User Journey

```
1. Landing Page
   ↓
2. Property Search (Public)
   - Search by address/location
   - Filter by price, bedrooms, etc.
   - View property cards
   ↓
3. Property Details (Public)
   - Basic property information
   - Photos, description
   - "Get AI Valuation" button
   ↓
4. Authentication Gate
   - If not logged in → Redirect to sign up/login
   - If logged in → Continue to valuation
   ↓
5. Valuation Request (Protected)
   - Submit property for AI valuation
   - Processing indicator
   ↓
6. Valuation Results (Protected)
   - Estimated value with confidence
   - Comparable properties
   - Driver attribution (SHAP values)
   - Save to dashboard option
   ↓
7. User Dashboard (Protected)
   - View all saved properties
   - Valuation history
   - Comparison tools
```

### API Endpoints

#### Public Endpoints
```
GET  /api/v1/catalog/properties/search
     Query params: q, city, minPrice, maxPrice, bedrooms, bathrooms
     Response: List of properties

GET  /api/v1/catalog/properties/:id
     Response: Property details
```

#### Protected Endpoints
```
POST /api/v1/ai/valuation/property
     Headers: Authorization: Bearer <token>
     Body: { propertyId, features }
     Response: Valuation results

POST /api/v1/catalog/properties/:id/save
     Headers: Authorization: Bearer <token>
     Response: Saved property confirmation

GET  /api/v1/catalog/users/me/properties
     Headers: Authorization: Bearer <token>
     Response: User's saved properties

GET  /api/v1/catalog/users/me/valuations
     Headers: Authorization: Bearer <token>
     Response: Valuation history
```

## Implementation Plan

### Phase 1: Data Models & Types (Week 1)

#### 1.1 Add Property Types
- Extend `shared/types/index.ts` with Property interface
- Add PropertyValuation type
- Add SavedProperty type

#### 1.2 Database Schema
- Create properties table
- Create property_valuations table
- Create user_saved_properties junction table

### Phase 2: Backend Services (Week 2-3)

#### 2.1 Catalog Service (`svc-catalog`)
- Property search endpoint
- Property details endpoint
- Save property endpoint
- User properties list endpoint

#### 2.2 Valuation Service Integration
- Connect to `svc-ai-valuation`
- Implement property valuation workflow
- Store valuation results

#### 2.3 API Gateway
- Route property endpoints
- Apply authentication middleware to protected routes

### Phase 3: Frontend (Week 3-4)

#### 3.1 Property Search Page
- Search interface with filters
- Property cards grid
- Map view (optional)

#### 3.2 Property Details Page
- Property information display
- Photo gallery
- "Get Valuation" CTA

#### 3.3 Authentication Integration
- Redirect to login if not authenticated
- Store intended destination
- Return after successful auth

#### 3.4 Valuation Results Page
- Display valuation with confidence
- Show comparable properties
- Driver attribution visualization
- Save property button

#### 3.5 Dashboard Enhancement
- Saved properties section
- Valuation history
- Quick access to saved properties

### Phase 4: ML Integration (Week 4-5)

#### 4.1 Property Valuation Model
- Train/adapt model for property valuations
- Feature engineering (location, size, amenities)
- Comparable selection algorithm

#### 4.2 Model Deployment
- Deploy to `svc-ai-valuation`
- API endpoint for predictions
- Confidence scoring

## Technical Specifications

### Property Data Model

```typescript
interface Property extends BaseEntity {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Property characteristics
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;

  // Location
  latitude: number;
  longitude: number;
  neighborhood?: string;

  // Pricing
  listPrice?: number;
  lastSalePrice?: number;
  lastSaleDate?: Date;

  // Features
  features: PropertyFeatures;

  // Media
  photos: string[];
  description?: string;

  // Status
  status: PropertyStatus;
  listedAt?: Date;
}

enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  MULTI_FAMILY = 'multi_family',
  LAND = 'land'
}

interface PropertyFeatures {
  parking?: number;
  garage?: boolean;
  pool?: boolean;
  hvac?: string;
  heating?: string;
  cooling?: string;
  appliances?: string[];
  flooring?: string[];
  amenities?: string[];
}

interface PropertyValuation extends BaseEntity {
  propertyId: string;
  userId: string;

  method: ValuationMethod;
  estimatedValue: number;
  confidence: number;

  // Analysis
  comparables?: Comparable[];
  driverAttribution?: DriverAttribution[];
  priceRange?: {
    low: number;
    high: number;
  };

  // Metadata
  modelVersion: string;
  valuationDate: Date;
}

interface SavedProperty {
  userId: string;
  propertyId: string;
  savedAt: Date;
  notes?: string;
  tags?: string[];
}
```

### Authentication Flow

```typescript
// Frontend: Check auth before valuation
const handleGetValuation = async (propertyId: string) => {
  const { user } = useAuth();

  if (!user) {
    // Store intended destination
    sessionStorage.setItem('returnTo', `/properties/${propertyId}/valuation`);
    router.push('/early-access?action=signin');
    return;
  }

  // Proceed with valuation
  const response = await fetch(`/api/v1/ai/valuation/property`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ propertyId })
  });

  const valuation = await response.json();
  // Display results
};
```

### ML Valuation Service

```python
# svc-ai-valuation endpoint
@app.post("/api/valuation/property")
async def valuate_property(
    request: PropertyValuationRequest,
    user: User = Depends(get_current_user)
):
    # Load property data
    property_data = await get_property(request.property_id)

    # Extract features
    features = extract_features(property_data)

    # Get prediction from model
    prediction = model.predict(features)
    confidence = calculate_confidence(features, prediction)

    # Find comparables
    comparables = find_comparable_properties(property_data, k=5)

    # Calculate driver attribution (SHAP)
    attribution = explain_prediction(model, features)

    # Save valuation
    valuation = await save_valuation(
        property_id=request.property_id,
        user_id=user.id,
        estimated_value=prediction,
        confidence=confidence,
        comparables=comparables,
        driver_attribution=attribution
    )

    return PropertyValuationResponse(
        valuation_id=valuation.id,
        estimated_value=prediction,
        confidence=confidence,
        price_range={
            "low": prediction * 0.9,
            "high": prediction * 1.1
        },
        comparables=comparables,
        driver_attribution=attribution
    )
```

## File Structure

```
acquimart-v1/
├── frontend/
│   ├── app/
│   │   ├── properties/
│   │   │   ├── page.tsx                    # Search page
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx               # Property details
│   │   │   │   └── valuation/
│   │   │   │       └── page.tsx           # Valuation results
│   │   └── dashboard/
│   │       ├── properties/
│   │       │   └── page.tsx               # Saved properties
│   │       └── valuations/
│   │           └── page.tsx               # Valuation history
│   ├── components/
│   │   ├── properties/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertySearch.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   └── ValuationResults.tsx
│   └── lib/
│       └── api/
│           └── properties.ts              # API client
│
├── backend/
│   ├── shared/
│   │   └── types/
│   │       └── index.ts                   # Add Property types
│   ├── svc-catalog/
│   │   └── src/
│   │       ├── routes/
│   │       │   └── properties.ts          # Property endpoints
│   │       └── services/
│   │           └── propertyService.ts     # Business logic
│   └── svc-ai-valuation/
│       └── src/
│           └── routes/
│               └── property.ts            # ML valuation endpoint
│
└── ml/
    ├── models/
    │   └── property_valuation/
    │       ├── model.pkl
    │       └── feature_config.json
    └── training/
        └── scripts/
            └── train_property_model.py
```

## Testing Strategy

### Unit Tests
- Property service methods
- Valuation calculations
- Authentication middleware

### Integration Tests
- End-to-end property search to valuation
- Authentication flow
- API endpoint contracts

### User Acceptance Tests
- User can search properties
- User must login to get valuation
- User can save properties
- User can view valuation history

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] ML model deployed
- [ ] API endpoints tested
- [ ] Authentication flows verified
- [ ] Frontend routes configured
- [ ] Error handling implemented
- [ ] Monitoring/logging setup
- [ ] Rate limiting configured
- [ ] Documentation updated

## Next Steps

1. **Review and approve this workflow**
2. **Set up development environment**
3. **Create database migrations**
4. **Implement backend services**
5. **Build frontend components**
6. **Train/deploy ML models**
7. **Test end-to-end flow**
8. **Deploy to staging**
9. **User testing**
10. **Production deployment**

## Success Metrics

- Property search latency < 200ms
- Valuation generation < 3 seconds
- ML model accuracy > 85%
- User authentication success rate > 95%
- Dashboard load time < 1 second

---

**Document Version**: 1.0
**Last Updated**: 2025-11-01
**Author**: Development Team
