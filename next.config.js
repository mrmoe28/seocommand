/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    BUILD_TIME: 'true',
  },
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
    ];
  },
  // Optimize for production
  reactStrictMode: true,
  // External packages that should not be bundled
  serverExternalPackages: ['@neondatabase/serverless'],
};

module.exports = nextConfig;