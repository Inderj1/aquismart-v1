# AcquiSmart Platform

AI-powered private equity platform with intelligent document processing, automated valuation, and risk analytics.

## Project Structure

```
acquimart-v1/
├── frontend/                    # Next.js frontend application (Port 3344)
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   └── public/                 # Static assets
│
├── backend/                    # Backend microservices
│   ├── platform-gateway/      # API Gateway (Port 3000)
│   ├── svc-ingestion/         # Document ingestion service
│   ├── svc-catalog/           # Entity catalog service
│   ├── svc-monitoring/        # KPI monitoring service
│   ├── svc-valuation/         # Valuation service
│   ├── svc-reporting/         # Reporting service
│   ├── svc-ai-document/       # AI document processing (Port 8001)
│   ├── svc-ai-entities/       # AI entity resolution (Port 8002)
│   ├── svc-ai-valuation/      # AI valuation intelligence (Port 8003)
│   ├── svc-ai-risk/           # AI risk analytics (Port 8004)
│   └── shared/                # Shared types and utilities
│
├── ml/                        # Machine Learning models and training
│   ├── models/               # Trained models
│   ├── training/             # Training scripts and configs
│   └── inference/            # Model serving
│
├── infra/                    # Infrastructure as Code
│   ├── terraform/            # Terraform configurations
│   ├── kubernetes/           # Kubernetes manifests
│   └── docker/               # Docker configurations
│
└── docs/                     # Documentation
    └── AI-ARCHITECTURE.md    # AI/ML architecture documentation
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd acquimart-v1
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev  # Runs on port 3344
   ```

3. **Backend Services (Docker Compose)**
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration

   # Start all services
   docker-compose up -d

   # View logs
   docker-compose logs -f
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   docker-compose exec postgres psql -U acquismart -d acquismart -f /schema.sql
   ```

## Features

### 🏢 Core Platform
- AI-powered document processing
- Automated valuations
- Portfolio monitoring
- Risk analytics

### 🏠 Property Valuation (In Development)
- Property search and discovery
- AI-powered property valuations
- Comparable property analysis
- User property management and tracking

See [Property Valuation Documentation](./docs/PROPERTY-VALUATION-WORKFLOW.md) for details.

## Architecture

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI
- **Port**: 3344

### Backend Services

#### Platform Gateway (Port 3000)
- API Gateway and authentication
- Request routing and rate limiting
- OIDC/SAML integration

#### AI Services

**svc-ai-document (Port 8001)**
- Document classification (LayoutLMv3)
- OCR processing (PaddleOCR)
- Key-value extraction
- Document summarization

**svc-ai-entities (Port 8002)**
- Named Entity Recognition (FinBERT)
- Entity resolution (fuzzy matching)
- Semantic search (Sentence-BERT + FAISS)

**svc-ai-valuation (Port 8003)**
- Comparable company selection
- Driver attribution (SHAP)
- Investment memo generation (GPT-4/Claude)

**svc-ai-risk (Port 8004)**
- Covenant breach prediction (LSTM)
- Credit risk models (PD/LGD/EAD)
- Anomaly detection (Isolation Forest)

### Database Schema

PostgreSQL with:
- Tenant isolation (row-level security)
- Full audit trail
- Document lineage tracking
- Time-series KPI storage

See `backend/svc-catalog/schema.sql` for details.

## AI/ML Components

### Document Intelligence
- **Classification**: LayoutLMv3 (92%+ accuracy target)
- **OCR**: PaddleOCR + Tesseract
- **Table Extraction**: Table Transformer
- **NER**: FinBERT fine-tuned (88%+ F1 target)

### Valuation Intelligence
- **Comps Selection**: KNN + Isolation Forest
- **Explainability**: SHAP for driver attribution
- **Memo Generation**: GPT-4/Claude with RAG
- **Scenario Analysis**: Monte Carlo simulation

### Risk Analytics
- **Covenant Prediction**: LSTM time-series (75%+ recall target)
- **Credit Models**: XGBoost-based PD/LGD/EAD
- **Anomaly Detection**: Isolation Forest + LSTM autoencoders

See [AI Architecture Documentation](docs/AI-ARCHITECTURE.md) for comprehensive details.

## Development

### Running Services Individually

**Frontend**
```bash
cd frontend
npm run dev
```

**API Gateway**
```bash
cd backend/platform-gateway
npm install
npm run dev
```

**AI Document Service**
```bash
cd backend/svc-ai-document
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8001
```

### Training ML Models

```bash
cd ml/training
pip install -r requirements.txt

# Train document classifier
python scripts/train_document_classifier.py --config configs/document_classification.yaml
```

## Environment Variables

Create `.env` file in root directory:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acquismart
DB_USER=acquismart
DB_PASSWORD=changeme

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenSearch
OPENSEARCH_HOST=localhost
OPENSEARCH_PORT=9200

# AWS S3
S3_BUCKET=acquismart-documents
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Authentication
JWT_SECRET=change-in-production

# AI/ML APIs
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# MLflow
MLFLOW_TRACKING_URI=http://localhost:5000
```

## Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend/platform-gateway
npm test

# Python tests
cd backend/svc-ai-document
pytest
```

## Deployment

### Docker Compose (Development)
```bash
docker-compose up -d
```

### Kubernetes (Production)
```bash
cd infra/kubernetes
kubectl apply -f namespaces/
kubectl apply -f secrets/
kubectl apply -f deployments/
kubectl apply -f services/
```

## API Documentation

Once services are running:
- **API Gateway**: http://localhost:3000/docs
- **AI Document Service**: http://localhost:8001/docs
- **AI Entities Service**: http://localhost:8002/docs
- **AI Valuation Service**: http://localhost:8003/docs
- **AI Risk Service**: http://localhost:8004/docs

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Create Pull Request

## License

Proprietary - All rights reserved

---

**Current Branch**: `oct19-core-enhancements`

For detailed AI architecture and model specifications, see [docs/AI-ARCHITECTURE.md](docs/AI-ARCHITECTURE.md)
