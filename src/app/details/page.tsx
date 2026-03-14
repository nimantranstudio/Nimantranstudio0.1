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
import { ArrowLeftRight, CheckCircle, ChevronDown, Sun, Music, Leaf, Circle, Wine, MoreHorizontal, Clock, Info, ShieldCheck, MapPin, Calendar, Users, AlertCircle, Heart, Sparkles, ArrowRight, ChevronUp, Trash2, Plus } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Theme } from '@/lib/constants/themes';
import { DEFAULT_EVENTS, type WeddingEvent } from '@/lib/schemas/wedding-form';

import { LoginModal } from '@/components/auth/LoginModal';

// ... existing imports

export default function DetailsPage() {
    const router = useRouter();
    const { formData, updateFormData, saveWedding, selectedThemeId, bundleImages, selectedPlan } = useWeddingStore();
    const [step, setStep] = useState(1); // 1: Couple, 2: Ceremony, 3: Events, 4: Summary
    const [expandedEventId, setExpandedEventId] = useState<string | null>(formData.events?.[0]?.id || null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
            onChange={(e) => {
                updateFormData({ groomName: e.target.value });
                if (errors.groomName) setErrors(e => ({ ...e, groomName: '' }));
            }}
            placeholder="First Name"
            error={errors.groomName}
            maxLength={25}
        />
    );

    const brideNameField = (
        <Input
            key="bride-name"
            label="Bride's Name"
            value={formData.brideName}
            onChange={(e) => {
                updateFormData({ brideName: e.target.value });
                if (errors.brideName) setErrors(e => ({ ...e, brideName: '' }));
            }}
            placeholder="First Name"
            error={errors.brideName}
            maxLength={25}
        />
    );

    const groomParentsField = (
        <Input
            key="groom-parents"
            label="Groom's Parents"
            value={formData.groomParents || ''}
            onChange={(e) => updateFormData({ groomParents: e.target.value })}
            placeholder="e.g. Mr. & Mrs. Sharma"
            maxLength={100}
        />
    );

    const brideParentsField = (
        <Input
            key="bride-parents"
            label="Bride's Parents"
            value={formData.brideParents || ''}
            onChange={(e) => updateFormData({ brideParents: e.target.value })}
            placeholder="e.g. Mr. & Mrs. Patel"
            maxLength={100}
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

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "DECEMBER 15, 2026";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }).toUpperCase();
        } catch (e) {
            return dateStr.toUpperCase();
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            const newErrors: Record<string, string> = {};
            if (!formData.groomName?.trim()) newErrors.groomName = "Groom's name is required";
            if (!formData.brideName?.trim()) newErrors.brideName = "Bride's name is required";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            setStep(2);
        } else if (step === 2) {
            const newErrors: Record<string, string> = {};
            if (!formData.primaryDate) newErrors.primaryDate = "Wedding date is required";
            if (!formData.primaryTime) newErrors.primaryTime = "Wedding time is required";
            if (!formData.defaultVenueName?.trim()) newErrors.defaultVenueName = "Venue address is required";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            setStep(3);
        } else if (step === 3) {
            if (formData.events) {
                const newErrors: Record<string, string> = {};
                for (const event of formData.events) {
                    if (!event.date) {
                        newErrors[`${event.id}-date`] = "Date is required";
                    }
                    if (!event.time) {
                        newErrors[`${event.id}-time`] = "Time is required";
                    }
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                }
            }
            setErrors({});
            setStep(4);
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
        { id: 1, label: 'The Couple', icon: <Heart size={20} strokeWidth={2.5} /> },
        { id: 2, label: 'Ceremony', icon: <MapPin size={20} strokeWidth={2.5} /> },
        { id: 3, label: 'Timeline', icon: <Calendar size={20} strokeWidth={2.5} /> },
        { id: 4, label: 'Summary', icon: <Sparkles size={20} strokeWidth={2.5} /> },
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


                <div className={styles.wizardContainer}>
                    {step === 1 && (
                        <div className={styles.splitLayout}>
                            <div className={styles.previewContainer}>
                                <div className={styles.invitePreview}>
                                    <div className={styles.previewInner}>
                                        <div className={styles.previewOrnament}>
                                            <Sparkles size={32} />
                                        </div>
                                        <div className={styles.previewIntro}>Together with their families</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.groomName || 'Groom Name') : (formData.brideName || 'Bride Name')}</div>
                                        <div className={styles.previewAmpersand}>&</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.brideName || 'Bride Name') : (formData.groomName || 'Groom Name')}</div>
                                        <div className={styles.previewDivider} />
                                        <div className={styles.previewDate}>{formatDate(formData.primaryDate || '')}</div>
                                        <div className={styles.previewVenue}>
                                            <span className={styles.previewVenueName}>{formData.defaultVenueName?.split(',')[0] || 'THE GRAND HOTEL'}</span>
                                            {formData.defaultVenueName?.split(',').slice(1).join(',') || 'JODHPUR, RAJASTHAN'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.sectionHeaderInner}>
                                    <div className={styles.sectionHeaderMain}>
                                        <h2 className={styles.sectionTitleMain}>About the Couple.</h2>
                                        <p className={styles.sectionSubtitleMain}>
                                            Introduce the beautiful couple. This will be the heart of your wedding identity.
                                        </p>
                                    </div>
                                    <div className={styles.stepHeaderInfo}>
                                        <div className={styles.stepBadge}>1</div>
                                        <span className={styles.stepStepText}>Step 1 of 4</span>
                                        <div className={styles.stepDot} />
                                        <div className={styles.stepTiming}>
                                            <Clock size={16} />
                                            <span>Takes 15 seconds</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.wizardCard}>
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
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <div className={styles.formInlineActions}>
                                                <button className={styles.backBtn} onClick={handleBack}>
                                                    Back
                                                </button>
                                                <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                                    Continue Setup
                                                    <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.splitLayout}>
                            <div className={styles.previewContainer}>
                                <div className={styles.invitePreview}>
                                    <div className={styles.previewInner}>
                                        <div className={styles.previewOrnament}>
                                            <Sparkles size={32} />
                                        </div>
                                        <div className={styles.previewIntro}>Together with their families</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.groomName || 'Groom Name') : (formData.brideName || 'Bride Name')}</div>
                                        <div className={styles.previewAmpersand}>&</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.brideName || 'Bride Name') : (formData.groomName || 'Groom Name')}</div>
                                        <div className={styles.previewDivider} />
                                        <div className={styles.previewDate}>{formatDate(formData.primaryDate || '')}</div>
                                        <div className={styles.previewVenue}>
                                            <span className={styles.previewVenueName}>{formData.defaultVenueName?.split(',')[0] || 'THE GRAND HOTEL'}</span>
                                            {formData.defaultVenueName?.split(',').slice(1).join(',') || 'JODHPUR, RAJASTHAN'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.sectionHeaderInner}>
                                    <div className={styles.sectionHeaderMain}>
                                        <h2 className={styles.sectionTitleMain}>Ceremony Details.</h2>
                                        <p className={styles.sectionSubtitleMain}>
                                            Define the foundational venue and timing for your primary wedding ceremony.
                                        </p>
                                    </div>
                                    <div className={styles.stepHeaderInfo}>
                                        <div className={styles.stepBadge}>2</div>
                                        <span className={styles.stepStepText}>Step 2 of 4</span>
                                        <div className={styles.stepDot} />
                                        <div className={styles.stepTiming}>
                                            <Clock size={16} />
                                            <span>Takes 20 seconds</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.wizardCard}>
                                    <div className={formStyles.grid}>
                                        <Input
                                            label="Primary Wedding Date"
                                            type="date"
                                            value={formData.primaryDate || ''}
                                            onChange={(e) => {
                                                updateFormData({ primaryDate: e.target.value });
                                                if (errors.primaryDate) setErrors(errs => ({ ...errs, primaryDate: '' }));
                                            }}
                                            error={errors.primaryDate}
                                        />
                                        <Input
                                            label="Time"
                                            type="time"
                                            value={formData.primaryTime || ''}
                                            onChange={(e) => {
                                                updateFormData({ primaryTime: e.target.value });
                                                if (errors.primaryTime) setErrors(errs => ({ ...errs, primaryTime: '' }));
                                            }}
                                            error={errors.primaryTime}
                                        />
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <Input
                                                label="Address"
                                                value={formData.defaultVenueName || ''}
                                                onChange={(e) => {
                                                    updateFormData({ defaultVenueName: e.target.value });
                                                    if (errors.defaultVenueName) setErrors(errs => ({ ...errs, defaultVenueName: '' }));
                                                }}
                                                placeholder="e.g. The Grand Palace, 123 Royal Road, Jaipur"
                                                type="textarea"
                                                error={errors.defaultVenueName}
                                                maxLength={500}
                                            />

                                            <div className={styles.formSuccessMessage}>
                                                <CheckCircle size={18} color="#D4AF37" />
                                                <span>Nice start — your invite identity is taking shape.</span>
                                            </div>

                                            <div className={styles.formInlineActions}>
                                                <button className={styles.backBtn} onClick={handleBack}>
                                                    Back
                                                </button>
                                                <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                                    Continue Setup
                                                    <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.splitLayout}>
                            <div className={clsx(styles.previewContainer, styles.formSide)}>
                                <div className={styles.timelinePreviewArea}>
                                    <div className={styles.timelineLineContainer}>
                                        <div className={styles.timelineGoldLine} />
                                        {(formData.events || []).map((event) => (
                                            <div
                                                key={`preview-${event.id}`}
                                                className={clsx(
                                                    styles.timelineNodeWrapper,
                                                    expandedEventId === event.id && styles.timelineNodeEntryActive
                                                )}
                                            >
                                                <div className={clsx(
                                                    styles.timelineNode,
                                                    expandedEventId === event.id && styles.timelineNodeActive,
                                                    event.name?.toLowerCase().includes('wedding') && styles.weddingNode
                                                )}>
                                                    {event.name?.toLowerCase().includes('wedding') && <div className={styles.shimmerEffect} />}
                                                </div>
                                                <div className={clsx(
                                                    styles.miniEventCard,
                                                    expandedEventId === event.id && styles.miniEventActive,
                                                    event.name?.toLowerCase().includes('wedding') && styles.weddingHighlight
                                                )}>
                                                    <div className={styles.miniEventName}>{event.name}</div>
                                                    <div className={styles.miniEventDetail}>
                                                        <span>{event.time || '--:--'}</span>
                                                        <span>{formatDateDisplay(event.date || formData.primaryDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.completionMessage}>
                                        “Your wedding celebration is beautifully coming together.”
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.sectionHeaderInner}>
                                    <div className={styles.sectionHeaderMain}>
                                        <h2 className={styles.sectionTitleMain}>Celebration Timeline.</h2>
                                        <p className={styles.sectionSubtitleMain}>
                                            Define the key ceremonies and moments of your wedding celebration.
                                        </p>
                                    </div>
                                    <div className={styles.stepHeaderInfo}>
                                        <div className={styles.stepBadge}>3</div>
                                        <span className={styles.stepStepText}>Step 3 of 4</span>
                                        <div className={styles.stepDot} />
                                        <div className={styles.stepTiming}>
                                            <Clock size={16} />
                                            <span>Takes 30 seconds</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.wizardCard}>
                                    <CelebrationTimeline
                                        errors={errors}
                                        setErrors={setErrors}
                                        expandedEventId={expandedEventId}
                                        setExpandedEventId={setExpandedEventId}
                                    />
                                    <div className={styles.formInlineActions} style={{ marginTop: '3rem', justifyContent: 'flex-end', gap: '3rem' }}>
                                        <button className={styles.backBtn} onClick={handleBack}>
                                            Back
                                        </button>
                                        <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                            Continue Setup
                                            <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className={styles.formSide}>
                            <div className={styles.sectionHeaderInner}>
                                <div className={styles.sectionHeaderMain}>
                                    <h2 className={styles.sectionTitleMain}>Summary & Preview.</h2>
                                    <p className={styles.sectionSubtitleMain}>
                                        Review your wedding details. Once finalized, you can preview and share your elegant invitation.
                                    </p>
                                </div>
                                <div className={styles.stepHeaderInfo}>
                                    <div className={styles.stepBadge}>4</div>
                                    <span className={styles.stepStepText}>Step 4 of 4</span>
                                    <div className={styles.stepDot} />
                                    <div className={styles.stepTiming}>
                                        <Clock size={16} />
                                        <span>Review and Finalize</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.wizardCard}>
                                <ArchitectureSummary />
                                <div className={styles.formInlineActions} style={{ marginTop: '3rem', justifyContent: 'flex-end', gap: '3rem' }}>
                                    <button className={styles.backBtn} onClick={handleBack}>
                                        Back
                                    </button>
                                    <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                        {isSaving ? 'Finalizing...' : 'Finalize & Preview'}
                                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </div >
    );
}

