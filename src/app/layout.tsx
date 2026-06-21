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
  metadataBase: new URL("https://nimantranstudio.com"),
  title: "Nimantran Studio | WhatsApp Wedding Invites & Digital Invites India",
  description: "Create stunning WhatsApp wedding invites and track RSVPs in under 5 minutes. The easiest digital wedding invitation platform for Indian weddings. No subscription required.",
  keywords: ["WhatsApp wedding invitation", "Marathi wedding invitation", "digital wedding invitation India", "wedding RSVP website", "wedding invite maker"],
  authors: [{ name: "Nimantran Studio" }],
  openGraph: {
    title: "Nimantran Studio | WhatsApp Wedding Invites & RSVP Tracking",
    description: "Design elegant digital wedding invitations and manage your guest list — all in one place. Share instantly on WhatsApp.",
    url: "https://nimantranstudio.com",
    siteName: "Nimantran Studio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nimantran Studio Wedding Invitations",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nimantran Studio | Digital Wedding Invitations",
    description: "Beautiful WhatsApp wedding invites and live RSVP tracking for Indian weddings.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://nimantranstudio.com",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
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
