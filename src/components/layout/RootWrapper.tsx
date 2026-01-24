'use client';

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
                <div style={{ flexShrink: 0, zIndex: 1000 }}>
                    <Navbar />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flexShrink: 0, zIndex: 1000 }}>
                <Navbar />
            </div>
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