// --- Helpers ---
function formatDateDisplay(dateStr?: string) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthStr = date.toLocaleString('default', { month: 'short' });
    return `${day}-${monthStr}-${year}`;
}

function getDefaultWelcomeMessage(eventName: string): string {
    const name = eventName.toLowerCase();
    if (name.includes('haldi')) return "Bless the couple with showers of yellow health and happiness";
    if (name.includes('mehendi')) return "Join at the mehendi event, with the \"Hands full of mehendi , hearts full of love\"";
    if (name.includes('sangeet')) return "Join us to turn up the volume \"Naach. gaana aur full-on hungama!\"";
    if (name.includes('wedding')) return "We are pleased to invite you to the wedding of";
    if (name.includes('reception')) return "We are pleased to invite you to the reception of";
    return "";
}

function getDefaultHeading(eventName: string): string {
    const name = eventName.toLowerCase();
    if (name.includes('haldi')) return "Haldi Ceremony";
    if (name.includes('mehendi')) return "Mehendi Ceremony";
    if (name.includes('sangeet')) return "Sangeet Ceremoney";
    if (name.includes('wedding')) return "Wedding Ceremony";
    if (name.includes('reception')) return "Reception Ceremony";
    return `${eventName} Ceremony`;
}

// --- Sub Components ---

