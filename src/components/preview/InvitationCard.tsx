'use client';

import { WeddingEvent } from '@/lib/schemas/wedding-form';
import { Theme } from '@/lib/constants/themes';
import styles from './Preview.module.css';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface InvitationCardProps {
    event: WeddingEvent;
    theme: Theme;
    groomName: string;
    brideName: string;
    isPlaceholder?: boolean;
    type?: 'image' | 'video';
    customImage?: string;
}

export const InvitationCard = ({ event, theme, groomName, brideName, isPlaceholder, type, customImage }: InvitationCardProps) => {
    return (
        <div className={styles.invitationCard} style={{ '--theme-primary': theme.colors[1], '--theme-bg': theme.colors[0] } as any}>
            {/* Watermark Overlay */}
            <div className={styles.watermark}>
                <span>NimantranStudio</span>
                <span>NimantranStudio</span>
                <span>NimantranStudio</span>
            </div>

            {customImage && (
                <Image
                    src={customImage}
                    alt={event.name}
                    fill
                    style={{ objectFit: 'cover', zIndex: 0 }}
                />
            )}

            {type === 'video' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 10 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        <Play size={32} fill="currentColor" color={theme.colors[1]} />
                    </div>
                </div>
            )}

            <div className={styles.content}>
                <p className={styles.cardEyebrow}>The Wedding of</p>
                <h2 className={styles.cardNames}>
                    {groomName || 'Groom'} <br /> & <br /> {brideName || 'Bride'}
                </h2>

                <div className={styles.cardDivider}></div>

                <h3 className={styles.cardEvent}>{event.name}</h3>

                {/* Only show dates and venue if it's not a generic placeholder (like poster/initials) */}
                {!isPlaceholder && (
                    <div className={styles.cardDetails}>
                        <p>{event.date || 'Date TBD'}</p>
                        <p>{event.time || 'Time TBD'}</p>
                        <p style={{ marginTop: '0.25rem' }}>{event.venue || 'Venue TBD'}</p>
                    </div>
                )}

                <div className={styles.cardFooter}>
                    Helping beyond invitations, with love.
                </div>
            </div>
        </div>
    );
};
