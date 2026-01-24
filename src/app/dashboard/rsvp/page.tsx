'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import {
    LogOut, User, Plus, Edit2, Link2, FileText, Trash2,
    Calendar, MapPin, Clock, Users, CheckCircle2, XCircle,
    HelpCircle, Copy, Share2, Download, Eye
} from 'lucide-react';
import styles from './rsvp-list.module.css';
import dashboardStyles from '../dashboard.module.css';

export default function RSVPListPage() {
    const router = useRouter();
    const { logout, formData, removeEvent } = useWeddingStore();

    // State for delete modal
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

    // Safely access events
    const events = formData?.events || [];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleDeleteClick = (id: string) => {
        setDeletingEventId(id);
    };

    const confirmDelete = () => {
        if (deletingEventId) {
            removeEvent(deletingEventId);
            setDeletingEventId(null);
        }
    };

    const cancelDelete = () => {
        setDeletingEventId(null);
    };

    // Calculate stats per event
    const getEventStats = (guests: any[]) => {
        let totalResponses = 0;
        let attending = 0;
        let declined = 0;
        let maybe = 0;
        let headcount = 0;

        guests.forEach(g => {
            if (g.status !== 'pending') totalResponses++;
            if (g.status === 'attending') {
                attending++;
                headcount += (1 + (g.companions || 0));
            }
            if (g.status === 'declined') declined++;
            // Assuming maybe might be added later
        });

        return { totalResponses, attending, declined, maybe, headcount };
    };

    const copyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };

    const openWhatsApp = (link: string) => {
        const text = `Please RSVP for our wedding: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className={styles.container}>
            <aside className={dashboardStyles.sidebar}>
                <nav className={dashboardStyles.nav}>
                    <Link href="/dashboard" className={dashboardStyles.navItem}>
                        My Ordered Bundle
                    </Link>
                    <div className={`${dashboardStyles.navItem} ${dashboardStyles.active}`}>
                        RSVP Manager
                    </div>
                </nav>

                <div className={dashboardStyles.sidebarFooter}>
                    <button onClick={handleLogout} className={dashboardStyles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <span className={styles.breadcrumbLink}>Rsvp Manager</span>
                    <span className={styles.separator}>/</span>
                    <span className={styles.activeBreadcrumb}>Event list</span>
                </div>

                <header className={styles.header}>
                    <h1 className={styles.title}>RSVP Dashboard</h1>
                    <Link href="/dashboard/rsvp/create" className={styles.createBtn}>
                        <Plus size={16} />
                        Create RSVP Event
                    </Link>
                </header>

                <div className={styles.listContainer}>
                    {(!events || events.length === 0) && (
                        <div className={styles.emptyStateContainer}>
                            <h2 className={styles.emptyTitle}>Elegant RSVPs for Indian Weddings</h2>
                            <p className={styles.emptySubtitle}>
                                Coordinate your guest list with ease. Digital tracking for the modern wedding coordinator.
                            </p>
                            <Link href="/dashboard/rsvp/create" className={styles.emptyCreateBtn}>
                                CREATE RSVP EVENT
                            </Link>
                        </div>
                    )}

                    {events && [...events].reverse().map((evt) => {
                        const stats = getEventStats(evt.guests || []);
                        // Use dynamic origin if on client, else fallback
                        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
                        const rsvpLink = `${origin}/rsvp/${evt.id}`;

                        return (
                            <div key={evt.id} className={styles.card}>
                                {/* A. Header */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.headerLeft}>
                                        <span className={styles.eventTypeBadge}>{evt.eventType || 'Wedding Event'}</span>
                                        <h3 className={styles.eventName}>{evt.name}</h3>
                                    </div>
                                    <div className={styles.statusLive}>
                                        <div className={styles.statusDot}></div>
                                        RSVP LIVE
                                    </div>
                                </div>

                                {/* B. Details Row */}
                                <div className={styles.detailsRow}>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailIcon}>
                                            <Calendar size={20} />
                                        </div>
                                        <div className={styles.detailText}>
                                            <span className={styles.detailLabel}>Date & Time</span>
                                            <span className={styles.detailValue}>
                                                {evt.date || 'TBD'} • {evt.time || 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailIcon}>
                                            <MapPin size={20} />
                                        </div>
                                        <div className={styles.detailText}>
                                            <span className={styles.detailLabel}>Venue</span>
                                            <span className={styles.detailValue} title={evt.venue}>
                                                {evt.venue || 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailIcon}>
                                            <Clock size={20} />
                                        </div>
                                        <div className={styles.detailText}>
                                            <span className={styles.detailLabel}>RSVP Deadline</span>
                                            <span className={styles.detailValue}>
                                                {evt.rsvpDeadline ? `Respond by ${evt.rsvpDeadline}` : 'No deadline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* C. Stats Grid */}
                                <div className={styles.statsRow}>
                                    <div className={`${styles.statBlock} ${styles.statTotal}`}>
                                        <div className={styles.statIcon}><Users size={20} color="#555" /></div>
                                        <div className={styles.statNumber}>{stats.totalResponses}</div>
                                        <div className={styles.statLabel}>TOTAL RESPONSES</div>
                                    </div>
                                    <div className={`${styles.statBlock} ${styles.statAttending}`}>
                                        <div className={styles.statIcon}><CheckCircle2 size={20} color="#1B5E20" /></div>
                                        <div className={styles.statNumber}>{stats.attending}</div>
                                        <div className={styles.statLabel}>ATTENDING</div>
                                    </div>
                                    <div className={`${styles.statBlock} ${styles.statDecline}`}>
                                        <div className={styles.statIcon}><XCircle size={20} color="#C62828" /></div>
                                        <div className={styles.statNumber}>{stats.declined}</div>
                                        <div className={styles.statLabel}>NOT ATTENDING</div>
                                    </div>
                                    <div className={`${styles.statBlock} ${styles.statMaybe}`}>
                                        <div className={styles.statIcon}><HelpCircle size={20} color="#F57F17" /></div>
                                        <div className={styles.statNumber}>{stats.maybe}</div>
                                        <div className={styles.statLabel}>MAYBE</div>
                                    </div>
                                </div>

                                <div className={styles.totalHeadcount}>
                                    👥 TOTAL HEADCOUNT: {stats.headcount} GUESTS
                                </div>

                                {/* D. Link Section */}
                                <div className={styles.linkSection}>
                                    <div className={styles.linkLabel}>Your RSVP Link</div>
                                    <div className={styles.linkBox}>
                                        <span className={styles.linkUrl}>{rsvpLink}</span>
                                        <button className={styles.copyBtn} onClick={() => copyLink(rsvpLink)}>
                                            <Copy size={14} /> Copy
                                        </button>
                                    </div>

                                    <div className={styles.buttonGroup}>
                                        {/* Primary "View Event" Button FIRST */}
                                        <button
                                            className={styles.viewEventBtn}
                                            onClick={() => router.push(`/dashboard/rsvp/${evt.id}`)}
                                        >
                                            <Eye size={20} />
                                            View Event
                                        </button>

                                        <button className={styles.whatsappBtn} onClick={() => openWhatsApp(rsvpLink)}>
                                            <Share2 size={20} />
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>

                                {/* E. Footer Actions */}
                                <div className={styles.cardFooter}>
                                    <div className={styles.footerActionsRow}>
                                        <button className={styles.footerAction}>
                                            <Edit2 size={16} /> Edit details
                                        </button>

                                        <button
                                            className={styles.deleteAction}
                                            onClick={() => handleDeleteClick(evt.id)}
                                        >
                                            <Trash2 size={16} /> Delete event
                                        </button>
                                    </div>
                                    <p className={styles.shareHint}>
                                        Share this link with family and guests to collect confirmations instantly.
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Custom Delete Modal */}
            {deletingEventId && (
                <div className={styles.modalOverlay} onClick={cancelDelete}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ marginBottom: '1rem', color: '#DC2626' }}>
                            <Trash2 size={48} />
                        </div>
                        <h3 className={styles.modalTitle}>Delete Event?</h3>
                        <p className={styles.modalText}>
                            Are you sure you want to delete this event? This action cannot be undone and you will lose all collected RSVPs.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnCancel} onClick={cancelDelete}>
                                Cancel
                            </button>
                            <button className={styles.btnConfirmDelete} onClick={confirmDelete}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
