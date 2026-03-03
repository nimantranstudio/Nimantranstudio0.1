'use client';

import { useWeddingStore } from '@/store/wedding-store';
import Image from 'next/image';
import { Input } from '@/components/form/Input';
import { EventRepeater } from '@/components/form/EventRepeater';
import styles from './details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { ArrowLeftRight, CheckCircle, ChevronDown, Sun, Music, Leaf, Circle, Wine, MoreHorizontal, Clock, Info, ShieldCheck, MapPin, Calendar, Users, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Theme } from '@/lib/constants/themes';
import { DEFAULT_EVENTS, type WeddingEvent } from '@/lib/schemas/wedding-form';

import { LoginModal } from '@/components/auth/LoginModal';

// ... existing imports

export default function DetailsPage() {
    const router = useRouter();
    const { formData, updateFormData, saveWedding, selectedThemeId, bundleImages, selectedPlan } = useWeddingStore();
    const [step, setStep] = useState(1); // 1: Couple, 2: Events, 3: Timeline, 4: Summary/Architecture
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [activeTheme, setActiveTheme] = useState<Theme | null>(null);

    useEffect(() => {
        if (!selectedThemeId) return;

        async function fetchTheme() {
            try {
                const res = await fetch(`/api/themes/${selectedThemeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setActiveTheme(data.theme);
                }
            } catch (error) {
                console.error("Failed to fetch theme", error);
            }
        }
        fetchTheme();
    }, [selectedThemeId]);

    const themeName = activeTheme ? activeTheme.name : 'Choose Theme';

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

    const handleLoginSuccess = async (phone: string) => {
        setShowLoginModal(false);
        useWeddingStore.getState().login(phone);

        setIsSaving(true);
        setSaveError(null);
        try {
            const result = await saveWedding();
            if (!result.success) {
                setSaveError("Background save failed, but you can still preview!");
            }
        } catch (err) {
            setSaveError("Connection issue, but preview is ready.");
        } finally {
            setIsSaving(false);
            router.push('/preview');
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!formData.groomName || !formData.brideName || !formData.primaryDate) {
                alert("Please fill in basic details and wedding date.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else {
            // Final step: Summary -> Login and Save
            setShowLoginModal(true);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else router.back();
    };

    const STEPS = [
        { id: 1, label: 'THE COUPLE', icon: '❤️' },
        { id: 2, label: 'TIMELINE', icon: '📅' },
        { id: 3, label: 'ARCHITECTURE', icon: '🏛️' },
    ];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Themes', href: '/themes' },
                            { label: `${themeName}${selectedPlan ? ` (${selectedPlan})` : ''}`, href: `/themes/${selectedThemeId}` },
                            { label: 'wedding details', active: true },
                        ]}
                    />
                </div>
            </header>

            <main className="container">
                <div className={styles.wizardHeader}>
                    <div className={styles.stepIndicator}>
                        {STEPS.map((s, i) => (
                            <div key={s.id} className={clsx(styles.stepItem, step === s.id && styles.stepActive, step > s.id && styles.stepDone)}>
                                <div className={styles.stepIcon}>{s.icon}</div>
                                <span className={styles.stepLabel}>{s.label}</span>
                                {i < STEPS.length - 1 && <div className={styles.stepLine} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.wizardContainer}>
                    {step === 1 && (
                        <div className={styles.wizardCard}>
                            <div className={formStyles.grid}>
                                {isGroomFirst ? (
                                    <>
                                        {groomNameField}
                                        {brideNameField}
                                    </>
                                ) : (
                                    <>
                                        {brideNameField}
                                        {groomNameField}
                                    </>
                                )}
                                <Input
                                    label="Primary Wedding Date"
                                    type="date"
                                    value={formData.primaryDate || ''}
                                    onChange={(e) => updateFormData({ primaryDate: e.target.value })}
                                />
                                <Input
                                    label="Timezone"
                                    value={formData.timezone || 'Asia/Kolkata'}
                                    disabled
                                />
                                <div className={styles.venueSection}>
                                    <h3 className={styles.venueHeading}>DEFAULT VENUE</h3>
                                    <div className={formStyles.grid}>
                                        <Input
                                            label="Venue Name"
                                            value={formData.defaultVenueName || ''}
                                            onChange={(e) => updateFormData({ defaultVenueName: e.target.value })}
                                            placeholder="The Grand Palace"
                                        />
                                        <Input
                                            label="Full Address"
                                            value={formData.defaultVenueAddress || ''}
                                            onChange={(e) => updateFormData({ defaultVenueAddress: e.target.value })}
                                            placeholder="123 Royal Road, Jaipur"
                                        />
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input
                                        label="Global Invitation Tagline"
                                        value={formData.globalTagline || ''}
                                        onChange={(e) => updateFormData({ globalTagline: e.target.value })}
                                        placeholder="Together with their families"
                                        type="textarea"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.wizardCard}>
                            <TimelineStep />
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.wizardCard}>
                            <ArchitectureSummary />
                        </div>
                    )}
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={clsx("container", styles.footerContainer)}>
                    <button className="btn btn-secondary" onClick={handleBack}>
                        {step === 1 ? 'Previous' : 'Previous'}
                    </button>
                    {saveError && (
                        <div style={{ color: '#E55B5B', fontSize: '0.875rem' }}>
                            {saveError}
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={handleNext} disabled={isSaving}>
                        {step === 3 ? (isSaving ? 'Generating...' : 'Finalize & Preview') : 'Next Step →'}
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

    // --- Sub Components ---


    function TimelineStep() {
        const [activeEventId, setActiveEventId] = useState(formData.events?.[0]?.id || '');
        const currentEvents = formData.events || [];
        const activeEvent = currentEvents.find(e => e.id === activeEventId) || currentEvents[0];

        const updateActiveEvent = (data: Partial<typeof currentEvents[0]>) => {
            updateFormData({
                events: currentEvents.map(e => e.id === activeEventId ? { ...e, ...data } : e)
            });
        };

        if (currentEvents.length === 0) return <div>Please go back and select events.</div>;

        return (
            <div className={styles.timelineLayout}>
                <div className={styles.timelineSidebar}>
                    {currentEvents.map(e => (
                        <div
                            key={e.id}
                            className={clsx(styles.timelineItem, activeEventId === e.id && styles.timelineItemActive)}
                            onClick={() => setActiveEventId(e.id)}
                        >
                            <div style={{ fontWeight: 600 }}>{e.name}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{e.date || formData.primaryDate}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.timelineContent}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{activeEvent.name} Settings</h2>
                        <span style={{ fontSize: '0.75rem', background: '#E5E7EB', padding: '2px 8px', borderRadius: '100px' }}>EVT-{activeEvent.id.toUpperCase()}</span>
                    </div>

                    <div className={formStyles.grid}>
                        <Input
                            label="Override Date?"
                            type="date"
                            value={activeEvent.date || ''}
                            onChange={(e) => updateActiveEvent({ date: e.target.value })}
                            helperText={`Default: ${formData.primaryDate}`}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Input
                                label="Start Time"
                                type="time"
                                value={activeEvent.time || ''}
                                onChange={(e) => updateActiveEvent({ time: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <Input
                                label="End Time"
                                type="time"
                                value={activeEvent.endTime || ''}
                                onChange={(e) => updateActiveEvent({ endTime: e.target.value })}
                                style={{ flex: 1 }}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <Input
                                label="Custom Event Tagline"
                                value={activeEvent.tagline || ''}
                                onChange={(e) => updateActiveEvent({ tagline: e.target.value })}
                                placeholder={formData.globalTagline}
                                helperText="Inherits from global tagline if left empty."
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2', padding: '1rem', background: 'white', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>VENUE LOGIC</span>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.75rem' }}>Custom Venue?</span>
                                    <input
                                        type="checkbox"
                                        checked={activeEvent.isCustomVenue}
                                        onChange={(e) => updateActiveEvent({ isCustomVenue: e.target.checked })}
                                    />
                                </label>
                            </div>
                            {activeEvent.isCustomVenue ? (
                                <Input
                                    label="Custom Venue for this Event"
                                    value={activeEvent.venue || ''}
                                    onChange={(e) => updateActiveEvent({ venue: e.target.value })}
                                    placeholder="Enter specific venue name"
                                />
                            ) : (
                                <p style={{ fontSize: '0.8125rem', color: '#666', fontStyle: 'italic', margin: 0 }}>
                                    Inheriting from Global: {formData.defaultVenueName || 'Not Set'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function ArchitectureSummary() {
        return (
            <div className={styles.summaryScroll}>
                <div className={styles.summaryHeader}>
                    <ShieldCheck size={28} color="#059669" />
                    <h2 style={{ margin: 0 }}>Global Wedding Identity</h2>
                </div>

                <div className={styles.summaryList}>
                    <div className={styles.summaryItem}>
                        <Users size={18} />
                        <span>{formData.brideName} & {formData.groomName}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <Calendar size={18} />
                        <span>{formData.primaryDate} (Default Date)</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <MapPin size={18} />
                        <span>{formData.defaultVenueName} (Default Venue)</span>
                    </div>
                </div>

                <div className={styles.eventsTimeline}>
                    {(formData.events || []).map((e, i) => (
                        <div key={e.id} className={styles.summaryEventCard}>
                            <div className={styles.eventTimeInfo}>
                                <div style={{ fontWeight: 700 }}>{e.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {e.date || formData.primaryDate} @ {e.time || 'TBD'}
                                </div>
                            </div>
                            <div className={styles.inheritanceBadge}>
                                {!e.date && !e.isCustomVenue ? 'INHERITED' : 'CUSTOMIZED'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
