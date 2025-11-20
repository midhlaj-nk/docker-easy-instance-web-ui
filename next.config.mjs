/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8069',
      },
    ],
    minimumCacheTTL: 60,
  },
  
  // Optimize bundle - remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Enable experimental optimizations
  experimental: {
    optimizePackageImports: ['zustand', 'chart.js', 'react-chartjs-2'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Proxy API calls to avoid CORS by keeping requests same-origin
  async rewrites() {
    const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com')
      .replace(/\/$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backend}/api/v1/:path*`,
      },
      {
        source: '/public/api/:path*',
        destination: `${backend}/public/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
