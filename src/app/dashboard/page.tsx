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
    MoreVertical,
    Heart
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const { formData, selectedThemeId, isAuthenticated, bundleImages, bundleItems, lastSavedWeddingId, updateEvent } = useWeddingStore();
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const cardRef = useRef<InvitationCardRef>(null);
    const [lightbox, setLightbox] = useState<{ image: string | null; title: string } | null>(null);
    const [bundleAssets, setBundleAssets] = useState<Record<string, string>>({});
    const [activeEventId, setActiveEventId] = useState<string | undefined>(formData.events?.[0]?.id);
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    useEffect(() => {
        let targetDateStr = formData.primaryDate;
        if (!targetDateStr && formData.events && formData.events.length > 0) {
            targetDateStr = formData.events[0].date;
        }

        let targetDate: Date;
        if (targetDateStr && !isNaN(Date.parse(targetDateStr))) {
            targetDate = new Date(targetDateStr);
        } else {
            // Default 47 days, 8 hours, 24 mins, 36 secs as in mockup
            targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 47);
            targetDate.setHours(targetDate.getHours() + 8);
            targetDate.setMinutes(targetDate.getMinutes() + 24);
            targetDate.setSeconds(targetDate.getSeconds() + 36);
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetDate.getTime() - now;

            if (difference <= 0) {
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
            } else {
                const d = Math.floor(difference / (1000 * 60 * 60 * 24));
                const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({
                    days: String(d).padStart(2, '0'),
                    hours: String(h).padStart(2, '0'),
                    minutes: String(m).padStart(2, '0'),
                    seconds: String(s).padStart(2, '0')
                });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [formData.primaryDate, formData.events]);

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
            const displayImages = (bundleImages && bundleImages.length > 0) ? bundleImages : (theme?.previewImages || []);
            return displayImages.map((imgUrl, index) => ({
                id: `design-${index}`,
                name: index === 0 ? "Wedding poster" : "Event Design",
                image: ensureLeadingSlash(imgUrl),
                event: (formData.events?.[index]) || (formData.events?.[0]) || { name: 'Main Event' }
            }));
        }

        const ID_MAPPING: Record<string, string> = {
            'evt_1': 'wedding',              // Initials logo
            'evt_2': 'wedding',              // Wedding contract
            'evt_3': 'wedding',              // Do not disturb
            'evt_4': 'wedding',              // Ladke wale tag
            'evt_5': 'wedding',              // Ladki wale tag
            'evt_6': 'save_the_date',        // Save the date
            'evt_7': 'wedding',              // Wedding Invitation
            'evt_8': 'haldi',                // Haldi Invitation
            'evt_9': 'sangeet',              // Sangeet Invitation
            'evt_10': 'mehendi',             // Mehendi Invitation
            'evt_11': 'wedding',             // Cinematic Video 
            'evt_12': 'rsvp',                // RSVP
            'evt_13': 'reception',           // Reception
            'evt_14': 'wedding',             // Welcome Wedding Poster
            'evt_15': 'haldi',               // Welcome Haldi Poster
            'evt_16': 'mehendi',             // Welcome Mehendi Poster
            'evt_17': 'wedding'              // Thank you card
        };

        const weddingEvents = formData.events || [];
        const items: Array<{ id: string; name: string; image: string; event: any }> = [];

        for (const bi of bundleItems) {
            if (!bi.templatePath) continue;

            const rawType = bi.eventType || bi.event?.eventName || '';
            const biType = rawType.toUpperCase().replace(/_/g, '');
            const dbEventId = bi.eventId;

            let matchedEvent = weddingEvents.find(evt => {
                const masterId = evt.id.toLowerCase();
                
                if (dbEventId && ID_MAPPING[dbEventId] === masterId) return true;
                if (!biType) return false;

                const evtName = (evt.name || '').toUpperCase();
                if (evtName && biType.includes(evtName)) return true;

                if (biType.includes('WEDDING') && masterId.includes('wedding')) return true;
                if (biType.includes('HALDI') && masterId.includes('haldi')) return true;
                if (biType.includes('MEHENDI') && masterId.includes('mehendi')) return true;
                if (biType.includes('SANGEET') && masterId.includes('sangeet')) return true;
                if (biType.includes('RECEPTION') && masterId.includes('reception')) return true;

                return false;
            });

            if (!matchedEvent && biType.includes('WEDDING')) {
                matchedEvent = weddingEvents.find(e => e.id === 'wedding');
            }

            const displayName = matchedEvent?.heading || matchedEvent?.name || bi.event?.eventName || bi.templateName || bi.eventType || 'Invitation';

            items.push({
                id: bi.id,
                name: displayName,
                image: ensureLeadingSlash(bi.templatePath),
                event: matchedEvent ? {
                    id: matchedEvent.id,
                    name: matchedEvent.heading || matchedEvent.name,
                    date: matchedEvent.date || formData.primaryDate,
                    time: matchedEvent.time || formData.primaryTime,
                    venue: matchedEvent.venue || formData.defaultVenueName,
                    tagline: matchedEvent.tagline,
                    description: matchedEvent.description,
                    heading: matchedEvent.heading
                } : {
                    id: bi.id,
                    name: displayName,
                    date: formData.primaryDate,
                    time: formData.primaryTime,
                    venue: formData.defaultVenueName
                }
            });
        }

        return items;
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
            {/* Fullscreen Preview Modal */}
            {selectedPreviewIndex !== null && theme && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '2rem'
                    }}
                    onClick={() => setSelectedPreviewIndex(null)}
                >
                    <button
                        onClick={() => setSelectedPreviewIndex(null)}
                        style={{
                            position: 'absolute', top: '2rem', right: '2rem',
                            background: 'white', border: 'none', borderRadius: '50%',
                            width: '40px', height: '40px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#333',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InvitationCard
                            ref={cardRef}
                            event={previewItems[selectedPreviewIndex]?.event || {
                                id: `preview-${selectedPreviewIndex}`,
                                name: `Preview ${selectedPreviewIndex + 1}`,
                                date: formData.primaryDate,
                                time: formData.primaryTime,
                                venue: formData.defaultVenueName
                            }}
                            theme={theme}
                            groomName={formData.groomName || undefined}
                            brideName={formData.brideName || undefined}
                            groomParents={formData.groomParents || undefined}
                            brideParents={formData.brideParents || undefined}
                            welcomeMessage={formData.invitationMessage || undefined}
                            isPlaceholder={true}
                            isRawPreview={false}
                            type='image'
                            customImage={previewItems[selectedPreviewIndex]?.image}
                            isSecured={true}
                            showSizingBoxes={false}
                        />
                    </div>
                </div>
            )}
            
            <DashboardSidebar />
            
            <main className={styles.mainContent}>
                {/* 1. Header with just the Title */}
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.title}>Welcome back, {formData.groomName?.split(' ')[0] || 'Vivek'}</h1>
                    <p className={styles.subtitle}>Your wedding preparation is on track. Everything looks perfect.</p>
                </div>

                {/* Wedding Countdown Hero Banner */}
                <div className={styles.countdownBanner}>
                    <div className={styles.bannerContent}>
                            <div className={styles.bannerContentLeft}>
                                <div className={styles.heartDecorator}>
                                    <div className={styles.decoratorLine} />
                                    <svg className={styles.heartSvg} viewBox="0 0 24 24" fill="#C8A951" width="14" height="14">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                    <div className={styles.decoratorLine} />
                                </div>
                                
                                <h2 className={styles.coupleNames}>
                                    {formData.brideName || formData.groomName ? 
                                        [formData.brideName, formData.groomName].filter(Boolean).join(' & ') 
                                        : 'Ananya & Rohan'}
                                </h2>
                                
                                <p className={styles.weddingMeta}>
                                    {(() => {
                                        let dStr = formData.primaryDate;
                                        if (!dStr && formData.events && formData.events.length > 0) {
                                            dStr = formData.events[0].date;
                                        }
                                        if (dStr && !isNaN(Date.parse(dStr))) {
                                            const d = new Date(dStr);
                                            const day = d.getDate();
                                            const month = d.toLocaleString('en-US', { month: 'long' });
                                            const year = d.getFullYear();
                                            
                                            const getOrdinal = (n: number) => {
                                                const s = ["th", "st", "nd", "rd"];
                                                const v = n % 100;
                                                return n + (s[(v - 20) % 10] || s[v] || s[0]);
                                            };
                                            
                                            return `${getOrdinal(day)} ${month} ${year}`;
                                        }
                                        return dStr || '20th December 2025';
                                    })()}
                                    {' • '}
                                    {formData.defaultVenueName || formData.defaultVenueAddress || 'Udaipur, Rajasthan'}
                                </p>
                            </div>
                            
                            <div className={styles.bannerContentRight}>
                                <p className={styles.countdownSubtitle}>Your Big Day is in</p>
                                
                                <div className={styles.countdownTimerRow}>
                                    <div className={styles.timeBlock}>
                                        <span className={styles.timeValue}>{timeLeft.days}</span>
                                        <span className={styles.timeUnit}>DAYS</span>
                                    </div>
                                    <span className={styles.timerDivider}>•</span>
                            <div className={styles.timeBlock}>
                                <span className={styles.timeValue}>{timeLeft.hours}</span>
                                <span className={styles.timeUnit}>HOURS</span>
                            </div>
                            <span className={styles.timerDivider}>•</span>
                            <div className={styles.timeBlock}>
                                <span className={styles.timeValue}>{timeLeft.minutes}</span>
                                <span className={styles.timeUnit}>MINUTES</span>
                            </div>
                            <span className={styles.timerDivider}>•</span>
                            <div className={styles.timeBlock}>
                                <span className={styles.timeValue}>{timeLeft.seconds}</span>
                                <span className={styles.timeUnit}>SECONDS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wedding Events Section (Full Width) */}
            <div className={styles.eventsSection} style={{ marginTop: '3rem' }}>
                            <div className={styles.eventsHeader}>
                                <h2>Wedding Events</h2>
                            </div>

                            {/* Horizontal Navigation */}
                            <div className={styles.horizontalNavContainer}>
                                {formData.events?.map((event, idx) => {
                                    const isActive = (activeEventId ? event.id === activeEventId : idx === 0);
                                    
                                    // Default icon mapping based on event name
                                    const eventName = (event.name || '').toLowerCase();
                                    let Icon = Calendar;
                                    if (eventName.includes('engage') || eventName.includes('ring')) Icon = Heart;
                                    else if (eventName.includes('mehendi') || eventName.includes('mehndi')) Icon = Edit3;
                                    else if (eventName.includes('haldi')) Icon = Sparkles;
                                    else if (eventName.includes('sangeet') || eventName.includes('music')) Icon = Play;
                                    else if (eventName.includes('wedding') || eventName.includes('pheras')) Icon = Users;
                                    else if (eventName.includes('reception')) Icon = CheckCircle2;

                                    return (
                                        <button 
                                            key={`nav-${idx}`} 
                                            className={`${styles.navTab} ${isActive ? styles.navTabActive : ''}`}
                                            onClick={() => setActiveEventId(event.id)}
                                        >
                                            <span className={styles.navLabel}>{event.name || 'Event'}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className={styles.eventList}>
                                {formData.events?.filter((event, idx) => activeEventId ? event.id === activeEventId : idx === 0).map((event, idx) => {
                                    // Match against previewItems for accurate coverage (mapped via ID_MAPPING from preview items)
                                    const matchedItemIndex = previewItems?.findIndex(pi => pi.event?.id === event.id);
                                    const matchedItem = matchedItemIndex !== -1 ? previewItems[matchedItemIndex] : null;

                                    // Fallback chain: preview items match -> bundle asset -> wedding fallback -> first item
                                    const poster = (matchedItem ? matchedItem.image : null) ||
                                                   getEventImage(event) ||
                                                   previewItems.find(pi => (pi.name || '').toUpperCase().includes('WEDDING'))?.image ||
                                                   previewItems[0]?.image;

                                    return (
                                        <div key={idx} className={styles.eventCard}>
                                            <div className={styles.eventCardContent}>
                                                
                                                {poster && (
                                                    <div className={styles.eventPreviewHeaderRow}>
                                                        <div className={styles.eventPreviewDetails}>
                                                            <div className={styles.eventCardMetaRow} style={{ marginTop: 0, marginBottom: '0.25rem' }}>
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
                                                            <p className={styles.eventPreviewSubtitle}>Delightful WhatsApp-ready image card</p>
                                                        </div>
                                                        <div className={styles.eventPreviewActions}>
                                                            <button className={styles.actionBtnOutline}><Edit3 size={18} /></button>
                                                            <button className={styles.actionBtnOutline}><Download size={18} /></button>
                                                            <button className={styles.actionBtnOutline}><Share2 size={18} /></button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={styles.eventPreviewAndMessageRow}>
                                                    {poster && (
                                                        <div 
                                                            className={styles.eventPreviewImageWrapper} 
                                                            onClick={() => matchedItemIndex !== -1 && setSelectedPreviewIndex(matchedItemIndex)}
                                                            style={{ cursor: matchedItemIndex !== -1 ? 'pointer' : 'default' }}
                                                        >
                                                            <InvitationCard
                                                                event={matchedItem?.event || event}
                                                                theme={theme}
                                                                groomName={formData.groomName || ''}
                                                                brideName={formData.brideName || ''}
                                                                groomParents={formData.groomParents}
                                                                brideParents={formData.brideParents}
                                                                welcomeMessage={formData.invitationMessage}
                                                                isPlaceholder={true}
                                                                isRawPreview={false}
                                                                customImage={poster}
                                                                className={styles.dashboardThumbCard}
                                                                isSecured={true}
                                                            />
                                                            <div className={styles.previewOverlay}>
                                                                <span>Preview</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className={styles.messageContentBlock}>
                                                        <textarea
                                                            className={styles.messageTextarea}
                                                            value={event.description || ''}
                                                            onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                                                            placeholder="With joyful hearts, we invite you to celebrate our special day."
                                                            rows={4}
                                                            maxLength={150}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className={styles.eventFooter}>
                                                    <button 
                                                        className={styles.eventFooterCopyBtn}
                                                        onClick={() => navigator.clipboard.writeText(event.description || 'With joyful hearts, we invite you to celebrate our special day.')}
                                                    >
                                                        Copy
                                                    </button>
                                                    <button 
                                                        className={styles.eventFooterNextBtn}
                                                        onClick={() => {
                                                            const currentIndex = formData.events?.findIndex(e => e.id === event.id) ?? 0;
                                                            const nextEvent = formData.events?.[currentIndex + 1];
                                                            if (nextEvent) {
                                                                setActiveEventId(nextEvent.id);
                                                            }
                                                        }}
                                                        disabled={idx === (formData.events?.length || 0) - 1}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

            {/* 2. Structured Content Row for perfect sibling alignment */}
            <div className={styles.contentRow} style={{ marginTop: '3rem' }}>
                <div className={styles.mainColumn}>
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

                {/* Wedding Overview Card (Full Width) */}
                <div className={styles.overviewCard} style={{ marginTop: '2rem' }}>
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
