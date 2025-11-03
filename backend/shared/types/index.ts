// Core domain types shared across all services

export interface BaseEntity {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  asOf?: Date;
}

// Document types
export interface Document extends BaseEntity {
  path: string;
  hash: string;
  type: DocumentType;
  period?: string;
  status: DocumentStatus;
  metadata: Record<string, any>;
}

export enum DocumentType {
  CAPITAL_ACCOUNT = 'capital_account',
  QUARTERLY_FINANCIALS = 'quarterly_financials',
  LOAN_AGREEMENT = 'loan_agreement',
  COVENANT_CALC = 'covenant_calc',
  BOARD_DECK = 'board_deck',
  OTHER = 'other'
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  CLASSIFIED = 'classified',
  EXTRACTED = 'extracted',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  FAILED = 'failed'
}

// Entity types
export interface Firm extends BaseEntity {
  name: string;
  lei?: string;
  country: string;
  sector?: string;
  website?: string;
}

export interface Fund extends BaseEntity {
  name: string;
  firmId: string;
  vintage: number;
  fundSize: number;
  currency: string;
  strategy: FundStrategy;
}

export enum FundStrategy {
  BUYOUT = 'buyout',
  VENTURE = 'venture',
  GROWTH = 'growth',
  CREDIT = 'credit',
  REAL_ESTATE = 'real_estate',
  INFRASTRUCTURE = 'infrastructure'
}

export interface PortfolioCompany extends BaseEntity {
  name: string;
  fundId: string;
  sector: string;
  country: string;
  investmentDate: Date;
  exitDate?: Date;
  status: InvestmentStatus;
}

export enum InvestmentStatus {
  ACTIVE = 'active',
  EXITED = 'exited',
  WRITTEN_OFF = 'written_off'
}

// KPI types
export interface KPI extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  unit: string;
  category: KPICategory;
  calculationMethod?: string;
}

export enum KPICategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  ESG = 'esg',
  CUSTOM = 'custom'
}

export interface KPIValue extends BaseEntity {
  kpiId: string;
  entityId: string;
  entityType: string;
  value: number;
  date: Date;
  currency?: string;
  sourceRef: SourceReference;
  confidence: number;
}

// Extraction and provenance
export interface ExtractedField extends BaseEntity {
  documentId: string;
  entityRef?: string;
  key: string;
  value: string;
  unit?: string;
  confidence: number;
  bbox: BoundingBox;
  pageRef: number;
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SourceReference {
  documentId: string;
  pageNumber: number;
  bbox?: BoundingBox;
  extractionMethod: string;
  hash: string;
}

// Valuation types
export interface Valuation extends BaseEntity {
  entityId: string;
  entityType: string;
  method: ValuationMethod;
  status: ValuationStatus;
  asOfDate: Date;
  scenarioId?: string;
  inputs: Record<string, any>;
  outputs: ValuationOutput;
  approvals: Approval[];
}

export enum ValuationMethod {
  INCOME_DCF = 'income_dcf',
  MARKET_COMPS = 'market_comps',
  HYBRID = 'hybrid',
  CREDIT_WATERFALL = 'credit_waterfall',
  TRANSACTION_BASED = 'transaction_based'
}

export enum ValuationStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PUBLISHED = 'published'
}

export interface ValuationOutput {
  fairValue: number;
  currency: string;
  confidence: number;
  sensitivities?: Record<string, number>;
  driverAttribution?: DriverAttribution[];
  comparables?: Comparable[];
}

export interface DriverAttribution {
  driver: string;
  contribution: number;
  percentage: number;
  shapValue?: number;
}

export interface Comparable {
  companyId: string;
  name: string;
  metrics: Record<string, number>;
  similarityScore: number;
}

// Workflow types
export interface WorkItem extends BaseEntity {
  type: WorkItemType;
  title: string;
  description?: string;
  assigneeId?: string;
  dueAt?: Date;
  priority: Priority;
  status: WorkItemStatus;
  relatedEntityId?: string;
  relatedEntityType?: string;
  metadata: Record<string, any>;
}

export enum WorkItemType {
  RECONCILIATION = 'reconciliation',
  ENTITY_MAPPING = 'entity_mapping',
  VALUATION_REVIEW = 'valuation_review',
  COVENANT_REVIEW = 'covenant_review',
  DATA_QUALITY = 'data_quality'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum WorkItemStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Approval extends BaseEntity {
  workItemId?: string;
  approverIdRequired: string;
  approverId?: string;
  approvedAt?: Date;
  status: ApprovalStatus;
  comments?: string;
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: Date;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// Search types
export interface SearchQuery {
  query: string;
  filters?: SearchFilter[];
  sort?: SortOption[];
  pagination?: PaginationInput;
}

export interface SearchFilter {
  field: string;
  operator: FilterOperator;
  value: any;
}

export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  CONTAINS = 'contains',
  IN = 'in'
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationInput {
  page: number;
  pageSize: number;
}

// Audit types
export interface AuditEvent {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// Property types
export interface Property extends BaseEntity {
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

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  MULTI_FAMILY = 'multi_family',
  LAND = 'land',
  COMMERCIAL = 'commercial'
}

export enum PropertyStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SOLD = 'sold',
  OFF_MARKET = 'off_market'
}

export interface PropertyFeatures {
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

export interface PropertyValuation extends BaseEntity {
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

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  savedAt: Date;
  notes?: string;
  tags?: string[];
}
