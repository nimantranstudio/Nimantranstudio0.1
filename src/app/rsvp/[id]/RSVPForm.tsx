'use client';

import { useState, useEffect } from 'react';
import styles from './rsvp.module.css';
import { Calendar, MapPin, Check, ChevronRight, Info } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface RSVPFormProps {
    wedding: any;
}

type Step = 'INVITE' | 'FORM' | 'SUCCESS' | 'ALREADY_REGISTERED';

export const RSVPForm = ({ wedding }: RSVPFormProps) => {
    const [step, setStep] = useState<Step>('INVITE');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [status, setStatus] = useState('attending'); // attending, declined, maybe
    const [dietary, setDietary] = useState('');
    const [guestName, setGuestName] = useState('');
    const [phone, setPhone] = useState('');
    const [adultCount, setAdultCount] = useState(1);

    // Check for previous submission
    useEffect(() => {
        const eventId = wedding.events[0]?.id; // Assuming we are focusing on the primary event of this link
        if (eventId) {
            const hasSubmitted = localStorage.getItem(`rsvp_submitted_${eventId}`);
            if (hasSubmitted) {
                setStep('ALREADY_REGISTERED');
            }
        }
    }, [wedding]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = {
            guestName,
            status,
            adultCount,
            childCount: 0,
            phone,
            dietary,
            message: '',
        };

        try {
            const response = await fetch(`/api/rsvp/${wedding.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const eventId = wedding.events[0]?.id;
                if (eventId) {
                    localStorage.setItem(`rsvp_submitted_${eventId}`, 'true');
                }
                setStep('SUCCESS');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit RSVP.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Logic
    if (step === 'ALREADY_REGISTERED') {
        return (
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <div className={styles.successContent}>
                        <div className={styles.successIcon} style={{ backgroundColor: '#FEF3C7' }}>
                            <Info size={40} color="#D97706" />
                        </div>
                        <h2 className={styles.successTitle} style={{ fontSize: '1.75rem' }}>Response Registered</h2>
                        <p className={styles.successText}>
                            You have already submitted your response for this event.
                            <br />
                            We have received your details!
                        </p>
                    </div>
                </div>
                <footer className={styles.footer}>
                    POWERED BY NIMANTRANSTUDIO
                </footer>
            </div>
        );
    }

    if (step === 'SUCCESS') {
        return (
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>
                            <Check size={40} />
                        </div>
                        <h2 className={styles.successTitle}>Thank You, {guestName.split(' ')[0]}!</h2>
                        <p className={styles.successText}>
                            Your response has been submitted successfully.<br />
                            We look forward to seeing you at the wedding!
                        </p>
                        <button onClick={() => setStep('INVITE')} className={styles.backButton}>
                            Back to Invitation
                        </button>
                    </div>
                </div>
                <footer className={styles.footer}>
                    POWERED BY NIMANTRANSTUDIO
                </footer>
            </div>
        );
    }

    if (step === 'FORM') {
        return (
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <header className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Confirm Attendance</h2>
                        <p className={styles.formSubtitle}>
                            We'd love to have you with us at the {wedding.groomName || 'Couple'}'s Wedding
                        </p>
                    </header>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {/* Attendance Status */}
                        <div className={styles.field}>
                            <label>Will you be attending?</label>
                            <div className={styles.statusGrid}>
                                {['attending', 'declined', 'maybe'].map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className={clsx(styles.statusBtn, status === opt && styles.statusBtnActive)}
                                        onClick={() => setStatus(opt)}
                                    >
                                        {opt === 'attending' ? 'Yes' : opt === 'declined' ? 'No' : 'Maybe'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Guest Name */}
                        <div className={styles.field}>
                            <label>Guest Name</label>
                            <input
                                required
                                placeholder="e.g. Rahul Patil"
                                className={styles.input}
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                        </div>

                        {/* Guests & Phone */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Number of Guests</label>
                                <input
                                    type="number"
                                    min="1"
                                    className={styles.input}
                                    value={adultCount}
                                    onChange={(e) => setAdultCount(parseInt(e.target.value) || 1)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Optional"
                                    className={styles.input}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Dietary */}
                        <div className={styles.field}>
                            <label>Dietary Preference</label>
                            <div className={styles.dietaryGrid}>
                                {['Veg', 'Non-Veg', 'Jain', 'Other'].map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className={clsx(styles.dietaryBtn, dietary === opt && styles.dietaryBtnActive)}
                                        onClick={() => setDietary(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className={styles.submit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Response'}
                        </button>
                    </form>
                </div>
                <footer className={styles.footer}>
                    POWERED BY NIMANTRANSTUDIO
                </footer>
            </div>
        );
    }

    // Default: INVITE
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.inviteIcon}>
                    <Calendar size={24} />
                </div>

                <header className={styles.header}>
                    <h1 className={styles.heading}>You're Invited</h1>
                    <p className={styles.subheading}>{wedding.groomName || 'Aditya'} & {wedding.brideName || 'Sanjana'}'s Wedding</p>
                </header>

                <main className={styles.main}>
                    <div className={styles.eventsList}>
                        {wedding.events.map((event: any) => (
                            <div key={event.id} className={styles.eventCard}>
                                <div className={styles.eventRow}>
                                    <MapPin size={18} className={styles.icon} />
                                    <span>{event.venue || 'Venue TBD'}</span>
                                </div>
                                <div className={styles.eventRow}>
                                    <Calendar size={18} className={styles.icon} />
                                    <span>{event.date || 'Date TBD'} • {event.time || 'Time TBD'} onwards</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setStep('FORM')} className={styles.confirmBtn}>
                        Confirm Attendance
                        <ChevronRight size={18} />
                    </button>
                </main>
            </div>
            <footer className={styles.footer}>
                POWERED BY NIMANTRANSTUDIO
            </footer>
        </div>
    );
};
