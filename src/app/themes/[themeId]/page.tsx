'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, CheckCircle, Smartphone, Headphones, ShieldCheck, Share2, X, ChevronLeft, Clock, Printer, Languages, Download, Heart } from 'lucide-react';
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
    const [isPersonalising, setIsPersonalising] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

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

    const activeBundleObj = theme && theme.bundles && theme.bundles.length > 0 ? theme.bundles[0] : null;

    let initialDisplayConfig = {
        enabled: true,
        items: {
            'WhatsApp Essentials': false,
            'WhatsApp + Posters': false,
            'Complete Wedding Suite': false
        } as Record<string, boolean>
    };

    if (activeBundleObj && activeBundleObj.bundleInvoices) {
        activeBundleObj.bundleInvoices.forEach((inv: any) => {
            const pkg = packages.find(p => p.id === inv.packageId);
            if (pkg && pkg.name) {
                initialDisplayConfig.items[pkg.name] = inv.isDisplay === true;
            }
        });
        const hasAnyEnabled = Object.values(initialDisplayConfig.items).some(v => v === true);
        initialDisplayConfig.enabled = hasAnyEnabled;
    } else {
        initialDisplayConfig.enabled = false;
    }

    // Auto-select the first available plan if current is disabled
    useEffect(() => {
        if (!initialDisplayConfig.enabled) return;
        const currentPlanObj = PLANS[selectedPlan];
        if (currentPlanObj && initialDisplayConfig.items[currentPlanObj.label] === false) {
            const firstEnabledId = Object.keys(PLANS).find(k => initialDisplayConfig.items[PLANS[k as keyof typeof PLANS].label]);
            if (firstEnabledId) {
                setSelectedPlan(firstEnabledId as keyof typeof PLANS);
            }
        }
    }, [theme, selectedPlan]);

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
        
        // Prepare store before navigation
        resetForm();
        setThemeId(theme.id);
        const items = activeBundle?.bundleItems || [];
        setBundleData(selectedPlan, imageList.map(a => a.image), items);
        
        // Navigate immediately with trigger
        router.push('/details?welcome=true');
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Theme link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy link: ', err);
        });
    };

    const formatPrice = (price: string | number | undefined | null) => {
        if (price === undefined || price === null) return "0";
        const num = typeof price === 'string' ? parseInt(price.replace(/,/g, '')) || 0 : price;
        return (num || 0).toLocaleString('en-IN');
    };

    // Find active bundle (default to first one)
    const activeBundle = theme && theme.bundles && theme.bundles.length > 0 ? theme.bundles[0] : null;

    // Helper to find specific invoice
    const getPackageInvoice = (pkgLabel: string) => {
        const pkg = packages.find(p => p.name === pkgLabel);
        if (pkg && activeBundle && activeBundle.bundleInvoices) {
            return activeBundle.bundleInvoices.find((inv: any) => inv.packageId === pkg.id);
        }
        return null;
    };

    const getDynamicPlan = (key: keyof typeof PLANS, label: string) => {
        const basePlan = PLANS[key];
        const invoice = getPackageInvoice(label);
        
        let price = basePlan.price;
        let originalPrice = basePlan.originalPrice;
        
        if (invoice) {
            if (invoice.finalSellingPrice !== undefined && invoice.finalSellingPrice !== null) {
                price = formatPrice(invoice.finalSellingPrice);
            }
            if (invoice.totalWeddingSuiteValue !== undefined && invoice.totalWeddingSuiteValue !== null) {
                originalPrice = formatPrice(invoice.totalWeddingSuiteValue);
            }
        }
        
        return {
            ...basePlan,
            price,
            originalPrice
        };
    };

    // Dynamic Plans logic using the new bundleInvoices table
    const DYNAMIC_PLANS = {
        essentials: getDynamicPlan('essentials', 'WhatsApp Essentials'),
        posters: getDynamicPlan('posters', 'WhatsApp + Posters'),
        complete: getDynamicPlan('complete', 'Complete Wedding Suite'),
    };

    let displayConfig = initialDisplayConfig;

    const selectedPackageName = DYNAMIC_PLANS[selectedPlan] ? DYNAMIC_PLANS[selectedPlan].label : '';
    const currentPackage = packages.find(p => p.name === selectedPackageName);

    // Use theme.bundleItems from the relational table or fallback to previewImages
    let imageList: { name: string, image: string }[] = [];
    
    if (activeBundle && activeBundle.bundleItems && activeBundle.bundleItems.length > 0) {
        const allowedItems = currentPackage ? JSON.parse(currentPackage.allowedItems || '[]') : [];
        
        const filtered = activeBundle.bundleItems
            .filter((item: any) => {
                if (!currentPackage) return true;
                if (!allowedItems || allowedItems.length === 0) return true;
                if (!item.eventId) return true;
                return allowedItems.includes(item.eventId);
            })
            .map((item: any) => ({
                name: item.event?.eventName || item.templateName || 'Design',
                image: item.templatePath
            }));
            
        imageList = filtered;
    }

    // Create a normalized assets structure for rendering
    const assets = imageList.length > 0 ? imageList : (
        theme?.previewImages && theme.previewImages.length > 0 
            ? theme.previewImages.map((img: string, i: number) => ({ name: `Preview ${i+1}`, image: img }))
            : [{ name: "Preview", image: theme?.thumbnail || '/placeholder-theme.jpg' }]
    );


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
            {/* Personalization Transition Screen removed - moved to /details */}

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
                            {displayConfig.enabled && (
                            <div className={styles.stackedSelectorContainer}>
                                <h3 className={styles.sectionLabel}>SELECT PACKAGE</h3>
                                <div className={styles.stackedSelector}>
                                    {(Object.values(DYNAMIC_PLANS) as Array<typeof PLANS['essentials']>)
                                        .filter(plan => displayConfig.items[plan.label])
                                        .map((plan) => (
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
                            )}
                        </div>





                        <div className={styles.pricing}>
                            <span className={styles.currentPrice}>₹ {DYNAMIC_PLANS[selectedPlan].price}</span>
                            <span className={styles.originalPrice}>₹ {DYNAMIC_PLANS[selectedPlan].originalPrice}</span>
                            {(() => {
                                const priceStr = DYNAMIC_PLANS[selectedPlan].price?.toString() || "0";
                                const originalStr = DYNAMIC_PLANS[selectedPlan].originalPrice?.toString() || "0";
                                const price = parseInt(priceStr.replace(/,/g, '')) || 0;
                                const original = parseInt(originalStr.replace(/,/g, '')) || 0;
                                const discount = original > 0 ? Math.round(((original - price) / original) * 100) : 0;
                                return discount > 0 ? (
                                    <span className={styles.discountBadge}>
                                        {discount}% OFF
                                    </span>
                                ) : null;
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

// --- Sub Components ---

function WeddingCelebration() {
    const particles = useRef(
        Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: -10 - Math.random() * 20,
            size: 8 + Math.random() * 12,
            type: ['heart', 'petal', 'sparkle', 'flake'][Math.floor(Math.random() * 4)],
            color: ['#D4AF37', '#FDFBF7', '#FDA4AF', '#EBCDC3'][Math.floor(Math.random() * 4)],
            duration: 4.0 + Math.random() * 2.0, // Slowed down fall speed
            delay: Math.random() * 0.8,
            rotation: Math.random() * 360,
            drift: (Math.random() - 0.5) * 40
        }))
    );

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0
        }}>
            {particles.current.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: `${p.x}vw`,
                        y: `${p.y}vh`,
                        rotate: p.rotation,
                        opacity: 1,
                        scale: 0.5
                    }}
                    animate={{
                        y: '110vh',
                        x: `${p.x + p.drift}vw`,
                        rotate: p.rotation + 720,
                        opacity: [1, 1, 0],
                        scale: [0.8, 1, 0.7]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        color: p.color,
                        filter: p.size < 12 ? 'blur(1px)' : 'none',
                        opacity: 0.8
                    }}
                >
                    {p.type === 'heart' && <Heart size={p.size} fill="currentColor" stroke="none" />}
                    {p.type === 'petal' && (
                        <div style={{
                            width: p.size,
                            height: p.size * 0.7,
                            background: 'currentColor',
                            borderRadius: '50% 0 50% 0',
                            transform: 'rotate(45deg)'
                        }} />
                    )}
                    {p.type === 'sparkle' && (
                        <div style={{
                            width: 2,
                            height: p.size,
                            background: 'currentColor',
                            boxShadow: `0 0 ${p.size / 2}px currentColor`
                        }} />
                    )}
                    {p.type === 'flake' && (
                        <div style={{
                            width: p.size / 2,
                            height: p.size / 2,
                            background: 'currentColor',
                            borderRadius: '2px'
                        }} />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
