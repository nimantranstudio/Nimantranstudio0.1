'use client';

import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { DevicePreviewFrame } from './DevicePreviewFrame';
import { websiteDesignsUrl, websiteDraftPreviewUrl } from '../journey';
import styles from './WebsiteDetailsPreview.module.css';

/**
 * The live website preview shown beside the details form in the website
 * journey (/details?flow=website). Updates as the customer types: the frame
 * re-reads the form from browser storage on every change.
 */
export function WebsiteDetailsPreview({ templateId, templateName }: { templateId: string; templateName: string }) {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <span className={styles.label}>Live preview · {templateName}</span>
                <a
                    href={websiteDraftPreviewUrl(templateId)}
                    target="_blank"
                    rel="noopener"
                    className={styles.link}
                    aria-label="Open your website full screen in a new tab"
                >
                    <Eye size={15} aria-hidden /> Full screen
                </a>
            </div>
            <div className={styles.frame}>
                <DevicePreviewFrame templateId={templateId} source="draft-with-samples" showDeviceToggle={false} />
            </div>
            <Link href={websiteDesignsUrl} className={styles.link}>
                <ArrowLeft size={15} aria-hidden /> Change design
            </Link>
        </div>
    );
}
