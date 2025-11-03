# AcquiSmart AI Architecture

## Overview
AcquiSmart is an AI-first private equity platform with core focus on intelligent document processing, automated valuation, and risk analytics.

## AI/ML Components

### 1. Document Intelligence Pipeline

#### 1.1 Document Classification
- **Model**: LayoutLMv3 / Donut
- **Purpose**: Classify GP documents into types
- **Categories**:
  - Capital account statements
  - Quarterly financial packages
  - Loan agreements
  - Covenant calculations
  - Board decks
- **Accuracy Target**: >92%
- **Location**: `ml/models/document-classification/`

#### 1.2 OCR & Layout Analysis
- **Engine**: PaddleOCR (primary) + Tesseract (fallback)
- **Capabilities**:
  - Multi-language text extraction
  - Table detection and extraction (Table Transformer)
  - Multi-page table stitching
  - Bounding box coordinates for lineage
- **Output Format**:
```json
{
  "text": "Revenue Q3 2024",
  "value": "12.5M",
  "bbox": [x1, y1, x2, y2],
  "page": 3,
  "confidence": 0.95
}
```
- **Location**: `ml/models/ocr-pipeline/`

#### 1.3 Named Entity Recognition (Financial)
- **Model**: FinBERT fine-tuned / spaCy v3
- **Entities**:
  - COMPANY, FUND, METRIC, DATE, CURRENCY, NUMBER, PERCENTAGE, KPI
- **Training Data**: FinBERT base + 500+ annotated financial docs
- **F1 Target**: >88%
- **Location**: `ml/models/ner-financial/`

#### 1.4 Key-Value Extraction
- **Model**: LayoutLMv3 sequence labeling
- **Confidence Scoring**: Softmax probabilities + rule validation
- **Output**: Structured field extractions with provenance
- **Location**: `ml/models/key-value-extraction/`

### 2. Entity Resolution & Matching

#### 2.1 Fuzzy Matching
- **Algorithm**: RapidFuzz + Levenshtein distance
- **Blocking**: Locality-sensitive hashing (LSH)
- **ML Component**: XGBoost classifier (match/no-match)
- **Features**:
  - Name similarity score
  - LEI exact match
  - Country/sector alignment
  - Size similarity
- **Precision Target**: >85% @ 90% recall
- **Location**: `ml/models/entity-resolution/`

### 3. Valuation Intelligence

#### 3.1 Comparable Company Selector
- **Type**: Similarity-based retrieval
- **Algorithm**: KNN on feature embeddings
- **Features**: Sector, revenue, growth rate, geography, size
- **Outlier Removal**: IQR + Isolation Forest
- **Data Sources**: Capital IQ, PitchBook, Bloomberg
- **Location**: `ml/models/comparable-selector/`

#### 3.2 Explainable AI (Driver Attribution)
- **Framework**: SHAP (SHapley Additive exPlanations)
- **Purpose**: Explain valuation drivers
- **Output Example**: "Revenue growth contributed +$2.3M (18%) to valuation"
- **Integration**: All valuation models
- **Location**: `ml/inference/explainability/`

#### 3.3 Investment Memo Generation
- **Model**: GPT-4 / Claude 3.5 Sonnet
- **Framework**: LangChain with RAG
- **Input**: Structured valuation data + KPIs + source documents
- **Output**:
  - Executive summary
  - Key drivers analysis
  - Risk assessment
  - Recommendations
  - Auto-citations with bbox links
- **Approval Rate Target**: >80%
- **Location**: `backend/svc-ai-valuation/memo-generator/`

### 4. Credit Risk & Monitoring

#### 4.1 Covenant Breach Prediction
- **Model**: LSTM time-series classifier
- **Input**: Historical KPI trends + covenant terms
- **Output**: Probability of breach in 1/2/3 quarters
- **Recall Target**: >75% (minimize false negatives)
- **Location**: `ml/models/covenant-predictor/`

#### 4.2 Credit Risk Models
- **PD Model**: XGBoost on sector default curves
- **LGD Model**: Beta regression (0-100% loss)
- **EAD Model**: Linear regression on exposure
- **Training Data**: Historical defaults + Moody's/S&P curves
- **Location**: `ml/models/credit-risk/`

#### 4.3 Anomaly Detection
- **Models**:
  - Isolation Forest (multivariate)
  - LSTM autoencoders (time-series)
- **Metrics Monitored**: Revenue, EBITDA, burn rate, covenant ratios
- **Output**: Anomaly score + flagged metrics
- **Location**: `ml/models/anomaly-detection/`

### 5. Semantic Search

#### 5.1 Dense Retrieval
- **Model**: Sentence-BERT / OpenAI embeddings
- **Index**: FAISS (vector similarity) + OpenSearch (hybrid)
- **Reranking**: Cross-encoder for top-k results
- **Query Types**:
  - Entity search
  - Document search
  - Field search with lineage
- **NDCG@10 Target**: >0.75
- **Location**: `ml/models/semantic-search/`

### 6. Advanced Features (Phase 4)

#### 6.1 Document Summarization
- **Model**: BART / T5 / GPT-4
- **Input**: 100+ page quarterly reports
- **Output**: 2-page executive summary with key metrics
- **Location**: `ml/models/summarization/`

#### 6.2 Benchmark Forecasting
- **Model**: Prophet / ARIMA
- **Input**: Historical benchmark series (MSCI, CEPRES, Preqin)
- **Output**: 1-3 year forecasts with confidence intervals
- **Location**: `ml/models/benchmark-forecast/`

#### 6.3 Smart Reconciliation Assistant
- **Model**: Fine-tuned T5 / GPT-4 few-shot
- **Input**: Extracted fields vs existing data
- **Output**: Suggested mappings + conflict resolution
- **Location**: `backend/svc-ai-document/reconciliation/`

