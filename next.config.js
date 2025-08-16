/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    BUILD_TIME: process.env.NODE_ENV === 'production' ? 'true' : process.env.BUILD_TIME || 'false',
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