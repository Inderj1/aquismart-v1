# Supabase Auth + PostgreSQL Multi-tenancy Implementation Plan

## Overview
Migrate from custom JWT authentication to Supabase Auth with PostgreSQL Row-Level Security (RLS) for database-level multi-tenancy and role-based access control with buyer/seller user types.

## Current State Analysis

### Database
- **System:** PostgreSQL 16 (Alpine) in Docker
- **Client:** Native `pg` library (v8.11.5)
- **Architecture:** Multi-tenant with basic RLS enabled
- **Users Table:** No password field (designed for OAuth/OIDC)
- **Current Auth:** Custom JWT with roles array

### Authentication
- JWT-based with `JWT_SECRET` environment variable
- No local password storage or hashing
- Role-based authorization middleware
- Frontend currently using mock authentication

### Migration Context
- **No existing users or data to migrate**
- Clean slate implementation
- Can fully redesign auth architecture

---

## Target Architecture

### User Types
1. **Buyer** - Users searching for and evaluating properties
2. **Seller** - Users listing and managing properties

### Multi-tenancy Model
- Tenant-level isolation via PostgreSQL RLS
- Each user belongs to one tenant
- Row-level security enforces data isolation
- User type (buyer/seller) determines feature access

### Authentication Flow
```
User → Supabase Auth (Login/Signup) → JWT Token → Backend Middleware →
Database (RLS Context) → Filtered Data Response
```

---

## Implementation Steps

### Phase 1: Database Schema Updates

#### File: `backend/svc-catalog/schema.sql`

**1.1 Add User Type Enum**
```sql
CREATE TYPE user_type AS ENUM ('buyer', 'seller');
```

**1.2 Update Users Table**
```sql
ALTER TABLE users ADD COLUMN user_type user_type NOT NULL;
ALTER TABLE users ADD COLUMN supabase_user_id UUID UNIQUE;
ALTER TABLE users ADD COLUMN metadata JSONB DEFAULT '{}';
```

**1.3 Create RLS Helper Functions**
```sql
-- Get current user's tenant ID from JWT
CREATE OR REPLACE FUNCTION auth.current_tenant_id()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'tenant_id', '')::uuid;
$$ LANGUAGE SQL STABLE;

-- Get current user's type
CREATE OR REPLACE FUNCTION auth.current_user_type()
RETURNS user_type AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'user_type', '')::user_type;
$$ LANGUAGE SQL STABLE;

-- Get current user's ID
CREATE OR REPLACE FUNCTION auth.current_user_id()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$ LANGUAGE SQL STABLE;
```

**1.4 Update RLS Policies for All Tables**

Example for properties table:
```sql
-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see properties in their tenant
CREATE POLICY tenant_isolation_policy ON properties
  FOR ALL
  USING (tenant_id = auth.current_tenant_id());

-- Policy: Only sellers can insert/update properties
CREATE POLICY seller_write_policy ON properties
  FOR INSERT
  WITH CHECK (
    tenant_id = auth.current_tenant_id() AND
    auth.current_user_type() = 'seller'
  );

CREATE POLICY seller_update_policy ON properties
  FOR UPDATE
  USING (
    tenant_id = auth.current_tenant_id() AND
    auth.current_user_type() = 'seller' AND
    created_by = auth.current_user_id()
  );

-- Policy: Buyers can read all properties in tenant
CREATE POLICY buyer_read_policy ON properties
  FOR SELECT
  USING (
    tenant_id = auth.current_tenant_id() AND
    auth.current_user_type() = 'buyer'
  );
```

Apply similar patterns to:
- `user_saved_properties` (buyers only)
- `property_valuations` (buyers only)
- `documents` (sellers can upload, buyers can view)
- `kpis`, `kpi_values` (based on access requirements)
- All other tenant-scoped tables

**1.5 Create Indexes for RLS Performance**
```sql
CREATE INDEX idx_users_supabase_user_id ON users(supabase_user_id);
CREATE INDEX idx_users_tenant_user_type ON users(tenant_id, user_type);
CREATE INDEX idx_properties_tenant_status ON properties(tenant_id, property_status);
```

---

### Phase 2: Supabase Setup

#### 2.1 Choose Deployment Option

**Option A: Supabase Cloud (Recommended for faster setup)**
- Create project at https://supabase.com
- Use hosted authentication service
- Managed database backups and scaling

