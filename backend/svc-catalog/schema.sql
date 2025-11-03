-- AcquiSmart Database Schema
-- PostgreSQL 16+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- Enums
CREATE TYPE document_type AS ENUM (
  'capital_account',
  'quarterly_financials',
  'loan_agreement',
  'covenant_calc',
  'board_deck',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'uploaded',
  'processing',
  'classified',
  'extracted',
  'reviewed',
  'approved',
  'failed'
);

CREATE TYPE fund_strategy AS ENUM (
  'buyout',
  'venture',
  'growth',
  'credit',
  'real_estate',
  'infrastructure'
);

CREATE TYPE investment_status AS ENUM (
  'active',
  'exited',
  'written_off'
);

CREATE TYPE kpi_category AS ENUM (
  'financial',
  'operational',
  'esg',
  'custom'
);

CREATE TYPE valuation_method AS ENUM (
  'income_dcf',
  'market_comps',
  'hybrid',
  'credit_waterfall',
  'transaction_based'
);

CREATE TYPE valuation_status AS ENUM (
  'draft',
  'review',
  'approved',
  'published'
);

CREATE TYPE work_item_type AS ENUM (
  'reconciliation',
  'entity_mapping',
  'valuation_review',
  'covenant_review',
  'data_quality'
);

CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE work_item_status AS ENUM (
  'pending',
  'in_progress',
  'blocked',
  'completed',
  'cancelled'
);

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE property_type AS ENUM (
  'single_family',
  'condo',
  'townhouse',
  'multi_family',
  'land',
  'commercial'
);

CREATE TYPE property_status AS ENUM (
  'active',
  'pending',
  'sold',
  'off_market'
);

-- Core entity tables

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  roles TEXT[] DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, email)
);

CREATE TABLE firms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(500) NOT NULL,
  lei VARCHAR(20),
  country VARCHAR(2),
  sector VARCHAR(100),
  website VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  as_of DATE
);

CREATE TABLE funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  firm_id UUID REFERENCES firms(id),
  name VARCHAR(500) NOT NULL,
  vintage INTEGER,
  fund_size NUMERIC(20, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  strategy fund_strategy,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  as_of DATE
);

CREATE TABLE portfolio_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  fund_id UUID REFERENCES funds(id),
  name VARCHAR(500) NOT NULL,
  sector VARCHAR(100),
  country VARCHAR(2),
  investment_date DATE,
  exit_date DATE,
  status investment_status DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  as_of DATE
);

-- Document management

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  path VARCHAR(1000) NOT NULL,
  hash VARCHAR(64) NOT NULL,
  type document_type,
  status document_status DEFAULT 'uploaded',
  period VARCHAR(20),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  as_of DATE
);

CREATE TABLE doc_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  text_content TEXT,
  ocr_confidence NUMERIC(5, 4),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id, page_number)
);

CREATE TABLE extracted_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  entity_ref UUID,
  key VARCHAR(255) NOT NULL,
  value TEXT,
  unit VARCHAR(50),
  confidence NUMERIC(5, 4),
  bbox JSONB, -- {x1, y1, x2, y2}
  page_ref INTEGER,
  extraction_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- KPIs and metrics

CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50),
  category kpi_category,
  calculation_method TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  UNIQUE(tenant_id, code)
);

CREATE TABLE kpi_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  kpi_id UUID NOT NULL REFERENCES kpis(id),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  value NUMERIC(20, 4),
  date DATE NOT NULL,
  currency VARCHAR(3),
  source_ref JSONB, -- {document_id, page, bbox, hash}
  confidence NUMERIC(5, 4),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  as_of DATE
);

-- Valuation

