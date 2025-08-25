/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['astronomy-engine'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    // Exclude SVGs from existing file loader and handle as React components via SVGR
    const imageRule = config.module.rules.find(
      (rule) => typeof rule === 'object' && rule !== null && rule.test && rule.test instanceof RegExp && rule.test.test('.svg')
    );
    if (imageRule) {
      imageRule.exclude = [/\.svg$/i];
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { ref: true } }],
    });
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
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
