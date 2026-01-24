'use client';

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function RootWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <div style={{ height: '100%', width: '100%' }}>{children}</div>;
    }

    return (
        <div style={{ height: '100%', width: '100%', overflowY: 'auto' }}>
            <main>{children}</main>
            <Footer />
        </div>
    );
}
