'use client';

import Link from 'next/link';
import styles from '../dashboard.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { useRouter } from 'next/navigation';
import { 
    LogOut, 
    LayoutDashboard, 
    Home, 
    Calendar, 
    Users, 
    Copy, 
    ExternalLink, 
    Eye, 
    Download, 
    Share2, 
    Play, 
    FileText, 
    Link2,
    MessageCircle,
    Sparkles,
    Check,
    Lock,
    Zap
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import type { Theme } from '@/lib/constants/themes';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
    const router = useRouter();
    const { formData, selectedThemeId, isAuthenticated, bundleImages, bundleItems } = useWeddingStore();
    const logout = useWeddingStore((state) => state.logout);
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const cardRef = useRef<InvitationCardRef>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) {
            router.push('/');
        }
    }, [isMounted, isAuthenticated, router]);

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

    // Improved preview item builder for dashboard
    const buildPreviewItems = () => {
        if (!theme) return [];
        
        const ensureLeadingSlash = (path: string) => {
            if (!path) return '';
            if (path.startsWith('http') || path.startsWith('/')) return path;
            return `/${path}`;
        };

        if (!bundleItems || bundleItems.length === 0) {
            const displayImages = (bundleImages && bundleImages.length > 0) ? bundleImages : (theme.previewImages || []);
            return displayImages.map((imgUrl, index) => {
                const url = ensureLeadingSlash(imgUrl);
                return {
                    id: `design-${index}`,
                    name: index === 0 ? "Wedding poster" : (url.includes('haldi') ? 'Haldi' : url.includes('mehendi') ? 'Mehendi' : url.includes('sangeet') ? 'Sangeet' : `Design ${index + 1}`),
                    image: url,
                    event: (formData.events?.[index]) || (formData.events?.[0]) || {
                        id: 'wedding',
                        name: 'Wedding Ceremony',
                        date: formData.primaryDate,
                        time: formData.primaryTime,
                        venue: formData.defaultVenueName
                    }
                };
            });
        }

        return bundleItems.map((bi) => {
            const matchedEvent = formData.events?.find(e => e.eventType?.toUpperCase() === bi.eventType.toUpperCase()) || formData.events?.[0] || {
                id: 'wedding',
                name: 'Wedding Ceremony',
                date: formData.primaryDate,
                time: formData.primaryTime,
                venue: formData.defaultVenueName
            };
            
            return {
                id: bi.id,
                name: bi.templateName || bi.eventType,
                image: ensureLeadingSlash(bi.templatePath), // Renamed
                event: matchedEvent
            };
        });
    };

    const previewItems = buildPreviewItems();

    // Generate RSVP Link based on couple names
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

    if (!isMounted) return null;
    if (!isAuthenticated) return null;

    return (
        <div className={styles.dashboardContainer}>
            {/* Fullscreen Preview Modal */}
            {selectedPreviewIndex !== null && theme && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        backgroundColor: 'rgba(0,0,0,0.92)',
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
                            color: '#333', zIndex: 10
                        }}
                    >
                        <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
                    </button>

                    <div
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InvitationCard
                            ref={cardRef}
                            key={`preview-${selectedPreviewIndex}-${resetKey}`}
                            event={previewItems[selectedPreviewIndex]?.event}
                            theme={theme}
                            groomName={formData.groomName || ''}
                            brideName={formData.brideName || ''}
                            groomParents={formData.groomParents}
                            brideParents={formData.brideParents}
                            welcomeMessage={formData.invitationMessage}
                            isPlaceholder={true}
                            type={selectedPreviewIndex === 1 ? 'video' : 'image'}
                            customImage={previewItems[selectedPreviewIndex]?.image}
                            isSecured={true}
                            showSizingBoxes={isEditMode}
                        />

                        {/* Modal Actions */}
                        <div style={{
                            position: 'absolute', bottom: '-4rem', left: '50%',
                            transform: 'translateX(-50%)', display: 'flex', gap: '1.5rem',
                            padding: '1rem', background: 'rgba(255,255,255,0.1)',
                            borderRadius: '100px', backdropFilter: 'blur(10px)'
                        }}>
                            <button
                                onClick={() => cardRef.current?.downloadImage()}
                                style={{
                                    background: 'white', border: 'none', borderRadius: '50%',
                                    width: '44px', height: '44px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111'
                                }}
                                title="Download"
                            >
                                <Download size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    const text = encodeURIComponent(`Check out our wedding invite!\n\nhttps://nimantran.app/rsvp/vivek-priyanka`);
                                    window.open(`https://wa.me/?text=${text}`, '_blank');
                                }}
                                style={{
                                    background: '#22c55e', border: 'none', borderRadius: '50%',
                                    width: '44px', height: '44px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                }}
                                title="Share"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DashboardSidebar />

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.headerSpacer} />

                {/* Wedding Event Card */}
                <div className={styles.card}>
                    <div className={styles.cardMain}>
                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>
                                Complete Wedding Communication Suite <Sparkles size={20} className={styles.titleSparkles} />
                            </h2>
                            <div className={styles.paymentStatus}>
                                <Check size={16} className={styles.paymentCheck} />
                                <span>Payment Completed • All Assets Ready</span>
                            </div>
                        </div>

                        <div className={styles.cardFeatures}>
                            <div className={styles.featuresColumn}>
                                <ul className={styles.featuresList}>
                                    <li><Check size={14} className={styles.featureCheck} /> Covers up to 7 wedding events</li>
                                    <li><Check size={14} className={styles.featureCheck} /> Mobile-optimized image invites</li>
                                    <li><Check size={14} className={styles.featureCheck} /> RSVP link with live guest count</li>
                                </ul>
                            </div>
                            <div className={styles.featuresColumn}>
                                <ul className={styles.featuresList}>
                                    <li><Check size={14} className={styles.featureCheck} /> Guest management RSVP</li>
                                    <li><Check size={14} className={styles.featureCheck} /> One-click WhatsApp sharing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.cardFooter}>
                        <div className={styles.footerPill}>
                            <span className={styles.footerItem}>
                                <Lock size={12} className={styles.footerIcon} /> 
                                Securely generated
                            </span>
                            <span className={styles.footerDivider}>•</span>
                            <span className={styles.footerItem}>
                                <Zap size={12} className={styles.footerIcon} />
                                Instant sharing ready
                            </span>
                            <span className={styles.footerDivider}>•</span>
                            <span className={styles.footerItem}>
                                <MessageCircle size={12} className={styles.footerIcon} />
                                Editable for 15 days
                            </span>
                        </div>

                        <div className={styles.footerActions}>
                            <button className={styles.btnActionOutline} title="Download Invitation">
                                <Download size={18} />
                                <span>Complete Assets</span>
                            </button>
                            <Link href="/preview" className={styles.btnActionOutline}>
                                <Eye size={18} />
                                <span>View Invites</span>
                            </Link>

                            <button className={styles.btnWhatsApp} title="Share on WhatsApp">
                                <Share2 size={18} />
                                <span>WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section: Your Wedding Assets */}
                <section className={styles.assetsSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Your Wedding Assets</h2>
                        <p className={styles.sectionSub}>All assets created for Vivek & Priyanka's wedding are listed below.</p>
                    </div>

                    <div className={styles.assetGrid}>
                        {/* 1. Primary Wedding Poster / Invite */}
                        {previewItems[0] && (
                            <div className={styles.assetCard}>
                                <div 
                                    className={styles.assetThumbWrapper} 
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}
                                    onClick={() => setSelectedPreviewIndex(0)}
                                >
                                    {theme ? (
                                        <InvitationCard 
                                            event={previewItems[0].event}
                                            theme={theme}
                                            groomName={formData.groomName || ''}
                                            brideName={formData.brideName || ''}
                                            isPlaceholder={true}
                                            customImage={previewItems[0].image}
                                            isSecured={true}
                                            className={styles.dashboardThumbCard}
                                        />
                                    ) : (
                                        <img src="/assets/main-invite.jpg" alt="Wedding poster Invite" className={styles.assetThumb} />
                                    )}
                                    <div className={styles.playOverlay}>
                                        <Eye size={20} color="white" />
                                    </div>
                                </div>
                                <div className={styles.assetInfo}>
                                    <h3 className={styles.assetName}>{previewItems[0].name} Invite</h3>
                                    <p className={styles.assetMeta}>Elegant WhatsApp-ready image card</p>
                                    <p className={styles.assetDesc}>Share instantly after unlock.</p>
                                    <div className={styles.assetActions}>
                                        <button className={styles.btnShare}>
                                            <MessageCircle size={16} />
                                            <span>Share</span>
                                        </button>
                                        <button className={styles.btnPreview} onClick={() => setSelectedPreviewIndex(0)}>
                                            <Eye size={16} />
                                            <span>Preview</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Wedding Teaser Video (Dynamic mapping) */}
                        {previewItems[1] && (
                            <div className={styles.assetCard}>
                                <div className={styles.assetThumbWrapper}>
                                    <img src={previewItems[1].image || "/assets/teaser-video.jpg"} alt={previewItems[1].name} className={styles.assetThumb} />
                                    <div className={styles.playOverlay} style={{ opacity: 1, background: 'rgba(0,0,0,0.2)' }}>
                                        <Play size={24} fill="white" color="white" />
                                    </div>
                                </div>
                                <div className={styles.assetInfo}>
                                    <h3 className={styles.assetName}>{previewItems[1].name} Video</h3>
                                    <p className={styles.assetMeta}>Short Video Clip</p>
                                    <p className={styles.assetDesc}>Send an elegant teaser video of your wedding.</p>
                                    <div className={styles.assetActions}>
                                        <button className={styles.btnShare}>
                                            <MessageCircle size={16} />
                                            <span>Share</span>
                                        </button>
                                        <button className={styles.btnDownload}>
                                            <Download size={16} />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Dynamic RSVP Link Card */}
                        <div className={styles.assetCard}>
                            <div className={styles.assetThumbWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDFBF7' }}>
                                <div className={styles.rsvpPreviewPlaceholder}>
                                    <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
                                        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold' }}>
                                            {formData.groomName?.split(' ')[0]} & {formData.brideName?.split(' ')[0]}
                                        </div>
                                    </div>
                                    <div className={styles.rsvpPreviewForm}>
                                        <div className={styles.rsvpPreviewLine}></div>
                                        <div className={styles.rsvpPreviewLine} style={{ width: '80%' }}></div>
                                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                            <div style={{ height: '12px', width: '12px', background: '#F3F4F6', borderRadius: '2px' }}></div>
                                            <div style={{ height: '12px', width: '12px', background: '#F3F4F6', borderRadius: '2px' }}></div>
                                        </div>
                                        <div className={styles.rsvpPreviewBtn}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.assetInfo}>
                                <h3 className={styles.assetName}>Landing Page with RSVP Link</h3>
                                <p className={styles.assetMeta}>Track responses from a smart link for guests.</p>
                                <p className={styles.assetUrl}>
                                    {rsvpFullUrl.replace('https://', '')} 
                                    <Copy 
                                        size={12} 
                                        style={{ cursor: 'pointer', marginLeft: '4px', color: copyStatus ? '#22c55e' : 'inherit' }} 
                                        onClick={handleCopyRsvpLink}
                                    />
                                </p>
                                <div className={styles.assetActions}>
                                    <button className={styles.btnOutlineSmall} onClick={handleCopyRsvpLink}>
                                        {copyStatus ? <Check size={16} /> : <Copy size={16} />}
                                        <span>{copyStatus ? 'Copied' : 'Copy Link'}</span>
                                    </button>
                                    <button className={styles.btnOutlineSmall} onClick={() => window.open(rsvpFullUrl, '_blank')}>
                                        <ExternalLink size={16} />
                                        <span>Open Page</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Additional Suite Assets (e.g. PDF or Next Item) */}
                        {previewItems[2] && (
                            <div className={styles.assetCard}>
                                <div className={styles.assetThumbWrapper}>
                                    <img src={previewItems[2].image || "/assets/pdf-invite.jpg"} alt={previewItems[2].name} className={styles.assetThumb} />
                                </div>
                                <div className={styles.assetInfo}>
                                    <h3 className={styles.assetName}>Printable {previewItems[2].name}</h3>
                                    <p className={styles.assetMeta}>Print Friendly PDF File</p>
                                    <p className={styles.assetDesc}>Save and print a PDF version of your invite.</p>
                                    <button className={styles.btnDownloadWide}>
                                        <Download size={16} />
                                        <span>Download (8.4MB)</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section: Additional Assets */}
                <section className={styles.additionalSection}>
                    <h2 className={styles.sectionTitleSmall}>Additional Assets</h2>
                    <div className={styles.additionalGrid}>
                        <div className={styles.additionalCard}>
                            <div className={styles.addAssetIcon}>
                                <MessageCircle size={20} />
                            </div>
                            <div className={styles.addAssetInfo}>
                                <h4>WhatsApp Status Preview</h4>
                                <p>Ideal for sharing as a status • story</p>
                                <div className={styles.addAssetActions}>
                                    <button className={styles.btnSmallAction}>
                                        <MessageCircle size={14} />
                                        Share
                                    </button>
                                    <button className={styles.btnSmallAction}>
                                        <Download size={14} />
                                        Download (2.4MB)
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.additionalCard}>
                            <div className={styles.addAssetIcon}>
                                <Sparkles size={20} />
                            </div>
                            <div className={styles.addAssetInfo}>
                                <h4>Vivek & Priyanka</h4>
                                <p>WhatsApp image • 2.4MB</p>
                                <div className={styles.addAssetActions}>
                                    <button className={styles.btnSmallAction}>
                                        <MessageCircle size={14} />
                                        Share
                                    </button>
                                    <button className={styles.btnSmallAction}>
                                        <Download size={14} />
                                        Download (1.8MB)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ready to Share Banner */}
                <div className={styles.shareBanner}>
                    <div className={styles.shareBannerContent}>
                        <div className={styles.shareBannerText}>
                            <h3><Sparkles size={20} className={styles.goldSparkle} /> You're ready to share! <Sparkles size={20} className={styles.goldSparkle} /></h3>
                            <p>Most couples finish sharing invites within 10 minutes.</p>
                        </div>
                        <div className={styles.shareBannerActions}>
                            <button className={styles.btnBannerPrimary}>
                                <MessageCircle size={18} />
                                Share on WhatsApp
                            </button>
                            <button className={styles.btnBannerOutline}>
                                <Link2 size={18} />
                                Copy RSVP Link
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
