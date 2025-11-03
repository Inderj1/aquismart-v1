import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from '../../shared/utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'platform-gateway',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1/ingestion', createProxy('http://svc-ingestion:3001'));
app.use('/api/v1/catalog', createProxy('http://svc-catalog:3002'));
app.use('/api/v1/monitoring', createProxy('http://svc-monitoring:3003'));
app.use('/api/v1/valuation', createProxy('http://svc-valuation:3004'));
app.use('/api/v1/reporting', createProxy('http://svc-reporting:3005'));

// AI service routes
app.use('/api/v1/ai/document', createProxy('http://svc-ai-document:8001'));
app.use('/api/v1/ai/entities', createProxy('http://svc-ai-entities:8002'));
app.use('/api/v1/ai/valuation', createProxy('http://svc-ai-valuation:8003'));
app.use('/api/v1/ai/risk', createProxy('http://svc-ai-risk:8004'));

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err, path: req.path });
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

function createProxy(target: string) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const response = await fetch(`${target}${req.path}`, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers as any
        },
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      logger.error('Proxy error', { error, target, path: req.path });
      next(error);
    }
  };
}

app.listen(PORT, () => {
  logger.info(`API Gateway listening on port ${PORT}`);
});

export default app;
