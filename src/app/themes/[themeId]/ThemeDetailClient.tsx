'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Heart,
    Calendar,
    MapPin,
    Share2,
    Download,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Check,
    ChevronDown,
    Smartphone,
    Headphones,
    ShieldCheck,
    X,
    Clock,
    Printer,
    Languages,
    Mail,
    Activity,
    Star,
    Play
} from 'lucide-react';
import type { Theme } from '@/lib/constants/themes';
import { useWeddingStore } from '@/store/wedding-store';
import { ThemeCard } from '@/components/ui/ThemeCard';
import styles from './theme-detail.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
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

export default function ThemeDetailClient({ 
    themeId, 
    initialTheme, 
    initialPackages, 
    initialRecommendations 
}: { 
    themeId: string,
    initialTheme: any,
    initialPackages: any[],
    initialRecommendations: any[]
}) {
    const router = useRouter();
    const { setThemeId, setBundleData, resetForm } = useWeddingStore();

    const [theme, setTheme] = useState<Theme | null>(initialTheme);
    const [recommendations, setRecommendations] = useState<Theme[]>(initialRecommendations);
    const [packages, setPackages] = useState<any[]>(initialPackages);

    // Accordion state
    const [openAccordion, setOpenAccordion] = useState<string | null>('what-you-get');

    // Preview Overlay state
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const activeBundle = theme?.bundles?.[0];

    const getInvoiceForPlan = (planLabel: string) => {
        const targetPackage = packages.find((p: any) => p.name === planLabel);
        if (!targetPackage) return null;
        return activeBundle?.bundleInvoices?.find((inv: any) => inv.packageId === targetPackage.id);
    };

    const essentialsInvoice = getInvoiceForPlan('WhatsApp Essentials');
    const postersInvoice = getInvoiceForPlan('WhatsApp + Posters');
    const completeInvoice = getInvoiceForPlan('Complete Wedding Suite');

    // Pricing Plans
    const PLANS = {
        essentials: {
            id: 'essentials',
            label: 'WhatsApp Essentials',
            desc: 'Perfect for digital-only invites',
            price: essentialsInvoice?.finalSellingPrice?.toString() || '0',
            originalPrice: essentialsInvoice?.totalWeddingSuiteValue?.toString() || '0',
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
            price: postersInvoice?.finalSellingPrice?.toString() || '0',
            originalPrice: postersInvoice?.totalWeddingSuiteValue?.toString() || '0',
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
            price: completeInvoice?.finalSellingPrice?.toString() || '0',
            originalPrice: completeInvoice?.totalWeddingSuiteValue?.toString() || '0',
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

    // Auto-cycling gallery slideshow
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startAutoPlay = useCallback(() => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            setSelectedAssetIndex((prev) => {
                const maxIndex = Math.min(assets?.length || 1, 5);
                return (prev + 1) % maxIndex;
            });
        }, 3000); // Change every 3 seconds (slow)
    }, []);

    // Pause auto-play on manual interaction, resume after 6s
    const pauseAndResume = useCallback(() => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => {
            startAutoPlay();
        }, 6000);
    }, [startAutoPlay]);

    // Start auto-cycling on mount
    useEffect(() => {
        startAutoPlay();
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
            if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        };
    }, [startAutoPlay]);

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
        setBundleData(selectedPlan, imageList.map(a => a.image), items as any);
        
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
    // Find active bundle (default to first one) - already defined above as activeBundle

    // Helper to find specific invoice price
    const getPackagePrice = (pkgLabel: string, fallback: string) => {
        const pkg = packages.find(p => p.name === pkgLabel);
        if (pkg && activeBundle && activeBundle.bundleInvoices) {
            const invoice = activeBundle.bundleInvoices.find((inv: any) => inv.packageId === pkg.id);
            if (invoice) return formatPrice(invoice.finalSellingPrice);
        }
        return fallback;
    };

    // Dynamic Plans logic using the new bundleInvoices table
    const DYNAMIC_PLANS = {
        essentials: {
            ...PLANS.essentials,
            price: getPackagePrice('WhatsApp Essentials', PLANS.essentials.price),
        },
        posters: {
            ...PLANS.posters,
            price: getPackagePrice('WhatsApp + Posters', PLANS.posters.price),
        },
        complete: {
            ...PLANS.complete,
            price: getPackagePrice('Complete Wedding Suite', PLANS.complete.price),
        }
    };

    let displayConfig = initialDisplayConfig;

    const selectedPackageName = DYNAMIC_PLANS[selectedPlan] ? DYNAMIC_PLANS[selectedPlan].label : '';
    const currentPackage = packages.find(p => p.name === selectedPackageName);

    // Use theme.previewImages as requested by the user
    let imageList: { name: string, image: string }[] = theme?.previewImages && theme.previewImages.length > 0 
        ? theme.previewImages.map((img: string, i: number) => ({ name: `Preview ${i+1}`, image: img }))
        : [{ name: "Preview", image: theme?.thumbnail || '/placeholder-theme.jpg' }];

    // Create a normalized assets structure for rendering
    const assets = imageList;


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
                            { label: theme?.name || 'Loading...', active: true },
                        ]}
                    />
                </div>
            </header>

            <div className="container">

                <div
                    className={clsx(styles.mobileCarousel, styles.mobileOnly)}
                    onScroll={handleCarouselScroll}
                    ref={carouselRef}
                >
                    {assets.map((asset, index) => (
                        <div key={index} className={styles.carouselItem} onClick={() => setPreviewIndex(index)}>
                            {asset.image.toLowerCase().endsWith('.html') ? (
                                <InvitationCard
                                    event={DUMMY_EVENT as any}
                                    theme={theme}
                                    groomName={undefined as unknown as string}
                                    brideName={undefined as unknown as string}
                                    groomParents={undefined}
                                    brideParents={undefined}
                                    customImage={asset.image}
                                    isRawPreview={true}
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
                    <div className={clsx(styles.leftColumn, styles.desktopOnly)}>
                        <div className={styles.galleryContainer}>
                        {/* Thumbnails on the left */}
                        <div className={styles.thumbnailList}>
                            {assets.slice(0, 4).map((asset, index) => (
                                <div
                                    key={index}
                                    className={clsx(
                                        styles.thumbnailItem,
                                        selectedAssetIndex === index ? styles.thumbnailItemActive : styles.thumbnailItemInactive
                                    )}
                                    onClick={() => { setSelectedAssetIndex(index); pauseAndResume(); }}
                                >
                                    <div className={styles.thumbnailItemInner}>
                                        {asset.image.toLowerCase().endsWith('.html') ? (
                                            <InvitationCard
                                                event={DUMMY_EVENT as any}
                                                theme={theme}
                                                groomName={undefined as unknown as string}
                                                brideName={undefined as unknown as string}
                                                groomParents={undefined}
                                                brideParents={undefined}
                                                customImage={asset.image}
                                                isRawPreview={true}
                                            />
                                        ) : (
                                            <Image
                                                src={asset.image}
                                                alt={asset.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        )}
                                        {/* Show Video Badge if name contains video */}
                                        {(asset.name.toLowerCase().includes('video')) && (
                                            <div className={styles.videoBadge}>
                                                <div className={styles.playIconBg}>
                                                    <Play size={14} fill="currentColor" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {assets.length > 4 && (
                                <div className={styles.moreDesignsBtn} onClick={() => setPreviewIndex(0)}>
                                    <span className={styles.moreDesignsCount}>+{assets.length - 4}</span>
                                    <span>More<br />Designs</span>
                                </div>
                            )}
                        </div>

                        {/* Main Image on the right - Crossfade Stack */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                <div
                                    className={styles.mainImageWrapper}
                                    onClick={() => setPreviewIndex(selectedAssetIndex)}
                                >
                                    {assets.slice(0, 5).map((asset, idx) => (
                                        asset.image.toLowerCase().endsWith('.html') ? (
                                            <div
                                                key={asset.image + idx}
                                                className={clsx(styles.crossfadeLayer, {
                                                    [styles.crossfadeLayerActive]: idx === selectedAssetIndex
                                                })}
                                            >
                                                <InvitationCard
                                                    event={DUMMY_EVENT as any}
                                                    theme={theme}
                                                    groomName={undefined as unknown as string}
                                                    brideName={undefined as unknown as string}
                                                    groomParents={undefined}
                                                    brideParents={undefined}
                                                    customImage={asset.image}
                                                    isRawPreview={true}
                                                />
                                            </div>
                                        ) : (
                                            <Image
                                                key={asset.image + idx}
                                                src={asset.image}
                                                alt={asset.name}
                                                fill
                                                className={clsx(styles.crossfadeLayer, {
                                                    [styles.crossfadeLayerActive]: idx === selectedAssetIndex
                                                })}
                                                style={{ objectFit: 'cover' }}
                                                priority={idx === 0}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )
                                    ))}
                                </div>

                            {/* Floating Prev Button */}
                            <div className={styles.galleryPrevBtn} onClick={() => {
                                setSelectedAssetIndex((prev) => (prev - 1 + Math.min(assets.length, 5)) % Math.min(assets.length, 5));
                                pauseAndResume();
                            }}>
                                <ChevronLeft size={24} />
                            </div>

                            {/* Floating Next Button */}
                            <div className={styles.galleryNextBtn} onClick={() => {
                                setSelectedAssetIndex((prev) => (prev + 1) % Math.min(assets.length, 5));
                                pauseAndResume();
                            }}>
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    </div>
                        {/* See the full experience section */}
                        <div className={styles.experienceSection}>
                            <div className={styles.experienceHeader}>
                                <h3 className={styles.experienceTitle}>See the full experience</h3>
                            </div>
                            <div className={styles.experienceGrid}>
                                <div className={styles.experienceCard}>
                                    <div className={styles.cardPreview}>
                                        <img src="/images/experience/whatsapp.png" alt="WhatsApp Share Preview" />
                                    </div>
                                    <span className={styles.cardLabel}>Share on WhatsApp</span>
                                </div>
                                <div className={styles.experienceCard}>
                                    <div className={styles.cardPreview}>
                                        <img src="/images/experience/rsvp.png" alt="Guest RSVP Preview" />
                                    </div>
                                    <span className={styles.cardLabel}>Guest RSVP</span>
                                </div>
                                <div className={styles.experienceCard}>
                                    <div className={styles.cardPreview}>
                                        <img src="/images/experience/tracking.png" alt="Track in Real Time Preview" />
                                    </div>
                                    <span className={styles.cardLabel}>Track in Real Time</span>
                                </div>
                                <div className={styles.experienceCard}>
                                    <div className={styles.cardPreview}>
                                        <img src="/images/experience/events.png" alt="Manage All Events Preview" />
                                    </div>
                                    <span className={styles.cardLabel}>Manage All Events</span>
                                </div>
                            </div>
                        </div>


                        </div>

                    {/* Right Column: Content */}
                    <div className={styles.contentCol}>
                        <div>
                            <h1 className={styles.title}>
                                {theme?.name || 'Suvarna Sohala'} | {theme?.bundleName || 'Premium Bundle'}
                            </h1>
                            <p className={styles.description}>
                                A complete wedding communication system not just an invite
                            </p>

                            {/* Package Selector (Universal) */}
                            {displayConfig.enabled && (
                            <div className={styles.stackedSelectorContainer}>


                                <div className={styles.stackedSelector}>
                                    {(Object.values(DYNAMIC_PLANS) as Array<typeof PLANS['essentials']>)
                                        .filter(plan => displayConfig.items[plan.label])
                                        .map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={clsx(styles.stackedOption, selectedPlan === plan.id && styles.stackedOptionActive)}
                                            onClick={() => setSelectedPlan(plan.id as keyof typeof PLANS)}
                                        >
                                            
                                            {/* Removed Essentials Badge */}
                                            <div className={styles.optionInfo}>
                                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                                    {plan.id !== 'essentials' && <span className={styles.optionLabel}>{plan.label}</span>}
                                                    {plan.id === 'posters' && (
                                                        <span className={styles.bestSellerBadge}>
                                                            Best Seller
                                                        </span>
                                                    )}
                                                    {selectedPlan === plan.id && plan.id !== 'essentials' && <CheckCircle size={16} fill="#C5A065" color="white" />}
                                                </div>
                                                {plan.id === 'essentials' ? (
                                                    <div className={styles.essentialsDetails}>

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <p className={styles.essentialsInBoxTitle}>Create, Share, and Manage your wedding In minutes.</p>

                                                                <p className={styles.essentialsInBoxSubtext}>Includes 6 event invites + RSVP system + Wedding dashboard</p>
                                                            </div>
                                                        </div>

                                                        <div className={styles.essentialsItemRow}>
                                                            <div className={styles.categoryHeader}>
                                                                <motion.div 
                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                    whileHover={{ scale: 1.35 }}
                                                                    animate={{ 
                                                                        scale: 1,
                                                                        opacity: 1
                                                                    }}
                                                                    transition={{ 
                                                                        type: "spring", stiffness: 400, damping: 10
                                                                    }}
                                                                    className={styles.tickCircle}
                                                                >
                                                                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <motion.path 
                                                                            d="M1 4.5L3.5 7L9 1" 
                                                                            stroke="white" 
                                                                            strokeWidth="2.5" 
                                                                            strokeLinecap="round" 
                                                                            strokeLinejoin="round"
                                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                                            animate={{ pathLength: 1, opacity: 1 }}
                                                                            transition={{ duration: 0.4 }}
                                                                        />
                                                                    </svg>
                                                                </motion.div>
                                                                <span className={styles.categoryLabel}>Wedding Invitations</span>
                                                            </div>
                                                            <span className={styles.itemName}>Save the Date · Wedding Invitation</span>
                                                        </div>
                                                        
                                                        <div className={styles.essentialsItemRow}>
                                                            <div className={styles.categoryHeader}>
                                                                <motion.div 
                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                    whileHover={{ scale: 1.35 }}
                                                                    animate={{ 
                                                                        scale: 1,
                                                                        opacity: 1
                                                                    }}
                                                                    transition={{ 
                                                                        type: "spring", stiffness: 400, damping: 10
                                                                    }}
                                                                    className={styles.tickCircle}
                                                                >
                                                                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <motion.path 
                                                                            d="M1 4.5L3.5 7L9 1" 
                                                                            stroke="white" 
                                                                            strokeWidth="2.5" 
                                                                            strokeLinecap="round" 
                                                                            strokeLinejoin="round"
                                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                                            animate={{ pathLength: 1, opacity: 1 }}
                                                                            transition={{ duration: 0.4 }}
                                                                        />
                                                                    </svg>
                                                                </motion.div>
                                                                <span className={styles.categoryLabel}>Wedding Events</span>
                                                            </div>
                                                            <span className={styles.itemName}>Haldi · Mehendi · Sangeet · Reception</span>
                                                        </div>

                                                        <div className={styles.essentialsItemRow}>
                                                            <div className={styles.categoryHeader}>
                                                                <motion.div 
                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                    whileHover={{ scale: 1.35 }}
                                                                    animate={{ 
                                                                        scale: 1,
                                                                        opacity: 1
                                                                    }}
                                                                    transition={{ 
                                                                        type: "spring", stiffness: 400, damping: 10
                                                                    }}
                                                                    className={styles.tickCircle}
                                                                >
                                                                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <motion.path 
                                                                            d="M1 4.5L3.5 7L9 1" 
                                                                            stroke="white" 
                                                                            strokeWidth="2.5" 
                                                                            strokeLinecap="round" 
                                                                            strokeLinejoin="round"
                                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                                            animate={{ pathLength: 1, opacity: 1 }}
                                                                            transition={{ duration: 0.4 }}
                                                                        />
                                                                    </svg>
                                                                </motion.div>
                                                                <span className={styles.categoryLabel}>Closing & Gratitude</span>
                                                            </div>
                                                            <span className={styles.itemName}>Thank You Card</span>
                                                        </div>

                                                        <div className={styles.essentialsItemRow}>
                                                            <div className={styles.categoryHeader}>
                                                                <motion.div 
                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                    whileHover={{ scale: 1.35 }}
                                                                    animate={{ 
                                                                        scale: 1,
                                                                        opacity: 1
                                                                    }}
                                                                    transition={{ 
                                                                        type: "spring", stiffness: 400, damping: 10
                                                                    }}
                                                                    className={styles.tickCircle}
                                                                >
                                                                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <motion.path 
                                                                            d="M1 4.5L3.5 7L9 1" 
                                                                            stroke="white" 
                                                                            strokeWidth="2.5" 
                                                                            strokeLinecap="round" 
                                                                            strokeLinejoin="round"
                                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                                            animate={{ pathLength: 1, opacity: 1 }}
                                                                            transition={{ duration: 0.4 }}
                                                                        />
                                                                    </svg>
                                                                </motion.div>
                                                                <span className={styles.categoryLabel}>Guest Experience</span>
                                                            </div>
                                                            <span className={styles.itemName}>RSVP · Guest Dashboard · Response Insights</span>
                                                                <div className={styles.itemJourneyRow}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8.5px' }}>
                                                                        <div className={styles.tickCircle}>
                                                                            <svg width="8" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M1 4.5L3.5 7L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className={styles.itemJourney}>
                                                                            Invite <span className={styles.journeySeparator}>→</span> Share <span className={styles.journeySeparator}>→</span> RSVP <span className={styles.journeySeparator}>→</span> Track
                                                                        </div>
                                                                    </div>
                                                                    <span className={styles.itemSupport}>Stay organised. Stay in control. Celebrate without the chaos.</span>
                                                                </div>
                                                        </div>

                                                        {/* Inline Pricing Breakdown */}
                                                        <hr className={styles.cardDivider} />
                                                        <div className={styles.inlinePricing}>
                                                            <div className={styles.pricingLeft}>
                                                                <div className={styles.saveLabel}>You save ₹{parseInt(DYNAMIC_PLANS[selectedPlan].originalPrice.replace(/,/g, '')) - parseInt(DYNAMIC_PLANS[selectedPlan].price.replace(/,/g, ''))}</div>
                                                                 <div className={styles.noSubscriptionLabel}>One-time payment. No subscriptions.</div>
                                                            </div>
                                                            <div className={styles.pricingRight}>
                                                                <div className={styles.worthLabel}>Total value <span className={styles.strikethrough}>₹{DYNAMIC_PLANS[selectedPlan].originalPrice}</span></div>
                                                                <span className={styles.todayPrice}>₹{DYNAMIC_PLANS[selectedPlan].price}</span>
                                                            </div>
                                                        </div>

                                                        {/* Action button inside the box */}
                                                        <div className={styles.inBoxActions}>
                                                            <button onClick={handleCreateNow} className={clsx("btn btn-primary", styles.mainActionButton)}>
                                                                Start My Wedding Setup
                                                            </button>
                                                            <p className={styles.socialProofText}>Most couples start sharing invites within 10 minutes after Creation.</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className={styles.optionDesc}>{plan.desc}</span>
                                                )}
                                            </div>
                                            {plan.id !== 'essentials' && (
                                                <div className={styles.optionPrice}>
                                                    ₹{plan.price}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            )}
                        </div>



                        {/* Value Highlights (Universal) */}
                        <div className={styles.valueHighlights}>
                            <div className={styles.highlightItem}>
                                <div className={styles.highlightIcon}><ShieldCheck size={24} /></div>
                                <span>100% Secure<br />Payments</span>
                            </div>
                            <div className={styles.highlightItem}>
                                <div className={styles.highlightIcon}><Clock size={20} /></div>
                                <span>Ready in 2–5<br />minutes</span>
                            </div>
                            <div className={styles.highlightItem}>
                                <div className={styles.highlightIcon}><Smartphone size={20} /></div>
                                <span>High quality &<br />WhatsApp Ready</span>
                            </div>
                            <div className={styles.highlightItem}>
                                <div className={styles.highlightIcon}><Download size={24} /></div>
                                <span>Instant<br />Download</span>
                            </div>
                        </div>

                        <div className={styles.accordions}>
                            <div className={styles.accordion}>
                                <button className={styles.accordionHeader} onClick={() => toggleAccordion('what-you-get')}>
                                    What You Get <ChevronDown size={18} style={{ transform: openAccordion === 'what-you-get' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
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
                                    Product Highlights <ChevronDown size={18} style={{ transform: openAccordion === 'highlights' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
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
                                    FAQ <ChevronDown size={18} style={{ transform: openAccordion === 'faq' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
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
                                        <span className={styles.supportValue}>+91 80105 81916</span>
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
                {recommendations.length > 0 && (
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
                )}
            </div>

            {/* Preview Overlay */}
            {previewIndex !== null && (
                <div className={styles.overlayBackdrop} onClick={() => setPreviewIndex(null)}>
                    <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setPreviewIndex(null)} style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 100 }}>
                            <X size={28} />
                        </button>

                        <div className={styles.previewImageWrapper} style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {assets[previewIndex].image.toLowerCase().endsWith('.html') ? (
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
                                    style={{ objectFit: 'cover', zIndex: 2 }}
                                    priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>

                        <div className={styles.previewInfo}>
                            <p className={styles.previewCount}>
                                {previewIndex + 1} / {assets.length}
                            </p>
                        </div>

                        <div className={styles.lightboxThumbnails}>
                            {assets.map((asset, index) => (
                                <div 
                                    key={index}
                                    className={clsx(styles.lightboxThumbItem, previewIndex === index && styles.lightboxThumbActive)}
                                    onClick={() => setPreviewIndex(index)}
                                >
                                    {asset.image.toLowerCase().endsWith('.html') ? (
                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#FDFBF7' }} />
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
