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
    const { logout, lastSavedWeddingId, formData } = useWeddingStore();
    const [copied, setCopied] = useState(false);
    const [link, setLink] = useState('');

    useEffect(() => {
        if (lastSavedWeddingId) {
            setLink(`${window.location.origin}/rsvp/${lastSavedWeddingId}`);
        }
    }, [lastSavedWeddingId]);

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
        const names = formData.groomName && formData.brideName
            ? `${formData.groomName} & ${formData.brideName}`
            : 'our wedding';
        const text = `You're invited to ${names}! Please RSVP here: ${link}`;
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
                        <p className={styles.cardSubtitle}>Share your RSVP link with guests</p>

                        {!link && (
                            <p style={{ color: '#B91C1C', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
                                Wedding not saved yet. Please go back and complete setup.
                            </p>
                        )}

                        <div className={styles.linkBox}>
                            <span className={styles.linkText}>{link || 'No link available'}</span>
                            <button
                                onClick={handleCopy}
                                className={styles.copyBtn}
                                title="Copy Link"
                                disabled={!link}
                            >
                                {copied ? (
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'green' }}>COPIED</span>
                                ) : (
                                    <Copy size={18} />
                                )}
                            </button>
                        </div>

                        <button className={styles.whatsappBtn} onClick={openWhatsApp} disabled={!link}>
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
