/**
 * Vercel Serverless API Handler
 * This file converts Express routes to Vercel serverless functions
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// MongoDB connection handler (cached for serverless)
const connectDB = require('../backend/config/db-serverless');

// Import routes
const districtRoutes = require('../backend/routes/districts');
const compareRoutes = require('../backend/routes/compare');
const cacheRoutes = require('../backend/routes/cache');

const app = express();

// CORS configuration - allow all origins in production (adjust as needed)
const allowedOrigins = (() => {
  if (process.env.FRONTEND_URLS) {
    return process.env.FRONTEND_URLS.split(',').map(s => s.trim());
  }
  if (process.env.VERCEL_URL) {
    return [`https://${process.env.VERCEL_URL}`];
  }
  return ['http://localhost:3000', 'http://localhost:3001', '*'];
})();

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// API routes
app.use('/api/districts', districtRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/cache', cacheRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MGNREGA Data Visualization API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      districts: '/api/districts',
      compare: '/api/compare',
      cache: '/api/cache'
    }
  });
});

// Export as Vercel serverless function
module.exports = async (req, res) => {
  // Connect to database (connection is cached)
  try {
    if (!global.mongoose || global.mongoose.readyState !== 1) {
      await connectDB();
      global.mongoose = require('mongoose');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    // Continue anyway - some endpoints might work without DB
  }

  return app(req, res);
};

