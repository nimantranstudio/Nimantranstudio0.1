'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, CheckCircle, Smartphone, Headphones, ShieldCheck, Share2, X, ChevronLeft } from 'lucide-react';
import { THEMES } from '@/lib/constants/themes';
import { useWeddingStore } from '@/store/wedding-store';
import { ThemeCard } from '@/components/ui/ThemeCard';
import styles from './theme-detail.module.css';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ThemeDetailPage({ params }: { params: Promise<{ themeId: string }> }) {
    const { themeId } = use(params);
    const router = useRouter();
    const { setThemeId } = useWeddingStore();

    const theme = THEMES.find(t => t.id === themeId);

    // Accordion state
    const [openAccordion, setOpenAccordion] = useState<string | null>('what-you-get');

    // Preview Overlay state
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    if (!theme) {
        return (
            <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
                <h1>Theme not found</h1>
                <Link href="/themes" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                    Back to Themes
                </Link>
            </div>
        );
    }

    const handleCreateNow = () => {
        setThemeId(theme.id);
        router.push('/details');
    };

    const assets = [
        { name: "Wedding poster", image: "wedding-poster.png" },
        { name: "Wedding", image: "wedding-invite.png" },
        { name: "Wedding video", image: "video-thumb.png" },
        { name: "Sangeet", image: "sangeet-invite.png" },
        { name: "Mehendi", image: "mehendi-invite.png" },
        { name: "Haldi", image: "haldi-invite.png" },
        { name: "Sangeet Poster", image: "sangeet-poster.png" },
        { name: "Mehendi Poster", image: "mehendi-poster.png" },
        { name: "Haldi Poster", image: "haldi-poster.png" },
        { name: "Save The Date", image: "save-the-date.png" },
        { name: "Initials", image: "initials.png" },
        { name: "Thank you card", image: "thank-you.png" },
    ];

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const handleNextPreview = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (previewIndex !== null) {
            setPreviewIndex((previewIndex + 1) % assets.length);
        }
    };

    const handlePrevPreview = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (previewIndex !== null) {
            setPreviewIndex((previewIndex - 1 + assets.length) % assets.length);
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (previewIndex === null) return;
            if (e.key === 'Escape') setPreviewIndex(null);
            if (e.key === 'ArrowRight') handleNextPreview();
            if (e.key === 'ArrowLeft') handlePrevPreview();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [previewIndex]);

    const recommendations = THEMES.filter(t => t.id !== themeId).slice(0, 4);

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Breadcrumb */}
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Themes', href: '/themes' },
                        { label: theme.name, active: true },
                    ]}
                />

                <div className={styles.layout}>
                    {/* Left Column: Asset Grid */}
                    <div className={styles.assetGrid}>
                        {assets.map((asset, index) => {
                            const isSpecialTheme = ['rajputana', 'modern-minimal'].includes(themeId);
                            return (
                                <div
                                    key={index}
                                    className={styles.assetCard}
                                    onClick={() => setPreviewIndex(index)}
                                    style={{
                                        cursor: 'pointer',
                                        background: theme.colors[0],
                                        color: theme.colors[2] || 'white',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '1rem',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        zIndex: 1
                                    }}>
                                        {asset.name}
                                    </div>

                                    {isSpecialTheme && (
                                        <Image
                                            src={`/assets/themes/${themeId}/${asset.image}`}
                                            alt={asset.name}
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                zIndex: 2
                                            }}
                                            onError={(e) => {
                                                // If image is missing, hide it so the styled placeholder shows
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Content */}
                    <div className={styles.contentCol}>
                        <h1 className={styles.title}>
                            {theme.name} theme invitation bundle complete pack of 12
                        </h1>
                        <p className={styles.description}>
                            Celebrate your special day with the {theme.name} Video, a modern and minimal digital invite that beautifully captures the spirit of your traditions. Make your wedding announcement as joyful as the celebration itself with this unique, stylish evite.
                        </p>

                        <ul className={styles.features}>
                            <li className={styles.featureItem}>Just fill your basic details one time ( Supports Hindi English, Marathi )</li>
                            <li className={styles.featureItem}>Get instant bundle in 2 - 5 minutes</li>
                            <li className={styles.featureItem}>Ready to download and shared on WhatsApp</li>
                        </ul>

                        <div className={styles.pricing}>
                            <span className={styles.currentPrice}>Rs 1200</span>
                            <span className={styles.originalPrice}>Rs 3800</span>
                        </div>

                        <div className={styles.actions}>
                            <button onClick={handleCreateNow} className={styles.btnPrimary}>
                                Create Now
                            </button>
                            <button className={styles.btnSecondary}>
                                <Share2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                Share
                            </button>
                        </div>

                        <div className={styles.accordions}>
                            <div className={styles.accordion}>
                                <button className={styles.accordionHeader} onClick={() => toggleAccordion('what-you-get')}>
                                    What You Get <ChevronDown size={18} />
                                </button>
                                {openAccordion === 'what-you-get' && (
                                    <div className={styles.accordionContent}>
                                        A complete digital bundle including high-resolution images for all events and a cinematic video invitation optimized for WhatsApp sharing.
                                    </div>
                                )}
                            </div>
                            <div className={styles.accordion}>
                                <button className={styles.accordionHeader} onClick={() => toggleAccordion('highlights')}>
                                    Product Highlights <ChevronDown size={18} />
                                </button>
                                {openAccordion === 'highlights' && (
                                    <div className={styles.accordionContent}>
                                        Premium typography, royal motifs, and culturally sensitive design elements crafted for a grand Indian wedding experience.
                                    </div>
                                )}
                            </div>
                            <div className={styles.accordion}>
                                <button className={styles.accordionHeader} onClick={() => toggleAccordion('faq')}>
                                    FAQ <ChevronDown size={18} />
                                </button>
                                {openAccordion === 'faq' && (
                                    <div className={styles.accordionContent}>
                                        Our FAQ section covers everything from customization options to delivery times and file formats.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.trustCol}>
                            <div className={styles.guaranteeBox}>
                                <span className={styles.guaranteeTitle}>Satisfaction Guaranteed</span>
                                <p className={styles.guaranteeText}>
                                    Final assets will be generated without watermarks in high definition immediately after payment. Editing allowed for next 15 days.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className={styles.supportBox}>
                                    <Headphones size={20} color="#666" />
                                    <div className={styles.supportInfo}>
                                        <span className={styles.supportLabel}>Need Help? Contact Us</span>
                                        <span className={styles.supportValue}>+91 96250 28649</span>
                                    </div>
                                </div>
                                <div className={styles.paymentBox}>
                                    <ShieldCheck size={20} color="#666" style={{ marginRight: '8px' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>SECURE PAYMENTS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <section className={styles.recommendations}>
                    <h2 className={styles.sectionTitle}>Themes recommendation for you</h2>
                    <div className={styles.recommendationGrid}>
                        {recommendations.map((recTheme) => (
                            <ThemeCard
                                key={recTheme.id}
                                theme={recTheme}
                                onSelect={(id) => router.push(`/themes/${id}`)}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Preview Overlay */}
            {previewIndex !== null && (
                <div className={styles.overlayBackdrop} onClick={() => setPreviewIndex(null)}>
                    <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setPreviewIndex(null)}>
                            <X size={24} />
                            <span>Close</span>
                        </button>

                        <div className={styles.previewImageWrapper} style={{ background: theme.colors[0], borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <div style={{
                                color: theme.colors[2] || 'white',
                                fontSize: '2rem',
                                fontWeight: '700',
                                textAlign: 'center',
                                padding: '2rem'
                            }}>
                                {assets[previewIndex].name}
                            </div>
                            <Image
                                src={`/assets/themes/${themeId}/${assets[previewIndex].image}`}
                                alt={assets[previewIndex].name}
                                fill
                                style={{ objectFit: 'contain', zIndex: 2 }}
                                priority
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>

                        <div className={styles.previewInfo}>
                            <h3 className={styles.previewTitle}>{assets[previewIndex].name}</h3>
                            <p className={styles.previewCount}>
                                {previewIndex + 1} / {assets.length}
                            </p>
                        </div>

                        <div className={styles.navContainer}>
                            <button className={clsx(styles.navBtn, styles.prevBtn)} onClick={handlePrevPreview}>
                                <ChevronLeft size={32} />
                            </button>
                            <button className={clsx(styles.navBtn, styles.nextBtn)} onClick={handleNextPreview}>
                                <ChevronRight size={32} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
