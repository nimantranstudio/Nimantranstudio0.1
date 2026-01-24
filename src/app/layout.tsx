import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import RootWrapper from "@/components/layout/RootWrapper";
import { Navbar } from "@/components/layout/Navbar";

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
        <header style={{ height: '80px', position: 'sticky', top: 0, zIndex: 2000 }}>
          <Navbar />
        </header>
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}
