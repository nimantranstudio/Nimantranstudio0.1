'use client';

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function RootWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return (
            <div style={{ height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
                {children}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
