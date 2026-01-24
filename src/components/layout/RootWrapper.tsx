'use client';

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function RootWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return (
            <main style={{ flex: 1, minHeight: 0 }}>
                {children}
            </main>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
