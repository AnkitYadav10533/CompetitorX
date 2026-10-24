import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compareRouter from './routes/compare.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for debugging & observability
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CompetitorX API',
    version: '1.0.0',
    tinyFishConfigured: Boolean(process.env.TINYFISH_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', compareRouter);

// Serve frontend static assets in production
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// For Single Page App (SPA) client routing, send index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error in CompetitorX API]:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'An unexpected error occurred during website comparison.',
  });
});

export default app;
