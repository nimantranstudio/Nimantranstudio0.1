'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWeddingStore } from '@/store/wedding-store';
import {
    Plus, Trash2, Copy, Share2, Download, Eye, Search, CheckCircle2,
    FileText, Users, XCircle, HelpCircle, MessageCircle, X
} from 'lucide-react';
import styles from './rsvp-list.module.css';
import { ShareArrowIcon } from '@/components/ui/ShareArrowIcon';
import { auth } from '@/lib/firebase';
import { formatDisplayDate, formatDisplayTime } from '@/lib/format-date';

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
    const [dbWedding, setDbWedding] = useState<any>(null);

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
                if (data.success) {
                    if (data.wedding) setDbWedding(data.wedding);
                    if (Array.isArray(data.rsvps)) setRsvps(data.rsvps);
                }
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

    const filteredRsvps = (rsvps || []).filter(r => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        const name = (r.guestName || (r as any).name || '').toLowerCase();
        const phone = (r.phone || '').toLowerCase();
        const status = (r.status || '').toLowerCase();
        return name.includes(query) || phone.includes(query) || status.includes(query);
    });

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

    const handleDownloadExcel = async () => {
        try {
            const XLSX = await import('xlsx');
            const data = (rsvps || []).map((r, index) => ({
                'S.No': index + 1,
                'Guest Name': r.guestName || 'Guest',
                'Status': (r.status || 'ATTENDING').toUpperCase(),
                'Adults': Number(r.adultCount) || 1,
                'Children': Number(r.childCount) || 0,
                'Phone': r.phone || '-',
                'Dietary': r.dietary || '-',
                'Message': r.message || '-',
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            worksheet['!cols'] = [
                { wch: 6 },
                { wch: 22 },
                { wch: 14 },
                { wch: 10 },
                { wch: 10 },
                { wch: 16 },
                { wch: 18 },
                { wch: 30 },
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest List');
            XLSX.writeFile(workbook, `wedding_guest_list.xlsx`);
        } catch (err) {
            console.error('Error exporting Excel file:', err);
        }
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
            <main className={styles.main}>
                <motion.header
                    className={styles.header}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
                >
                    <h1 className={styles.title}>Website and RSVP Response</h1>
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
                    {(() => {
                        const rsvpLink = getRsvpLink();
                        const invitationTypeName = 'Wedding Ceremony';

                        const weddingCeremonyEvent = formData.events?.find(e =>
                            e.id?.toLowerCase().includes('wedding') ||
                            e.name?.toLowerCase().includes('wedding') ||
                            e.eventType?.toLowerCase().includes('wedding')
                        ) || dbWedding?.events?.find((e: any) =>
                            e.id?.toLowerCase().includes('wedding') ||
                            e.name?.toLowerCase().includes('wedding') ||
                            e.eventType?.toLowerCase().includes('wedding')
                        );

                        // Date & Time
                        const rawDate = formData.primaryDate || weddingCeremonyEvent?.date || dbWedding?.events?.[0]?.date || '';
                        const formattedDate = formatDisplayDate(rawDate);
                        const rawTime = formData.primaryTime || weddingCeremonyEvent?.time || dbWedding?.events?.[0]?.time || '';
                        const formattedTime = formatDisplayTime(rawTime);
                        
                        const dateDisplay = (formattedDate || rawDate)
                            ? `${formattedDate || rawDate}${formattedTime ? ` • ${formattedTime}` : (rawTime ? ` • ${rawTime}` : '')}`
                            : 'TBD';

                        // Venue
                        const venueDisplay = formData.defaultVenueName || formData.defaultVenueAddress || weddingCeremonyEvent?.venue || dbWedding?.events?.[0]?.venue || 'TBD';

                        // RSVP Deadline
                        const rawDeadline = formData.rsvpDeadline || weddingCeremonyEvent?.rsvpDeadline || dbWedding?.rsvpDeadline || '';
                        const formattedDeadline = formatDisplayDate(rawDeadline);
                        const deadlineDisplay = (formattedDeadline || rawDeadline) ? `Respond by ${formattedDeadline || rawDeadline}` : 'No deadline';

                        return (
                            <motion.div key="primary_wedding_ceremony" variants={itemVariants} className={styles.eventGroup}>
                                {/* Dark Luxury Event Hero Card */}
                                <div className={styles.darkHeroCard}>
                                    <div className={styles.heroHeader}>
                                        <div className={styles.heroLeft}>
                                            <div className={styles.nameRow}>
                                                <h2 className={styles.eventName}>Website and RSVP Response</h2>
                                                <div className={styles.statusLive}>
                                                    <span className={styles.statusDot}></span>
                                                    RSVP LIVE
                                                </div>
                                            </div>
                                            <p className={styles.eventSubtitle}>
                                                {invitationTypeName}
                                            </p>
                                        </div>

                                        {/* Glassmorphic Action Pills */}
                                        <div className={styles.actionPillsGroup}>
                                            <button
                                                className={styles.pillBtn}
                                                onClick={() => copyLink('primary_wedding_ceremony')}
                                            >
                                                {copiedId === 'primary_wedding_ceremony' ? <CheckCircle2 size={16} color="#4ADE80" /> : <Copy size={16} />}
                                                <span>{copiedId === 'primary_wedding_ceremony' ? 'Copied' : 'Copy Link'}</span>
                                            </button>
                                            {rsvpLink && (
                                                <Link href={rsvpLink} target="_blank" className={styles.pillBtn}>
                                                    <Eye size={16} />
                                                    <span>Preview</span>
                                                </Link>
                                            )}
                                            <button className={styles.pillBtn} onClick={openWhatsApp}>
                                                <ShareArrowIcon size={16} color="#111827" />
                                                <span>Share on WhatsApp</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailCard}>
                                            <span className={styles.detailLabel}>Date & Time</span>
                                            <span className={styles.detailValue}>
                                                {dateDisplay}
                                            </span>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <span className={styles.detailLabel}>Venue</span>
                                            <span className={styles.detailValue}>{venueDisplay}</span>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <span className={styles.detailLabel}>RSVP Deadline</span>
                                            <span className={styles.detailValue}>
                                                {deadlineDisplay}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Merged Unified Guest Responses Section */}
                                <div className={styles.guestSection}>
                                    {/* Color-Coded Stats Summary Grid */}
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

                                    <div className={styles.sectionDivider} />

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
                                                    placeholder="Search guests by name..."
                                                    className={styles.searchInput}
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    aria-label="Search guests by name"
                                                />
                                                {searchQuery && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSearchQuery('')}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '0.85rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#94A3B8',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: '4px',
                                                            borderRadius: '50%',
                                                        }}
                                                        title="Clear search"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <button className={styles.exportBtn} onClick={handleDownloadExcel}>
                                                <Download size={16} />
                                                <span>Download List</span>
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
                    })()}
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
