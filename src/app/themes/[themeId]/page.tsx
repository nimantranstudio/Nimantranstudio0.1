'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, CheckCircle, Smartphone, Headphones, ShieldCheck, Share2, X, ChevronLeft, Clock, Printer, Languages, Download } from 'lucide-react';
import type { Theme } from '@/lib/constants/themes';
import { useWeddingStore } from '@/store/wedding-store';
import { ThemeCard } from '@/components/ui/ThemeCard';
import styles from './theme-detail.module.css';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { motion } from 'framer-motion';
import { InvitationCard } from '@/components/preview/InvitationCard';

const DUMMY_EVENT = {
    id: 'preview',
    name: undefined,
    heading: undefined,
    tagline: undefined,
    date: undefined,
    time: undefined,
    venue: undefined,
    description: undefined,
    isCustomVenue: false
};

export default function ThemeDetailPage({ params }: { params: Promise<{ themeId: string }> }) {
    const { themeId } = use(params);
    const router = useRouter();
    const { setThemeId, setBundleData, resetForm } = useWeddingStore();

    const [theme, setTheme] = useState<Theme | null>(null);
    const [recommendations, setRecommendations] = useState<Theme[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch packages first to have mappings
                const pkgRes = await fetch('/api/admin/packages');
                if (pkgRes.ok) {
                    const pkgData = await pkgRes.json();
                    setPackages(pkgData.packages || []);
                }

                // Fetch themes
                const res = await fetch('/api/themes');
                if (res.ok) {
                    const data = await res.json();
                    const allThemes: Theme[] = data.themes || [];
                    const foundTheme = allThemes.find(t => t.id === themeId);
                    setTheme(foundTheme || null);
                    setRecommendations(allThemes.filter(t => t.id !== themeId).slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch themes or packages", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [themeId]);

    // Accordion state
    const [openAccordion, setOpenAccordion] = useState<string | null>('what-you-get');

    // Preview Overlay state
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    // Pricing Plans
    const PLANS = {
        essentials: {
            id: 'essentials',
            label: 'WhatsApp Essentials',
            desc: 'Perfect for digital-only invites',
            price: '999',
            originalPrice: '2500',
            features: [
                "12 Unique Rajputana Wedding Designs",
                "High-Resolution JPEG/PNG Formats",
                "Optimized for WhatsApp & Social Media",
                "Ready in 2-5 Minutes",
                "Supports Hindi, English, Marathi",
                "No Watermark",
                "Delivery: Immediate download via dashboard after successful checkout."
            ]
        },
        posters: {
            id: 'posters',
            label: 'WhatsApp + Posters',
            desc: 'Digital invites plus print-ready posters',
            price: '1,999',
            originalPrice: '4500',
            features: [
                "Everything in WhatsApp Essentials",
                "A3 & A4 Print-Ready PDF Files",
                "High-Resolution CMYK for Printing",
                "Suitable for Wedding Venue Signage",
                "Standard Print Dimensions Included",
                "Priority Printing Support"
            ]
        },
        complete: {
            id: 'complete',
            label: 'Complete Wedding Suite',
            desc: 'The ultimate bundle for all your needs',
            price: '3,499',
            originalPrice: '7500',
            features: [
                "Everything in WhatsApp + Posters",
                "All 12+ Wedding Event Designs (Sangeet, Haldi, etc.)",
                "Complete Stationery Suite",
                "Source Files Included",
                "Dedicated Designer Support"
            ]
        }
    };

    const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>('complete');
    const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
    const [activeSlide, setActiveSlide] = useState(0);
    const [showStickyBar, setShowStickyBar] = useState(false);

    // Reset index if image list changes and index is out of bounds
    useEffect(() => {
        setSelectedAssetIndex(0);
        setActiveSlide(0);
    }, [selectedPlan]);

    // Track scroll for sticky bar
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 600; // Approx height of top section
            setShowStickyBar(scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const carouselRef = useRef<HTMLDivElement>(null);

    // Handle carousel scroll for dots
    const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const width = e.currentTarget.offsetWidth;
        // Improved logic:
        const index = Math.round(scrollLeft / width);
        setActiveSlide(index);
    };

    const scrollToSlide = (index: number) => {
        if (carouselRef.current) {
            const width = carouselRef.current.offsetWidth;
            carouselRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
            setActiveSlide(index);
        }
    };



    const handleCreateNow = () => {
        if (!theme) return;
        resetForm();
        setThemeId(theme.id);
        const items = activeBundle?.bundleItems || [];
        setBundleData(selectedPlan, imageList, items);
        router.push('/details');
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Theme link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy link: ', err);
        });
    };

    const formatPrice = (price: string | number) => {
        const num = typeof price === 'string' ? parseInt(price.replace(/,/g, '')) || 0 : price;
        return num.toLocaleString('en-IN');
    };

    // Find active bundle (default to first one)
    const activeBundle = theme && theme.bundles && theme.bundles.length > 0 ? theme.bundles[0] : null;

    // Dynamic Plans logic
    const DYNAMIC_PLANS = {
        essentials: {
            ...PLANS.essentials,
            price: activeBundle ? formatPrice(activeBundle.whatsappPrice) : PLANS.essentials.price,
        },
        posters: {
            ...PLANS.posters,
            price: activeBundle ? formatPrice(activeBundle.printablePrice) : PLANS.posters.price,
        },
        complete: {
            ...PLANS.complete,
            price: activeBundle ? formatPrice(activeBundle.completePrice) : PLANS.complete.price,
        }
    };

    const selectedPackageName = DYNAMIC_PLANS[selectedPlan].label;
    const currentPackage = packages.find(p => p.name === selectedPackageName);

    // Use theme.previewImages or fallback to empty array
    let imageList: string[] = [];
    if (activeBundle && activeBundle.itemImages) {
        try {
            const itemImagesObj = JSON.parse(activeBundle.itemImages);

            if (currentPackage) {
                const allowedItems = JSON.parse(currentPackage.allowedItems || '[]');
                // Filter items that are in the allowedItems list
                const filteredItems = Object.entries(itemImagesObj)
                    .filter(([itemName]) => allowedItems.includes(itemName))
                    .map(([_, imgUrl]) => imgUrl as string);

                imageList = filteredItems;
            } else {
                // Fallback to all images if package not found
                imageList = Object.values(itemImagesObj) as string[];
            }
        } catch (e) {
            imageList = theme?.previewImages || [];
        }
    } else {
        imageList = theme?.previewImages || [];
    }

    // Create a normalized assets structure for rendering
    const assets = imageList.length > 0 ? imageList.map((img, i) => ({
        name: `Design ${i + 1}`,
        image: img // Store full URL here
    })) : [
        { name: "No Preview", image: theme?.thumbnail || '/placeholder-theme.jpg' }
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

    if (isLoading) {
        return (
            <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
                <h2>Loading Theme Details...</h2>
            </div>
        );
    }

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

    // const recommendations = THEMES.filter(t => t.id !== themeId).slice(0, 4);

    return (
        <div className={styles.page}>
            {/* Header with Breadcrumb and Separator */}
            <header style={{
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                marginBottom: '2rem'
            }}>
                <div className="container" style={{ padding: '1.5rem 0' }}>
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Themes', href: '/themes' },
                            { label: theme.name, active: true },
                        ]}
                    />
                </div>
            </header>

            <div className="container">

                {/* Mobile Carousel */}
                <div
                    className={clsx(styles.mobileCarousel, styles.mobileOnly)}
                    onScroll={handleCarouselScroll}
                    ref={carouselRef}
                >
                    {assets.map((asset, index) => (
                        <div key={index} className={styles.carouselItem} onClick={() => setPreviewIndex(index)}>
                            {asset.image.endsWith('.html') ? (
                                <InvitationCard
                                    event={DUMMY_EVENT as any}
                                    theme={theme}
                                    groomName={undefined as unknown as string}
                                    brideName={undefined as unknown as string}
                                    groomParents={undefined}
                                    brideParents={undefined}
                                    customImage={asset.image}
                                />
                            ) : (
                                <Image
                                    src={asset.image}
                                    alt={asset.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            )}
                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7rem'
                            }}>
                                Swipe to view
                            </div>
                        </div>
                    ))}
                </div>
                {/* Carousel Dots - Mobile */}
                <div className={clsx(styles.carouselDots, styles.mobileOnly)}>
                    {assets.slice(0, 5).map((_, i) => (
                        <div
                            key={i}
                            className={clsx(styles.dot, activeSlide === i && styles.activeDot)}
                            onClick={() => scrollToSlide(i)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </div>

                <div className={styles.layout}>
                    {/* Left Column: Asset Grid Refactored (Desktop) */}
                    <div className={clsx(styles.galleryContainer, styles.desktopOnly)}>
                        {/* Main Image */}
                        <div
                            className={styles.mainImageWrapper}
                            onClick={() => setPreviewIndex(selectedAssetIndex)}
                        >
                            {assets[selectedAssetIndex].image.endsWith('.html') ? (
                                <InvitationCard
                                    event={DUMMY_EVENT as any}
                                    theme={theme}
                                    groomName={undefined as unknown as string}
                                    brideName={undefined as unknown as string}
                                    groomParents={undefined}
                                    brideParents={undefined}
                                    customImage={assets[selectedAssetIndex].image}
                                />
                            ) : (
                                <Image
                                    src={assets[selectedAssetIndex].image}
                                    alt={assets[selectedAssetIndex].name}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                        zIndex: 2
                                    }}
                                    priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            )}
                            <div style={{
                                position: 'absolute',
                                bottom: '1rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                backdropFilter: 'blur(4px)',
                                zIndex: 3
                            }}>
                                {assets[selectedAssetIndex].name}
                            </div>
                        </div>

                        {/* Desktop Dots Indicator */}
                        <div className={clsx(styles.carouselDots, styles.desktopOnly)} style={{ margin: '0.5rem 0' }}>
                            {assets.slice(0, 5).map((_, i) => (
                                <div
                                    key={i}
                                    className={clsx(styles.dot, (selectedAssetIndex % 5) === i && styles.activeDot)}
                                    // Make desktop dots clickable too
                                    onClick={() => setSelectedAssetIndex(i)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>

                        {/* Thumbnails */}
                        <div className={styles.thumbnailList}>
                            {assets.map((asset, index) => (
                                <div
                                    key={index}
                                    className={clsx(
                                        styles.thumbnailItem,
                                        selectedAssetIndex === index ? styles.thumbnailItemActive : styles.thumbnailItemInactive
                                    )}
                                    onClick={() => setSelectedAssetIndex(index)}
                                >
                                    {asset.image.endsWith('.html') ? (
                                        <InvitationCard
                                            event={DUMMY_EVENT as any}
                                            theme={theme}
                                            groomName={undefined as unknown as string}
                                            brideName={undefined as unknown as string}
                                            groomParents={undefined}
                                            brideParents={undefined}
                                            customImage={asset.image}
                                        />
                                    ) : (
                                        <Image
                                            src={asset.image}
                                            alt={asset.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className={styles.contentCol}>
                        <div>
                            <h1 className={styles.title} style={{ marginBottom: '0.25rem' }}>
                                {theme.name} | {theme.bundleName || 'Theme Invitation Bundle'}
                            </h1>
                            <p className={styles.description} style={{ marginBottom: '0.25rem', opacity: 0.8 }}>
                                Complete pack of 12 wedding designs
                            </p>
                            <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '0 0 0.75rem 0' }} />

                            {/* Package Selector (Universal) */}
                            <div className={styles.stackedSelectorContainer}>
                                <h3 className={styles.sectionLabel}>SELECT PACKAGE</h3>
                                <div className={styles.stackedSelector}>
                                    {(Object.values(DYNAMIC_PLANS) as Array<typeof PLANS['essentials']>).map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={clsx(styles.stackedOption, selectedPlan === plan.id && styles.stackedOptionActive)}
                                            onClick={() => setSelectedPlan(plan.id as keyof typeof PLANS)}
                                        >
                                            <div className={styles.optionInfo}>
                                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                                    <span className={styles.optionLabel}>{plan.label}</span>
                                                    {plan.id === 'posters' && (
                                                        <span className={styles.bestSellerBadge}>
                                                            Best Seller
                                                        </span>
                                                    )}
                                                    {selectedPlan === plan.id && <CheckCircle size={16} fill="#C5A065" color="white" />}
                                                </div>
                                                <span className={styles.optionDesc}>{plan.desc}</span>
                                            </div>
                                            <div className={styles.optionPrice}>
                                                ₹{plan.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>





                        <div className={styles.pricing}>
                            <span className={styles.currentPrice}>₹ {DYNAMIC_PLANS[selectedPlan].price}</span>
                            <span className={styles.originalPrice}>₹ {DYNAMIC_PLANS[selectedPlan].originalPrice}</span>
                            {(() => {
                                const price = parseInt(DYNAMIC_PLANS[selectedPlan].price.replace(/,/g, ''));
                                const original = parseInt(DYNAMIC_PLANS[selectedPlan].originalPrice.replace(/,/g, ''));
                                const discount = Math.round(((original - price) / original) * 100);
                                return (
                                    <span className={styles.discountBadge}>
                                        {discount}% OFF
                                    </span>
                                );
                            })()}
                        </div>

                        <div className={styles.actions}>
                            <button onClick={handleCreateNow} className="btn btn-primary" style={{ flex: 1 }}>
                                Create Now
                            </button>
                            <button className={styles.iconBtn} onClick={handleShare} title="Share Theme">
                                <Share2 size={24} />
                            </button>
                        </div>

                        {/* Value Highlights (Universal) */}
                        <div className={styles.valueHighlights}>
                            <div className={styles.highlightItem}>
                                <div className={styles.highlightIcon}><Clock size={20} /></div>
                                <span>Ready in 2–5<br />minutes</span>
                            </div>
                            <div className={styles.highlightItem}>
                                <div className={styles.highlightIcon}><Smartphone size={20} /></div>
                                <span>WhatsApp &<br />Print Ready</span>
                            </div>
                            <div className={styles.highlightItem}>
                                <div className={styles.highlightIcon}><Download size={24} /></div>
                                <span>Instant<br />Download</span>
                            </div>
                        </div>

                        <div className={styles.accordions}>
                            <div className={styles.accordion}>
                                <button className={styles.accordionHeader} onClick={() => toggleAccordion('what-you-get')}>
                                    What You Get <ChevronDown size={18} />
                                </button>
                                {openAccordion === 'what-you-get' && (
                                    <div className={styles.accordionContent}>
                                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {(() => {
                                                if (!currentPackage || !currentPackage.whatYouGet) {
                                                    return DYNAMIC_PLANS[selectedPlan].features.map((feature, i) => (
                                                        <li key={i}>{feature}</li>
                                                    ));
                                                }
                                                try {
                                                    const items = JSON.parse(currentPackage.whatYouGet);
                                                    return Array.isArray(items) ? items.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    )) : <li>{currentPackage.whatYouGet}</li>;
                                                } catch (e) {
                                                    return <li>{currentPackage.whatYouGet}</li>;
                                                }
                                            })()}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className={styles.accordion}>
                                <button className={styles.accordionHeader} onClick={() => toggleAccordion('highlights')}>
                                    Product Highlights <ChevronDown size={18} />
                                </button>
                                {openAccordion === 'highlights' && (
                                    <div className={styles.accordionContent}>
                                        {currentPackage && currentPackage.productHighlights ? (
                                            <div dangerouslySetInnerHTML={{ __html: currentPackage.productHighlights.replace(/\n/g, '<br/>') }} />
                                        ) : (
                                            <>
                                                <p style={{ marginBottom: '1rem' }}>
                                                    Premium typography, royal motifs, and culturally sensitive design elements crafted for a grand Indian wedding experience.
                                                </p>
                                                <p>
                                                    This bundle captures the grandeur of Rajputana culture. Each element is crafted with royal precision, ensuring your wedding invitation stands out as a masterpiece.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={styles.accordion}>
                                <button className={styles.accordionHeader} onClick={() => toggleAccordion('faq')}>
                                    FAQ <ChevronDown size={18} />
                                </button>
                                {openAccordion === 'faq' && (
                                    <div className={styles.accordionContent}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#1a1a1a' }}>How long does it take to get my designs?</p>
                                                <p style={{ color: '#666', fontSize: '0.9rem' }}>Our automated system ensures your designs are ready in 2–5 minutes after payment. You can download them instantly from your dashboard.</p>
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#1a1a1a' }}>What happens if I lose my download link?</p>
                                                <p style={{ color: '#666', fontSize: '0.9rem' }}>Don't worry! You can log in to your account anytime to access your purchase history and re-download your files.</p>
                                            </div>
                                        </div>
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
                        <button className={styles.closeBtn} onClick={() => setPreviewIndex(null)} style={{ top: '-3rem', zIndex: 10 }}>
                            <X size={28} />
                        </button>

                        <div className={styles.previewImageWrapper} style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {assets[previewIndex].image.endsWith('.html') ? (
                                <InvitationCard
                                    event={DUMMY_EVENT as any}
                                    theme={theme}
                                    groomName={undefined as unknown as string}
                                    brideName={undefined as unknown as string}
                                    groomParents={undefined}
                                    brideParents={undefined}
                                    customImage={assets[previewIndex].image}
                                />
                            ) : (
                                <Image
                                    src={assets[previewIndex].image}
                                    alt={assets[previewIndex].name}
                                    fill
                                    style={{ objectFit: 'contain', zIndex: 2 }}
                                    priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            )}
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

            {/* Sticky Bottom Bar */}
            <div className={clsx(styles.stickyBottomBar, showStickyBar && styles.stickyVisible, styles.mobileOnly)}>
                <div className={styles.stickyInfo}>
                    <span className={styles.stickyLabel}>{DYNAMIC_PLANS[selectedPlan].label}</span>
                    <span className={styles.stickyPrice}>₹{DYNAMIC_PLANS[selectedPlan].price}</span>
                </div>
                <button onClick={handleCreateNow} className={clsx("btn btn-primary", styles.stickyBtn)}>
                    Create Now
                </button>
            </div>
        </div>
    );
}
