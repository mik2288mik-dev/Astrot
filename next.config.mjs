/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['swisseph'],
    outputFileTracingIncludes: {
      "/api/chart": [
        "ephe/sepl_*",
        "ephe/seplm*",
        "ephe/semo_*",
        "ephe/semom*"
      ],
      "app/api/chart/route": [
        "ephe/sepl_*",
        "ephe/seplm*",
        "ephe/semo_*",
        "ephe/semom*"
      ]
    }
  }
};
export default nextConfig;
