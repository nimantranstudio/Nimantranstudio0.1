'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Copy, Phone, LogOut } from 'lucide-react';
import styles from './event-link.module.css';
import dashboardStyles from '@/app/dashboard/dashboard.module.css';
import { useWeddingStore } from '@/store/wedding-store';

export default function EventLinkPage() {
    const router = useRouter();
    const { logout } = useWeddingStore();
    const [copied, setCopied] = useState(false);

    // In a real app, you'd get the actual ID from context or URL params
    const [link, setLink] = useState('');

    useEffect(() => {
        // Just a placeholder example since we don't have the ID here without params
        setLink(`${window.location.origin}/dashboard/rsvp`);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openWhatsApp = () => {
        const text = `Please RSVP for our wedding: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
            <aside className={dashboardStyles.sidebar}>
                <nav className={dashboardStyles.nav}>
                    <Link href="/dashboard" className={dashboardStyles.navItem}>
                        Wedding Assets
                    </Link>
                    <div className={`${dashboardStyles.navItem} ${dashboardStyles.active}`}>
                        RSVP Manager
                    </div>
                </nav>

                <div className={dashboardStyles.sidebarFooter}>
                    <button onClick={handleLogout} className={dashboardStyles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
                {/* Breadcrumb */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    paddingBottom: '1rem', marginBottom: '2rem',
                    borderBottom: '1px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 500
                }}>
                    <span style={{ color: '#888' }}>Rsvp Manager</span>
                    <span style={{ color: '#ccc' }}>/</span>
                    <span style={{ color: '#888' }}>Create</span>
                    <span style={{ color: '#ccc' }}>/</span>
                    <span style={{ color: '#333', fontWeight: 600 }}>Event link</span>
                </div>

                <div className={styles.container}>
                    <div className={styles.card}>
                        <h1 className={styles.cardTitle}>All set!</h1>
                        <p className={styles.cardSubtitle}>Now just share your link!</p>

                        {/* QR Code Placeholder */}
                        <div className={styles.qrContainer}>
                            <div className={styles.qrPlaceholder}>
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className={styles.qrDot} style={{ opacity: Math.random() > 0.5 ? 1 : 0.4 }} />
                                ))}
                            </div>
                        </div>

                        <div className={styles.qrLabel}>Add this QR Code to your invitation</div>

                        <a href="#" className={styles.downloadBtn} onClick={(e) => e.preventDefault()}>
                            <Download size={14} />
                            DOWNLOAD IMAGE
                        </a>

                        <div className={styles.linkBox}>
                            <span className={styles.linkText}>{link}</span>
                            <button onClick={handleCopy} className={styles.copyBtn} title="Copy Link">
                                {copied ? (
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'green' }}>COPIED</span>
                                ) : (
                                    <Copy size={18} />
                                )}
                            </button>
                        </div>

                        <button className={styles.whatsappBtn} onClick={openWhatsApp}>
                            <Phone size={18} style={{ fill: 'currentColor' }} />
                            Send on WhatsApp
                        </button>

                        <div style={{ marginTop: '2rem' }}>
                            <Link href="/dashboard/rsvp" style={{ color: '#1B5E20', fontWeight: 600, textDecoration: 'none' }}>
                                Go to Dashboard
                            </Link>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
