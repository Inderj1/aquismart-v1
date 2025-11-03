"use strict";
// Core domain types shared across all services
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyStatus = exports.PropertyType = exports.FilterOperator = exports.ApprovalStatus = exports.WorkItemStatus = exports.Priority = exports.WorkItemType = exports.ValuationStatus = exports.ValuationMethod = exports.KPICategory = exports.InvestmentStatus = exports.FundStrategy = exports.DocumentStatus = exports.DocumentType = void 0;
var DocumentType;
(function (DocumentType) {
    DocumentType["CAPITAL_ACCOUNT"] = "capital_account";
    DocumentType["QUARTERLY_FINANCIALS"] = "quarterly_financials";
    DocumentType["LOAN_AGREEMENT"] = "loan_agreement";
    DocumentType["COVENANT_CALC"] = "covenant_calc";
    DocumentType["BOARD_DECK"] = "board_deck";
    DocumentType["OTHER"] = "other";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["UPLOADED"] = "uploaded";
    DocumentStatus["PROCESSING"] = "processing";
    DocumentStatus["CLASSIFIED"] = "classified";
    DocumentStatus["EXTRACTED"] = "extracted";
    DocumentStatus["REVIEWED"] = "reviewed";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["FAILED"] = "failed";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var FundStrategy;
(function (FundStrategy) {
    FundStrategy["BUYOUT"] = "buyout";
    FundStrategy["VENTURE"] = "venture";
    FundStrategy["GROWTH"] = "growth";
    FundStrategy["CREDIT"] = "credit";
    FundStrategy["REAL_ESTATE"] = "real_estate";
    FundStrategy["INFRASTRUCTURE"] = "infrastructure";
})(FundStrategy || (exports.FundStrategy = FundStrategy = {}));
var InvestmentStatus;
(function (InvestmentStatus) {
    InvestmentStatus["ACTIVE"] = "active";
    InvestmentStatus["EXITED"] = "exited";
    InvestmentStatus["WRITTEN_OFF"] = "written_off";
})(InvestmentStatus || (exports.InvestmentStatus = InvestmentStatus = {}));
var KPICategory;
(function (KPICategory) {
    KPICategory["FINANCIAL"] = "financial";
    KPICategory["OPERATIONAL"] = "operational";
    KPICategory["ESG"] = "esg";
    KPICategory["CUSTOM"] = "custom";
})(KPICategory || (exports.KPICategory = KPICategory = {}));
var ValuationMethod;
(function (ValuationMethod) {
    ValuationMethod["INCOME_DCF"] = "income_dcf";
    ValuationMethod["MARKET_COMPS"] = "market_comps";
    ValuationMethod["HYBRID"] = "hybrid";
    ValuationMethod["CREDIT_WATERFALL"] = "credit_waterfall";
    ValuationMethod["TRANSACTION_BASED"] = "transaction_based";
})(ValuationMethod || (exports.ValuationMethod = ValuationMethod = {}));
var ValuationStatus;
(function (ValuationStatus) {
    ValuationStatus["DRAFT"] = "draft";
    ValuationStatus["REVIEW"] = "review";
    ValuationStatus["APPROVED"] = "approved";
    ValuationStatus["PUBLISHED"] = "published";
})(ValuationStatus || (exports.ValuationStatus = ValuationStatus = {}));
var WorkItemType;
(function (WorkItemType) {
    WorkItemType["RECONCILIATION"] = "reconciliation";
    WorkItemType["ENTITY_MAPPING"] = "entity_mapping";
    WorkItemType["VALUATION_REVIEW"] = "valuation_review";
    WorkItemType["COVENANT_REVIEW"] = "covenant_review";
    WorkItemType["DATA_QUALITY"] = "data_quality";
})(WorkItemType || (exports.WorkItemType = WorkItemType = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MEDIUM"] = "medium";
    Priority["HIGH"] = "high";
    Priority["URGENT"] = "urgent";
})(Priority || (exports.Priority = Priority = {}));
var WorkItemStatus;
(function (WorkItemStatus) {
    WorkItemStatus["PENDING"] = "pending";
    WorkItemStatus["IN_PROGRESS"] = "in_progress";
    WorkItemStatus["BLOCKED"] = "blocked";
    WorkItemStatus["COMPLETED"] = "completed";
    WorkItemStatus["CANCELLED"] = "cancelled";
})(WorkItemStatus || (exports.WorkItemStatus = WorkItemStatus = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EQUALS"] = "eq";
    FilterOperator["NOT_EQUALS"] = "ne";
    FilterOperator["GREATER_THAN"] = "gt";
    FilterOperator["LESS_THAN"] = "lt";
    FilterOperator["CONTAINS"] = "contains";
    FilterOperator["IN"] = "in";
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["SINGLE_FAMILY"] = "single_family";
    PropertyType["CONDO"] = "condo";
    PropertyType["TOWNHOUSE"] = "townhouse";
    PropertyType["MULTI_FAMILY"] = "multi_family";
    PropertyType["LAND"] = "land";
    PropertyType["COMMERCIAL"] = "commercial";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["ACTIVE"] = "active";
    PropertyStatus["PENDING"] = "pending";
    PropertyStatus["SOLD"] = "sold";
    PropertyStatus["OFF_MARKET"] = "off_market";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
//# sourceMappingURL=index.js.map