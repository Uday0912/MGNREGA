/**
 * Dynamic API URL configuration utility
 * Detects API URL at runtime based on environment
 */

/**
 * Get the API base URL dynamically
 * This function runs in the browser and detects the appropriate API URL
 * 
 * Priority:
 * 1. REACT_APP_API_URL (explicitly set in environment variables - highest priority)
 * 2. Runtime detection from current origin (for same-origin deployments)
 * 3. Fallback to relative path
 */
export const getDynamicApiUrl = () => {
  // Check for explicit API URL (set in Vercel dashboard)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Runtime detection (browser only)
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    
    // Try to detect backend based on hostname patterns
    const hostname = window.location.hostname;
    
    // If deployed on Vercel and backend might be on a subdomain or separate service
    if (hostname.includes('vercel.app')) {
      // Common pattern: frontend might be on vercel, backend elsewhere
      // User should set REACT_APP_API_URL, but we provide same-origin fallback
      // This works if backend is proxied through Vercel rewrites
      return `${origin}/api`;
    }
    
    // Default: same origin with /api path
    // This works for:
    // - Same-origin deployments
    // - Backend proxied through Vercel
    // - Local development with proxy
    return `${origin}/api`;
  }

  // Server-side rendering or build-time fallback
  return '/api';
};

/**
 * Get API URL with automatic fallback detection
 * Can detect backend on common deployment platforms
 */
export const detectBackendUrl = () => {
  const explicitUrl = process.env.REACT_APP_API_URL;
  if (explicitUrl) return explicitUrl;

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    
    // Try common backend deployment patterns
    const patterns = [
      // Render pattern
      origin.replace(/\.vercel\.app$/, '.onrender.com'),
      // Railway pattern  
      origin.replace(/\.vercel\.app$/, '.railway.app'),
      // Heroku pattern
      origin.replace(/\.vercel\.app$/, '.herokuapp.com'),
    ];

    // For now, use same origin (works with proxy)
    // User should explicitly set REACT_APP_API_URL for separate deployments
    return `${origin}/api`;
  }

  return '/api';
};

// Export the API base URL (evaluated at runtime)
export const API_BASE_URL = getDynamicApiUrl();

export default API_BASE_URL;

