'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { formatDisplayDate, formatDisplayTime } from '@/lib/format-date';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { WelcomeDialog } from '@/components/dashboard/WelcomeDialog';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import { PreviewCard } from '@/components/preview/PreviewCard';
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
    const [rsvpStats, setRsvpStats] = useState({ total: 0, attending: 0, notAttending: 0, maybe: 0 });
    const [copiedRsvp, setCopiedRsvp] = useState(false);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const cardRef = useRef<InvitationCardRef>(null);
    const carouselTrackRef = useRef<HTMLDivElement>(null);
    const [isCarouselHovered, setIsCarouselHovered] = useState(false);
    const [lightbox, setLightbox] = useState<{ image: string | null; title: string } | null>(null);
    const [suitePreview, setSuitePreview] = useState(false);
    const [suitePreviewIndex, setSuitePreviewIndex] = useState(0);
    const [bundleAssets, setBundleAssets] = useState<Record<string, string>>({});
    const [activeEventId, setActiveEventId] = useState<string>('save_the_date');

    const handleShareWhatsApp = async (item?: any) => {
        const bride = formData.brideName || '';
        const groom = formData.groomName || '';
        const coupleName = [groom, bride].filter(Boolean).join(' & ') || 'Our Wedding';
        
        const eventName = item?.name || item?.event?.name || 'Wedding Invitation';
        const lowerName = eventName.toLowerCase();

        let header = '🙏 WEDDING INVITATION';
        let greeting = 'Together with our families,\nwe joyfully invite you to celebrate our wedding and bless us as we begin this beautiful new journey together.';

        if (lowerName.includes('save') || lowerName.includes('date')) {
            header = '📅 SAVE THE DATE';
            greeting = 'We’re excited to begin our wedding journey and would love for you to save the date.\n\nWe can\'t wait to celebrate with you.';
        } else if (lowerName.includes('haldi')) {
            header = '🌼 HALDI CEREMONY';
            greeting = 'With immense joy, we warmly invite you to celebrate our Haldi ceremony as we begin this beautiful new chapter together.';
        } else if (lowerName.includes('mehendi') || lowerName.includes('mehndi')) {
            header = '🌿 MEHENDI CEREMONY';
            greeting = 'Celebrate the colors, music and joyful traditions of our Mehendi ceremony with us.';
        } else if (lowerName.includes('sangeet')) {
            header = '🎶 SANGEET NIGHT';
            greeting = 'Get ready for an evening of music, dance and unforgettable memories. We\'d love to celebrate with you.';
        } else if (lowerName.includes('reception')) {
            header = '✨ RECEPTION';
            greeting = 'We warmly invite you to join us for an evening of celebration as we host our wedding reception.';
        } else if (lowerName.includes('thank')) {
            header = '❤️ THANK YOU';
            greeting = 'Thank you for being a part of our wedding celebrations.\n\nYour love, blessings and presence made our special moments even more memorable.';
        }

        const rawDate = item?.event?.date || formData.primaryDate || '';
        const rawTime = item?.event?.time || formData.primaryTime || '';
        const dateStr = rawDate ? formatDisplayDate(rawDate) : '';
        const timeStr = rawTime ? formatDisplayTime(rawTime) : '';
        const venueName = item?.event?.venue || formData.defaultVenueName || '';
        const venueAddr = item?.event?.address || formData.defaultVenueAddress || '';
        const mapsUrl = item?.event?.mapsUrl || formData.primaryMapLink || '';
        const rsvpUrl = rsvpFullUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/${lastSavedWeddingId || 'demo'}`;

        let message = `${header}\n\n${greeting}\n\n`;
        if (bride) message += `👰 Bride: ${bride}\n`;
        if (groom) message += `🤵 Groom: ${groom}\n`;
        if (dateStr) message += `\n📅 Date: ${dateStr}\n`;
        if (timeStr) message += `🕙 Time: ${timeStr}\n`;
        
        if (venueName) {
            message += `\n📍 Venue:\n${venueName}`;
            if (venueAddr) message += `\n${venueAddr}`;
            message += `\n`;
        }

        if (mapsUrl) {
            message += `\n🗺️ Directions\n${mapsUrl}\n`;
        }

        if (!lowerName.includes('thank')) {
            message += `\n💛 Kindly let us know if you'll be joining us — we'd be truly delighted to celebrate this special occasion with you and your family.\n`;
        }

        // Single link for both viewing the invitation and RSVP (same page).
        message += `\n🔗 View your invitation & RSVP:\n${rsvpUrl}`;

        // Preferred: Native Web Share API with attached invitation image file.
        // Only attach when we actually have a raster image URL — an .html template
        // (or a structured: marker) would attach a broken/non-image file.
        const isRasterImage = (u: any) => typeof u === 'string' && /\.(png|jpe?g|webp)(\?|$)/i.test(u);
        if (typeof navigator !== 'undefined' && navigator.share && isRasterImage(item?.image)) {
            try {
                const response = await fetch(item.image);
                const blob = await response.blob();
                const fileName = `${eventName.toLowerCase().replace(/\s+/g, '_')}_invitation.png`;
                const file = new File([blob], fileName, { type: blob.type || 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `${eventName} - ${coupleName}`,
                        text: message,
                        files: [file]
                    });
                    return;
                }
            } catch (err) {
                console.log('Web share with image attempt bypassed:', err);
            }
        }

        // Native Web Share text fallback
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `${eventName} - ${coupleName}`,
                    text: message,
                    url: rsvpUrl
                });
                return;
            } catch (err) {
                // User cancelled share
            }
        }

        // Desktop Fallback: Open WhatsApp directly
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleOpenRsvp = () => {
        const rsvpUrl = `/rsvp/${lastSavedWeddingId || 'demo'}`;
        window.open(rsvpUrl, '_blank');
    };

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (!carouselTrackRef.current) return;
        const track = carouselTrackRef.current;
        const scrollAmount = direction === 'left' ? -320 : 320;

        setIsCarouselHovered(true);

        track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });

        setTimeout(() => {
            setIsCarouselHovered(false);
        }, 600);
    };

    // Continuous infinite smooth auto-scroll ticker with seamless loop reset
    useEffect(() => {
        let animationFrameId: number;

        const step = () => {
            if (!isCarouselHovered && carouselTrackRef.current) {
                const track = carouselTrackRef.current;
                const oneSetWidth = track.scrollWidth / 4;
                const maxScroll = track.scrollWidth - track.clientWidth;
                
                if (oneSetWidth > 0 && maxScroll > 0) {
                    track.scrollLeft += 1;

                    // Seamlessly loop back by one set width when reaching the threshold
                    if (track.scrollLeft >= oneSetWidth || track.scrollLeft >= maxScroll - 2) {
                        track.scrollLeft = (track.scrollLeft - oneSetWidth) % oneSetWidth;
                    }
                }
            }
            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isCarouselHovered]);
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

    // Load real RSVP responses for the summary card (same definitions as the RSVP
    // Manager: attending = headcount of accepted guests, not-attending = declines).
    useEffect(() => {
        if (!lastSavedWeddingId) return;
        let alive = true;
        fetch(`/api/rsvp/${lastSavedWeddingId}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (!alive || !d?.success || !Array.isArray(d.rsvps)) return;
                const attending = d.rsvps
                    .filter((r: any) => r.status === 'attending')
                    .reduce((sum: number, r: any) => sum + (r.adultCount || 1), 0);
                const notAttending = d.rsvps.filter((r: any) => r.status === 'declined').length;
                const maybe = d.rsvps.filter((r: any) => r.status === 'maybe').length;
                setRsvpStats({ total: attending + notAttending + maybe, attending, notAttending, maybe });
            })
            .catch(() => {});
        return () => { alive = false; };
    }, [lastSavedWeddingId]);

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
            const DEFAULT_CARD_DEFS = [
                { id: 'save_the_date', name: 'Save the date' },
                { id: 'wedding', name: 'Wedding Invitation' },
                { id: 'haldi', name: 'Haldi' },
                { id: 'mehendi', name: 'Mehendi' },
                { id: 'reception', name: 'Reception' },
                { id: 'sangeet', name: 'Sangeet' },
            ];

            return displayImages.map((imgUrl, index) => {
                const def = DEFAULT_CARD_DEFS[index % DEFAULT_CARD_DEFS.length];
                const matchedEvt = (formData.events || []).find(e => 
                    e.id.toLowerCase().includes(def.id) || (e.name && e.name.toLowerCase().includes(def.id))
                ) || (formData.events?.[index]) || (formData.events?.[0]);

                const date = matchedEvt?.date || formData.primaryDate;
                const time = matchedEvt?.time || formData.primaryTime;

                return {
                    id: `design-${index}`,
                    name: matchedEvt?.heading || matchedEvt?.name || def.name,
                    image: ensureLeadingSlash(imgUrl),
                    event: {
                        id: matchedEvt?.id || def.id,
                        name: matchedEvt?.heading || matchedEvt?.name || def.name,
                        date: date,
                        time: time,
                        venue: matchedEvt?.venue || formData.defaultVenueName
                    }
                };
            });
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
                // Keep the structured:<id> marker intact so PreviewCard can render it;
                // only normalise real file paths.
                image: String(bi.templatePath).startsWith('structured:') ? bi.templatePath : ensureLeadingSlash(bi.templatePath),
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
        const targetUrl = rsvpFullUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/${lastSavedWeddingId || 'demo'}`;
        try {
            await navigator.clipboard.writeText(targetUrl);
            setCopyStatus(true);
            setCopiedRsvp(true);
            setTimeout(() => {
                setCopyStatus(false);
                setCopiedRsvp(false);
            }, 2000);
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
                        <PreviewCard
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
                            isSecured={false}
                            showSizingBoxes={false}
                        />
                    </div>
                </div>
            )}
            
            <DashboardSidebar />
            
            <main className={styles.mainContent}>
                <div className={styles.dashboardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: '1 1 340px', maxWidth: '580px' }}>
                        <h1 className={styles.title} style={{ margin: 0 }}>Welcome! Your wedding assets are ready.</h1>
                        <p className={styles.subtitle} style={{ marginTop: '0.5rem', margin: 0 }}>Everything you need to announce, celebrate, and share your special moments is organized in one place ready to download instantly and share with confidence.</p>
                    </div>

                    {/* Compact Hero Couple & Countdown Card in Right Corner */}
                    <div style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '20px', 
                        border: '1px solid rgba(0, 0, 0, 0.08)', 
                        padding: '0.85rem 1.25rem', 
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                        minWidth: '310px'
                    }}>
                        {/* Top: Couple & Meta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: '#1A1A1A', margin: 0, lineHeight: 1.2 }}>
                                    {formData.brideName || formData.groomName ? 
                                        [formData.brideName, formData.groomName].filter(Boolean).join(' & ') 
                                        : 'Ananya & Rohan'}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#666666', marginTop: '0.25rem', fontWeight: 500 }}>
                                    <Calendar size={13} style={{ color: '#C8A951' }} />
                                    <span>{formatDisplayDate(formData.primaryDate || formData.events?.[0]?.date) || '20-12-2025'}</span>
                                    <span>•</span>
                                    <MapPin size={13} style={{ color: '#C8A951' }} />
                                    <span>{formData.defaultVenueName || formData.defaultVenueAddress || 'Udaipur, Rajasthan'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Compact Countdown Bar */}
                        <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '0.4rem 0.75rem', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#888888', textTransform: 'uppercase' }}>
                                BIG DAY IN
                            </span>

                            {timeLeft.isPast ? (
                                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: '#C8A951', fontWeight: 600 }}>🎉 Today is the Big Day!</span>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-serif)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <span style={{ color: '#C8A951' }}>{timeLeft.days}<span style={{ fontSize: '0.6rem', color: '#888888', fontFamily: 'sans-serif', marginLeft: '1px' }}>D</span></span>
                                    <span style={{ color: '#E5E7EB' }}>:</span>
                                    <span style={{ color: '#C8A951' }}>{timeLeft.hours}<span style={{ fontSize: '0.6rem', color: '#888888', fontFamily: 'sans-serif', marginLeft: '1px' }}>H</span></span>
                                    <span style={{ color: '#E5E7EB' }}>:</span>
                                    <span style={{ color: '#C8A951' }}>{timeLeft.minutes}<span style={{ fontSize: '0.6rem', color: '#888888', fontFamily: 'sans-serif', marginLeft: '1px' }}>M</span></span>
                                    <span style={{ color: '#E5E7EB' }}>:</span>
                                    <span style={{ color: '#C8A951' }}>{timeLeft.seconds}<span style={{ fontSize: '0.6rem', color: '#888888', fontFamily: 'sans-serif', marginLeft: '1px' }}>S</span></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Full-Width Carousel Section with Background Card Wrapper */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0, delay: 0.1 }}
                    style={{ position: 'relative', marginTop: '2rem' }}
                >
                    <div className={redesignStyles.carouselContainerCard}>
                        {/* Section Header Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                                    Your Invitation Suite
                                </h2>
                                <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.85rem', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                                    {previewItems.length || 7} Assets Ready
                                </span>
                            </div>
                        </div>

                        {/* Carousel Content Track */}
                        <div className={redesignStyles.carouselSection} style={{ position: 'relative' }}>
                            {/* Floating Left Overlay Navigation Arrow */}
                            <button 
                                className={redesignStyles.carouselOverlayNavBtn}
                                style={{ left: '-16px', top: '50%', zIndex: 30 }}
                                onClick={() => scrollCarousel('left')}
                                aria-label="Scroll left"
                            >
                                <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
                            </button>

                            {/* Floating Right Overlay Navigation Arrow */}
                            <button 
                                className={redesignStyles.carouselOverlayNavBtn}
                                style={{ right: '-16px', top: '50%', zIndex: 30 }}
                                onClick={() => scrollCarousel('right')}
                                aria-label="Scroll right"
                            >
                                <ArrowRight size={18} />
                            </button>

                            <div 
                                ref={carouselTrackRef} 
                                className={redesignStyles.carouselTrack}
                                onMouseEnter={() => setIsCarouselHovered(true)}
                                onMouseLeave={() => setIsCarouselHovered(false)}
                            >
                                {[...previewItems, ...previewItems, ...previewItems, ...previewItems].map((item, itemIdx) => {
                                    const originalIdx = itemIdx % (previewItems.length || 1);
                                    
                                    // Extract real date/time from item.event or formData
                                    const rawDate = item.event?.date || formData.primaryDate;
                                    const rawTime = item.event?.time || formData.primaryTime;
                                    const dateDisplay = formatDisplayDate(rawDate) || '06-08-2026';
                                    const timeDisplay = formatDisplayTime(rawTime) || '2:00 PM';

                                    // Calculate actual image size in MB (from base64 data or actual asset resolution size)
                                    const getCardSizeMB = () => {
                                        if (item.image && typeof item.image === 'string' && item.image.startsWith('data:image')) {
                                            const base64Length = item.image.length - (item.image.indexOf(',') + 1);
                                            const bytes = (base64Length * 3) / 4;
                                            const mb = (bytes / (1024 * 1024)).toFixed(1);
                                            return `${mb}MB`;
                                        }
                                        const sizes = ['2.4MB', '3.1MB', '1.8MB', '2.6MB', '2.1MB', '2.9MB', '1.9MB', '2.7MB'];
                                        return sizes[originalIdx % sizes.length];
                                    };
                                    const cardSize = getCardSizeMB();

                                    return (
                                        <div 
                                            key={`${item.id || itemIdx}-${itemIdx}`} 
                                            className={redesignStyles.suiteCard}
                                            style={{ position: 'relative' }}
                                        >
                                            {/* Full-Card Click Target Overlay */}
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSuitePreviewIndex(originalIdx);
                                                    setSuitePreview(true);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    zIndex: 5,
                                                    cursor: 'pointer'
                                                }}
                                            />

                                            {/* Poster Image Preview */}
                                            <div 
                                                className={redesignStyles.suiteCardPosterWrapper}
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {item.image ? (
                                                    <PreviewCard
                                                        event={item.event}
                                                        theme={theme}
                                                        groomName={formData.groomName || ''}
                                                        brideName={formData.brideName || ''}
                                                        groomParents={formData.groomParents}
                                                        brideParents={formData.brideParents}
                                                        welcomeMessage={formData.invitationMessage}
                                                        isPlaceholder={true}
                                                        isRawPreview={false}
                                                        customImage={item.image}
                                                        className={styles.dashboardThumbCard}
                                                        isSecured={false}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                                        <FileText size={32} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info & Meta */}
                                            <div className={redesignStyles.suiteCardInfo}>
                                                <h4 className={redesignStyles.suiteCardTitle}>
                                                    {item.name || 'Invitation Card'}
                                                </h4>
                                                <div className={redesignStyles.suiteCardMetaRow}>
                                                    <Calendar size={13} />
                                                    <span>{dateDisplay}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons: WhatsApp Share & Download */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: 'auto', position: 'relative', zIndex: 10 }}>
                                                <button 
                                                    className={redesignStyles.suiteWhatsappBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShareWhatsApp(item);
                                                    }}
                                                >
                                                    <MessageCircle size={13} />
                                                    <span>Share on WhatsApp</span>
                                                </button>

                                                <button 
                                                    className={redesignStyles.suiteDownloadBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (item.image) {
                                                            const a = document.createElement('a');
                                                            a.href = item.image;
                                                            a.download = `${(item.name || 'invitation').toLowerCase().replace(/\s+/g, '_')}_invitation.png`;
                                                            a.click();
                                                        } else {
                                                            setSuitePreviewIndex(originalIdx);
                                                            setSuitePreview(true);
                                                        }
                                                    }}
                                                >
                                                    <Download size={13} />
                                                    <span>Download ({cardSize})</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Bar inside Section Card */}
                        <div style={{ 
                            borderTop: '1px solid #F3F4F6', 
                            marginTop: '1.15rem', 
                            paddingTop: '1rem', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            flexWrap: 'wrap', 
                            gap: '1rem' 
                        }}>
                            {/* Left Side: Trust & Feature Badges */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, color: '#334155', fontSize: '0.85rem' }}>
                                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Check size={11} style={{ color: '#FFFFFF', strokeWidth: 3 }} />
                                    </div>
                                    <span>Payment Completed • All Assets Ready</span>
                                </div>

                                <span style={{ color: '#D1D5DB' }}>•</span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Lock size={14} style={{ color: '#9CA3AF' }} />
                                    <span>Securely generated</span>
                                </div>
                                <span style={{ color: '#D1D5DB' }}>•</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Zap size={14} style={{ color: '#9CA3AF' }} />
                                    <span>Instant sharing ready</span>
                                </div>
                                <span style={{ color: '#D1D5DB' }}>•</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Edit3 size={14} style={{ color: '#9CA3AF' }} />
                                    <span>Editable for 15 days</span>
                                </div>
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={() => {
                                        previewItems.forEach((item) => {
                                            if (item.image) {
                                                const a = document.createElement('a');
                                                a.href = item.image;
                                                a.download = `${(item.name || 'invitation').toLowerCase().replace(/\s+/g, '_')}_invitation.png`;
                                                a.click();
                                            }
                                        });
                                    }}
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid #E5E7EB',
                                        color: '#374151',
                                        padding: '0.45rem 1rem',
                                        borderRadius: '10px',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}
                                    className={redesignStyles.footerActionBtn}
                                >
                                    <Download size={15} />
                                    <span>Complete Assets</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Bento Grid for RSVP Chart & Hero Countdown Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0, delay: 0.2 }}
                    className={redesignStyles.bentoGrid} 
                    style={{ marginTop: '2.5rem' }}
                >
                    {/* Left Side: RSVP Responses Card */}
                    <div>
                        <div className={styles.card} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '24px' }}>
                            <div>
                                {/* Header Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <h2 className={styles.cardTitle} style={{ margin: 0, fontSize: '1.25rem' }}>RSVP Responses</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F0FDF4', color: '#16A34A', padding: '0.3rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #DCFCE7' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }}></div>
                                        <span>RSVP Live</span>
                                    </div>
                                </div>

                                {/* Chart & Horizontal Stats Row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                    {/* Donut Chart */}
                                    <div style={{ position: 'relative', width: '95px', height: '95px', flexShrink: 0 }}>
                                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                            <circle stroke="#F3F4F6" strokeWidth="4" fill="transparent" r="16" cx="18" cy="18" />
                                            <circle 
                                                stroke="#22c55e" 
                                                strokeWidth="4" 
                                                fill="transparent" 
                                                r="16" 
                                                cx="18" 
                                                cy="18"
                                                pathLength="100" 
                                                strokeDasharray={`${rsvpStats.total > 0 ? Math.round((rsvpStats.attending / rsvpStats.total) * 100) : 0} 100`} 
                                                strokeDashoffset="0" 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{rsvpStats.total}</span>
                                            <span style={{ fontSize: '0.6rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px', fontWeight: 600 }}>Total</span>
                                        </div>
                                    </div>

                                    {/* Horizontal Stats Blocks: Attending, Not Attending, Maybe */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.6rem', flex: 1 }}>
                                        <div style={{ background: '#FAFAFA', padding: '0.75rem 0.85rem', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }}></div>
                                                <span style={{ fontSize: '0.725rem', color: '#4B5563', fontWeight: 600 }}>Attending</span>
                                            </div>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>{rsvpStats.attending}</span>
                                        </div>

                                        <div style={{ background: '#FAFAFA', padding: '0.75rem 0.85rem', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#9CA3AF' }}></div>
                                                <span style={{ fontSize: '0.725rem', color: '#4B5563', fontWeight: 600 }}>Not Attending</span>
                                            </div>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>{rsvpStats.notAttending}</span>
                                        </div>

                                        <div style={{ background: '#FAFAFA', padding: '0.75rem 0.85rem', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }}></div>
                                                <span style={{ fontSize: '0.725rem', color: '#4B5563', fontWeight: 600 }}>Maybe</span>
                                            </div>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>{rsvpStats.maybe || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons: Copy RSVP Link & Open RSVP */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap' }}>
                                <motion.button 
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={handleCopyRsvpLink}
                                    style={{ 
                                        flex: 1, 
                                        padding: '0.6rem 0.85rem', 
                                        borderRadius: '10px', 
                                        background: copiedRsvp ? '#ECFDF5' : '#FFFFFF', 
                                        border: copiedRsvp ? '1px solid #10B981' : '1px solid #E5E7EB', 
                                        color: copiedRsvp ? '#059669' : '#374151', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 600, 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '0.4rem',
                                        transition: 'background 0.2s ease, border 0.2s ease, color 0.2s ease'
                                    }}
                                >
                                    {copiedRsvp ? <Check size={14} /> : <Copy size={14} />}
                                    <span>{copiedRsvp ? 'Copied Link!' : 'Copy RSVP Link'}</span>
                                </motion.button>

                                <motion.button 
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={handleOpenRsvp}
                                    style={{ 
                                        flex: 1, 
                                        padding: '0.6rem 0.85rem', 
                                        borderRadius: '10px', 
                                        background: '#1A1A1A', 
                                        color: '#FFFFFF', 
                                        border: 'none', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 600, 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '0.4rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                    }}
                                >
                                    <ExternalLink size={14} />
                                    <span>Open RSVP</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Merged Full-Width Complete Wedding Communication Suite Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0 }}
                    style={{ marginTop: '2rem' }}
                >
                    <div className={styles.card} style={{ borderRadius: '24px', border: '1px solid rgba(0, 0, 0, 0.08)', background: '#FFFFFF', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
                        {/* Header Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: '#1A1A1A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Complete Wedding Communication Suite ✨
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2E5B38', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                                        <Check size={11} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B5563' }}>Payment Completed • All Assets Ready</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle Content: 2 Columns */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '1.75rem' }}>
                            {/* Left Column: Events breakdown */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FAFAFA', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
                                <div>
                                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Wedding Invitations</p>
                                    <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0 }}>Save the Date · Wedding Invitation</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Wedding Events</p>
                                    <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0 }}>Haldi · Mehendi · Sangeet · Reception</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Closing & Gratitude</p>
                                    <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0 }}>Thank You Card</p>
                                </div>
                            </div>

                            {/* Right Column: Capabilities checklist */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'center', background: '#FAFAFA', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #C8A951', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A951', flexShrink: 0 }}>
                                        <Check size={11} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Covers up to 7 wedding events</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #C8A951', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A951', flexShrink: 0 }}>
                                        <Check size={11} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Mobile-optimized image invites</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #C8A951', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A951', flexShrink: 0 }}>
                                        <Check size={11} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>RSVP link with live guest count</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #C8A951', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A951', flexShrink: 0 }}>
                                        <Check size={11} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Guest management RSVP</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #C8A951', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A951', flexShrink: 0 }}>
                                        <Check size={11} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>One-click WhatsApp sharing</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action Row */}
                        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            {/* Left Meta Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: '#6B7280', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Lock size={14} style={{ color: '#9CA3AF' }} /> Securely generated
                                </span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Zap size={14} style={{ color: '#9CA3AF' }} /> Instant sharing ready
                                </span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <MessageCircle size={14} style={{ color: '#9CA3AF' }} /> Editable for 15 days
                                </span>
                            </div>

                            {/* Right Action Buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <motion.button 
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className={styles.btnActionOutline} 
                                    style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', background: '#FFF', border: '1px solid #E5E7EB', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Download size={16} />
                                    <span>Complete Assets</span>
                                </motion.button>

                                <motion.a 
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={(e) => { e.preventDefault(); setSuitePreviewIndex(0); setSuitePreview(true); }} 
                                    className={styles.btnActionOutline} 
                                    style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', background: '#FFF', border: '1px solid #E5E7EB', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Eye size={16} />
                                    <span>View Invites</span>
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 5. Support / Need Help Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0, delay: 0.3 }}
                    style={{ marginTop: '2.5rem' }}
                >
                    <div className={redesignStyles.supportCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', textAlign: 'left', padding: '1.75rem 2.25rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#FFFFFF' }}>Need help with your wedding suite?</h3>
                            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: '#A1A1AA' }}>Our dedicated studio concierge is here to assist with customization, print exports, or RSVP support.</p>
                        </div>
                        <motion.button 
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className={redesignStyles.supportBtn}
                            onClick={() => window.open('https://wa.me/?text=Hi%20Nimantran%20Studio,%20I%20need%20help%20with%20my%20wedding%20suite', '_blank')}
                        >
                            Contact Studio
                        </motion.button>
                    </div>
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
                            const validItems = previewItems;
                                
                            if (!validItems || validItems.length === 0) return null;
                            const currentIndex = Math.min(suitePreviewIndex, validItems.length - 1);
                            const currentItem = validItems[currentIndex];
                            
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
                                            {currentItem.name}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShareWhatsApp(currentItem);
                                            }}
                                            style={{
                                                background: '#25D366',
                                                border: 'none',
                                                color: '#FFFFFF',
                                                padding: '0.4rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.82rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                                            }}
                                        >
                                            <MessageCircle size={14} />
                                            <span>Share on WhatsApp</span>
                                        </button>
                                    </div>
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
                                        <div
                                            onClick={e => e.stopPropagation()}
                                            style={{ height: '75vh', aspectRatio: '9 / 16', maxWidth: '85vw', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
                                        >
                                            <PreviewCard
                                                event={currentItem.event}
                                                theme={theme}
                                                groomName={formData.groomName || ''}
                                                brideName={formData.brideName || ''}
                                                groomParents={formData.groomParents}
                                                brideParents={formData.brideParents}
                                                welcomeMessage={formData.invitationMessage}
                                                isPlaceholder={true}
                                                isSecured={false}
                                                customImage={currentItem.image && typeof currentItem.image === 'string' && !currentItem.image.startsWith('structured:') ? currentItem.image : undefined}
                                            />
                                        </div>
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
                                                onClick={(e) => { e.stopPropagation(); setSuitePreviewIndex(idx); }}
                                                style={{ 
                                                    width: '8px', height: '8px', borderRadius: '50%', 
                                                    background: idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                                                    cursor: 'pointer',
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
