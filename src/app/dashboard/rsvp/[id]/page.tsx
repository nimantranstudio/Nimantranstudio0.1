'use client';

import { useRouter, useParams } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { formatDisplayDate } from '@/lib/format-date';
import { ArrowLeft, Calendar, MapPin, Download, Share2, Search, X } from 'lucide-react';
import styles from './guest-list.module.css';
import { useMemo, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

interface RSVPEntry {
    id: string;
    guestName: string;
    status: string;
    adultCount: number;
    childCount: number;
    phone?: string;
    dietary?: string;
}

export default function GuestListPage() {
    const router = useRouter();
    const params = useParams();
    const { formData, lastSavedWeddingId } = useWeddingStore();

    const eventId = params.id as string;
    const event = formData.events.find(e => e.id === eventId);

    const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!lastSavedWeddingId) return;
        setLoading(true);
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
                setLoading(false);
            }
        };
        fetchRsvps();
    }, [lastSavedWeddingId]);

    const stats = useMemo(() => ({
        totalAttending: rsvps
            .filter(r => r.status === 'attending')
            .reduce((sum, r) => sum + (r.adultCount || 1), 0),
        responses: rsvps.length,
        notAttending: rsvps.filter(r => r.status === 'declined').length,
        confirmedVeg: rsvps
            .filter(r => r.status === 'attending' && r.dietary === 'VEG')
            .reduce((sum, r) => sum + (r.adultCount || 1), 0),
    }), [rsvps]);

    const filteredRsvps = (rsvps || []).filter(r => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        const name = (r.guestName || (r as any).name || '').toLowerCase();
        const phone = (r.phone || '').toLowerCase();
        const status = (r.status || '').toLowerCase();
        return name.includes(query) || phone.includes(query) || status.includes(query);
    });

    const handleWhatsAppShare = () => {
        const summary =
            `*Wedding RSVP Summary: ${event?.name || 'My Wedding'}*\n\n` +
            `✅ *Attending:* ${stats.totalAttending}\n` +
            `❌ *Not Attending:* ${stats.notAttending}\n` +
            `🍲 *Veg Meals:* ${stats.confirmedVeg}\n` +
            `📝 *Total Responses:* ${stats.responses}\n\n` +
            `_Generated via NimantranStudio_`;
        window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank');
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
                'Dietary': r.dietary || '-',
                'Phone': r.phone || '-',
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            worksheet['!cols'] = [
                { wch: 6 },
                { wch: 22 },
                { wch: 14 },
                { wch: 10 },
                { wch: 10 },
                { wch: 18 },
                { wch: 16 },
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest List');
            const eventSlug = (event?.name || 'wedding').replace(/\s+/g, '_').toLowerCase();
            XLSX.writeFile(workbook, `${eventSlug}_guest_list.xlsx`);
        } catch (err) {
            console.error('Error exporting Excel file:', err);
        }
    };

    if (!event) {
        return <div className={styles.container}>Event not found</div>;
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                            <ArrowLeft size={28} color="#1B5E20" />
                        </button>
                        <h1 className={styles.title}>{event.name}</h1>
                    </div>
                    <div className={styles.eventMeta}>
                        <div className={styles.metaItem}>
                            <Calendar size={16} />
                            <span>{formatDisplayDate(event.date) || 'Date TBD'}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <MapPin size={16} />
                            <span>{event.venue || 'Venue TBD'}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>TOTAL ATTENDING</div>
                        <div className={styles.statValue}>{stats.totalAttending}</div>
                        <div className={styles.statDesc}>Confirmed Guests</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>RESPONSES</div>
                        <div className={styles.statValue}>{stats.responses}</div>
                        <div className={styles.statDesc}>Total Forms Submitted</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>VEG PREFERENCE</div>
                        <div className={styles.statValue}>{stats.confirmedVeg}</div>
                        <div className={styles.statDesc}>Confirmed Veg Meals</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>NOT ATTENDING</div>
                        <div className={styles.statValue}>{stats.notAttending}</div>
                        <div className={styles.statDesc}>Regret Submissions</div>
                    </div>
                </div>

                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.listTitle}>Guest List</h2>
                        <div className={styles.tableControls}>
                            <div className={styles.searchContainer} style={{ position: 'relative' }}>
                                <Search className={styles.searchIcon} size={16} />
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
                            <button onClick={handleWhatsAppShare} className={styles.btnWhatsapp}>
                                <Share2 size={16} />
                                Copy for WhatsApp
                            </button>
                            <button onClick={handleDownloadExcel} className={styles.btnExport}>
                                <Download size={16} />
                                Download List
                            </button>
                        </div>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>GUEST NAME</th>
                                <th>STATUS</th>
                                <th>ADULTS</th>
                                <th>DIETARY</th>
                                <th>PHONE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>Loading responses...</td>
                                </tr>
                            ) : filteredRsvps.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
                                        {rsvps.length === 0 ? "No guests have RSVP'd yet." : 'No matching guests found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredRsvps.map(r => {
                                    const statusClass =
                                        r.status === 'attending' ? styles.statusYes
                                        : r.status === 'declined' ? styles.statusNo
                                        : styles.statusPending;
                                    const statusLabel =
                                        r.status === 'attending' ? 'YES'
                                        : r.status === 'declined' ? 'NO'
                                        : r.status === 'maybe' ? 'MAYBE'
                                        : 'PENDING';

                                    return (
                                        <tr key={r.id}>
                                            <td className={styles.guestName}>{r.guestName}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${statusClass}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td className={styles.pax}>{r.adultCount || 1}</td>
                                            <td className={styles.dietary}>{r.dietary || '-'}</td>
                                            <td>{r.phone || '-'}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
