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
  env: {
    // Ensure Supabase URL is available during production builds. Fallback to
    // SUPABASE_URL when only server-side vars are configured.
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
