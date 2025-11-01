/**
 * Dynamic API configuration
 * Automatically detects API URL based on environment
 */

/**
 * Get the API base URL dynamically
 * Priority:
 * 1. REACT_APP_API_URL (explicitly set - highest priority)
 * 2. Runtime detection from window.location (for same-origin deployments)
 * 3. Localhost fallback for development
 */
export const getApiBaseUrl = () => {
  // Explicit API URL (highest priority - set in Vercel dashboard)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Runtime detection (only available in browser)
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    
    // Same origin (if backend is proxied or on same domain)
    return `${origin}/api`;
  }

  // Development fallback (build-time)
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api'
    : '/api';
};

// Get API URL dynamically at runtime
export const getRuntimeApiUrl = () => {
  // Check if we have explicit URL
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Runtime detection from browser
  if (typeof window !== 'undefined') {
    // Try to detect backend URL from common patterns
    const hostname = window.location.hostname;
    
    // If on Vercel preview/production, try common backend patterns
    if (hostname.includes('vercel.app')) {
      // User should set REACT_APP_API_URL, but we provide runtime fallback
      // For now, try same origin
      return `${window.location.origin}/api`;
    }
    
    // Default: same origin
    return `${window.location.origin}/api`;
  }

  // Fallback
  return '/api';
};

// Export the resolved API base URL (for build-time usage)
export const API_BASE_URL = typeof window !== 'undefined' 
  ? getRuntimeApiUrl() 
  : (process.env.REACT_APP_API_URL || '/api');

// Log the API URL in development for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

export default API_BASE_URL;

