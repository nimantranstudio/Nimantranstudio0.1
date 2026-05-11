import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Treat Prisma as an external package — never bundle it, load from node_modules at runtime.
  // This prevents Next.js from inlining the Prisma client and triggering NFT over-tracing.
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Exclude any leftover generated-client artifacts from Vercel's file tracing.
  outputFileTracingExcludes: {
    '*': ['./src/generated/**'],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@/components/ui'
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
