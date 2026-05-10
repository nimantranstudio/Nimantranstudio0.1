import { Input } from '@/components/form/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';
import styles from '@/app/details/details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useWeddingStore } from '@/store/wedding-store';

interface CoupleDetailsFormProps {
    errors: Record<string, string>;
    setErrors: (errors: Record<string, string>) => void;
    handleNext: () => void;
    step: number;
}

export function CoupleDetailsForm({ errors, setErrors, handleNext, step }: CoupleDetailsFormProps) {
    const { formData, updateFormData } = useWeddingStore();
    const isGroomFirst = (formData.groomName || '').length > (formData.brideName || '').length;

    const groomNameField = (
        <Input
            label="Groom's Name"
            placeholder="e.g. Rahul"
            value={formData.groomName || ''}
            onChange={(e) => {
                updateFormData({ groomName: e.target.value });
                if (errors.groomName) setErrors({ ...errors, groomName: '' });
            }}
            error={errors.groomName}
            maxLength={25}
        />
    );

    const brideNameField = (
        <Input
            label="Bride's Name"
            placeholder="e.g. Anjali"
            value={formData.brideName || ''}
            onChange={(e) => {
                updateFormData({ brideName: e.target.value });
                if (errors.brideName) setErrors({ ...errors, brideName: '' });
            }}
            error={errors.brideName}
            maxLength={25}
        />
    );

    const groomParentsField = (
        <Input
            label="Groom's Parents (Optional)"
            placeholder="e.g. Mr. & Mrs. Sharma"
            value={formData.groomParents || ''}
            onChange={(e) => updateFormData({ groomParents: e.target.value })}
            maxLength={100}
        />
    );

    const brideParentsField = (
        <Input
            label="Bride's Parents (Optional)"
            placeholder="e.g. Mr. & Mrs. Verma"
            value={formData.brideParents || ''}
            onChange={(e) => updateFormData({ brideParents: e.target.value })}
            maxLength={100}
        />
    );

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
            key="step1"
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
                            <h2 className={styles.sectionTitleMain}>The Couple.</h2>
                            <p className={styles.sectionSubtitleMain}>
                                Start by telling us the names to be featured on your beautiful invitation.
                            </p>
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
                    <AnimatePresence>
                        {Object.keys(errors).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.footerErrorTooltip}
                            >
                                <motion.div
                                    className={styles.tooltipPulse}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    <span>Beautiful beginning made</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button className={styles.backBtn} style={{ visibility: 'hidden' }}>
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
