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
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const { formData, selectedThemeId, isAuthenticated, bundleImages, bundleItems } = useWeddingStore();
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const cardRef = useRef<InvitationCardRef>(null);

    useEffect(() => {
        setIsMounted(true);
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
        if (!theme) return [];
        const ensureLeadingSlash = (path: string) => {
            if (!path) return '';
            if (path.startsWith('http') || path.startsWith('/')) return path;
            return `/${path}`;
        };

        if (!bundleItems || bundleItems.length === 0) {
            const displayImages = (bundleImages && bundleImages.length > 0) ? bundleImages : (theme.previewImages || []);
            return displayImages.map((imgUrl, index) => ({
                id: `design-${index}`,
                name: index === 0 ? "Wedding poster" : "Event Design",
                image: ensureLeadingSlash(imgUrl),
                event: (formData.events?.[index]) || (formData.events?.[0]) || { name: 'Main Event' }
            }));
        }

        return bundleItems.map((bi) => ({
            id: bi.id,
            name: bi.templateName || bi.eventType,
            image: ensureLeadingSlash(bi.templatePath), // Renamed
            event: formData.events?.find(e => e.eventType?.toUpperCase() === bi.eventType.toUpperCase()) || formData.events?.[0] || { name: 'Wedding' }
        }));
    };

    const previewItems = buildPreviewItems();
    const rsvpSlug = `${formData.groomName?.toLowerCase().split(' ')[0] || 'wedding'}-${formData.brideName?.toLowerCase().split(' ')[0] || 'rsvp'}`;
    const rsvpFullUrl = `https://nimantran.app/rsvp/${rsvpSlug}`;
    const [copyStatus, setCopyStatus] = useState(false);

    const handleCopyRsvpLink = async () => {
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
                                {formData.events?.slice(0, 3).map((event, idx) => (
                                    <div key={idx} className={styles.eventRow}>
                                        <div className={styles.eventIconWrapper}>
                                            <Calendar size={22} />
                                        </div>
                                        <div className={styles.eventConnector}></div>
                                        <div className={styles.eventMain}>
                                            <div className={styles.eventDetails}>
                                                <h4>
                                                    {event.name} 
                                                    {idx === 0 && <span className={styles.upcomingBadge}>Upcoming</span>}
                                                </h4>
                                                <p className={styles.eventMeta}>{event.eventType || 'Main Celebration'} • {event.date || 'TBD'}</p>
                                            </div>
                                            <div className={styles.responseCount}>
                                                <span className={styles.countNumber}>{idx === 0 ? '34' : idx === 1 ? '12' : '18'}</span>
                                                <span className={styles.countLabel}>Responses</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className={styles.quickActionsSection}>
                            <h2>Quick Actions</h2>
                            <div className={styles.actionGrid}>
                                <div className={styles.actionTile} onClick={handleCopyRsvpLink}>
                                    <div className={styles.actionTileIcon}><Link2 size={24} /></div>
                                    <h5>Copy RSVP Link</h5>
                                </div>
                                <div className={styles.actionTile} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(rsvpFullUrl)}`, '_blank')}>
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
                            <img 
                                src="/assets/gazebo.png" 
                                alt="Wedding Gazebo" 
                                className={styles.countdownImage} 
                            />
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

                {/* 3. Your Wedding Assets Section */}
                <section className={styles.assetsSection} style={{ marginTop: '4rem' }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Your Wedding Assets</h2>
                        <p className={styles.sectionSub}>Manage all digital assets created for your wedding.</p>
                    </div>

                    <div className={styles.assetGrid}>
                        {previewItems.slice(0, 3).map((item, index) => (
                            <div key={item.id} className={styles.assetCard}>
                                <div className={styles.assetThumbWrapper}>
                                    <img src={item.image} alt={item.name} className={styles.assetThumb} />
                                    <div className={styles.playOverlay}>
                                        <Eye size={20} color="white" />
                                    </div>
                                </div>
                                <div className={styles.assetInfo}>
                                    <h3 className={styles.assetName}>{item.name}</h3>
                                    <div className={styles.assetActions}>
                                        <button className={styles.btnShare}><MessageCircle size={14} /></button>
                                        <button className={styles.btnPreview}><Eye size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
