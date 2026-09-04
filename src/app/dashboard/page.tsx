'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { formatDisplayDate, formatLongDisplayDate, formatDisplayTime, parseWeddingDate, calculateDaysRemaining } from '@/lib/format-date';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { WelcomeDialog } from '@/components/dashboard/WelcomeDialog';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import { PreviewCard } from '@/components/preview/PreviewCard';
import type { Theme } from '@/lib/constants/themes';
import styles from './dashboard.module.css';
import redesignStyles from './dashboard-redesign.module.css';
import rsvpStyles from './rsvp/rsvp-list.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoInviteCard } from './VideoInviteCard';
import { auth } from '@/lib/firebase';
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
    Heart,
    Trash2,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Search,
    X
} from 'lucide-react';
import Link from 'next/link';

interface RSVPEntry {
    id: string;
    guestName: string;
    status: string;
    adultCount: number;
    childCount: number;
    phone?: string;
    dietary?: string;
    message?: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { formData, selectedThemeId, isAuthenticated, bundleImages, bundleItems, lastSavedWeddingId, updateEvent, removeEvent } = useWeddingStore();
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

    const [deletingRsvpEventId, setDeletingRsvpEventId] = useState<string | null>(null);
    const [copiedRsvpId, setCopiedRsvpId] = useState<string | null>(null);
    const [rsvpsList, setRsvpsList] = useState<RSVPEntry[]>([]);
    const [rsvpListLoading, setRsvpListLoading] = useState(false);
    const [rsvpSearchQuery, setRsvpSearchQuery] = useState('');
    const [rsvpStatusFilter, setRsvpStatusFilter] = useState<'all' | 'attending' | 'declined' | 'maybe'>('all');

