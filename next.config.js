/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'telegra.ph' },
      { protocol: 'https', hostname: '**.telegram.org' }
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({ swisseph: 'commonjs swisseph' });
    }
    return config;
  }
};

module.exports = nextConfig;