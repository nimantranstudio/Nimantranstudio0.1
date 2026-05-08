import { Input } from '@/components/form/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';
import styles from '@/app/details/details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useWeddingStore } from '@/store/wedding-store';

interface CeremonyDetailsFormProps {
    errors: Record<string, string>;
    setErrors: (errors: Record<string, string>) => void;
    handleNext: () => void;
    handleBack: () => void;
    step: number;
}

export function CeremonyDetailsForm({ errors, setErrors, handleNext, handleBack, step }: CeremonyDetailsFormProps) {
    const { formData, updateFormData } = useWeddingStore();
    const isGroomFirst = (formData.groomName || '').length > (formData.brideName || '').length;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "DECEMBER 15, 2026";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }).toUpperCase();
        } catch {
            return "DECEMBER 15, 2026";
        }
    };

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.splitLayout}
        >
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
                <div className={styles.formContent}>
                    <div className={styles.sectionHeaderInner}>
                        <div className={styles.stepHeaderContainer}>
                            <div className={styles.stepHeaderInfo}>
                                <div className={styles.stepBadge}>{step}</div>
                                <span className={styles.stepStepText}>Step {step} of 4</span>
                            </div>
                            <div className={styles.stepTiming}>
                                <Clock size={14} />
                                <span>Takes 20 seconds</span>
                            </div>
                        </div>
                        <div className={styles.sectionHeaderMain}>
                            <h2 className={styles.sectionTitleMain}>Ceremony Details.</h2>
                            <p className={styles.sectionSubtitleMain}>
                                Define the foundational venue and timing for your primary wedding ceremony.
                            </p>
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
                                    if (errors.primaryDate) {
                                        const newErrs = { ...errors };
                                        delete newErrs.primaryDate;
                                        setErrors(newErrs);
                                    }
                                }}
                                error={errors.primaryDate}
                            />
                            <Input
                                label="Primary Time"
                                type="time"
                                value={formData.primaryTime || ''}
                                onChange={(e) => {
                                    updateFormData({ primaryTime: e.target.value });
                                    if (errors.primaryTime) {
                                        const newErrs = { ...errors };
                                        delete newErrs.primaryTime;
                                        setErrors(newErrs);
                                    }
                                }}
                                error={errors.primaryTime}
                            />
                            <div style={{ gridColumn: 'span 2' }}>
                                <Input
                                    label="Default Venue Address"
                                    placeholder="e.g. The Grand Hotel, City Center, Jodhpur"
                                    value={formData.defaultVenueName || ''}
                                    onChange={(e) => {
                                        updateFormData({ defaultVenueName: e.target.value });
                                        if (errors.defaultVenueName) {
                                            const newErrs = { ...errors };
                                            delete newErrs.defaultVenueName;
                                            setErrors(newErrs);
                                        }
                                    }}
                                    error={errors.defaultVenueName}
                                    maxLength={500}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <Input
                                    label="Google Maps Link (Optional)"
                                    placeholder="Paste Google Maps URL"
                                    value={formData.primaryMapLink || ''}
                                    onChange={(e) => updateFormData({ primaryMapLink: e.target.value })}
                                />
                            </div>
                        </div>
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
