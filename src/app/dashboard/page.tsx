'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const router = useRouter();
    const logout = useWeddingStore((state) => state.logout);
    const isAuthenticated = useWeddingStore((state) => state.isAuthenticated);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) {
            router.push('/');
        }
    }, [isMounted, isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!isMounted) return null; // Prevent hydration mismatch
    if (!isAuthenticated) return null; // Don't render content while redirecting

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar navigation */}
            <aside className={styles.sidebar}>
                <nav className={styles.nav}>
                    <div className={`${styles.navItem} ${styles.active}`}>
                        My Ordered Bundle
                    </div>
                    <Link href="/dashboard/rsvp" className={styles.navItem}>
                        RSVP Manager
                    </Link>

                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>


            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                </header>

                {/* Wedding Event Card */}
                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <h2>vivek & Priyanka wedding</h2>
                        <p className={styles.cardDetails}>12 Dec, 2026 • Forest Elegance</p>
                        <span className={styles.statusBadge}>Draft</span>
                    </div>

                    <div className={styles.cardActions}>
                        <Link href="/details" className={styles.btnActionOutline}>
                            Edit Details
                        </Link>
                        <Link href="/preview" className={styles.btnActionPrimary}>
                            View Invites
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
