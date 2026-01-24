'use client';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import styles from './event-link.module.css';
import { Download, Copy, Phone } from 'lucide-react';
import { useState } from 'react';

export default function EventLinkPage() {
    const [copied, setCopied] = useState(false);
    const link = "nimantran.studio/rsvp/wed-2025";

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

                    <button className={styles.whatsappBtn}>
                        <Phone size={18} style={{ fill: 'currentColor' }} />
                        Send on WhatsApp
                    </button>

                </div>
            </main>
        </div>
    );
}
