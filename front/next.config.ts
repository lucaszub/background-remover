import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  serverExternalPackages: ['sharp'],
  // Webpack configuration for Sharp
  webpack: (config: { externals?: unknown[] }) => {
    if (!config.externals) {
      config.externals = [];
    }
    config.externals.push({
      sharp: 'commonjs sharp'
    });
    return config;
  },
};

export default nextConfig;
