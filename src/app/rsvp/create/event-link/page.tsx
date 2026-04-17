'use client';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import styles from './event-link.module.css';
import { Copy, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWeddingStore } from '@/store/wedding-store';

export default function EventLinkPage() {
    const { lastSavedWeddingId, formData } = useWeddingStore();
    const [copied, setCopied] = useState(false);
    const [link, setLink] = useState('');

    useEffect(() => {
        if (lastSavedWeddingId) {
            setLink(`${window.location.origin}/rsvp/${lastSavedWeddingId}`);
        }
    }, [lastSavedWeddingId]);

    const handleCopy = () => {
        if (!link) return;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openWhatsApp = () => {
        if (!link) return;
        const names = formData.groomName && formData.brideName
            ? `${formData.groomName} & ${formData.brideName}`
            : 'our wedding';
        const text = `You're invited to ${names}! Please RSVP here: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'RSVP', href: '/rsvp' },
                            { label: 'Create', href: '/rsvp/create' },
                            { label: 'Event link', active: true },
                        ]}
                    />
                </div>
            </header>

            <main className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.cardTitle}>All set!</h1>
                    <p className={styles.cardSubtitle}>Now just share your link!</p>

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
                </div>
            </main>
        </div>
    );
}
