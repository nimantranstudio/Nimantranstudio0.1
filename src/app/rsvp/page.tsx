import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import styles from './rsvp.module.css';

export default function RSVPPage() {
    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <h1 className={styles.title}>RSVP Management</h1>
                            <p className={styles.subtitle}>
                                Coordinate your guest list with ease. Digital tracking
                                for the modern wedding coordinator.
                            </p>
                            <Link href="/rsvp/create" className={styles.ctaButton}>
                                CREATE RSVP EVENT
                            </Link>
                        </div>
                        <div className={styles.featuresList}>
                            <div className={styles.featureItem}>
                                <Check className={styles.checkIcon} size={20} />
                                <p>Automated WhatsApp reminders for pending RSVPs.</p>
                            </div>
                            <div className={styles.featureItem}>
                                <Check className={styles.checkIcon} size={20} />
                                <p>Dietary preferences and plus-one tracking.</p>
                            </div>
                            <div className={styles.featureItem}>
                                <Check className={styles.checkIcon} size={20} />
                                <p>Real-time guest list dashboard for parents and couples.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.process}>
                <div className="container">
                    <div className={styles.processGrid}>
                        {/* Card 1 */}
                        <div className={styles.processCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src="/rsvp_create.png"
                                        alt="Create Invitation"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Create your online invitation link</h3>
                                <p className={styles.cardDesc}>
                                    Add your event name, location and date to generate a personalized invitation.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className={styles.processCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src="/rsvp_share.png"
                                        alt="Share on WhatsApp"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Share on WhatsApp</h3>
                                <p className={styles.cardDesc}>
                                    Send your invitation link through WhatsApp or any other platform instantly.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className={styles.processCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src="/rsvp_confirm.png"
                                        alt="Confirm Attendance"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Confirm attendance at your event</h3>
                                <p className={styles.cardDesc}>
                                    Get RSVP responses easily with a simple attendee list ready to download.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* You can add more sections here later if needed */}
        </div>
    );
}
