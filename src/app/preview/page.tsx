'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { THEMES } from '@/lib/constants/themes';
import { InvitationCard } from '@/components/preview/InvitationCard';
import styles from '@/components/preview/Preview.module.css';
import { ChevronLeft, Play, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PreviewPage() {
    const { formData, selectedThemeId, lastSavedWeddingId } = useWeddingStore();
    const theme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

    return (
        <div className={styles.previewPage}>
            <header className={styles.header}>
                <div className="container">
                    <Link href="/details" style={{ display: 'inline-flex', alignItems: 'center', color: '#666', marginBottom: '1rem' }}>
                        <ChevronLeft size={16} /> Edit Details
                    </Link>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Wedding Bundle</h1>
                    <p style={{ color: '#666' }}>Generated automatically from your details. Ready for high-res delivery.</p>
                </div>
            </header>

            <main className="container">

                {/* Photos / Image Invitations */}
                <h2 className={styles.sectionTitle}>Digital Image Pack</h2>
                <div className={styles.grid}>
                    {formData.events.map((event) => (
                        <InvitationCard
                            key={event.id}
                            event={event}
                            theme={theme}
                            groomName={formData.groomName}
                            brideName={formData.brideName}
                        />
                    ))}
                </div>

                {/* Video Placeholder */}
                <h2 className={styles.sectionTitle}>Video Invitation</h2>
                <div className={styles.videoPlaceholder}>
                    <Play size={64} className={styles.videoIcon} />
                    <h3>Cinematic Video Invitation</h3>
                    <p style={{ maxWidth: '400px', margin: '1rem auto', opacity: 0.8 }}>
                        A personalized animated video with your music and photos. Previews are watermarked until purchase.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                        <CheckCircle size={16} color="var(--primary)" /> Final Render in 1080p HD
                    </div>
                </div>

                {/* Bundle Summary Card */}
                <div style={{ marginTop: '5rem', backgroundColor: '#FDFBF7', padding: '3rem', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Full Bundle Includes:</h2>
                    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', listStyle: 'none', padding: 0 }}>
                        <li>✨ {formData.events.length} Event Invitations</li>
                        <li>🎬 Animated Video Invite</li>
                        <li>📝 RSVP Tracking Link</li>
                        <li>📱 WhatsApp Ready Files</li>
                        <li>🖨️ High-Res Print Files</li>
                    </ul>
                </div>
            </main>

            {/* Payment Action Bar */}
            <footer className={styles.summaryBar}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Total Bundle Price</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>₹3,999</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            {lastSavedWeddingId && (
                                <Link
                                    href={`/dashboard/${lastSavedWeddingId}`}
                                    className="btn btn-outline"
                                >
                                    Guest Dashboard
                                </Link>
                            )}
                            <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                                Checkout <CreditCard size={18} style={{ marginLeft: '8px' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