---

## AI Services Architecture

### Service: svc-ai-document (Python/FastAPI)
**Port**: 8001

**Endpoints**:
- `POST /classify` - Document classification
- `POST /ocr` - OCR processing
- `POST /extract` - Key-value extraction
- `POST /summarize` - Document summarization

**Dependencies**:
- PyTorch, Transformers, PaddleOCR
- PostgreSQL (metadata), S3 (files)

### Service: svc-ai-entities (Python/FastAPI)
**Port**: 8002

**Endpoints**:
- `POST /resolve` - Entity resolution
- `POST /ner` - Named entity recognition
- `GET /search/semantic` - Semantic search

**Dependencies**:
- spaCy, FAISS, OpenSearch
- Redis (caching)

### Service: svc-ai-valuation (Python/FastAPI)
**Port**: 8003

**Endpoints**:
- `POST /comps/select` - Comparable selection
- `POST /explain` - Driver attribution (SHAP)
- `POST /memo/generate` - Investment memo generation

**Dependencies**:
- OpenAI/Anthropic API, LangChain
- SHAP, scikit-learn

### Service: svc-ai-risk (Python/FastAPI)
**Port**: 8004

**Endpoints**:
- `POST /covenant/predict` - Covenant breach prediction
- `POST /anomaly/detect` - Anomaly detection
- `POST /credit/score` - Credit risk scoring

**Dependencies**:
- PyTorch, XGBoost, Prophet
- Timescale (time-series data)

---

## ML Infrastructure

### Model Serving
- **Framework**: FastAPI microservices
- **Scaling**: Kubernetes HPA with GPU node pools (A10G/T4)
- **Caching**: Redis for frequent inferences
- **Monitoring**: Prometheus + Grafana

### Training Pipeline
- **Orchestration**: Kubeflow Pipelines / AWS SageMaker
- **Data Versioning**: DVC
- **Experiment Tracking**: MLflow
- **Model Registry**: MLflow with staging/prod promotion

### Feature Store
- **Platform**: Feast
- **Storage**: PostgreSQL (offline) + Redis (online)
- **Features**: Entity embeddings, KPI history, market data

### LLM Integration
- **Providers**: OpenAI GPT-4, Anthropic Claude 3.5 Sonnet
- **Framework**: LangChain (chains, agents, RAG)
- **Vector DB**: Pinecone / Weaviate
- **Prompt Management**: PromptLayer + version control

---

## Data Requirements

### Training Datasets
1. **Document Classification**: 2,000+ labeled documents (200/class min)
2. **NER**: 500+ annotated financial documents
3. **Entity Resolution**: 10,000+ firm/fund name pairs
4. **Credit Models**: 10+ years historical defaults (500+ loans)
5. **Valuation Comps**: Market database (Capital IQ, PitchBook)

### Synthetic Data
- LLM-generated synthetic GP reports for testing
- Data augmentation (back-translation, synonym replacement)
- Golden datasets: 500+ test cases for regression

---

## Tech Stack Summary

| Category | Technology |
|----------|-----------|
| **Document AI** | LayoutLMv3, PaddleOCR, Table Transformer |
| **NLP** | spaCy, HuggingFace Transformers, FinBERT |
| **LLM** | GPT-4, Claude 3.5, LangChain |
| **ML Models** | XGBoost, scikit-learn, PyTorch |
| **Time Series** | Prophet, LSTM, ARIMA |
| **Explainability** | SHAP, LIME |
| **Search** | Sentence-BERT, FAISS, OpenSearch |
| **Serving** | FastAPI, TorchServe |
| **MLOps** | MLflow, Kubeflow, DVC |

---

## Performance Metrics

| Model | Metric | Target |
|-------|--------|--------|
| Document Classification | Accuracy | >92% |
| OCR Extraction | Field F1 | >95% |
| NER | Entity F1 | >88% |
| Entity Resolution | Precision@90%R | >85% |
| Covenant Prediction | Recall | >75% |
| Memo Generation | Approval Rate | >80% |
| Semantic Search | NDCG@10 | >0.75 |

---

## Cost Estimates (Monthly)

| Component | Provider | Cost |
|-----------|----------|------|
| GPT-4 API (100K tokens/day) | OpenAI | $3,000 |
| Claude API | Anthropic | $1,500 |
| GPU instances (4x A10G) | AWS | $2,500 |
| Model serving (10 CPU pods) | AWS | $800 |
| OpenSearch (3 nodes) | AWS | $600 |
| MLflow | Self-hosted | $200 |
| **Total** | | **~$8,600** |

---

## Implementation Phases

### Phase 1 (Weeks 0-8): Foundation
- ✅ Document classification
- ✅ OCR pipeline
- ✅ NER for financial entities
- ✅ Key-value extraction
- ✅ Entity resolution
- ✅ MLflow setup

### Phase 2 (Weeks 8-16): Valuation
- ✅ Comparable selector
- ✅ SHAP attribution
- ✅ GPT-4 memo generation
- ✅ Semantic search

### Phase 3 (Weeks 16-24): Risk
- ✅ Covenant prediction
- ✅ Credit risk models
- ✅ Anomaly detection

### Phase 4 (Weeks 24-32): Advanced
- ✅ Document summarization
- ✅ Benchmark forecasting
- ✅ Smart reconciliation

---

## Security & Compliance

### Data Privacy
- PII/DLP field tagging + redaction
- KMS-managed encryption keys
- Row-level security per tenant

### Model Governance
- Model versioning + lineage
- A/B testing framework
- Performance monitoring + drift detection
- Audit logs for all predictions

### API Security
- Rate limiting per tenant
- API key rotation
- Input validation + sanitization
- Output filtering (no PII leakage)

---

*Last Updated: 2025-10-19*