function CelebrationTimeline({ errors, setErrors, expandedEventId, setExpandedEventId }: { errors: Record<string, string>, setErrors: any, expandedEventId: string | null, setExpandedEventId: any }) {
    const { formData, updateFormData, addEvent, removeEvent, updateEvent } = useWeddingStore();

    const toggleEvent = (id: string) => {
        setExpandedEventId(expandedEventId === id ? null : id);
    };

    return (
        <div className={styles.eventTimelineContainer}>
            <div className={styles.eventTimelineSection}>
                {(formData.events || []).map((event, index) => (
                    <div
                        key={event.id}
                        className={clsx(
                            styles.eventCard,
                            expandedEventId === event.id && styles.eventCardActive
                        )}
                    >
                        <div
                            className={styles.eventCardHeader}
                            onClick={() => toggleEvent(event.id)}
                        >
                            <div className={styles.eventCardNumber}>{index + 1}</div>
                            <div className={styles.eventCardTitle}>{event.name}</div>
                            <div className={styles.eventCardToggle}>
                                <ChevronDown size={20} />
                            </div>
                        </div>

                        {expandedEventId === event.id && (
                            <div className={styles.eventCardBody}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <Input
                                        label="Event Name"
                                        value={event.name}
                                        onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                                        placeholder="e.g. Mehendi"
                                    />

                                    <div className={styles.eventFieldRow}>
                                        <Input
                                            label="Date"
                                            type="date"
                                            value={event.date || ''}
                                            onChange={(e) => {
                                                updateEvent(event.id, { date: e.target.value });
                                                setErrors((prev: any) => ({ ...prev, [`${event.id}-date`]: '' }));
                                            }}
                                            error={errors[`${event.id}-date`]}
                                        />
                                        <Input
                                            label="Time"
                                            type="time"
                                            value={event.time || ''}
                                            onChange={(e) => {
                                                updateEvent(event.id, { time: e.target.value });
                                                setErrors((prev: any) => ({ ...prev, [`${event.id}-time`]: '' }));
                                            }}
                                            error={errors[`${event.id}-time`]}
                                        />
                                    </div>

                                    <Input
                                        label="Venue"
                                        value={event.venue || ''}
                                        onChange={(e) => updateEvent(event.id, { venue: e.target.value, isCustomVenue: !!e.target.value })}
                                        placeholder="Inherits from Global if empty"
                                        type="textarea"
                                    />

                                    <button
                                        className={styles.removeEventBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeEvent(event.id);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Remove Event
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    className={styles.addEventBtn}
                    onClick={() => {
                        const newId = crypto.randomUUID();
                        addEvent({ id: newId, name: 'New Celebration' });
                        setExpandedEventId(newId);
                    }}
                >
                    <Plus size={20} />
                    Add Another Event
                </button>
            </div>
        </div>
    );
}

function ArchitectureSummary() {
    const { formData } = useWeddingStore();
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
                    <span>{formatDateDisplay(formData.primaryDate)} (Default Date)</span>
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
                                {formatDateDisplay(e.date || formData.primaryDate)} @ {e.time || 'TBD'}
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