    useEffect(() => {
        if (!lastSavedWeddingId) return;
        setRsvpListLoading(true);
        const fetchRsvps = async () => {
            try {
                await auth.authStateReady();
                const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
                const res = await fetch(`/api/rsvp/${lastSavedWeddingId}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const data = await res.json();
                if (data.success && Array.isArray(data.rsvps)) {
                    setRsvpsList(data.rsvps);
                    const attending = data.rsvps
                        .filter((r: any) => r.status === 'attending')
                        .reduce((sum: number, r: any) => sum + (r.adultCount || 1), 0);
                    const notAttending = data.rsvps.filter((r: any) => r.status === 'declined').length;
                    const maybe = data.rsvps.filter((r: any) => r.status === 'maybe').length;
                    setRsvpStats({ total: attending + notAttending + maybe, attending, notAttending, maybe });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setRsvpListLoading(false);
            }
        };
        fetchRsvps();
    }, [lastSavedWeddingId]);

    const fullRsvpStats = {
        totalResponses: rsvpsList.length,
        attending: rsvpsList.filter(r => r.status === 'attending').length,
        declined: rsvpsList.filter(r => r.status === 'declined').length,
        maybe: rsvpsList.filter(r => r.status === 'maybe').length,
        headcount: rsvpsList
            .filter(r => r.status === 'attending')
            .reduce((sum, r) => sum + (r.adultCount || 1), 0),
    };

    const filteredRsvpsList = rsvpsList.filter(r => {
        const matchesSearch = r.guestName.toLowerCase().includes(rsvpSearchQuery.toLowerCase()) ||
            (r.phone && r.phone.includes(rsvpSearchQuery));
        const matchesStatus = rsvpStatusFilter === 'all' ? true : r.status === rsvpStatusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDeleteRsvpClick = (id: string) => setDeletingRsvpEventId(id);
    const confirmDeleteRsvp = () => {
        if (deletingRsvpEventId) { removeEvent(deletingRsvpEventId); setDeletingRsvpEventId(null); }
    };
    const cancelDeleteRsvp = () => setDeletingRsvpEventId(null);

    const getRsvpPageLink = () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return lastSavedWeddingId ? `${origin}/rsvp/${lastSavedWeddingId}` : '';
    };

    const copyRsvpPageLink = (id: string) => {
        navigator.clipboard.writeText(getRsvpPageLink());
        setCopiedRsvpId(id);
        setTimeout(() => setCopiedRsvpId(null), 2000);
    };

    const openWhatsAppRsvp = () => {
        const names = formData.groomName && formData.brideName
            ? `${formData.groomName} & ${formData.brideName}`
            : 'our wedding';
        const text = `Please RSVP for ${names}: ${getRsvpPageLink()}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleExportRsvpCSV = () => {
        const headers = ['Guest Name', 'Status', 'Adults', 'Children', 'Phone', 'Dietary'];
        const rows = rsvpsList.map(r => [
            r.guestName,
            r.status,
            String(r.adultCount || 1),
            String(r.childCount || 0),
            r.phone || '-',
            r.dietary || '-',
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wedding_rsvps.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

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
        }, 300);
    };

    // Continuous slow, majestic infinite auto-scroll ticker with seamless loop reset
    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();

        const step = (time: number) => {
            const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;

            if (!isCarouselHovered && carouselTrackRef.current) {
                const track = carouselTrackRef.current;
                const oneSetWidth = track.scrollWidth / 4;
                const maxScroll = track.scrollWidth - track.clientWidth;
                
                if (oneSetWidth > 0 && maxScroll > 0) {
                    // Smooth, gentle 30px per second glide
                    track.scrollLeft += 30 * deltaTime;

                    // Seamlessly loop back by one set width when reaching the threshold
                    if (track.scrollLeft >= oneSetWidth) {
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
        const rawDate = formData.primaryDate || (formData.events && formData.events.length > 0 ? formData.events[0].date : '');
        const rawTime = formData.primaryTime || (formData.events && formData.events.length > 0 ? formData.events[0].time : '');
        const parsedTarget = parseWeddingDate(rawDate, rawTime);

        // If user has provided a date, use it; otherwise use a future reference date
        const targetDate = parsedTarget || parseWeddingDate('20-12-2025') || new Date(Date.now() + 47 * 86400000);

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
    }, [formData.primaryDate, formData.primaryTime, formData.events]);

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
            
            <main className={styles.mainContent}>
                {/* 1. Clean Full-Width Dashboard Welcome Header */}
                <div className={styles.dashboardHeader} style={{ marginBottom: '1.5rem' }}>
                    <h1 className={styles.title} style={{ margin: 0 }}>Welcome! Your wedding suite is ready.</h1>
                    <p className={styles.subtitle} style={{ marginTop: '0.45rem', margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Download your cards, share instantly on WhatsApp, and track guest RSVPs in real time.</p>
                </div>

                {/* 2. Dedicated Couple & Wedding Details Celebration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.08 }}
                    style={{ marginBottom: '1.25rem' }}
                >
                    <div className={redesignStyles.coupleInfoCard}>
                        {/* Couple Name & Date / Countdown Row */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {/* Line 1: Couple Name */}
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                {formData.brideName || formData.groomName ? 
                                    [formData.brideName, formData.groomName].filter(Boolean).join(' & ') 
                                    : 'Ananya & Rohan'}
                            </h3>

                            {/* Line 2: Real-time Date  ·  Real-time Days to go */}
                            {(() => {
                                const userDateStr = formData.primaryDate || (formData.events && formData.events.length > 0 ? formData.events[0].date : '');
                                const countdownData = calculateDaysRemaining(userDateStr || '20-12-2025');
                                const displayDate = formatLongDisplayDate(userDateStr) || '20 December 2025';

                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', color: '#64748B', fontWeight: 500, flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <Calendar size={13} style={{ color: '#C8A951' }} />
                                            <span style={{ color: '#334155', fontWeight: 600 }}>
                                                {displayDate}
                                            </span>
                                        </div>

                                        <span style={{ color: '#94A3B8', margin: '0 0.15rem' }}>·</span>

                                        <span style={{ color: '#B45309', fontWeight: 600 }}>
                                            {countdownData.text}
                                        </span>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Right Corner Group: Action Buttons */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem', 
                            flexWrap: 'wrap', 
                            marginLeft: 'auto' 
                        }}>

                            {/* Complete Assets Download Button */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
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
                                    borderRadius: '100px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className={redesignStyles.footerActionBtn}
                            >
                                <Download size={14} />
                                <span>Download Assets</span>
                            </motion.button>

                            {/* Share on WhatsApp Button */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={() => handleShareWhatsApp()}
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #E5E7EB',
                                    color: '#374151',
                                    padding: '0.45rem 1rem',
                                    borderRadius: '100px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className={redesignStyles.footerActionBtn}
                            >
                                <MessageCircle size={15} style={{ color: '#16A34A' }} />
                                <span>Share on WhatsApp</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Full-Width Carousel Section with Background Card Wrapper */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0, delay: 0.12 }}
                    style={{ position: 'relative' }}
                >
                    <div className={redesignStyles.carouselContainerCard}>
                        {/* Section Header Row */}
                        <div className={redesignStyles.carouselHeaderRow}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: '#1A1A1A', margin: 0, letterSpacing: '-0.01em' }}>
                                    Your Invitation Suite
                                </h2>
                                <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.85rem', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                                    {previewItems.length || 5} Assets Ready
                                </span>
                            </div>

                            {/* Header Navigation Controls */}
                            <div className={redesignStyles.carouselNavGroup}>
                                <button 
                                    className={redesignStyles.carouselHeaderNavBtn}
                                    onClick={() => scrollCarousel('left')}
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button 
                                    className={redesignStyles.carouselHeaderNavBtn}
                                    onClick={() => scrollCarousel('right')}
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Carousel Content Track */}
                        <div className={redesignStyles.carouselSection} style={{ position: 'relative' }}>
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
                                    const dateDisplay = formatDisplayDate(rawDate) || '06-08-2026';

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

                                                {/* Hover Overlay Badge */}
                                                <div className={redesignStyles.suiteCardOverlay}>
                                                    <div className={redesignStyles.suiteCardOverlayBadge}>
                                                        <Eye size={12} />
                                                        <span>Preview</span>
                                                    </div>
                                                </div>
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

                                            {/* Action Button: WhatsApp Share */}
                                            <div style={{ marginTop: 'auto', position: 'relative', zIndex: 10, width: '100%' }}>
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>



                {/* RSVP Manager Dashboard Section - Unified Master Command Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0, delay: 0.3 }}
                    style={{ marginTop: '2.5rem' }}
                >
                    {/* Header Row */}
                    <div className={rsvpStyles.header}>
                        <h1 className={rsvpStyles.title}>RSVP Dashboard</h1>
                    </div>

                    {/* Unified Events Master List Container */}
                    <div className={rsvpStyles.listContainer}>
                        {(formData.events && formData.events.length > 0 ? formData.events.slice(0, 1) : [{
                            id: 'primary_event',
                            name: [formData.groomName, formData.brideName].filter(Boolean).join(' & ') || 'Haldi',
                            date: formData.primaryDate || 'TBD',
                            time: formData.primaryTime || '15:00',
                            venue: formData.defaultVenueName || 'TBD',
                            rsvpDeadline: 'No deadline'
                        }]).map((evt) => {
                            const rsvpLink = getRsvpPageLink();

                            return (
                                <div key={evt.id} className={rsvpStyles.eventGroup}>
                                    <div className={rsvpStyles.eventMasterCard}>
                                        {/* 1. Master Event Header & Action Suite */}
                                        <div className={rsvpStyles.masterHeader}>
                                            <div className={rsvpStyles.headerLeft}>
                                                <div className={rsvpStyles.titleRow}>
                                                    <h2 className={rsvpStyles.eventName}>{evt.name}</h2>
                                                    <div className={rsvpStyles.statusLiveBadge}>
                                                        <span className={rsvpStyles.pulseDot}></span>
                                                        RSVP LIVE
                                                    </div>
                                                </div>

                                                {/* Meta Chips */}
                                                <div className={rsvpStyles.metaChipsRow}>
                                                    <div className={rsvpStyles.metaChip}>
                                                        <Calendar size={13} className={rsvpStyles.metaIcon} />
                                                        <span>{evt.date || 'TBD'} {evt.time ? `• ${evt.time}` : ''}</span>
                                                    </div>
                                                    <div className={rsvpStyles.metaChip}>
                                                        <MapPin size={13} className={rsvpStyles.metaIcon} />
                                                        <span>{evt.venue || 'TBD'}</span>
                                                    </div>
                                                    <div className={rsvpStyles.metaChip}>
                                                        <Clock size={13} className={rsvpStyles.metaIcon} />
                                                        <span>{evt.rsvpDeadline ? `Deadline: ${evt.rsvpDeadline}` : 'No deadline'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Suite */}
                                            <div className={rsvpStyles.actionSuite}>
                                                <button
                                                    className={rsvpStyles.actionBtnWhatsapp}
                                                    onClick={openWhatsAppRsvp}
                                                >
                                                    <Share2 size={15} />
                                                    <span>WhatsApp</span>
                                                </button>
                                                <button
                                                    className={rsvpStyles.actionBtn}
                                                    onClick={() => copyRsvpPageLink(evt.id)}
                                                >
                                                    {copiedRsvpId === evt.id ? <CheckCircle2 size={15} color="#10B981" /> : <Copy size={15} />}
                                                    <span>{copiedRsvpId === evt.id ? 'Copied' : 'Copy Link'}</span>
                                                </button>
                                                {rsvpLink && (
                                                    <Link href={rsvpLink} target="_blank" className={rsvpStyles.actionBtn}>
                                                        <Eye size={15} />
                                                        <span>Preview</span>
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/details"
                                                    className={`${rsvpStyles.actionBtn} ${rsvpStyles.actionBtnEdit}`}
                                                >
                                                    <Edit3 size={14} />
                                                    <span>Edit</span>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* 2. Interactive Metrics Control Bar (Apple-style Segmented Filter Strip) */}
                                        <div className={rsvpStyles.metricsControlBar}>
                                            <div className={rsvpStyles.segmentedPillTrack} role="tablist">
                                                <button
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={rsvpStatusFilter === 'all'}
                                                    className={`${rsvpStyles.segmentTab} ${rsvpStatusFilter === 'all' ? rsvpStyles.segmentTabActive : ''}`}
                                                    onClick={() => setRsvpStatusFilter('all')}
                                                >
                                                    {rsvpStatusFilter === 'all' && (
                                                        <motion.div
                                                            layoutId="activeFilterPill"
                                                            className={rsvpStyles.segmentPillBg}
                                                            transition={{ type: "spring", bounce: 0, duration: 0.28 }}
                                                        />
                                                    )}
                                                    <span className={rsvpStyles.segmentLabel}>Total Responses</span>
                                                    <span className={`${rsvpStyles.segmentCount} ${rsvpStyles.countAll}`}>
                                                        {fullRsvpStats.totalResponses}
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={rsvpStatusFilter === 'attending'}
                                                    className={`${rsvpStyles.segmentTab} ${rsvpStatusFilter === 'attending' ? rsvpStyles.segmentTabActive : ''}`}
                                                    onClick={() => setRsvpStatusFilter('attending')}
                                                >
                                                    {rsvpStatusFilter === 'attending' && (
                                                        <motion.div
                                                            layoutId="activeFilterPill"
                                                            className={rsvpStyles.segmentPillBg}
                                                            transition={{ type: "spring", bounce: 0, duration: 0.28 }}
                                                        />
                                                    )}
                                                    <span className={rsvpStyles.statusIndicatorDot} style={{ background: '#22C55E' }}></span>
                                                    <span className={rsvpStyles.segmentLabel}>Attending</span>
                                                    <span className={`${rsvpStyles.segmentCount} ${rsvpStyles.countAttending}`}>
                                                        {fullRsvpStats.attending}
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={rsvpStatusFilter === 'declined'}
                                                    className={`${rsvpStyles.segmentTab} ${rsvpStatusFilter === 'declined' ? rsvpStyles.segmentTabActive : ''}`}
                                                    onClick={() => setRsvpStatusFilter('declined')}
                                                >
                                                    {rsvpStatusFilter === 'declined' && (
                                                        <motion.div
                                                            layoutId="activeFilterPill"
                                                            className={rsvpStyles.segmentPillBg}
                                                            transition={{ type: "spring", bounce: 0, duration: 0.28 }}
                                                        />
                                                    )}
                                                    <span className={rsvpStyles.statusIndicatorDot} style={{ background: '#F43F5E' }}></span>
                                                    <span className={rsvpStyles.segmentLabel}>Not Attending</span>
                                                    <span className={`${rsvpStyles.segmentCount} ${rsvpStyles.countDeclined}`}>
                                                        {fullRsvpStats.declined}
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={rsvpStatusFilter === 'maybe'}
                                                    className={`${rsvpStyles.segmentTab} ${rsvpStatusFilter === 'maybe' ? rsvpStyles.segmentTabActive : ''}`}
                                                    onClick={() => setRsvpStatusFilter('maybe')}
                                                >
                                                    {rsvpStatusFilter === 'maybe' && (
                                                        <motion.div
                                                            layoutId="activeFilterPill"
                                                            className={rsvpStyles.segmentPillBg}
                                                            transition={{ type: "spring", bounce: 0, duration: 0.28 }}
                                                        />
                                                    )}
                                                    <span className={rsvpStyles.statusIndicatorDot} style={{ background: '#F59E0B' }}></span>
                                                    <span className={rsvpStyles.segmentLabel}>Maybe</span>
                                                    <span className={`${rsvpStyles.segmentCount} ${rsvpStyles.countMaybe}`}>
                                                        {fullRsvpStats.maybe}
                                                    </span>
                                                </button>
                                            </div>

                                            {/* Confirmed Headcount Chip */}
                                            <div className={rsvpStyles.headcountBadge}>
                                                <Users size={14} />
                                                <span><strong>{fullRsvpStats.headcount}</strong> Confirmed Headcount</span>
                                            </div>
                                        </div>

                                        {/* 3. Table Toolbar (Search + Export) */}
                                        <div className={rsvpStyles.tableToolbar}>
                                            <div className={rsvpStyles.searchBox}>
                                                <Search size={15} className={rsvpStyles.searchIcon} />
                                                <input
                                                    type="text"
                                                    placeholder="Search guests or phone..."
                                                    className={rsvpStyles.searchInput}
                                                    value={rsvpSearchQuery}
                                                    onChange={e => setRsvpSearchQuery(e.target.value)}
                                                />
                                                {rsvpSearchQuery && (
                                                    <button
                                                        type="button"
                                                        aria-label="Clear search"
                                                        className={rsvpStyles.searchClearBtn}
                                                        onClick={() => setRsvpSearchQuery('')}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className={rsvpStyles.exportBtn}
                                                onClick={handleExportRsvpCSV}
                                            >
                                                <Download size={14} />
                                                <span>Export CSV</span>
                                            </button>
                                        </div>

                                        {/* 4. Guest Table */}
                                        <div className={rsvpStyles.tableWrapper}>
                                            <table className={rsvpStyles.guestTable}>
                                                <thead>
                                                    <tr>
                                                        <th>GUEST NAME</th>
                                                        <th>STATUS</th>
                                                        <th>ADULTS</th>
                                                        <th>PHONE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rsvpListLoading ? (
                                                        <tr>
                                                            <td colSpan={4}>
                                                                <div className={rsvpStyles.emptyStateContainer}>
                                                                    <div className={rsvpStyles.emptyIconCircle}>
                                                                        <Users size={24} />
                                                                    </div>
                                                                    <h4 className={rsvpStyles.emptyHeading}>Loading responses...</h4>
                                                                    <p className={rsvpStyles.emptyText}>Fetching the latest RSVP entries for your event.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : filteredRsvpsList.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4}>
                                                                <div className={rsvpStyles.emptyStateContainer}>
                                                                    <div className={rsvpStyles.emptyIconCircle}>
                                                                        <Share2 size={24} />
                                                                    </div>
                                                                    {rsvpsList.length === 0 ? (
                                                                        <>
                                                                            <h4 className={rsvpStyles.emptyHeading}>No guest responses yet</h4>
                                                                            <p className={rsvpStyles.emptyText}>
                                                                                Share your RSVP link on WhatsApp or with wedding invitations to collect responses.
                                                                            </p>
                                                                            <button
                                                                                type="button"
                                                                                className={rsvpStyles.emptyShareBtn}
                                                                                onClick={openWhatsAppRsvp}
                                                                            >
                                                                                <Share2 size={14} />
                                                                                <span>Share on WhatsApp</span>
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <h4 className={rsvpStyles.emptyHeading}>No matching guests</h4>
                                                                            <p className={rsvpStyles.emptyText}>
                                                                                No guests found for &ldquo;{rsvpSearchQuery || rsvpStatusFilter}&rdquo;. Try clearing filters.
                                                                            </p>
                                                                            <button
                                                                                type="button"
                                                                                className={rsvpStyles.emptyShareBtn}
                                                                                onClick={() => {
                                                                                    setRsvpSearchQuery('');
                                                                                    setRsvpStatusFilter('all');
                                                                                }}
                                                                            >
                                                                                <span>Reset Filters</span>
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        filteredRsvpsList.map(r => (
                                                            <tr key={r.id}>
                                                                <td>
                                                                    <div className={rsvpStyles.guestNameCell}>
                                                                        <div className={rsvpStyles.guestAvatar}>
                                                                            {r.guestName ? r.guestName.charAt(0).toUpperCase() : 'G'}
                                                                        </div>
                                                                        <span className={rsvpStyles.guestNameText}>{r.guestName}</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className={`${rsvpStyles.statusBadge} ${
                                                                        r.status === 'attending' ? rsvpStyles.statusYes
                                                                        : r.status === 'declined' ? rsvpStyles.statusNo
                                                                        : r.status === 'maybe' ? rsvpStyles.statusMaybe
                                                                        : rsvpStyles.statusPending
                                                                    }`}>
                                                                        {r.status === 'attending' ? 'Attending'
                                                                            : r.status === 'declined' ? 'Declined'
                                                                            : r.status === 'maybe' ? 'Maybe'
                                                                            : 'Pending'}
                                                                    </span>
                                                                </td>
                                                                <td>{r.adultCount || 1}</td>
                                                                <td>{r.phone || '—'}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {deletingRsvpEventId && (
                    <div className={rsvpStyles.modalOverlay} onClick={cancelDeleteRsvp}>
                        <div className={rsvpStyles.modalContent} onClick={e => e.stopPropagation()}>
                            <div style={{ marginBottom: '1rem', color: '#EF4444' }}>
                                <Trash2 size={48} />
                            </div>
                            <h3 className={rsvpStyles.modalTitle}>Delete Event?</h3>
                            <p className={rsvpStyles.modalText}>
                                Are you sure you want to delete this event? This action cannot be undone and you will lose all collected RSVPs.
                            </p>
                            <div className={rsvpStyles.modalActions}>
                                <button className={rsvpStyles.btnCancel} onClick={cancelDeleteRsvp}>Cancel</button>
                                <button className={rsvpStyles.btnConfirmDelete} onClick={confirmDeleteRsvp}>Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                )}

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
                                                background: '#16A34A',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: '#FFFFFF',
                                                padding: '0.45rem 1.15rem',
                                                borderRadius: '20px',
                                                fontSize: '0.82rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.45rem',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <MessageCircle size={14} />
                                            <span>Share on WhatsApp</span>
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (currentItem.image && typeof currentItem.image === 'string' && !currentItem.image.startsWith('structured:')) {
                                                    const a = document.createElement('a');
                                                    a.href = currentItem.image;
                                                    a.download = `${(currentItem.name || 'invitation').toLowerCase().replace(/\s+/g, '_')}_invitation.png`;
                                                    a.click();
                                                } else {
                                                    // Fallback download
                                                    const a = document.createElement('a');
                                                    a.href = currentItem.image || '/assets/themes/sample-card.png';
                                                    a.download = `${(currentItem.name || 'invitation').toLowerCase().replace(/\s+/g, '_')}_invitation.png`;
                                                    a.click();
                                                }
                                            }}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.15)',
                                                border: '1px solid rgba(255, 255, 255, 0.35)',
                                                color: '#FFFFFF',
                                                padding: '0.45rem 1.15rem',
                                                borderRadius: '20px',
                                                fontSize: '0.82rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.45rem',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Download size={14} />
                                            <span>Download Card</span>
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
