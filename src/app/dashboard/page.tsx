'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { formatDisplayDate, formatDisplayTime } from '@/lib/format-date';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { WelcomeDialog } from '@/components/dashboard/WelcomeDialog';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import type { Theme } from '@/lib/constants/themes';
import styles from './dashboard.module.css';
import redesignStyles from './dashboard-redesign.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoInviteCard } from './VideoInviteCard';
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
    const [showWelcome, setShowWelcome] = useState(false);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const cardRef = useRef<InvitationCardRef>(null);
    const [lightbox, setLightbox] = useState<{ image: string | null; title: string } | null>(null);
    const [suitePreview, setSuitePreview] = useState(false);
    const [suitePreviewIndex, setSuitePreviewIndex] = useState(0);
    const [bundleAssets, setBundleAssets] = useState<Record<string, string>>({});
    const [activeEventId, setActiveEventId] = useState<string>('save_the_date');
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isPast: false
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
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00', isPast: true });
            } else {
                const d = Math.floor(difference / (1000 * 60 * 60 * 24));
                const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({
                    days: String(d).padStart(2, '0'),
                    hours: String(h).padStart(2, '0'),
                    minutes: String(m).padStart(2, '0'),
                    seconds: String(s).padStart(2, '0'),
                    isPast: false
                });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [formData.primaryDate, formData.events]);

    useEffect(() => {
        setIsMounted(true);
        // Arriving from a successful payment shows the welcome celebration over the
        // dashboard, then cleans the query param so a refresh won't replay it.
        if (new URLSearchParams(window.location.search).get('welcome') === 'true') {
            setShowWelcome(true);
        }
    }, []);

    const closeWelcome = () => {
        setShowWelcome(false);
        window.history.replaceState({}, '', window.location.pathname);
    };

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

    const getSlideImage = (typeKey: string, fallback: string) => {
        const item = bundleItems?.find(bi => {
            const biType = (bi.eventType || bi.event?.eventName || '').toUpperCase().replace(/_/g, '');
            return biType.includes(typeKey.toUpperCase());
        });
        if (item?.templatePath) return item.templatePath;
        
        const displayImages = (bundleImages && bundleImages.length > 0) ? bundleImages : (theme?.previewImages || []);
        const indexMap: Record<string, number> = {
            'SAVE_THE_DATE': 0,
            'HALDI': 1,
            'MEHENDI': 2,
            'SANGEET': 3,
            'WEDDING': 4,
        };
        const idx = indexMap[typeKey];
        if (idx !== undefined && displayImages[idx]) return displayImages[idx];
        
        return fallback;
    };

    if (!isMounted || !isAuthenticated) return null;

    return (
        <>
        <div className={styles.dashboardContainer}>
            <WelcomeDialog
                open={showWelcome}
                onClose={closeWelcome}
                coupleNames={[formData.groomName, formData.brideName].filter(Boolean).join(' & ') || undefined}
            />

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
                        style={{ height: 'min(80vh, 711px)', aspectRatio: '9/16', maxWidth: '90vw', position: 'relative', margin: '0 auto' }}
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
                {/* 1. Header & Glassmorphism Hero */}
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.title}>Welcome back, {formData.groomName?.split(' ')[0] || 'Vivek'}</h1>
                    <p className={styles.subtitle}>Your wedding preparation is on track. Everything looks perfect.</p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0 }}
                    className={`${redesignStyles.glassHero}`}
                    style={{ marginTop: '2rem' }}
                >
                    <div className={redesignStyles.heroLeft}>
                        <h2 className={redesignStyles.heroCouple}>
                            {formData.brideName || formData.groomName ? 
                                [formData.brideName, formData.groomName].filter(Boolean).join(' & ') 
                                : 'Ananya & Rohan'}
                        </h2>
                        <div className={redesignStyles.heroMeta}>
                            <Calendar size={16} />
                            <span>
                                {formatDisplayDate(formData.primaryDate || formData.events?.[0]?.date) || '20-12-2025'}
                            </span>
                            <span>•</span>
                            <MapPin size={16} />
                            <span>{formData.defaultVenueName || formData.defaultVenueAddress || 'Udaipur, Rajasthan'}</span>
                        </div>
                    </div>

                    <div className={redesignStyles.heroRight}>
                        {timeLeft.isPast ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#C8A951', fontWeight: 500, margin: 0, lineHeight: 1 }}>Congratulations!</span>
                                <span style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your big day has arrived</span>
                            </div>
                        ) : (
                            <>
                                <span className={redesignStyles.countdownLabel}>Your Big Day is in</span>
                                <div className={redesignStyles.countdownBox}>
                                    <div className={redesignStyles.timeBlock}>
                                        <span className={redesignStyles.timeValue}>{timeLeft.days}</span>
                                        <span className={redesignStyles.timeUnit}>Days</span>
                                    </div>
                                    <span className={redesignStyles.timerDivider}>:</span>
                                    <div className={redesignStyles.timeBlock}>
                                        <span className={redesignStyles.timeValue}>{timeLeft.hours}</span>
                                        <span className={redesignStyles.timeUnit}>Hrs</span>
                                    </div>
                                    <span className={redesignStyles.timerDivider}>:</span>
                                    <div className={redesignStyles.timeBlock}>
                                        <span className={redesignStyles.timeValue}>{timeLeft.minutes}</span>
                                        <span className={redesignStyles.timeUnit}>Mins</span>
                                    </div>
                                    <span className={redesignStyles.timerDivider}>:</span>
                                    <div className={redesignStyles.timeBlock}>
                                        <span className={redesignStyles.timeValue}>{timeLeft.seconds}</span>
                                        <span className={redesignStyles.timeUnit}>Secs</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>



                {/* 3. Grid Layout: Events (Main) + Actions (Side) */}
                <motion.div 
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.08
                            }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                    className={redesignStyles.bentoGrid} 
                    style={{ marginTop: '2.5rem' }}
                >
                    {/* Main Column */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.6, bounce: 0 } }
                        }}
                        className={redesignStyles.mainColumn}
                    >
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className={redesignStyles.eventHeader} style={{ marginBottom: 0 }}>
                                <div>
                                    <h2 className={redesignStyles.eventTitle}>Wedding Events</h2>
                                    <p className={styles.subtitle} style={{ marginBottom: 0 }}>Manage your invitations and details.</p>
                                </div>
                            </div>

                            {/* Horizontal Nav */}
                            <div className={styles.horizontalNavContainer}>
                                {[
                                    { id: 'save_the_date', name: 'Save The Date', date: formData.primaryDate, time: formData.primaryTime, description: 'Save the date for our special day!' },
                                    ...(formData.events || []),
                                    { id: 'thank_you', name: 'Thank You', date: formData.primaryDate, time: formData.primaryTime, description: 'Thank you for being a part of our celebration!' }
                                ].map((event, idx) => {
                                    const isActive = (activeEventId ? event.id === activeEventId : idx === 0 && !activeEventId);
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
                        </div>

                        <div className={styles.eventList}>
                            {[
                                { id: 'save_the_date', name: 'Save The Date', date: formData.primaryDate, time: formData.primaryTime, description: 'Save the date for our special day!' },
                                ...(formData.events || []),
                                { id: 'thank_you', name: 'Thank You', date: formData.primaryDate, time: formData.primaryTime, description: 'Thank you for being a part of our celebration!' }
                            ].filter((event, idx) => activeEventId ? event.id === activeEventId : idx === 0 && !activeEventId).map((event, idx) => {
                                const matchedItemIndex = previewItems?.findIndex(pi => pi.event?.id === event.id || pi.id === event.id || (event.id === 'save_the_date' && pi.name.toLowerCase().includes('save')) || (event.id === 'thank_you' && pi.name.toLowerCase().includes('thank')));
                                const matchedItem = matchedItemIndex !== -1 ? previewItems[matchedItemIndex] : null;
                                const poster = (matchedItem ? matchedItem.image : null) ||
                                                getEventImage(event) ||
                                                previewItems.find(pi => (pi.name || '').toUpperCase().includes('WEDDING'))?.image ||
                                                previewItems[0]?.image;

                                return (
                                    <div key={idx} className={redesignStyles.eventBentoCard}>
                                        <div className={redesignStyles.eventBentoContent}>
                                            
                                            {/* Preview Column */}
                                            {poster && (
                                                <div className={redesignStyles.eventPreviewCol}>
                                                    <div 
                                                        className={redesignStyles.eventPreviewImageWrapper} 
                                                        onClick={() => {
                                                            if (matchedItemIndex !== -1) {
                                                                setSuitePreviewIndex(matchedItemIndex);
                                                                setSuitePreview(true);
                                                            } else if (poster) {
                                                                setLightbox({ image: poster, title: event.name || 'Event Preview' });
                                                            }
                                                        }}
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
                                                            <span>Click to preview Full Size</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Details & Editor Column */}
                                            <div className={redesignStyles.eventDetailsCol}>
                                                <div className={styles.eventCardMetaRow} style={{ marginTop: 0, marginBottom: '1.5rem' }}>
                                                    <div className={styles.metaItem}>
                                                        <Calendar size={16} />
                                                        <span>{formatDisplayDate(event.date) || 'TBD'}</span>
                                                    </div>
                                                    <span className={styles.metaDivider}>•</span>
                                                    <div className={styles.metaItem}>
                                                        <Clock size={16} />
                                                        <span>{formatDisplayTime(event.time) || 'TBD'}</span>
                                                    </div>
                                                </div>

                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '0.5rem' }}>
                                                    WhatsApp message for your card
                                                </label>
                                                <textarea
                                                    className={redesignStyles.messageEditor}
                                                    value={event.description || ''}
                                                    onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                                                    placeholder="Write a warm, welcoming message for your guests. (e.g. With joyful hearts, we invite you to celebrate our special day.)"
                                                />
                                                
                                                <div className={styles.eventFooter} style={{ marginTop: '1.5rem', padding: 0, border: 'none' }}>
                                                    <button 
                                                        className={styles.eventFooterCopyBtn}
                                                        onClick={() => navigator.clipboard.writeText(event.description || 'With joyful hearts, we invite you to celebrate our special day.')}
                                                    >
                                                        Copy Message
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
                                                        Next Event
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Side Column */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.6, bounce: 0 } }
                        }}
                        className={redesignStyles.sideColumn}
                    >
                        
                        {/* RSVP Pie Chart Card */}
                        <div className={styles.card}>
                            <div className={styles.cardContent} style={{ padding: '1.5rem' }}>
                                <h2 className={styles.cardTitle} style={{ marginBottom: '1.5rem' }}>RSVP Responses</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
                                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                            <circle stroke="#F3F4F6" strokeWidth="4" fill="transparent" r="16" cx="18" cy="18" />
                                            <circle stroke="#22c55e" strokeWidth="4" fill="transparent" r="16" cx="18" cy="18" 
                                                pathLength="100" strokeDasharray="83 100" strokeDashoffset="0" strokeLinecap="round" />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#333' }}>174</span>
                                            <span style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                                                <span style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 600 }}>Attending</span>
                                            </div>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginLeft: '1rem' }}>145</span>
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D1D5DB' }}></div>
                                                <span style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 600 }}>Not Attending</span>
                                            </div>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginLeft: '1rem' }}>29</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Invitation Card */}
                        {lastSavedWeddingId && (
                            <VideoInviteCard
                                orderId={lastSavedWeddingId} // Use wedding ID/order ID identifier
                                groomName={formData.groomName || 'Groom'}
                                brideName={formData.brideName || 'Bride'}
                                eventDate={formData.primaryDate || (formData.events?.[0]?.date) || '14th Feb 2026'}
                                eventTime={formData.events?.[0]?.time || '6:30 PM'}
                                venue={formData.events?.[0]?.venue || 'Hotel Grand Resort'}
                                eventType={formData.events?.[0]?.name || 'Wedding'}
                                themeColor={theme?.name?.toLowerCase().includes('haldi') ? '#D97706' : '#b38b40'}
                                slide1Bg={getSlideImage('SAVE_THE_DATE', '/assets/themes/rajputana/save-the-date.png')}
                                slide2Bg={getSlideImage('HALDI', '/assets/themes/rajputana/haldi-invite.png')}
                                slide3Bg={getSlideImage('MEHENDI', '/assets/themes/rajputana/mehendi-invite.png')}
                                slide4Bg={getSlideImage('SANGEET', '/assets/themes/rajputana/sangeet-invite.png')}
                                slide5Bg={getSlideImage('WEDDING', '/assets/themes/rajputana/wedding-invite.png')}
                            />
                        )}

                        {/* Status Card */}
                        <div className={styles.card} style={{ margin: 0 }}>
                            <div className={styles.cardMain}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardTitle}>Complete Suite</h2>
                                    <div className={styles.paymentStatus}>
                                        <Check size={14} className={styles.paymentCheck} />
                                        <span style={{ fontSize: '0.8rem' }}>Assets Ready</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', marginBottom: '0.2rem' }}>Wedding Invitations</p>
                                        <p style={{ fontSize: '0.75rem', color: '#666' }}>Save the Date · Wedding Invitation</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', marginBottom: '0.2rem' }}>Wedding Events</p>
                                        <p style={{ fontSize: '0.75rem', color: '#666' }}>Haldi · Mehendi · Sangeet · Reception</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', marginBottom: '0.2rem' }}>Closing & Gratitude</p>
                                        <p style={{ fontSize: '0.75rem', color: '#666' }}>Thank You Card</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardFooter} style={{ padding: '1rem', flexDirection: 'column', gap: '0.8rem' }}>
                                <a onClick={(e) => { e.preventDefault(); setSuitePreviewIndex(0); setSuitePreview(true); }} className={styles.btnActionOutline} style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
                                    <Eye size={18} />
                                    <span>View Suite</span>
                                </a>
                                <button className={styles.btnActionOutline} style={{ width: '100%', justifyContent: 'center' }}>
                                    <Download size={18} />
                                    <span>Complete Assets</span>
                                </button>
                            </div>
                        </div>



                        {/* Support Card */}
                        <div className={redesignStyles.supportCard}>
                            <h3>Need help?</h3>
                            <p>Our premium support is here for your special day.</p>
                            <button className={redesignStyles.supportBtn}>Contact Studio</button>
                        </div>
                    </motion.div>
                </motion.div>
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

            {/* Suite Preview Overlay */}
            {suitePreview && (
                <div
                    onClick={() => setSuitePreview(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.88)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center',
                        padding: '2rem',
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                    }}
                >
                    <style dangerouslySetInnerHTML={{__html: `
                        ::-webkit-scrollbar { display: none; }
                    `}} />
                    
                    <div style={{ position: 'sticky', top: '1rem', width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', zIndex: 10 }}>
                         <h3 style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Complete Suite Preview</h3>
                         <button onClick={() => setSuitePreview(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>✕ Close</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                        {(() => {
                            const validItems = previewItems.filter(item => item.image);
                                
                            if (validItems.length === 0) return null;
                            const currentIndex = Math.min(suitePreviewIndex, validItems.length - 1);
                            const currentItem = validItems[currentIndex];
                            
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
                                        {currentItem.name}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%', justifyContent: 'center' }}>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSuitePreviewIndex(Math.max(0, currentIndex - 1)); }}
                                            disabled={currentIndex === 0}
                                            style={{ 
                                                background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: '50%', 
                                                width: '44px', height: '44px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', 
                                                opacity: currentIndex === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s', flexShrink: 0
                                            }}
                                        >
                                            ←
                                        </button>
                                        <img
                                            src={currentItem.image}
                                            alt={currentItem.name}
                                            onClick={e => e.stopPropagation()}
                                            style={{
                                                height: '75vh',
                                                maxWidth: '85vw',
                                                borderRadius: '16px',
                                                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                                                objectFit: 'contain',
                                            }}
                                        />
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSuitePreviewIndex(Math.min(validItems.length - 1, currentIndex + 1)); }}
                                            disabled={currentIndex === validItems.length - 1}
                                            style={{ 
                                                background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: '50%', 
                                                width: '44px', height: '44px', cursor: currentIndex === validItems.length - 1 ? 'not-allowed' : 'pointer', 
                                                opacity: currentIndex === validItems.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s', flexShrink: 0
                                            }}
                                        >
                                            →
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {validItems.map((_, idx) => (
                                            <div 
                                                key={idx} 
                                                style={{ 
                                                    width: '8px', height: '8px', borderRadius: '50%', 
                                                    background: idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                                                    transition: 'all 0.3s'
                                                }} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </>
    );
}
