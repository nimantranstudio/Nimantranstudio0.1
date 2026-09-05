'use client';

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import ExitIntentModal from "@/components/ui/ExitIntentModal";
import { AnnouncementStrip } from "@/components/home/AnnouncementStrip";
import { useState, useEffect } from "react";

export default function RootWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const isAdmin = pathname?.startsWith('/admin');
    const isRsvpPage = pathname?.startsWith('/rsvp/');
    const isHidden = isAdmin || isRsvpPage;
    const isLandingPage = pathname === '/';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {!isHidden && <Navbar />}
            {isLandingPage && <AnnouncementStrip />}
            <main style={{ flex: 1 }}>
                {children}
            </main>
            {!isHidden && <Footer />}
            {!isHidden && <FloatingWhatsApp />}
            {isLandingPage && <ExitIntentModal />}
        </div>
    );
}
