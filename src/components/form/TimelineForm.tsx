import { motion } from 'framer-motion';
import { Clock, ArrowRight, ChevronDown, Trash2, Plus } from 'lucide-react';
import styles from '@/app/details/details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { Input } from '@/components/form/Input';
import { clsx } from 'clsx';
import { useState } from 'react';

// Extract formatDateDisplay from details page or duplicate it here for scope
function formatDateDisplay(dateStr?: string) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthStr = date.toLocaleString('default', { month: 'short' });
    return `${day}-${monthStr}-${year}`;
}

export function CelebrationTimeline({ errors, setErrors, expandedEventId, setExpandedEventId }: { errors: Record<string, string>, setErrors: any, expandedEventId: string | null, setExpandedEventId: any }) {
    const { formData, addEvent, removeEvent, updateEvent } = useWeddingStore();

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
                            <div className={styles.eventCardTitle}>{event.name}</div>
                            <div className={styles.eventCardToggle}>
                                <ChevronDown size={20} />
                            </div>
                        </div>

                        {expandedEventId === event.id && (
                            <div className={styles.eventCardBody}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className={styles.eventFieldRow}>
                                        <Input
                                            label="Date"
                                            type="date"
                                            value={event.date || ''}
                                            onChange={(e) => {
                                                updateEvent(event.id, { date: e.target.value });
                                                if (errors[`${event.id}-date`]) {
                                                    const newErrs = { ...errors };
                                                    delete newErrs[`${event.id}-date`];
                                                    setErrors(newErrs);
                                                }
                                            }}
                                            error={errors[`${event.id}-date`]}
                                        />
                                        <Input
                                            label="Time"
                                            type="time"
                                            value={event.time || ''}
                                            onChange={(e) => {
                                                updateEvent(event.id, { time: e.target.value });
                                                if (errors[`${event.id}-time`]) {
                                                    const newErrs = { ...errors };
                                                    delete newErrs[`${event.id}-time`];
                                                    setErrors(newErrs);
                                                }
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
                    type="button"
                    className={styles.addEventBtn}
                    onClick={() => addEvent()}
                >
                    <Plus size={16} />
                    <span>Add Another Event</span>
                </button>
            </div>
        </div>
    );
}

interface TimelineFormProps {
    errors: Record<string, string>;
    setErrors: (errors: Record<string, string>) => void;
    handleNext: () => void;
    handleBack: () => void;
    step: number;
    expandedEventId: string | null;
    setExpandedEventId: (id: string | null) => void;
}

export function TimelineForm({ errors, setErrors, handleNext, handleBack, step, expandedEventId, setExpandedEventId }: TimelineFormProps) {
    const { formData } = useWeddingStore();

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.splitLayout}
        >
            <div className={clsx(styles.previewContainer, styles.formSide)}>
                <div className={styles.formContent} style={{ padding: '2rem' }}>
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
                                        (expandedEventId === event.id || !!event.date) && styles.timelineNodeActive,
                                        event.name?.toLowerCase().includes('wedding') && styles.weddingNode
                                    )}>
                                        {event.name?.toLowerCase().includes('wedding') && <div className={styles.shimmerEffect} />}
                                    </div>
                                    <div className={clsx(
                                        styles.miniEventCard,
                                        expandedEventId === event.id && styles.miniEventActive,
                                        (!event.date && !event.time) && styles.miniEventBlank,
                                        event.name?.toLowerCase().includes('wedding') && styles.weddingHighlight
                                    )}>
                                        <div className={styles.miniEventName}>{event.name}</div>
                                        <div className={styles.miniEventDetail}>
                                            <span>{event.time || ''}</span>
                                            <span>{event.date ? formatDateDisplay(event.date) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formSide}>
                <div className={styles.formContent}>
                    <div className={styles.sectionHeaderInner}>
                        <div className={styles.stepHeaderContainer}>
                            <div className={styles.stepHeaderInfo}>
                                <div className={styles.stepBadge}>{step}</div>
                                <span className={styles.stepStepText}>Step {step} of 4</span>
                            </div>
                            <div className={styles.stepTiming}>
                                <Clock size={14} />
                                <span>Takes 30 seconds</span>
                            </div>
                        </div>
                        <div className={styles.sectionHeaderMain}>
                            <h2 className={styles.sectionTitleMain}>Celebration Timeline.</h2>
                            <p className={styles.sectionSubtitleMain}>
                                Define the key ceremonies and moments of your wedding celebration.
                            </p>
                        </div>
                    </div>
                    <div className={styles.wizardCard}>
                        <CelebrationTimeline
                            errors={errors}
                            setErrors={setErrors}
                            expandedEventId={expandedEventId}
                            setExpandedEventId={setExpandedEventId}
                        />
                    </div>
                </div>
                <div className={styles.formFooter}>
                    <div className={styles.footerProgressBarContainer}>
                        <motion.div
                            className={styles.footerProgressBar}
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                    <button className={styles.backBtn} onClick={handleBack}>
                        Back
                    </button>
                    <button className={styles.continueBtn} onClick={handleNext}>
                        Continue Setup
                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
