import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compareRouter from './routes/compare.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for debugging & hackathon visibility
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
