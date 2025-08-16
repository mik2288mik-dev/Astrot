/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['swisseph'],
    outputFileTracingExcludes: {
      '*': ['ephe-full/**'] // тяжёлое никогда не трейсить
    },
    outputFileTracingIncludes: {
      '/api/chart': ['ephe/**'],
      'app/api/chart/route': ['ephe/**']
    }
  }
};
export default nextConfig;
