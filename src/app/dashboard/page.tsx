'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import type { Theme } from '@/lib/constants/themes';
import styles from './dashboard.module.css';
import { 
    Users, 
    FileText, 
    CheckCircle2, 
    Clock, 
    Plus,
    LayoutDashboard,
    ArrowRight,
    Eye,
    QrCode,
    Share2,
    Calendar,
    Edit3,
    MessageCircle,
    Download,
    Sparkles,
    Check,
    Lock,
    Zap,
    Play,
    Copy,
    Link2,
    ExternalLink,
    MapPin,
    Quote,
    MoreVertical
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const { formData, selectedThemeId, isAuthenticated, bundleImages, bundleItems, lastSavedWeddingId } = useWeddingStore();
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const cardRef = useRef<InvitationCardRef>(null);
    const [lightbox, setLightbox] = useState<{ image: string | null; title: string } | null>(null);
    const [bundleAssets, setBundleAssets] = useState<Record<string, string>>({});

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        fetch('/api/bundle-assets')
            .then(r => r.json())
            .then(d => setBundleAssets(d.assets || {}))
            .catch(() => {});
    }, []);

    useEffect(() => {
        async function fetchTheme() {
            if (!selectedThemeId) return;
            try {
                const res = await fetch(`/api/themes/${selectedThemeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTheme(data.theme);
                }
            } catch (error) {
                console.error("Failed to fetch theme", error);
            }
        }
        fetchTheme();
    }, [selectedThemeId]);

    const buildPreviewItems = () => {
        const ensureLeadingSlash = (path: string) => {
            if (!path) return '';
            if (path.startsWith('http') || path.startsWith('/')) return path;
            return `/${path}`;
        };

        if (!bundleItems || bundleItems.length === 0) {
            // When we have a theme + events, generate event-specific poster paths
            if (theme?.name && formData.events && formData.events.length > 0) {
                const themeSlug = theme.name.toLowerCase().replace(/\s+/g, '-');
                return formData.events.map((event, index) => {
                    const eventSlug = (event.eventType || event.name || '').toLowerCase().replace(/\s+/g, '-');
                    return {
                        id: `event-${index}`,
                        name: event.name || 'Event',
                        image: `/assets/themes/${themeSlug}/${eventSlug}-poster.png`,
                        event: event
                    };
                });
            }

            const displayImages = (bundleImages && bundleImages.length > 0) ? bundleImages : (theme?.previewImages || []);
            return displayImages.map((imgUrl, index) => ({
                id: `design-${index}`,
                name: index === 0 ? "Wedding poster" : "Event Design",
                image: ensureLeadingSlash(imgUrl),
                event: (formData.events?.[index]) || (formData.events?.[0]) || { name: 'Main Event' }
            }));
        }

        return bundleItems.map((bi) => {
            const biType = bi.eventType || '';
            const matchedEvent = formData.events?.find(e => (e.eventType || '').toUpperCase() === biType.toUpperCase()) || formData.events?.[0] || { name: 'Wedding' };

            return {
                id: bi.id,
                name: bi.templateName || bi.eventType,
                image: ensureLeadingSlash(bi.templatePath),
                event: matchedEvent
            };
        });
    };

    const previewItems = buildPreviewItems();

    const getEventImage = (event: { name?: string; eventType?: string }) => {
        const tryKeys = [
            `${(event.name || '').toLowerCase()} invitation`,
            `${(event.eventType || '').toLowerCase()} invitation`,
            (event.name || '').toLowerCase(),
            (event.eventType || '').toLowerCase(),
        ];
        for (const key of tryKeys) {
            if (key && bundleAssets[key]) return bundleAssets[key];
        }
        return null;
    };

    const rsvpFullUrl = lastSavedWeddingId
        ? `${typeof window !== 'undefined' ? window.location.origin : 'https://nimantranwebsite.vercel.app'}/rsvp/${lastSavedWeddingId}`
        : '';
    const [copyStatus, setCopyStatus] = useState(false);

    const handleCopyRsvpLink = async () => {
        if (!rsvpFullUrl) return;
        try {
            await navigator.clipboard.writeText(rsvpFullUrl);
            setCopyStatus(true);
            setTimeout(() => setCopyStatus(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    if (!isMounted || !isAuthenticated) return null;

    return (
        <>
        <div className={styles.dashboardContainer}>
            <DashboardSidebar />
            
            <main className={styles.mainContent}>
                {/* 1. Header with just the Title */}
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.title}>Welcome back, {formData.groomName?.split(' ')[0] || 'Vivek'}</h1>
                    <p className={styles.subtitle}>Your wedding preparation is on track. Everything looks perfect.</p>
                </div>

                {/* 2. Structured Content Row for perfect sibling alignment */}
                <div className={styles.contentRow} style={{ marginTop: '3rem' }}>
                    <div className={styles.mainColumn}>
                        {/* Wedding Events Section (Aligned Top) */}
                        <div className={styles.eventsSection}>
                            <div className={styles.eventsHeader}>
                                <h2>Wedding Events</h2>
                                <Link href="/dashboard/rsvp" className={styles.manageBtn}>Manage Events</Link>
                            </div>

                            <div className={styles.eventList}>
                                {formData.events?.map((event, idx) => {
                                    // Match against previewItems for better coverage (handles bundleItems OR bundleImages)
                                    const itemIndex = previewItems?.findIndex(pi => {
                                        const piName = (pi.name || '').toUpperCase().trim();
                                        const eventName = (event.name || '').toUpperCase().trim();
                                        const piType = (pi.event?.eventType || '').toUpperCase().trim();
                                        const eventType = (event.eventType || '').toUpperCase().trim();

                                        return (piName.length > 0 && eventName.length > 0 && (piName.includes(eventName) || eventName.includes(piName))) ||
                                               (piType.length > 0 && eventType.length > 0 && piType === eventType);
                                    });

                                    // Fallback chain: bundle asset → previewItems match → wedding fallback → first item
                                    const poster = getEventImage(event) ||
                                                   (itemIndex !== -1 ? previewItems[itemIndex].image : null) ||
                                                   previewItems.find(pi => (pi.name || '').toUpperCase().includes('WEDDING'))?.image ||
                                                   previewItems[0]?.image;

                                    return (
                                        <div key={idx} className={styles.eventCard}>
                                            <div
                                                className={styles.eventPosterThumb}
                                                onClick={() => setLightbox({ image: poster || null, title: event.name })}
                                                style={{ cursor: 'pointer' }}
                                                title="Click to view card"
                                            >
                                                {poster ? (
                                                    <img
                                                        src={poster}
                                                        alt={event.name}
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                            const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                                            if (placeholder) placeholder.style.display = 'block';
                                                        }}
                                                    />
                                                ) : null}
                                                {poster ? (
                                                    <span className={styles.posterPlaceholderSmall} style={{ display: 'none' }}>VIEW<br/>INVITE</span>
                                                ) : (
                                                    <span className={styles.posterPlaceholderSmall}>VIEW<br/>INVITE</span>
                                                )}
                                            </div>

                                            <div className={styles.eventCardContent}>
                                                <div className={styles.eventCardHeaderRow}>
                                                    <h4>{event.name}</h4>
                                                </div>
                                                
                                                <div className={styles.eventCardMetaRow}>
                                                    <div className={styles.metaItem}>
                                                        <Clock size={14} />
                                                        <span>{event.time || 'TBD'}</span>
                                                    </div>
                                                    <span className={styles.metaDivider}>•</span>
                                                    <div className={styles.metaItem}>
                                                        <Calendar size={14} />
                                                        <span>{event.date || 'TBD'}</span>
                                                    </div>
                                                    {event.date && event.date !== 'TBD' && (
                                                        <>
                                                            <span className={styles.metaDivider}>•</span>
                                                            <div className={styles.metaItem}>
                                                                <span className={styles.daysLeftText}>
                                                                    {(() => {
                                                                        const eventDate = new Date(event.date);
                                                                        const today = new Date();
                                                                        today.setHours(0, 0, 0, 0);
                                                                        const diff = eventDate.getTime() - today.getTime();
                                                                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                                                        if (days < 0) return 'Completed';
                                                                        if (days === 0) return 'Today';
                                                                        return `${days} days left`;
                                                                    })()}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <div className={styles.eventMessageBlock}>
                                                    <p>{event.description || 'Join us for this special celebration.'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className={styles.quickActionsSection}>
                            <h2>Quick Actions</h2>
                            {rsvpFullUrl && (
                                <div className={styles.rsvpLinkBar}>
                                    <span className={styles.rsvpLinkText}>{rsvpFullUrl}</span>
                                    <button className={styles.rsvpLinkOpen} onClick={() => window.open(rsvpFullUrl, '_blank')}>
                                        <ExternalLink size={14} /> Open
                                    </button>
                                </div>
                            )}
                            <div className={styles.actionGrid}>
                                <div className={styles.actionTile} onClick={handleCopyRsvpLink} style={{ opacity: rsvpFullUrl ? 1 : 0.4, cursor: rsvpFullUrl ? 'pointer' : 'not-allowed' }}>
                                    <div className={styles.actionTileIcon}><Link2 size={24} /></div>
                                    <h5>{copyStatus ? 'Copied!' : 'Copy RSVP Link'}</h5>
                                </div>
                                <div className={styles.actionTile} onClick={() => rsvpFullUrl && window.open(`https://wa.me/?text=${encodeURIComponent(rsvpFullUrl)}`, '_blank')} style={{ opacity: rsvpFullUrl ? 1 : 0.4, cursor: rsvpFullUrl ? 'pointer' : 'not-allowed' }}>
                                    <div className={styles.actionTileIcon}><MessageCircle size={24} /></div>
                                    <h5>WhatsApp Share</h5>
                                </div>
                                <div className={styles.actionTile}>
                                    <div className={styles.actionTileIcon}><QrCode size={24} /></div>
                                    <h5>Download QR Code</h5>
                                </div>
                                <div className={styles.actionTile}>
                                    <div className={styles.actionTileIcon}><Edit3 size={24} /></div>
                                    <h5>Edit Wedding Details</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.sideColumn}>
                        {/* Wedding Countdown (Aligned Top with Events) */}
                        <div className={styles.countdownCard}>
                            <div className={styles.countdownInfo}>
                                <span className={styles.countdownLabel}>Wedding Countdown</span>
                                <div className={styles.countdownNumberRow}>
                                    <span className={styles.countdownNumber}>28</span>
                                    <span className={styles.countdownText}>Days to go</span>
                                </div>
                            </div>
                            <span className={styles.countdownDate}>12 DEC 2026</span>
                        </div>

                        {/* Wedding Overview Card (NEW) */}
                        <div className={styles.overviewCard}>
                            <h2 className={styles.overviewTitle}>Wedding Overview</h2>
                            
                            <div className={styles.statsContainer}>
                                <div className={styles.statBox}>
                                    <span className={styles.statValue}>280</span>
                                    <span className={styles.statLabel}>Total Guests Invited</span>
                                </div>
                                <div className={styles.dividerVertical} />
                                <div className={styles.statBox}>
                                    <span className={styles.statValue}>174</span>
                                    <span className={styles.statLabel}>Responses Received</span>
                                </div>
                                <div className={styles.dividerVertical} />
                                <div className={styles.statBox}>
                                    <span className={styles.statValue}>174</span>
                                    <span className={styles.statLabel}>Meals preference collected</span>
                                </div>
                            </div>

                            <hr className={styles.overviewDivider} />

                            <div className={styles.reminderRow}>
                                <Sparkles size={16} className={styles.sparkleIcon} />
                                <span className={styles.reminderText}>Send reminder to guests for Mehendi</span>
                            </div>

                            <button className={styles.btnSendNow}>
                                Send Now
                            </button>
                        </div>

                        {/* Original Summary Card */}
                        <div className={styles.card} style={{ margin: 0 }}>
                            <div className={styles.cardMain}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardTitle}>
                                        Complete Suite
                                    </h2>
                                    <div className={styles.paymentStatus}>
                                        <Check size={14} className={styles.paymentCheck} />
                                        <span style={{ fontSize: '0.8rem' }}>Assets Ready</span>
                                    </div>
                                </div>
                                <ul className={styles.featuresList} style={{ marginTop: '1rem', padding: 0 }}>
                                    <li style={{ fontSize: '0.8rem' }}><Check size={12} /> 7 events covered</li>
                                    <li style={{ fontSize: '0.8rem' }}><Check size={12} /> Guest management</li>
                                </ul>
                            </div>
                            <div className={styles.cardFooter} style={{ padding: '1rem', flexDirection: 'column', gap: '1rem' }}>
                                <Link href="/preview" className={styles.btnActionOutline} style={{ width: '100%', justifyContent: 'center' }}>
                                    <Eye size={18} />
                                    <span>View Invites</span>
                                </Link>
                                <button className={styles.btnWhatsApp} style={{ width: '100%', justifyContent: 'center' }}>
                                    <Share2 size={18} />
                                    <span>WhatsApp</span>
                                </button>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className={styles.helpCard}>
                            <h3>Need help?</h3>
                            <p>Our premium support is here for your special day.</p>
                            <button className={styles.secondaryAction}>Contact Studio</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

            {/* Card Lightbox */}
            {lightbox && (
                <div
                    onClick={() => setLightbox(null)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.88)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '2rem',
                    }}
                >
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {lightbox.title} · Click anywhere to close
                    </p>

                    {lightbox.image ? (
                        <img
                            src={lightbox.image}
                            alt={lightbox.title}
                            onClick={e => e.stopPropagation()}
                            style={{
                                maxHeight: '80vh', maxWidth: '90vw',
                                borderRadius: '12px',
                                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                                objectFit: 'contain',
                            }}
                        />
                    ) : (
                        <div style={{
                            background: '#1a1a1a', border: '1px solid #333',
                            borderRadius: '16px', padding: '4rem 5rem',
                            textAlign: 'center',
                        }}>
                            <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                {lightbox.title}
                            </p>
                            <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600 }}>
                                Card not available yet
                            </p>
                            <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                This event card hasn&apos;t been generated for your theme.
                            </p>
                        </div>
                    )}

                    <Link
                        href="/preview"
                        onClick={e => e.stopPropagation()}
                        style={{
                            marginTop: '1.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff', borderRadius: '100px',
                            padding: '0.6rem 1.5rem', fontSize: '0.82rem',
                            fontWeight: 600, textDecoration: 'none',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                    >
                        Open Full Preview →
                    </Link>
                </div>
            )}
        </>
    );
}
