'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { Input } from '@/components/form/Input';
import { EventRepeater } from '@/components/form/EventRepeater';
import styles from './details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DetailsPage() {
    const router = useRouter();
    const { formData, updateFormData, saveWedding } = useWeddingStore();
    const [isSaving, setIsSaving] = useState(false);

    const handleNext = async () => {
        // Basic validation check before moving
        if (!formData.groomName || !formData.brideName) {
            alert("Please enter names for the Bride and Groom.");
            return;
        }

        setIsSaving(true);
        const result = await saveWedding();
        setIsSaving(false);

        if (result.success) {
            router.push('/preview');
        } else {
            alert("Failed to save details: " + (result.error || "Unknown error"));
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Fill your wedding details</h1>
                    <p className={styles.subtitle}>Enter the details once, and we'll generate everything for you.</p>
                </div>
            </header>

            <main className="container">
                <div className={styles.layout}>
                    {/* Form Column */}
                    <div className={styles.formColumn}>

                        {/* Couple Details */}
                        <section className={formStyles.section}>
                            <h2 className={formStyles.sectionTitle}>Couple Details</h2>
                            <div className={formStyles.grid}>
                                <Input
                                    label="Groom's Name"
                                    value={formData.groomName}
                                    onChange={(e) => updateFormData({ groomName: e.target.value })}
                                    placeholder="First & Last Name"
                                />
                                <Input
                                    label="Bride's Name"
                                    value={formData.brideName}
                                    onChange={(e) => updateFormData({ brideName: e.target.value })}
                                    placeholder="First & Last Name"
                                />
                                <Input
                                    label="Groom's Parents"
                                    value={formData.groomParents || ''}
                                    onChange={(e) => updateFormData({ groomParents: e.target.value })}
                                    placeholder="e.g. Mr. & Mrs. Sharma"
                                />
                                <Input
                                    label="Bride's Parents"
                                    value={formData.brideParents || ''}
                                    onChange={(e) => updateFormData({ brideParents: e.target.value })}
                                    placeholder="e.g. Mr. & Mrs. Patel"
                                />
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

                    {/* Preview Placeholder Column (Sticky) */}
                    <div className={styles.previewColumn}>
                        <div className={styles.stickyPreview}>
                            <h3>Live Preview</h3>
                            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                                See your changes update in real-time.
                            </p>

                            <div className={styles.previewCard}>
                                <div className={styles.previewContent}>
                                    <p className={styles.previewEyebrow}>The Wedding of</p>
                                    <h2 className={styles.previewNames}>
                                        {formData.groomName || 'Groom'} <br /> & <br /> {formData.brideName || 'Bride'}
                                    </h2>
                                    <div className={styles.previewDate}>
                                        {formData.events[0]?.date || 'Date'} • {formData.events[0]?.venue || 'Venue'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className="container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleNext} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Generate Previews'}
                    </button>
                </div>
            </footer>
        </div>
    );
}
