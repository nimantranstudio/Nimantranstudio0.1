'use client';

import { useWeddingStore } from '@/store/wedding-store';
import Image from 'next/image';
import { Input } from '@/components/form/Input';
import { EventRepeater } from '@/components/form/EventRepeater';
import styles from './details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { ArrowLeftRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { THEMES } from '@/lib/constants/themes';

import { LoginModal } from '@/components/auth/LoginModal';

// ... existing imports

export default function DetailsPage() {
    const router = useRouter();
    const { formData, updateFormData, saveWedding, selectedThemeId } = useWeddingStore();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const activeTheme = THEMES.find(t => t.id === selectedThemeId);
    const themeName = activeTheme ? activeTheme.name : 'Rajputana';

    const [isGroomFirst, setIsGroomFirst] = useState(true);

    const groomNameField = (
        <Input
            key="groom-name"
            label="Groom's Name"
            value={formData.groomName}
            onChange={(e) => updateFormData({ groomName: e.target.value })}
            placeholder="First & Last Name"
        />
    );

    const brideNameField = (
        <Input
            key="bride-name"
            label="Bride's Name"
            value={formData.brideName}
            onChange={(e) => updateFormData({ brideName: e.target.value })}
            placeholder="First & Last Name"
        />
    );

    const groomParentsField = (
        <Input
            key="groom-parents"
            label="Groom's Parents"
            value={formData.groomParents || ''}
            onChange={(e) => updateFormData({ groomParents: e.target.value })}
            placeholder="e.g. Mr. & Mrs. Sharma"
        />
    );

    const brideParentsField = (
        <Input
            key="bride-parents"
            label="Bride's Parents"
            value={formData.brideParents || ''}
            onChange={(e) => updateFormData({ brideParents: e.target.value })}
            placeholder="e.g. Mr. & Mrs. Patel"
        />
    );

    const handleNext = async () => {
        // Basic validation check
        if (!formData.groomName || !formData.brideName) {
            alert("Please enter names for the Bride and Groom.");
            return;
        }

        // Show Login Modal instead of direct save/push
        setShowLoginModal(true);
    };

    const handleLoginSuccess = async (phone: string) => {
        setShowLoginModal(false);
        // Set logged in state
        useWeddingStore.getState().login(phone);

        setIsSaving(true);
        setSaveError(null);
        try {
            const result = await saveWedding();
            if (!result.success) {
                console.warn("Background save failed:", result.error);
                setSaveError("Couldn't save to database, but you can still preview!");
            }
        } catch (err) {
            console.error("Save error:", err);
            setSaveError("Connection issue, but preview is ready.");
        } finally {
            setIsSaving(false);
            router.push('/preview');
        }
    };


    const assets = [
        { name: "Wedding poster", image: "wedding-poster.png" },
        { name: "Wedding", image: "wedding-invite.png" },
        { name: "Wedding video", image: "video-thumb.png" },
        { name: "Sangeet", image: "sangeet-invite.png" },
        { name: "Mehendi", image: "mehendi-invite.png" },
        { name: "Haldi", image: "haldi-invite.png" },
        { name: "Sangeet Poster", image: "sangeet-poster.png" },
        { name: "Mehendi Poster", image: "mehendi-poster.png" },
        { name: "Haldi Poster", image: "haldi-poster.png" },
        { name: "Save The Date", image: "save-the-date.png" },
        { name: "Initials", image: "initials.png" },
        { name: "Thank you card", image: "thank-you.png" },
    ];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Themes', href: '/themes' },
                            { label: themeName, href: `/themes/${selectedThemeId || 'rajputana'}` },
                            { label: 'wedding details', active: true },
                        ]}
                    />
                </div>
            </header>

            <main className="container">
                <div className={styles.layout}>

                    {/* Left Column: Theme Images */}
                    <div className={styles.imageCol}>
                        <div className={styles.imageGrid}>
                            {assets.map((asset, index) => (
                                <div
                                    key={index}
                                    className={styles.imageCard}
                                    style={{
                                        backgroundColor: activeTheme?.colors[0] || '#eee',
                                        color: activeTheme?.colors[2] || '#333'
                                    }}
                                >
                                    {/* Fallback Text/Placeholder */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0.25rem',
                                        fontSize: '0.6rem',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        zIndex: 1
                                    }}>
                                        {asset.name}
                                    </div>

                                    {/* Actual Image if available */}
                                    {selectedThemeId && (
                                        <Image
                                            src={`/assets/themes/${selectedThemeId}/${asset.image}`}
                                            alt={asset.name}
                                            fill
                                            style={{ objectFit: 'cover', zIndex: 2 }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className={styles.formColumn}>
                        <h1 className={styles.title} style={{ marginBottom: '0.5rem' }}>Fill your wedding details</h1>
                        <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>Enter the details once, and we'll generate everything for you.</p>

                        {/* Couple Details */}
                        <section className={clsx(formStyles.section, styles.swapSection)}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Couple Details</h2>
                                <button
                                    className={clsx(styles.sectionSwapBtn, styles.primarySwap)}
                                    type="button"
                                    onClick={() => setIsGroomFirst(!isGroomFirst)}
                                    title="Swap Positions"
                                >
                                    <ArrowLeftRight size={18} />
                                    <span>Swap Order</span>
                                </button>
                            </div>

                            <div className={formStyles.grid}>
                                {isGroomFirst ? (
                                    <>
                                        {groomNameField}
                                        {brideNameField}
                                        {groomParentsField}
                                        {brideParentsField}
                                    </>
                                ) : (
                                    <>
                                        {brideNameField}
                                        {groomNameField}
                                        {brideParentsField}
                                        {groomParentsField}
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Events Section */}
                        <EventRepeater />

                        {/* Additional Info */}
                        <section className={formStyles.section}>
                            <h2 className={formStyles.sectionTitle}>Additional Details</h2>
                            <div className={formStyles.grid}>
                                <Input
                                    label="RSVP Contact Number"
                                    value={formData.rsvpContact || ''}
                                    onChange={(e) => updateFormData({ rsvpContact: e.target.value })}
                                    placeholder="+91 9876543210"
                                />
                                <Input
                                    label="RSVP Deadline"
                                    type="date"
                                    value={formData.rsvpDeadline || ''}
                                    onChange={(e) => updateFormData({ rsvpDeadline: e.target.value })}
                                />
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={clsx("container", styles.footerContainer)}>
                    {saveError && (
                        <div style={{ marginRight: '1rem', color: '#E55B5B', fontSize: '0.875rem', alignSelf: 'center' }}>
                            {saveError}
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={handleNext} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Generate Previews'}
                    </button>
                </div>
            </footer>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </div >
    );
}
