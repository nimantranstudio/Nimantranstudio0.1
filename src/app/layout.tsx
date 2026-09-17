import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import RootWrapper from "@/components/layout/RootWrapper";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nimantranstudio.in"),
  title: "Nimantran Studio | WhatsApp Wedding Invites & Digital Invites India",
  description: "Create stunning WhatsApp wedding invites and track RSVPs in under 5 minutes. The easiest digital wedding invitation platform for Indian weddings. No subscription required.",
  keywords: ["WhatsApp wedding invitation", "Marathi wedding invitation", "digital wedding invitation India", "wedding RSVP website", "wedding invite maker"],
  authors: [{ name: "Nimantran Studio" }],
  openGraph: {
    type: "website",
    title: "Nimantran Studio | Digital Wedding Invitations for Indian Weddings",
    description: "Create beautiful digital wedding invitations for Indian weddings. Share on WhatsApp, collect RSVPs and manage guest updates — all in one place.",
    url: "https://www.nimantranstudio.in/",
    siteName: "Nimantran Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nimantran Studio | Invitations built for Great Indian Weddings",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nimantran Studio | Digital Wedding Invitations for Indian Weddings",
    description: "Create beautiful digital wedding invitations for Indian weddings. Share on WhatsApp, collect RSVPs and manage guest updates — all in one place.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.nimantranstudio.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const rootStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.nimantranstudio.in/#organization",
      "name": "Nimantran Studio",
      "url": "https://www.nimantranstudio.in",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.nimantranstudio.in/#logo",
        "url": "https://www.nimantranstudio.in/icon.png",
        "caption": "Nimantran Studio"
      },
      "description": "Create stunning WhatsApp wedding invites and track RSVPs in under 5 minutes for Indian weddings."
    },
    {
      "@type": "WebSite",
      "@id": "https://www.nimantranstudio.in/#website",
      "url": "https://www.nimantranstudio.in",
      "name": "Nimantran Studio",
      "description": "Digital Wedding Invitations & WhatsApp RSVP Tracking",
      "publisher": {
        "@id": "https://www.nimantranstudio.in/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#FDFBF7' }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootStructuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning style={{ backgroundColor: '#FDFBF7' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <RootWrapper>{children}</RootWrapper>
        </div>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
