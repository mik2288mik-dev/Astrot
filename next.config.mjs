/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['swisseph'],
    outputFileTracingIncludes: {
      'app/api/chart/route.ts': ['./ephe/**'],
      'app/api/interpret/route.ts': ['./ephe/**']
    }
  }
};
module.exports = nextConfig;
