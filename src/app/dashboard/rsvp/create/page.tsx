'use client';

import { useState } from 'react';
import styles from './create.module.css';
import { Input } from '@/components/form/Input';
import formStyles from '@/components/form/Form.module.css';
import { Info, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import dashboardStyles from '../../dashboard.module.css';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function RSVPCreatePage() {
    const router = useRouter();
    const { addEvent, logout, saveWedding } = useWeddingStore();

    const [allowCompanions, setAllowCompanions] = useState(true);
    const [collectDietary, setCollectDietary] = useState(false);
    const [eventName, setEventName] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [eventType, setEventType] = useState('Wedding');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [deadline, setDeadline] = useState('');
    const [venue, setVenue] = useState('');

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleCreateLink = async () => {
        if (!eventName) {
            alert("Please enter an event name.");
            return;
        }
        if (!date) {
            alert("Please select an event date.");
            return;
        }
        if (!time) {
            alert("Please select an event time.");
            return;
        }
        if (!venue) {
            alert("Please enter a venue address or link.");
            return;
        }
        if (!deadline) {
            alert("Please set an RSVP deadline.");
            return;
        }

        addEvent({
            name: eventName,
            description: welcomeMessage,
            eventType,
            date,
            time,
            venue,
            rsvpDeadline: deadline,
            allowCompanions,
            collectDietary,
            guests: []
        });

        // Save to backend to generate valid DB IDs for the links
        const result = await saveWedding();
        if (!result.success) {
            alert(`Backend sync failed: ${result.error || 'Unknown error'}. Link might not work immediately.`);
        }

        router.push('/dashboard/rsvp');
    };

    return (
        <div className={styles.container}>
            <DashboardSidebar />

            <main className={styles.main}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <span className={styles.breadcrumbLink}>Rsvp Manager</span>
                    <span className={styles.separator}>/</span>
                    <span className={styles.activeBreadcrumb}>Create</span>
                </div>

                <div className={styles.formContainer}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Host Your Event</h1>
                        <p className={styles.subtitle}>Create a beautiful, distraction-free RSVP link to share with your loved ones via WhatsApp</p>
                    </header>

                    <section className={formStyles.section}>
                        <h2 className={formStyles.sectionTitle}>RSVP Information</h2>
                        <div className={styles.formGrid}>
                            {/* Event Name */}
                            <div className={styles.fullWidth}>
                                <Input
                                    label="EVENT NAME"
                                    placeholder="Rahul and Anjalee's Wedding"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                />
                            </div>

                            {/* Welcome Message */}
                            <div className={styles.fullWidth}>
                                <Input
                                    label="WELCOME MESSAGE"
                                    placeholder="Ex: We can't wait to celebrate with you!"
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                />
                            </div>

                            {/* Date & Time */}
                            <div>
                                <Input
                                    label="DATE"
                                    type="date"
                                    placeholder="DD/MM/YYYY"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <Input
                                    label="TIME"
                                    type="time"
                                    placeholder="00:00"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>

                            {/* Event Type & Deadline */}
                            <div>
                                <label className={styles.label}>Event Type</label>
                                <select
                                    className={styles.select}
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                >
                                    <option value="Wedding">Wedding</option>
                                    {/* Temporarily disabled other event types as requested */}
                                    {/* 
                                    <option value="Reception">Reception</option>
                                    <option value="Sangeet">Sangeet</option>
                                    <option value="Haldi">Haldi</option>
                                    <option value="Engagement">Engagement</option>
                                    <option value="Birthday">Birthday</option>
                                    <option value="Other">Other</option>
                                    */}
                                </select>
                            </div>
                            <div>
                                <Input
                                    label="RSVP DEADLINE (OPTIONAL)"
                                    type="date"
                                    placeholder="Set deadline"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>

                            {/* Venue */}
                            <div className={styles.fullWidth}>
                                <label className={styles.label}>Venue Address / Google Maps Link</label>
                                <textarea
                                    className={styles.textarea}
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                    placeholder="Ex: Physical address or link"
                                ></textarea>
                            </div>
                        </div>

                        {/* Allow Companions Toggle */}
                        <div className={styles.toggleRow}>
                            <div className={styles.toggleLabelGroup}>
                                <span className={styles.toggleLabel}>Allow companions</span>
                                <Info size={16} className={styles.infoIcon} />
                            </div>
                            <button
                                type="button"
                                className={clsx(styles.toggle, allowCompanions && styles.active)}
                                onClick={() => setAllowCompanions(!allowCompanions)}
                            >
                                <div className={styles.toggleThumb} />
                            </button>
                        </div>

                        {/* Collect Dietary Preferences Toggle */}
                        <div className={styles.toggleRow}>
                            <div className={styles.toggleLabelGroup}>
                                <div>
                                    <span className={styles.toggleLabel} style={{ display: 'block' }}>Collect Dietary Preferences</span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Ask guests about allergies or meal choices</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={clsx(styles.toggle, collectDietary && styles.active)}
                                onClick={() => setCollectDietary(!collectDietary)}
                            >
                                <div className={styles.toggleThumb} />
                            </button>
                        </div>
                    </section>

                    <div className={styles.actions}>
                        <button
                            className={clsx("btn btn-primary", styles.createButton)}
                            onClick={handleCreateLink}
                        >
                            CREATE LINK
                        </button>
                        <Link href="/dashboard/rsvp" className={styles.cancelLink}>
                            CANCEL AND GO BACK
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