CREATE TABLE valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  method valuation_method,
  status valuation_status DEFAULT 'draft',
  as_of_date DATE NOT NULL,
  scenario_id UUID,
  inputs JSONB DEFAULT '{}',
  outputs JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE valuation_comparables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  valuation_id UUID NOT NULL REFERENCES valuations(id) ON DELETE CASCADE,
  company_id UUID,
  name VARCHAR(500),
  metrics JSONB DEFAULT '{}',
  similarity_score NUMERIC(5, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflows

CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  type work_item_type NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES users(id),
  due_at TIMESTAMP,
  priority priority DEFAULT 'medium',
  status work_item_status DEFAULT 'pending',
  related_entity_id UUID,
  related_entity_type VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  work_item_id UUID REFERENCES work_items(id),
  approver_id_required UUID NOT NULL REFERENCES users(id),
  approver_id UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  status approval_status DEFAULT 'pending',
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance

CREATE INDEX idx_documents_tenant_type ON documents(tenant_id, type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_hash ON documents(hash);

CREATE INDEX idx_extracted_fields_document ON extracted_fields(document_id);
CREATE INDEX idx_extracted_fields_entity ON extracted_fields(entity_ref);
CREATE INDEX idx_extracted_fields_key ON extracted_fields(key);

CREATE INDEX idx_kpi_values_entity ON kpi_values(entity_id, entity_type);
CREATE INDEX idx_kpi_values_date ON kpi_values(date DESC);
CREATE INDEX idx_kpi_values_kpi_date ON kpi_values(kpi_id, date DESC);

CREATE INDEX idx_valuations_entity ON valuations(entity_id, entity_type);
CREATE INDEX idx_valuations_status ON valuations(status);
CREATE INDEX idx_valuations_date ON valuations(as_of_date DESC);

CREATE INDEX idx_work_items_assignee ON work_items(assignee_id, status);
CREATE INDEX idx_work_items_status ON work_items(status);

CREATE INDEX idx_audit_events_tenant_time ON audit_events(tenant_id, timestamp DESC);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);

-- Full-text search indexes
CREATE INDEX idx_firms_name_trgm ON firms USING gin(name gin_trgm_ops);
CREATE INDEX idx_portfolio_companies_name_trgm ON portfolio_companies USING gin(name gin_trgm_ops);

-- Row-level security policies (tenant isolation)
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON firms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funds_updated_at BEFORE UPDATE ON funds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_companies_updated_at BEFORE UPDATE ON portfolio_companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_items_updated_at BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Property valuation tables

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'USA',

  -- Property characteristics
  property_type property_type NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC(3, 1) NOT NULL,
  sqft INTEGER NOT NULL,
  lot_size INTEGER,
  year_built INTEGER,

  -- Location
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  neighborhood VARCHAR(200),

  -- Pricing
  list_price NUMERIC(15, 2),
  last_sale_price NUMERIC(15, 2),
  last_sale_date DATE,

  -- Features (stored as JSONB for flexibility)
  features JSONB DEFAULT '{}',

  -- Media
  photos TEXT[],
  description TEXT,

  -- Status
  status property_status DEFAULT 'active',
  listed_at TIMESTAMP,

  -- Standard audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  as_of DATE
);

CREATE TABLE property_valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  user_id UUID NOT NULL REFERENCES users(id),

  method valuation_method NOT NULL,
  estimated_value NUMERIC(15, 2) NOT NULL,
  confidence NUMERIC(5, 4) NOT NULL,

  -- Analysis results
  comparables JSONB, -- Array of comparable properties
  driver_attribution JSONB, -- SHAP values
  price_range JSONB, -- {low, high}

  -- Metadata
  model_version VARCHAR(50) NOT NULL,
  valuation_date TIMESTAMP NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  as_of DATE
);

CREATE TABLE user_saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  tags TEXT[],

  CONSTRAINT unique_user_property UNIQUE(user_id, property_id)
);

-- Property indexes
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(list_price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);

CREATE INDEX idx_property_valuations_property ON property_valuations(property_id);
CREATE INDEX idx_property_valuations_user ON property_valuations(user_id);
CREATE INDEX idx_property_valuations_date ON property_valuations(valuation_date DESC);

CREATE INDEX idx_saved_properties_user ON user_saved_properties(user_id);
CREATE INDEX idx_saved_properties_property ON user_saved_properties(property_id);

-- Full-text search on property addresses
CREATE INDEX idx_properties_address_trgm ON properties USING gin(address gin_trgm_ops);
CREATE INDEX idx_properties_city_trgm ON properties USING gin(city gin_trgm_ops);

-- Enable RLS for properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_valuations ENABLE ROW LEVEL SECURITY;

-- Trigger for updated_at on properties
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
