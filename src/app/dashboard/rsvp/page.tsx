'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeddingStore } from '@/store/wedding-store';
import {
    Plus, FileText, Trash2,
    Users, CheckCircle2, XCircle,
    HelpCircle, Copy, Share2, Download, Eye, Search,
} from 'lucide-react';
import styles from './rsvp-list.module.css';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

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
        fetch(`/api/rsvp/${lastSavedWeddingId}`)
            .then(res => res.json())
            .then(data => { if (data.success) setRsvps(data.rsvps); })
            .catch(console.error)
            .finally(() => setRsvpLoading(false));
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
                    {events.length === 0 && (
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

                    {[...events].reverse().map((evt) => {
                        const rsvpLink = getRsvpLink();

                        return (
                            <div key={evt.id} className={styles.eventGroup}>
                                <div className={styles.card}>
                                    <div className={styles.cardBody}>
                                        {/* Header */}
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

                                                <p style={{ marginTop: '1.25rem', color: '#64748B', fontSize: '0.875rem' }}>
                                                    Share this link with family and guests to collect confirmations instantly.
                                                </p>
                                            </div>
                                            <div className={styles.headerRight}>
                                                <button
                                                    className={styles.iconBtn}
                                                    onClick={() => copyLink(evt.id)}
                                                    title={copiedId === evt.id ? 'Copied!' : 'Copy Link'}
                                                >
                                                    {copiedId === evt.id ? <CheckCircle2 size={18} color="#22C55E" /> : <Copy size={18} />}
                                                </button>
                                                <button className={styles.iconBtn} onClick={openWhatsApp} title="Share on WhatsApp">
                                                    <Share2 size={18} />
                                                </button>
                                                {rsvpLink && (
                                                    <Link href={rsvpLink} target="_blank" className={styles.iconBtn} title="Preview RSVP">
                                                        <Eye size={18} />
                                                    </Link>
                                                )}
                                                <button
                                                    className={`${styles.iconBtn} ${styles.btnDelete}`}
                                                    onClick={() => handleDeleteClick(evt.id)}
                                                    title="Delete event"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Stats — from real API data */}
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
                                </div>

                                {/* Guest List Card */}
                                <div className={`${styles.card} ${styles.guestListCard}`}>
                                    <div className={styles.guestListSection}>
                                        <div className={styles.guestListHeader}>
                                            <h3 className={styles.guestListTitle}>Guest List</h3>
                                            <div className={styles.guestListActions}>
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
                                                <button className={styles.iconBtn} onClick={openWhatsApp} title="Share on WhatsApp">
                                                    <Share2 size={18} />
                                                </button>
                                                <button className={styles.btnActionOutline} onClick={handleExportCSV}>
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
                                                                        : styles.statusPending
                                                                    }`}>
                                                                        {r.status === 'attending' ? 'YES'
                                                                            : r.status === 'declined' ? 'NO'
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

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
                            <button className={styles.btnCancel} onClick={cancelDelete}>Cancel</button>
                            <button className={styles.btnConfirmDelete} onClick={confirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
