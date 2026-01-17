'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './rsvp.module.css';

export const RSVPForm = ({ weddingId }: { weddingId: string }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attending, setAttending] = useState('yes');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            guestName: formData.get('guestName'),
            attending: attending,
            adultCount: formData.get('adultCount'),
            childCount: formData.get('childCount'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch(`/api/rsvp/${weddingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/rsvp/thank-you');
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

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <label>Your Name</label>
                <input name="guestName" required placeholder="Full Name" className={styles.input} />
            </div>

            <div className={styles.field}>
                <label>Will you be attending?</label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="attending"
                            value="yes"
                            checked={attending === 'yes'}
                            onChange={() => setAttending('yes')}
                        />
                        Yes, I'll be there!
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="attending"
                            value="no"
                            checked={attending === 'no'}
                            onChange={() => setAttending('no')}
                        />
                        Regretfully, No.
                    </label>
                </div>
            </div>

            {attending === 'yes' && (
                <div className={styles.counts}>
                    <div className={styles.field}>
                        <label>Adults</label>
                        <input name="adultCount" type="number" min="1" defaultValue="1" className={styles.input} />
                    </div>
                    <div className={styles.field}>
                        <label>Children</label>
                        <input name="childCount" type="number" min="0" defaultValue="0" className={styles.input} />
                    </div>
                </div>
            )}

            <div className={styles.field}>
                <label>Message for the Couple</label>
                <textarea name="message" placeholder="A sweet note..." className={styles.textarea} rows={3} />
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Send RSVP'}
            </button>
        </form>
    );
};
