'use client';

import { RSVPForm } from '@/app/rsvp/[id]/RSVPForm';
import styles from '@/app/rsvp/[id]/rsvp.module.css';
import type { WebsiteTemplateProps } from '../types';

/**
 * Royal Sanctuary — the original Nimantran wedding website. Renders the exact
 * component and page wrapper the live guest site (/rsvp/[id]/page.tsx) uses,
 * unchanged, so the preview and review always match what guests will see.
 */
export default function RoyalSanctuary({ wedding, isPreview = false }: WebsiteTemplateProps) {
    return (
        <div className={`${styles.page} ${isPreview ? styles.previewPage : ''}`}>
            <RSVPForm wedding={wedding} isPreview={isPreview} />
        </div>
    );
}
