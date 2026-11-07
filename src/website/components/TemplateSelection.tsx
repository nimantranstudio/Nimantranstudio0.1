'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Check, Eye } from 'lucide-react';
import { WEBSITE_TEMPLATES, getWebsiteTemplate } from '../templates/registry';
import { useWebsiteJourney } from '../store/website-journey';
import { websiteDetailsUrl, websiteFullPreviewUrl } from '../journey';
import { DevicePreviewFrame } from './DevicePreviewFrame';
import styles from '@/app/websites/websites.module.css';

const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const formatRupees = (amount: number) => rupees.format(amount);

/**
 * The design list on /websites. Each design shows its real website in a phone
 * mockup (same renderer as every other preview). "Preview" opens the complete
 * website in a new tab; "Use this design" goes straight to the details page.
 */
export function TemplateSelection() {
    const router = useRouter();
    const storedId = useWebsiteJourney((s) => s.selectedTemplateId);
    const selectTemplate = useWebsiteJourney((s) => s.selectTemplate);
    const activeTemplates = WEBSITE_TEMPLATES.filter((t) => t.status === 'active');
    const [selectedId, setSelectedId] = useState<string>(activeTemplates[0]?.id ?? '');

    // Restore the customer's earlier choice once browser storage is available.
    useEffect(() => {
        if (storedId && getWebsiteTemplate(storedId)?.status === 'active') setSelectedId(storedId);
    }, [storedId]);

    // Saved straight away so a refresh or a trip back keeps the choice.
    const choose = (id: string) => {
        setSelectedId(id);
        selectTemplate(id);
    };

    const handleUseDesign = (id: string) => {
        selectTemplate(id);
        router.push(websiteDetailsUrl(id));
    };

    return (
        <>
            <div className={styles.grid} role="radiogroup" aria-label="Wedding website designs">
                {activeTemplates.map((template) => {
                    const isSelected = template.id === selectedId;
                    const inputId = `website-design-${template.id}`;
                    return (
                        <article
                            key={template.id}
                            className={clsx(styles.card, isSelected && styles.cardSelected)}
                            onClick={() => choose(template.id)}
                        >
                            <div className={styles.phoneStage}>
                                <DevicePreviewFrame
                                    templateId={template.id}
                                    source="sample"
                                    showDeviceToggle={false}
                                    interactive={false}
                                />
                                {isSelected && (
                                    <span className={styles.selectedBadge}>
                                        <Check size={14} aria-hidden /> Selected
                                    </span>
                                )}
                                <a
                                    href={websiteFullPreviewUrl(template.id)}
                                    target="_blank"
                                    rel="noopener"
                                    className={styles.previewButton}
                                    aria-label={`Preview the full ${template.name} website in a new tab`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Eye size={16} aria-hidden /> Preview
                                </a>
                            </div>
                            <div className={styles.cardBody}>
                                <input
                                    type="radio"
                                    name="website-design"
                                    id={inputId}
                                    className={styles.radio}
                                    checked={isSelected}
                                    onChange={() => choose(template.id)}
                                />
                                <label htmlFor={inputId} className={styles.cardTitle}>
                                    {template.name}
                                </label>
                                <p className={styles.cardText}>{template.tagline}</p>
                                <div className={styles.cardFooter}>
                                    <p className={styles.price}>
                                        <span className={styles.priceAmount}>{formatRupees(template.price)}</span>
                                        <span className={styles.priceNote}>one-time payment</span>
                                    </p>
                                    <button
                                        type="button"
                                        className={`btn btn-primary ${styles.fullWidth}`}
                                        onClick={() => handleUseDesign(template.id)}
                                    >
                                        Use this design
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <p className={styles.cardsNote}>
                Looking for printable or WhatsApp invitation cards? <Link href="/themes">Browse invitation card themes</Link>
            </p>
        </>
    );
}
