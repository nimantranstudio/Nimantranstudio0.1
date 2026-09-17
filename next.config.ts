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
  /**
   * Baseline security headers (there were none before).
   *
   * Deliberately no Content-Security-Policy here: this app renders invitation
   * templates in same-origin iframes and loads Razorpay Checkout, Google Tag
   * Manager and Firebase, alongside extensive inline styling. A CSP strict
   * enough to be worth having would break those, and a CSP loose enough not to
   * (unsafe-inline + unsafe-eval) buys almost nothing. Adding one properly is
   * its own task — nonces plus a scripted audit of every third-party origin —
   * rather than something to slip in as a config line.
   *
   * X-Frame-Options is SAMEORIGIN, not DENY, precisely because those card
   * preview iframes are same-origin; DENY would blank them out.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Force HTTPS for two years, including subdomains.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Stop browsers second-guessing declared content types (an uploaded
          // image being sniffed as HTML is how stored XSS gets its start).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Clickjacking protection that still permits our own card iframes.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Don't leak full invitation URLs (which contain wedding ids) to
          // third-party origins via the Referer header.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Nothing here needs these devices; deny by default.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
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
