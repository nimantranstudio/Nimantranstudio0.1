import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import RootWrapper from "@/components/layout/RootWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "NimantranStudio | Created with a click, sent with love.",
  description: "One form. One click. Your entire wedding invitation bundle ready for WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
          <div style={{ flexShrink: 0, zIndex: 2000 }}>
            <Navbar />
          </div>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <RootWrapper>{children}</RootWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
