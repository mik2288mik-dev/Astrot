/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['astronomy-engine'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    return config;
  },
  transpilePackages: [
    '@telegram-apps/sdk',
    '@telegram-apps/sdk-react'
  ],
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
