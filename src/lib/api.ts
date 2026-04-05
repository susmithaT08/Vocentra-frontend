/**
 * Centralized API configuration for Vocentra frontend.
 *
 * In development: NEXT_PUBLIC_API_URL is empty, so requests go through
 * Next.js rewrites (proxied to localhost:5000).
 *
 * In production: NEXT_PUBLIC_API_URL points to the deployed backend
 * (e.g., https://vocentra-backend.onrender.com).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Build a full API URL from a path.
 * @param path - API path starting with '/' (e.g., '/api/auth/login')
 * @returns Full URL string
 */
export const apiUrl = (path: string): string => `${API_BASE}${path}`;

export default API_BASE;
