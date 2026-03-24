'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import {
    LogOut, User, Plus, Edit2, Link2, FileText, Trash2,
    Calendar, MapPin, Clock, Users, CheckCircle2, XCircle,
    HelpCircle, Copy, Share2, Download, Eye, Search,
    ChevronLeft, ChevronRight, ShieldCheck, Zap, Lock
} from 'lucide-react';
import styles from './rsvp-list.module.css';
import dashboardStyles from '../dashboard.module.css';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

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

    // State for copy feedback
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyLink = (id: string, link: string) => {
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openWhatsApp = (link: string) => {
        const text = `Please RSVP for our wedding: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className={styles.container}>
            <DashboardSidebar />

            <main className={styles.main}>
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
                            <div key={evt.id} className={styles.eventGroup}>
                                <div className={styles.card}>
                                    <div className={styles.cardBody}>
                                        {/* A. Header */}
                                        <div className={styles.cardHeader}>
                                            <div className={styles.headerLeft}>
                                                <div className={styles.nameRow}>
                                                    <h3 className={styles.eventName}>{evt.name}</h3>
                                                    <div className={styles.statusLive}>
                                                        <div className={styles.statusDot}></div>
                                                        RSVP LIVE
                                                    </div>
                                                </div>

                                                <div className={styles.detailsRow}>
                                                    <div className={styles.detailItem}>
                                                        <div className={styles.detailText}>
                                                            <span className={styles.detailLabel}>Date & Time</span>
                                                            <span className={styles.detailValue}>
                                                                {evt.date || 'TBD'} • {evt.time || 'TBD'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <div className={styles.detailText}>
                                                            <span className={styles.detailLabel}>Venue</span>
                                                            <span className={styles.detailValue} title={evt.venue}>
                                                                {evt.venue || 'TBD'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <div className={styles.detailText}>
                                                            <span className={styles.detailLabel}>RSVP Deadline</span>
                                                            <span className={styles.detailValue}>
                                                                {evt.rsvpDeadline ? `Respond by ${evt.rsvpDeadline}` : 'No deadline'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.headerRight}>
                                                <button 
                                                    className={styles.footerBtnOutline}
                                                    onClick={() => copyLink(evt.id, rsvpLink)}
                                                >
                                                    {copiedId === evt.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                                    <span>{copiedId === evt.id ? 'Copied!' : 'Copy Link'}</span>
                                                </button>
                                                <button className={styles.footerBtnWhatsApp}>
                                                     <Share2 size={16} />
                                                     <span>WhatsApp</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* C. Stats Grid */}
                                        <div className={styles.statsRow}>
                                            <div className={`${styles.statBlock} ${styles.statTotal}`}>
                                                <div className={styles.statContent}>
                                                    <div className={`${styles.statIconBox} ${styles.iconTotal}`}>
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className={styles.statInfo}>
                                                        <span className={styles.statTitle}>Responses Received</span>
                                                        <span className={styles.statMainNumber}>{stats.totalResponses}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${styles.statBlock} ${styles.statAttending}`}>
                                                <div className={styles.statContent}>
                                                    <div className={`${styles.statIconBox} ${styles.iconAttending}`}>
                                                        <Users size={24} />
                                                    </div>
                                                    <div className={styles.statInfo}>
                                                        <span className={styles.statTitle}>Attending</span>
                                                        <span className={styles.statMainNumber}>{stats.attending}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${styles.statBlock} ${styles.statDecline}`}>
                                                <div className={styles.statContent}>
                                                    <div className={`${styles.statIconBox} ${styles.iconDecline}`}>
                                                        <XCircle size={24} />
                                                    </div>
                                                    <div className={styles.statInfo}>
                                                        <span className={styles.statTitle}>Not Attending</span>
                                                        <span className={styles.statMainNumber}>{stats.declined}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${styles.statBlock} ${styles.statMaybe}`}>
                                                <div className={styles.statContent}>
                                                    <div className={`${styles.statIconBox} ${styles.iconMaybe}`}>
                                                        <HelpCircle size={24} />
                                                    </div>
                                                    <div className={styles.statInfo}>
                                                        <span className={styles.statTitle}>Maybe</span>
                                                        <span className={styles.statMainNumber}>{stats.maybe}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                     {/* E. Footer Actions */}
                                    <div className={styles.cardFooter}>
                                        <p className={styles.footerInstruction}>
                                            Share this link with family and guests to collect confirmations instantly.
                                        </p>
                                        <div className={styles.footerActionsRow}>
                                            <Link 
                                                href={rsvpLink} 
                                                target="_blank" 
                                                className={styles.previewAction}
                                            >
                                                <Eye size={16} /> Preview RSVP
                                            </Link>
                                            <button
                                                className={styles.deleteAction}
                                                onClick={() => handleDeleteClick(evt.id)}
                                            >
                                                <Trash2 size={16} /> Delete event
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 2: GUEST LIST */}
                                <div className={`${styles.card} ${styles.guestListCard}`}>
                                    <div className={styles.guestListSection}>
                                        <div className={styles.guestListHeader}>
                                            <h3 className={styles.guestListTitle}>{evt.name} Guest List</h3>
                                            <div className={styles.guestListActions}>
                                                <div className={styles.searchWrapper}>
                                                    <Search size={16} className={styles.searchIcon} />
                                                    <input type="text" placeholder="Search guests..." className={styles.searchInput} />
                                                </div>
                                                <button className={styles.btnActionSecondary}>
                                                    <Share2 size={16} />
                                                    <span>Copy for WhatsApp</span>
                                                </button>
                                                <button className={styles.btnActionOutline}>
                                                    <Download size={16} />
                                                    <span>Export CSV</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.tableContainer}>
                                            <table className={styles.guestTable}>
                                                <thead>
                                                    <tr>
                                                        <th>GUEST NAME</th>
                                                        <th>STATUS</th>
                                                        <th>COUNTS</th>
                                                        <th>PHONE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={4} className={styles.emptyTable}>
                                                            No guests have RSVP'd yet.
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className={styles.paginationRow}>
                                            <div className={styles.paginationActions}>
                                                <button className={styles.pageBtn} disabled>
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <span className={styles.pageIndicator}>1</span>
                                                <button className={styles.pageBtnNext}>
                                                    <span>Next</span>
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
