/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'telegra.ph' },
      { protocol: 'https', hostname: '**.telegram.org' }
    ]
  }
};

module.exports = nextConfig;