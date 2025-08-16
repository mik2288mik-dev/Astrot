/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['swisseph'],
    outputFileTracingIncludes: {
      'app/api/chart/route.ts': ['./ephe/**'],
      'app/api/interpret/route.ts': ['./ephe/**']
    }
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
