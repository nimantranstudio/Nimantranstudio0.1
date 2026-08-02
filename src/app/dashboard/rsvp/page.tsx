'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWeddingStore } from '@/store/wedding-store';
import {
    Plus, Trash2, Copy, Share2, Download, Eye, Search, CheckCircle2,
    FileText, Users, XCircle, HelpCircle
} from 'lucide-react';
import styles from './rsvp-list.module.css';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { auth } from '@/lib/firebase';

interface RSVPEntry {
    id: string;
    guestName: string;
    status: string;
    adultCount: number;
    childCount: number;
    phone?: string;
    dietary?: string;
    message?: string;
    createdAt: string;
}

export default function RSVPListPage() {
    const { formData, removeEvent, lastSavedWeddingId } = useWeddingStore();

    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const events = formData?.events || [];

    useEffect(() => {
        if (!lastSavedWeddingId) return;
        setRsvpLoading(true);
        const fetchRsvps = async () => {
            try {
                await auth.authStateReady();
                const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
                const res = await fetch(`/api/rsvp/${lastSavedWeddingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setRsvps(data.rsvps);
            } catch (err) {
                console.error(err);
            } finally {
                setRsvpLoading(false);
            }
        };
        fetchRsvps();
    }, [lastSavedWeddingId]);

    const stats = {
        totalResponses: rsvps.length,
        attending: rsvps.filter(r => r.status === 'attending').length,
        declined: rsvps.filter(r => r.status === 'declined').length,
        maybe: rsvps.filter(r => r.status === 'maybe').length,
        headcount: rsvps
            .filter(r => r.status === 'attending')
            .reduce((sum, r) => sum + (r.adultCount || 1), 0),
    };

    const filteredRsvps = rsvps.filter(r =>
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.phone && r.phone.includes(searchQuery))
    );

    const handleDeleteClick = (id: string) => setDeletingEventId(id);
    const confirmDelete = () => {
        if (deletingEventId) { removeEvent(deletingEventId); setDeletingEventId(null); }
    };
    const cancelDelete = () => setDeletingEventId(null);

    const getRsvpLink = () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return lastSavedWeddingId ? `${origin}/rsvp/${lastSavedWeddingId}` : '';
    };

    const copyLink = (id: string) => {
        navigator.clipboard.writeText(getRsvpLink());
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openWhatsApp = () => {
        const names = formData.groomName && formData.brideName
            ? `${formData.groomName} & ${formData.brideName}`
            : 'our wedding';
        const text = `Please RSVP for ${names}: ${getRsvpLink()}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleExportCSV = () => {
        const headers = ['Guest Name', 'Status', 'Adults', 'Children', 'Phone', 'Dietary'];
        const rows = rsvps.map(r => [
            r.guestName,
            r.status,
            String(r.adultCount || 1),
            String(r.childCount || 0),
            r.phone || '-',
            r.dietary || '-',
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wedding_rsvps.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', bounce: 0, duration: 0.5 }
        }
    };

    return (
        <div className={styles.container}>
            <DashboardSidebar />

            <main className={styles.main}>
                <motion.header
                    className={styles.header}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
                >
                    <h1 className={styles.title}>RSVP Dashboard</h1>
                    <Link href="/dashboard/rsvp/create" className={styles.createBtn}>
                        <Plus size={18} />
                        <span>Create RSVP Event</span>
                    </Link>
                </motion.header>

                <motion.div
                    className={styles.listContainer}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {events.length === 0 && (
                        <motion.div variants={itemVariants} className={styles.emptyStateContainer}>
                            <h2 className={styles.emptyTitle}>Elegant RSVPs for Indian Weddings</h2>
                            <p className={styles.emptySubtitle}>
                                Coordinate your guest list with ease. Digital tracking for the modern wedding coordinator.
                            </p>
                            <Link href="/dashboard/rsvp/create" className={styles.createBtn}>
                                CREATE RSVP EVENT
                            </Link>
                        </motion.div>
                    )}

                    {/* Primary event RSVP tracking */}
                    {events.slice(0, 1).map((evt) => {
                        const rsvpLink = getRsvpLink();

                        return (
                            <motion.div key={evt.id} variants={itemVariants} className={styles.eventGroup}>
                                {/* Dark Luxury Event Hero Card */}
                                <div className={styles.darkHeroCard}>
                                    <div className={styles.heroHeader}>
                                        <div className={styles.heroLeft}>
                                            <div className={styles.nameRow}>
                                                <h2 className={styles.eventName}>{evt.name}</h2>
                                                <div className={styles.statusLive}>
                                                    <span className={styles.statusDot}></span>
                                                    RSVP LIVE
                                                </div>
                                            </div>
                                        </div>

                                        {/* Glassmorphic Action Pills */}
                                        <div className={styles.actionPillsGroup}>
                                            <button
                                                className={styles.pillBtn}
                                                onClick={() => copyLink(evt.id)}
                                            >
                                                {copiedId === evt.id ? <CheckCircle2 size={16} color="#4ADE80" /> : <Copy size={16} />}
                                                <span>{copiedId === evt.id ? 'Copied' : 'Copy Link'}</span>
                                            </button>
                                            <button className={styles.pillBtn} onClick={openWhatsApp}>
                                                <Share2 size={16} />
                                                <span>WhatsApp</span>
                                            </button>
                                            {rsvpLink && (
                                                <Link href={rsvpLink} target="_blank" className={styles.pillBtn}>
                                                    <Eye size={16} />
                                                    <span>Preview</span>
                                                </Link>
                                            )}
                                            <button
                                                className={`${styles.pillBtn} ${styles.pillDelete}`}
                                                onClick={() => handleDeleteClick(evt.id)}
                                            >
                                                <Trash2 size={16} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailCard}>
                                            <span className={styles.detailLabel}>Date & Time</span>
                                            <span className={styles.detailValue}>
                                                {evt.date || 'TBD'} {evt.time ? `• ${evt.time}` : ''}
                                            </span>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <span className={styles.detailLabel}>Venue</span>
                                            <span className={styles.detailValue}>{evt.venue || 'TBD'}</span>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <span className={styles.detailLabel}>RSVP Deadline</span>
                                            <span className={styles.detailValue}>
                                                {evt.rsvpDeadline ? `Respond by ${evt.rsvpDeadline}` : 'No deadline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Color-Coded Bento Stats Grid */}
                                <div className={styles.bentoStatsGrid}>
                                    <div className={`${styles.bentoStatCard} ${styles.cardTotal}`}>
                                        <div className={styles.bentoHeader}>
                                            <span className={styles.bentoTitle}>Total Responses</span>
                                        </div>
                                        <span className={styles.bentoNumber}>{stats.totalResponses}</span>
                                    </div>

                                    <div className={`${styles.bentoStatCard} ${styles.cardAttending}`}>
                                        <div className={styles.bentoHeader}>
                                            <span className={styles.bentoTitle}>Attending</span>
                                        </div>
                                        <span className={styles.bentoNumber}>{stats.attending}</span>
                                    </div>

                                    <div className={`${styles.bentoStatCard} ${styles.cardDeclined}`}>
                                        <div className={styles.bentoHeader}>
                                            <span className={styles.bentoTitle}>Not Attending</span>
                                        </div>
                                        <span className={styles.bentoNumber}>{stats.declined}</span>
                                    </div>

                                    <div className={`${styles.bentoStatCard} ${styles.cardMaybe}`}>
                                        <div className={styles.bentoHeader}>
                                            <span className={styles.bentoTitle}>Maybe</span>
                                        </div>
                                        <span className={styles.bentoNumber}>{stats.maybe}</span>
                                    </div>
                                </div>

                                {/* Guest Responses Table */}
                                <div className={styles.guestSection}>
                                    <div className={styles.guestHeader}>
                                        <div className={styles.guestTitleGroup}>
                                            <h3 className={styles.guestTitle}>Guest Responses</h3>
                                            <span className={styles.headcountBadge}>
                                                <Users size={14} />
                                                {stats.headcount} Confirmed Guests
                                            </span>
                                        </div>
                                        <div className={styles.guestActions}>
                                            <div className={styles.searchWrapper}>
                                                <Search size={16} className={styles.searchIcon} />
                                                <input
                                                    type="text"
                                                    placeholder="Search guests..."
                                                    className={styles.searchInput}
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <button className={styles.exportBtn} onClick={handleExportCSV}>
                                                <Download size={16} />
                                                <span>Export CSV</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.tableWrapper}>
                                        <table className={styles.guestTable}>
                                            <thead>
                                                <tr>
                                                    <th>GUEST NAME</th>
                                                    <th>STATUS</th>
                                                    <th>ADULTS</th>
                                                    <th>PHONE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rsvpLoading ? (
                                                    <tr>
                                                        <td colSpan={4} className={styles.emptyTable}>Loading responses...</td>
                                                    </tr>
                                                ) : filteredRsvps.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className={styles.emptyTable}>
                                                            {rsvps.length === 0
                                                                ? "No guests have RSVP'd yet."
                                                                : "No matching guests found."}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredRsvps.map(r => (
                                                        <tr key={r.id}>
                                                            <td className={styles.guestName}>{r.guestName}</td>
                                                            <td>
                                                                <span className={`${styles.statusBadge} ${
                                                                    r.status === 'attending' ? styles.statusYes
                                                                    : r.status === 'declined' ? styles.statusNo
                                                                    : r.status === 'maybe' ? styles.statusMaybe
                                                                    : styles.statusPending
                                                                }`}>
                                                                    {r.status === 'attending' ? 'ATTENDING'
                                                                        : r.status === 'declined' ? 'DECLINED'
                                                                        : r.status === 'maybe' ? 'MAYBE'
                                                                        : 'PENDING'}
                                                                </span>
                                                            </td>
                                                            <td>{r.adultCount || 1}</td>
                                                            <td>{r.phone || '-'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </main>

            {deletingEventId && (
                <div className={styles.modalOverlay} onClick={cancelDelete}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ marginBottom: '1rem', color: '#EF4444' }}>
                            <Trash2 size={48} />
                        </div>
                        <h3 className={styles.modalTitle}>Delete Event?</h3>
                        <p className={styles.modalText}>
                            Are you sure you want to delete this event? This action cannot be undone and you will lose all collected RSVPs.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnCancel} onClick={cancelDelete}>Cancel</button>
                            <button className={styles.btnConfirmDelete} onClick={confirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
