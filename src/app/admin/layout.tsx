'use client';

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useWeddingStore } from "@/store/wedding-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAdmin } = useWeddingStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Admin access is granted only to the owner's number after OTP login.
        // Anyone else is sent to the normal login screen.
        if (mounted && !isAdmin) {
            router.replace('/login');
        }
    }, [mounted, isAdmin, router]);

    // Wait for persisted auth to hydrate, and block content for non-admins.
    if (!mounted || !isAdmin) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: '#FDFBF7', color: '#6B7280',
                fontFamily: 'var(--font-sans)'
            }}>
                Checking access…
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FDFBF7' }}>
            <AdminHeader />

            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <AdminSidebar />
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '2rem',
                    position: 'relative'
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
