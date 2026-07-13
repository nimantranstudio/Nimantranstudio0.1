'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import styles from './ProvisioningOverlay.module.css';

const STAGES = [
    'Payment Confirmed',
    'Crafting Your Invitations',
    'Creating RSVP Website',
    'Setting up Guest Dashboard',
    'Optimising WhatsApp Sharing',
    'Preparing Downloads',
    'Almost Ready…',
];

/**
 * Fullscreen overlay shown from payment success until the dashboard redirect.
 * The checkmarks advance on a timer for reassurance; the real backend work runs
 * behind it and the parent redirects when verification resolves. The last stage
 * intentionally never "completes" here — the redirect ends the overlay.
 */
export function ProvisioningOverlay({ coupleNames }: { coupleNames?: string }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        // Advance through all but the final stage; hold on "Almost Ready…".
        const id = setInterval(() => {
            setCurrent((c) => (c < STAGES.length - 1 ? c + 1 : c));
        }, 750);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={styles.overlay} role="status" aria-live="polite">
            <div className={styles.card}>
                <div className={styles.iconBadge}>
                    <Sparkles size={26} strokeWidth={1.75} />
                </div>
                <h1 className={styles.title}>Preparing your Wedding Suite</h1>
                {coupleNames && <p className={styles.subtitle}>for {coupleNames}</p>}

                <ul className={styles.stageList}>
                    {STAGES.map((label, i) => {
                        const done = i < current;
                        const active = i === current;
                        return (
                            <li
                                key={label}
                                className={`${styles.stage} ${done ? styles.done : ''} ${active ? styles.active : ''}`}
                            >
                                <span className={styles.stageIcon} aria-hidden>
                                    {done ? (
                                        <Check size={16} strokeWidth={2.5} />
                                    ) : active ? (
                                        <Loader2 size={16} className={styles.spin} />
                                    ) : (
                                        <span className={styles.dot} />
                                    )}
                                </span>
                                <span className={styles.stageLabel}>{label}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
