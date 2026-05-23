import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Console logging for debugging fetches in development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimizing package imports for faster compilation
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@/components/ui'
    ],
  },
  // Common compression and power-user optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
