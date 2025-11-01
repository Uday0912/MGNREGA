#!/usr/bin/env node

/**
 * Dynamic build script for Vercel
 * This script runs before the build to set up environment variables dynamically
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const vercelUrl = process.env.VERCEL_URL;
const vercelEnv = process.env.VERCEL_ENV; // production, preview, development
const apiUrl = process.env.REACT_APP_API_URL;

// Determine API URL dynamically if not explicitly set
let finalApiUrl = apiUrl;

if (!finalApiUrl && vercelUrl) {
  // Try to construct backend URL from common patterns
  const baseUrl = `https://${vercelUrl}`;
  
  // Common backend deployment URL patterns
  // User should set REACT_APP_API_URL, but we provide fallbacks
  if (vercelEnv === 'production') {
    // In production, try common backend patterns
    finalApiUrl = process.env.BACKEND_URL || `${baseUrl}/api`;
  } else {
    // Preview/development - use same origin or explicit backend
    finalApiUrl = process.env.BACKEND_URL || `${baseUrl}/api`;
  }
  
  console.log(`🔗 Auto-detected API URL: ${finalApiUrl}`);
}

// Set the API URL for React build
if (finalApiUrl) {
  process.env.REACT_APP_API_URL = finalApiUrl;
  console.log(`✅ Using API URL: ${finalApiUrl}`);
} else {
  console.warn('⚠️  No API URL configured. Using fallback.');
}

// Continue with build
process.exit(0);

