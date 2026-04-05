import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In production, the frontend calls the backend directly via NEXT_PUBLIC_API_URL.
    // Rewrites are only needed in local development to proxy API calls to the Express backend.
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
