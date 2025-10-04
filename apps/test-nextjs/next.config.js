// Optional Sentry integration - only if installed
let withSentryConfig;
try {
  withSentryConfig = require('@sentry/nextjs').withSentryConfig;
} catch (e) {
  // Sentry not installed, use identity function
  withSentryConfig = (config) => config;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@anukit/components', '@anukit/core'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        optimui: {
          test: /[\\/]node_modules[\\/]@optimui[\\/]/,
          name: 'optimui',
          priority: 30,
          reuseExistingChunk: true,
        },
      },
    };

    return config;
  },
};

const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = bundleAnalyzer(nextConfig);