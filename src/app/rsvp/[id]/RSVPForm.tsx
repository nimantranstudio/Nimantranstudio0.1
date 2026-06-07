'use client';

import { useState, useEffect } from 'react';
import styles from './rsvp.module.css';
import { Calendar, MapPin, Check, Info } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { FloatingFlowers } from '@/components/ui/FloatingFlowers';
import { MandalaBackground } from '@/components/ui/MandalaBackground';
import { FlowerPetalDrift } from '@/components/ui/FlowerPetalDrift';

interface RSVPFormProps {
    wedding: any;
}

type Step = 'INVITE' | 'SUCCESS' | 'ALREADY_REGISTERED';

const WhatsAppIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export const RSVPForm = ({ wedding }: RSVPFormProps) => {
    const [step, setStep] = useState<Step>('INVITE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPetals, setShowSuccessPetals] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Form state
    const [status, setStatus] = useState('attending');
    const [guestName, setGuestName] = useState('');
    const [phone, setPhone] = useState('');
    const [adultCount, setAdultCount] = useState(1);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const eventId = wedding.events[0]?.id;
        if (eventId) {
            const hasSubmitted = localStorage.getItem(`rsvp_submitted_${eventId}`);
            if (hasSubmitted) setStep('ALREADY_REGISTERED');
        }
    }, [wedding]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const data = { guestName, status, adultCount, childCount: 0, phone, message };

        try {
            const response = await fetch(`/api/rsvp/${wedding.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const eventId = wedding.events[0]?.id;
                if (eventId) localStorage.setItem(`rsvp_submitted_${eventId}`, 'true');
                setShowSuccessPetals(true);
                setTimeout(() => setStep('SUCCESS'), 500);
            } else {
                setSubmitError('Something went wrong. Please try again in a moment.');
            }
        } catch {
            setSubmitError('Could not reach the server. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddToCalendar = () => {
        const event = wedding.events[0];
        if (!event?.date) return;
        const title = encodeURIComponent(`${wedding.groomName} & ${wedding.brideName}'s Wedding`);
        const location = encodeURIComponent(event.venue || event.venueName || 'Wedding Venue');
        const startDate = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, '');
        window.open(
            `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${startDate}&location=${location}`,
            '_blank'
        );
    };

    const handleOpenMaps = () => {
        const event = wedding.events[0];
        const venue = event?.venue || event?.venueName;
        if (!venue) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`, '_blank');
    };

    const handleWhatsAppShare = () => {
        const event = wedding.events[0];
        const dateStr = event?.date
            ? new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            : '';
        const text = `I'm attending ${wedding.groomName} & ${wedding.brideName}'s wedding${dateStr ? ` on ${dateStr}` : ''}! 🎊`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const renderFlowers = () => (
        <>
            <MandalaBackground />
            <FloatingFlowers />
        </>
    );



    const primaryEvent = wedding.events?.[0];
    const primaryEventDate = primaryEvent?.date
        ? new Date(primaryEvent.date).toLocaleDateString('en-GB', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })
        : null;

    // ─── ALREADY REGISTERED ───────────────────────────────────────────────
    if (step === 'ALREADY_REGISTERED') {
        return (
            <div className={styles.wrapper}>
                {renderFlowers()}
                <div className={styles.card}>
                    <div className={styles.successContent}>
                        <div className={styles.successIcon} style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}>
                            <Info size={38} color="#D97706" />
                        </div>
                        <h2 className={styles.successTitle}>Already Registered</h2>
                        <p className={styles.successText}>
                            You&apos;ve already submitted your response for this event. We&apos;ve got your details!
                        </p>
                    </div>
                    <Link href="/" className={styles.poweredByCard}>
                        crafted by
                        <img src="/logo.png" alt="Nimantran Studio" className={styles.brandLogo} />
                    </Link>
                </div>
            </div>
        );
    }

    // ─── SUCCESS ──────────────────────────────────────────────────────────
    if (step === 'SUCCESS') {
        const successText = status === 'declined'
            ? 'Your warm wishes mean the world to the couple.'
            : status === 'maybe'
            ? 'We hope to see you there — fingers crossed!'
            : 'Your response has been confirmed. We cannot wait to celebrate with you!';

        return (
            <div className={styles.wrapper}>
                {renderFlowers()}
                {showSuccessPetals && <FlowerPetalDrift />}
                <div className={styles.card}>
                    

                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>
                            <Check size={38} strokeWidth={3} />
                        </div>

                        <h2 className={styles.successTitle}>Thank You, {guestName || 'Guest'}!</h2>

                        <p className={styles.successText}>{successText}</p>

                        {status !== 'declined' && primaryEventDate && (
                            <p className={styles.seeYouText}>See you on {primaryEventDate}!</p>
                        )}

                        <div className={styles.successDivider} />

                        <div className={styles.actionButtons}>
                            <button className={styles.actionBtn} onClick={handleAddToCalendar}>
                                <Calendar size={16} /> Add to Calendar
                            </button>
                            <button className={styles.actionBtn} onClick={handleOpenMaps}>
                                <MapPin size={16} /> Open in Maps
                            </button>
                        </div>

                        {status !== 'declined' && (
                            <button className={styles.whatsappBtn} onClick={handleWhatsAppShare}>
                                <WhatsAppIcon /> Share the news on WhatsApp
                            </button>
                        )}
                    </div>

                    <div className={styles.buttonWrapper}>
                        <button onClick={() => setStep('INVITE')} className={styles.backButton}>
                            Back to Invitation
                        </button>
                    </div>

                    <Link href="/" className={styles.poweredByCard}>
                        crafted by
                        <img src="/logo.png" alt="Nimantran Studio" className={styles.brandLogo} />
                    </Link>
                </div>
            </div>
        );
    }



    // ─── INVITE (default) ─────────────────────────────────────────────────
    const weddingEvents = (wedding.events || []).filter(
        (e: any) => e.name?.toLowerCase().includes('wedding') || e.eventType === 'Wedding'
    );
    const displayEvents = weddingEvents.length > 0 ? weddingEvents.slice(0, 1) : wedding.events?.slice(0, 1) ?? [];

    return (
        <div className={styles.wrapper}>
            {renderFlowers()}
            {showSuccessPetals && <FlowerPetalDrift />}
            <div className={styles.card}>
                

                <header className={styles.header}>
                    <p className={styles.joyfullyText}>
                        You are joyfully invited<br />to the wedding of
                    </p>
                    <div className={styles.namesContainer}>
                        <span className={styles.groomName}>{wedding.groomName}</span>
                        <span className={styles.ampersand}>&amp;</span>
                        <span className={styles.brideName}>{wedding.brideName}</span>
                    </div>
                </header>



                <main className={styles.main}>
                    <div className={styles.welcomeBox}>
                        <p className={styles.welcomeText}>
                            {wedding.invitationMessage || "We can't wait to celebrate this special day with you!"}
                        </p>
                    </div>

                    <div className={styles.eventsList}>
                        {displayEvents.map((event: any) => {
                            const venue = event.venue || event.venueName;
                            return (
                                <div key={event.id} className={styles.eventCard}>
                                    <div className={styles.eventRoleTitle}>
                                        {event.eventName || event.name || 'The Wedding Ceremony'}
                                    </div>
                                    <div className={styles.eventRowSimple}>
                                        {event.date
                                            ? new Date(event.date).toLocaleDateString('en-GB', {
                                                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                              })
                                            : 'Date TBD'}
                                        {event.time ? ` · ${event.time} onwards` : ''}
                                    </div>
                                    {venue && (
                                        <div className={styles.venueRow}>
                                            <MapPin size={13} />
                                            <span>{venue}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {wedding.rsvpDeadline && (
                        <p className={styles.deadlineText}>
                            Please respond by{' '}
                            {new Date(wedding.rsvpDeadline).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </p>
                    )}
                </main>

                <div className={styles.ornamentDivider} style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
                    <div className={styles.ornamentLine} />
                    <span>✦</span>
                    <div className={styles.ornamentLine} />
                </div>

                <header className={styles.formHeader}>
                    <h2 className={styles.formTitle}>Confirm Attendance</h2>
                    <p className={styles.formSubtitle}>
                        We&apos;d love to have you with us at {wedding.groomName}&apos;s Wedding
                    </p>
                </header>

                <form id="rsvp-form" className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label>Your Name</label>
                        <input
                            required
                            placeholder="e.g. Rahul Patil"
                            className={styles.input}
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>No. of Guests</label>
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

                    <div className={styles.field}>
                        <label>Send your warm wishes</label>
                        <textarea
                            placeholder="Write a heartfelt message for the couple…"
                            className={clsx(styles.input, styles.textarea)}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Will you be attending?</label>
                        <div className={styles.statusGrid}>
                            {(['attending', 'maybe', 'declined'] as const).map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    className={clsx(styles.statusBtn, status === opt && styles.statusBtnActive)}
                                    onClick={() => setStatus(opt)}
                                >
                                    {opt === 'attending'
                                        ? "I'll be there 🎉"
                                        : opt === 'maybe'
                                        ? 'Will try 🤞'
                                        : 'Sending wishes 💛'}
                                </button>
                            ))}
                        </div>
                        <div className={styles.feedbackMessage}>
                            {status === 'attending' && "Can't wait to celebrate with you 🎉"}
                            {status === 'maybe' && 'Hope to see you there 🤍'}
                            {status === 'declined' && 'Your wishes mean a lot 💛'}
                        </div>
                    </div>
                </form>

                <div className={styles.buttonWrapper}>
                    {submitError && (
                        <p style={{ color: '#B91C1C', fontSize: '0.875rem', textAlign: 'center' }}>
                            {submitError}
                        </p>
                    )}
                    <button type="submit" form="rsvp-form" className={styles.submit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting…' : 'Confirm My Attendance'}
                    </button>
                </div>

                <Link href="/" className={styles.poweredByCard}>
                    crafted by
                        <img src="/logo.png" alt="Nimantran Studio" className={styles.brandLogo} />
                </Link>
            </div>
        </div>
    );
};