**Option B: Self-hosted Supabase**
- Add Supabase services to `docker-compose.yml`
- More control, runs alongside existing services
- Requires more infrastructure management

#### 2.2 Configure Supabase Project

**Authentication Settings:**
- Enable Email/Password authentication
- Configure email templates
- Set up password policies
- Enable email confirmations (optional)

**User Metadata Schema:**
```json
{
  "tenant_id": "uuid",
  "user_type": "buyer | seller",
  "tenant_name": "string",
  "company_name": "string (optional for sellers)"
}
```

**JWT Configuration:**
- Copy JWT secret from Supabase project settings
- Set JWT expiration (default: 1 hour)
- Configure refresh token rotation

#### 2.3 Database Connection

**If using Supabase Cloud:**
- Use Supabase's PostgreSQL connection string
- Migrate schema to Supabase database
- OR use database webhooks to sync with existing PostgreSQL

**If self-hosting:**
- Point Supabase to existing PostgreSQL instance
- Share database between Supabase Auth and application

---

### Phase 3: Environment Configuration

#### File: `.env` (root and backend services)

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Database (if using existing PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acquismart
DB_USER=acquismart
DB_PASSWORD=changeme

# Remove old JWT_SECRET (replaced by Supabase)
# JWT_SECRET=change-in-production
```

#### File: `docker-compose.yml`

**Option 1: Using Supabase Cloud**
- No changes needed, use cloud endpoints

**Option 2: Self-hosted Supabase**
```yaml
services:
  # Add Supabase services
  supabase-auth:
    image: supabase/gotrue:latest
    environment:
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://acquismart:changeme@db:5432/acquismart
      GOTRUE_SITE_URL: http://localhost:3000
      GOTRUE_JWT_SECRET: ${SUPABASE_JWT_SECRET}
      GOTRUE_JWT_EXP: 3600
    ports:
      - "9999:9999"
    depends_on:
      - db

  supabase-rest:
    image: postgrest/postgrest:latest
    environment:
      PGRST_DB_URI: postgres://acquismart:changeme@db:5432/acquismart
      PGRST_JWT_SECRET: ${SUPABASE_JWT_SECRET}
    ports:
      - "3001:3000"
    depends_on:
      - db
```

---

### Phase 4: Backend Updates

#### File: `backend/svc-catalog/package.json`

Add dependencies:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "jose": "^5.2.0"
  }
}
```

#### File: `backend/shared/middleware/auth.ts`

Replace entire file:
```typescript
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import * as jose from 'jose';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    email: string;
    userType: 'buyer' | 'seller';
    supabaseUserId: string;
  };
}

/**
 * Middleware to authenticate requests using Supabase JWT
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);

    // Verify JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Extract user metadata
    const userMetadata = user.user_metadata || {};
    const tenantId = userMetadata.tenant_id;
    const userType = userMetadata.user_type;

    if (!tenantId || !userType) {
      return res.status(401).json({
        error: 'User profile incomplete. Missing tenant or user type.'
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      tenantId: tenantId,
      email: user.email!,
      userType: userType,
      supabaseUserId: user.id
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to authorize based on user type
 */
export const authorizeUserType = (...allowedTypes: Array<'buyer' | 'seller'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        error: `Access denied. Required user type: ${allowedTypes.join(' or ')}`
      });
    }

    next();
  };
};

export type { AuthenticatedRequest };
```

#### File: `backend/svc-catalog/src/db/client.ts`

Add RLS context setting:
```typescript
import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'acquismart',
  user: process.env.DB_USER || 'acquismart',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Set RLS context for the current session
 */
export async function setRLSContext(
  client: PoolClient,
  userId: string,
  tenantId: string,
  userType: 'buyer' | 'seller'
) {
  await client.query(`
    SELECT set_config('request.jwt.claims', $1::text, true)
  `, [JSON.stringify({
    sub: userId,
    tenant_id: tenantId,
    user_type: userType
  })]);
}

/**
 * Execute query with RLS context
 */
export async function queryWithContext(
  text: string,
  params: any[],
  user: { id: string; tenantId: string; userType: 'buyer' | 'seller' }
) {
  const client = await pool.connect();
  try {
    await setRLSContext(client, user.id, user.tenantId, user.userType);
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

export async function getClient() {
  return await pool.connect();
}

export default pool;
```

#### File: `backend/svc-catalog/src/routes/properties.ts`

Update route handlers:
```typescript
import express from 'express';
import { authenticate, authorizeUserType, AuthenticatedRequest } from '../../../shared/middleware/auth';
import { queryWithContext } from '../db/client';

const router = express.Router();

// Buyers can search and view properties
router.get('/search', authenticate, authorizeUserType('buyer'), async (req: AuthenticatedRequest, res) => {
  try {
    const result = await queryWithContext(
      'SELECT * FROM properties WHERE property_status = $1',
      ['active'],
      req.user!
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Sellers can list new properties
router.post('/', authenticate, authorizeUserType('seller'), async (req: AuthenticatedRequest, res) => {
  try {
    const { address, city, state, list_price, ...otherFields } = req.body;

    const result = await queryWithContext(
      `INSERT INTO properties
       (tenant_id, address, city, state, list_price, created_by, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user!.tenantId, address, city, state, list_price, req.user!.id, req.user!.id],
      req.user!
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Buyers can save properties
router.post('/:id/save', authenticate, authorizeUserType('buyer'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const result = await queryWithContext(
      `INSERT INTO user_saved_properties (user_id, property_id, notes, tags)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, property_id) DO NOTHING
       RETURNING *`,
      [req.user!.id, id, req.body.notes || null, req.body.tags || []],
      req.user!
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save property' });
  }
});

export default router;
```

Apply similar patterns to all routes in:
- `backend/svc-catalog/src/routes/`
- Update all route files to use new middleware

---

### Phase 5: Frontend Integration

#### File: `package.json` (root/app)

Add Supabase client:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-ui-react": "^0.4.7",
    "@supabase/auth-ui-shared": "^0.1.8"
  }
}
```

#### File: `app/lib/supabase.ts` (new file)

```typescript
import { createClientComponentClient } from '@supabase/supabase-js';

export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});
```

#### File: `app/components/auth/SignUp.tsx` (new file)

```typescript
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer');
  const [tenantName, setTenantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            tenant_name: tenantName,
          },
        },
      });

      if (error) throw error;

      // Redirect or show success message
      console.log('User created:', data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={tenantName}
        onChange={(e) => setTenantName(e.target.value)}
        placeholder="Company/Tenant Name"
        required
      />
      <select value={userType} onChange={(e) => setUserType(e.target.value as 'buyer' | 'seller')}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

#### File: `app/components/auth/SignIn.tsx` (new file)

```typescript
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect based on user type
      const userType = data.user?.user_metadata?.user_type;
      if (userType === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/buyer/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

#### File: `app/middleware.ts` (new file)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/seller/:path*', '/buyer/:path*'],
};
```

#### Update API Calls

Replace all API calls to include Supabase session token:
```typescript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch('/api/properties', {
  headers: {
    'Authorization': `Bearer ${session?.access_token}`,
  },
});
```

---

### Phase 6: Database Migration & Sync

#### Create Database Trigger for User Sync

When a user signs up via Supabase, automatically create a record in the users table:

```sql
-- Function to sync Supabase users to users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  -- Create tenant if tenant_name is provided
  IF NEW.raw_user_meta_data->>'tenant_name' IS NOT NULL THEN
    INSERT INTO tenants (name, domain)
    VALUES (
      NEW.raw_user_meta_data->>'tenant_name',
      NEW.email
    )
    RETURNING id INTO new_tenant_id;
  END IF;

  -- Insert user record
  INSERT INTO public.users (
    id,
    supabase_user_id,
    tenant_id,
    email,
    name,
    user_type,
    metadata
  ) VALUES (
    gen_random_uuid(),
    NEW.id,
    new_tenant_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    (NEW.raw_user_meta_data->>'user_type')::user_type,
    NEW.raw_user_meta_data
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on Supabase auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### Phase 7: Testing & Validation

#### Unit Tests
- Test Supabase JWT verification
- Test RLS policies with different user types
- Test tenant isolation

#### Integration Tests
- Test complete signup flow (buyer & seller)
- Test login and token refresh
- Test buyer-specific operations (save properties, valuations)
- Test seller-specific operations (list properties, analytics)
- Test cross-tenant data isolation
- Test unauthorized access attempts

#### Security Tests
- Verify RLS policies prevent cross-tenant access
- Test JWT expiration and refresh
- Test invalid token handling
- Attempt to access seller endpoints as buyer (should fail)
- Attempt to access buyer endpoints as seller (should fail)

---

### Phase 8: Cleanup

#### Remove Old Authentication Code
- Delete custom JWT generation logic
- Remove `JWT_SECRET` environment variable
- Clean up old authentication middleware (if backed up)
- Update documentation

#### Update Documentation
- Update README.md with Supabase setup instructions
- Document user types and permissions
- Add API authentication examples
- Update deployment guide

---

## Environment Variables Summary

### Backend Services
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Database (existing)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acquismart
DB_USER=acquismart
DB_PASSWORD=changeme
```

### Frontend (Next.js)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## User Permissions Matrix

| Feature | Buyer | Seller |
|---------|-------|--------|
| View properties | ✓ | ✓ |
| Save properties | ✓ | ✗ |
| Request valuations | ✓ | ✗ |
| View saved properties | ✓ (own) | ✗ |
| List new properties | ✗ | ✓ |
| Edit own properties | ✗ | ✓ |
| View property analytics | ✗ | ✓ (own) |
| Upload documents | ✗ | ✓ |
| View all tenant users | ✓ (admin) | ✓ (admin) |

---

## RLS Policy Examples

### Properties Table
- **Tenant Isolation:** All users see only their tenant's properties
- **Sellers:** Can INSERT/UPDATE properties they created
- **Buyers:** Read-only access to all tenant properties

### User Saved Properties Table
- **Buyers Only:** Can INSERT/SELECT their own saved properties
- **Tenant Isolation:** Can only save properties from their tenant

### Property Valuations Table
- **Buyers Only:** Can request and view their own valuations
- **Tenant Isolation:** Valuations scoped to tenant

### Documents Table
- **Sellers:** Can upload documents for their properties
- **Buyers:** Read-only access to property documents
- **Tenant Isolation:** Documents scoped to tenant

---

## Migration Checklist

- [ ] Create user_type enum in database
- [ ] Update users table schema
- [ ] Create RLS helper functions
- [ ] Implement RLS policies for all tables
- [ ] Create performance indexes
- [ ] Set up Supabase project
- [ ] Configure authentication providers
- [ ] Add Supabase environment variables
- [ ] Update docker-compose.yml (if self-hosting)
- [ ] Install Supabase dependencies (backend)
- [ ] Update authentication middleware
- [ ] Update database client with RLS context
- [ ] Update all route handlers
- [ ] Install Supabase dependencies (frontend)
- [ ] Create Supabase client configuration
- [ ] Build SignUp component
- [ ] Build SignIn component
- [ ] Create auth middleware for Next.js
- [ ] Update all API calls with auth tokens
- [ ] Create user sync trigger
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Perform security testing
- [ ] Remove old authentication code
- [ ] Update documentation
- [ ] Deploy and verify

---

## Rollback Plan

If issues arise during implementation:

1. **Database:** Keep old schema alongside new (don't drop columns immediately)
2. **Backend:** Feature flag to switch between old JWT and Supabase
3. **Frontend:** Keep old mock auth as fallback
4. **Docker:** Maintain separate environment files for old/new config

---

## Post-Implementation Monitoring

### Metrics to Track
- Authentication success/failure rates
- Token refresh patterns
- RLS policy performance impact
- Database query performance
- User signup conversion by type (buyer vs seller)

### Logging
- Failed authentication attempts
- RLS policy violations
- Cross-tenant access attempts
- Performance bottlenecks

---

## Additional Features (Future Enhancements)

1. **Multi-factor Authentication (MFA)** via Supabase
2. **Social Login** (Google, LinkedIn, etc.)
3. **Magic Link** authentication (passwordless)
4. **Admin User Type** for tenant management
5. **Team Member Invitations** within tenants
6. **Audit Logging** for sensitive operations
7. **Session Management** with device tracking
8. **Password Reset** flows
9. **Email Verification** enforcement
10. **Rate Limiting** on authentication endpoints

---

## Support & Resources

- **Supabase Documentation:** https://supabase.com/docs
- **PostgreSQL RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **Auth Helpers:** https://supabase.com/docs/guides/auth/auth-helpers
- **Supabase JS Client:** https://supabase.com/docs/reference/javascript

---

## Questions or Issues

If you encounter any issues during implementation:

1. Check Supabase project logs for authentication errors
2. Verify JWT secret matches between Supabase and backend
3. Test RLS policies in PostgreSQL console directly
4. Enable debug logging in authentication middleware
5. Verify environment variables are loaded correctly
