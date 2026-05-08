import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import styles from '@/app/details/details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { Input } from '@/components/form/Input';

interface RSVPPreviewProps {
    isSaving: boolean;
    handleNext: () => void;
    handleBack: () => void;
    step: number;
}

export function RSVPPreview({ isSaving, handleNext, handleBack, step }: RSVPPreviewProps) {
    const { formData, updateFormData } = useWeddingStore();

    return (
        <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.splitLayout}
        >
            <div className={styles.rsvpPreviewContainer}>
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTopText}>
                        You are joyfully invited <br /> to the wedding of
                    </div>
                    <div className={styles.miniCardNames}>
                        {formData.groomName || 'Rahul'}
                        <span className={styles.miniCardAmpersand}>&</span>
                        {formData.brideName || 'Anjalee'}
                    </div>

                    <div className={styles.miniCardMessageBox}>
                        <p className={styles.miniCardMessageText}>
                            {formData.invitationMessage || "We're so excited to celebrate our special day with our dearest friends and family! Please join us for an evening of love and laughter."}
                        </p>
                    </div>

                    <div className={styles.miniCardRSVPLabel}>RSVP</div>

                    <div className={styles.miniCardEventTitle}>
                        THE {formData.eventType?.toUpperCase() || 'WEDDING'} CEREMONY
                    </div>
                    <div className={styles.miniCardDate}>
                        {formData.primaryDate ? new Date(formData.primaryDate).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) : 'Sunday, 15th of March 2026'}
                        {' • '}
                        {formData.primaryTime || '19:00'} onwards
                    </div>

                    <div className={styles.miniCardButton}>
                        Respond to Invitation
                    </div>

                    <div className={styles.miniCardPoweredBy}>
                        Powered by Nimantran Studio
                    </div>
                </div>
            </div>

            <div className={styles.formSide}>
                <div className={styles.formContent}>
                    <div className={styles.sectionHeaderInner}>
                        <div className={styles.stepHeaderContainer}>
                            <div className={styles.stepHeaderInfo}>
                                <div className={styles.stepBadge}>4</div>
                                <span className={styles.stepStepText}>Step 4 of 4</span>
                            </div>
                            <div className={styles.stepTiming}>
                                <Clock size={14} />
                                <span>Takes 30 seconds</span>
                            </div>
                        </div>
                        <div className={styles.sectionHeaderMain}>
                            <h1 className={styles.rsvpTitle} style={{ marginTop: 0 }}>Host Your Event</h1>
                            <p className={styles.rsvpSubtitle}>
                                Create a beautiful, distraction-free RSVP link to share with your loved ones via WhatsApp
                            </p>
                        </div>
                    </div>

                    <div className={styles.wizardCard}>
                        <div className={formStyles.grid}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <Input
                                    label="EVENT NAME"
                                    value={`${formData.groomName || 'Rahul'} and ${formData.brideName || 'Anjalee'}'s Wedding`}
                                    readOnly
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label className={formStyles.label}>EVENT TYPE</label>
                                <select
                                    className={styles.selectInput}
                                    value={formData.eventType || 'Wedding'}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const matched = (formData.events || []).find(ev =>
                                            ev.id.toLowerCase() === value.toLowerCase() ||
                                            ev.name?.toLowerCase().includes(value.toLowerCase())
                                        );
                                        const updates: Record<string, string> = { eventType: value };
                                        if (matched?.date) updates.primaryDate = matched.date;
                                        if (matched?.time) updates.primaryTime = matched.time;
                                        updateFormData(updates);
                                    }}
                                >
                                    <option value="Wedding">Wedding</option>
                                    <option value="Reception">Reception</option>
                                    <option value="Sangeet">Sangeet</option>
                                    <option value="Haldi">Haldi</option>
                                    <option value="Mehendi">Mehendi</option>
                                    <option value="Engagement">Engagement</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <Input
                                label="RSVP BY DATE"
                                type="date"
                                value={formData.rsvpDeadline || ''}
                                onChange={(e) => updateFormData({ rsvpDeadline: e.target.value })}
                            />
                            <div style={{ gridColumn: 'span 2' }}>
                                <Input
                                    label="WELCOME MESSAGE"
                                    value={formData.invitationMessage || ''}
                                    onChange={(e) => updateFormData({ invitationMessage: e.target.value })}
                                    placeholder="We're so excited to celebrate our special day..."
                                />
                            </div>
                        </div>

                        <div className={styles.rsvpOptions}>
                            <div className={styles.rsvpOptionRow}>
                                <div className={styles.rsvpOptionLabel}>
                                    <div>Allow companions / +1s?</div>
                                    <div className={styles.rsvpOptionSub}>Guests can indicate if they are bringing family members.</div>
                                </div>
                                <label className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        checked={formData.allowCompanions ?? false}
                                        onChange={(e) => updateFormData({ allowCompanions: e.target.checked })}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                            <div className={styles.rsvpOptionRow}>
                                <div className={styles.rsvpOptionLabel}>
                                    <div>Collect dietary preferences?</div>
                                    <div className={styles.rsvpOptionSub}>Ask guests about Veg/Non-veg or allergies.</div>
                                </div>
                                <label className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        checked={formData.collectDietary ?? false}
                                        onChange={(e) => updateFormData({ collectDietary: e.target.checked })}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
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
                    <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                        {isSaving ? 'Finalizing...' : 'Finalize & Preview'}
                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
