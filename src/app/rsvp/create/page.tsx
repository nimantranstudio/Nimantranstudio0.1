'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './create.module.css';

export default function RSVPCreatePage() {
    const [allowCompanions, setAllowCompanions] = useState(true);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Event details</h1>
                <p className={styles.subtitle}>Set up your digital RSVP tracking link.</p>
            </header>

            <main className="container">
                <div className={styles.formCard}>
                    <form className={styles.form}>
                        {/* Event Name */}
                        <div className={styles.fieldFull}>
                            <label className={styles.label}>EVENT NAME</label>
                            <input
                                type="text"
                                placeholder="Ex: Birthday Barbecue"
                                className={styles.input}
                            />
                        </div>

                        {/* Date & Time */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>DATE</label>
                                <input
                                    type="text"
                                    placeholder="DD/MM/YYYY"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>TIME</label>
                                <input
                                    type="text"
                                    placeholder="00:00"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        {/* Deadline & Venue */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>RSVP DEADLINE (OPTIONAL)</label>
                                <input
                                    type="text"
                                    placeholder="Set deadline"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>VENUE OR LINK</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Physical address or link"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        {/* Allow Companions Toggle */}
                        <div className={styles.toggleRow}>
                            <div className={styles.toggleLabelGroup}>
                                <span className={styles.toggleLabel}>Allow companions</span>
                                <span className={styles.infoIcon}>i</span>
                            </div>
                            <button
                                type="button"
                                className={`${styles.toggle} ${allowCompanions ? styles.active : ''}`}
                                onClick={() => setAllowCompanions(!allowCompanions)}
                            >
                                <div className={styles.toggleThumb} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.actions}>
                    <button className={styles.createButton}>
                        CREATE LINK
                    </button>
                    <Link href="/rsvp" className={styles.cancelLink}>
                        CANCEL AND GO BACK
                    </Link>
                </div>
            </main>
        </div>
    );
}
