import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json one directory up (/Users/vivek/) makes Next.js
  // guess the wrong workspace root, which crashes Turbopack outright when it
  // then can't resolve the `next` package from there. Pin it explicitly.
  turbopack: {
    root: "/Users/vivek/Desktop/final nimantran studio ",
  },
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
  serverExternalPackages: [
    '@remotion/renderer',
    '@remotion/bundler',
    '@ffmpeg-installer/ffmpeg',
    'pdfkit'
  ],
};

export default nextConfig;
