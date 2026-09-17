import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Invitation Themes & Templates | Nimantran Studio',
  description: 'Explore premium Indian wedding invitation themes. Fully customized digital suites, WhatsApp cards, and RSVP tracking for every wedding culture and style.',
  alternates: {
    canonical: 'https://www.nimantranstudio.in/themes',
  },
  openGraph: {
    title: 'Wedding Invitation Themes & Templates | Nimantran Studio',
    description: 'Explore premium Indian wedding invitation themes with RSVP tracking and WhatsApp cards.',
    url: 'https://www.nimantranstudio.in/themes',
    siteName: 'Nimantran Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nimantran Studio Wedding Themes',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Invitation Themes & Templates | Nimantran Studio',
    description: 'Explore premium Indian wedding invitation themes with RSVP tracking and WhatsApp cards.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
