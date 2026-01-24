'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { LogOut, ArrowLeft, Calendar, MapPin, Download, Share2, Search } from 'lucide-react';
import styles from './guest-list.module.css';
import dashboardStyles from '../../dashboard.module.css';
import { useMemo, useState } from 'react';

export default function GuestListPage() {
    const router = useRouter();
    const params = useParams();
    const { logout, formData } = useWeddingStore();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // 1. Find the event
    const eventId = params.id;
    const event = formData.events.find(e => e.id === eventId);

    // Safely access guest list
    const guests = event?.guests || [];

    // 2. Calculate Stats
    const stats = useMemo(() => {
        let totalAttending = 0;
        let responses = 0;
        let confirmedVeg = 0;
        let notAttending = 0;

        guests.forEach(guest => {
            if (guest.status !== 'pending') {
                responses++;
            }

            if (guest.status === 'attending') {
                const pax = 1 + (guest.companions || 0);
                totalAttending += pax;

                if (guest.dietary === 'VEG') {
                    confirmedVeg += pax;
                }
            } else if (guest.status === 'declined') {
                notAttending++;
            }
        });

        return { totalAttending, responses, confirmedVeg, notAttending };
    }, [guests]);

    // 3. Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Filter logic
    const filteredGuests = guests.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.phone && g.phone.includes(searchQuery))
    );

    // 4. Actions
    const handleWhatsAppShare = () => {
        const summary = `*Wedding RSVP Summary: ${event?.name || 'My Wedding'}*\n\n` +
            `✅ *Attending:* ${stats.totalAttending}\n` +
            `❌ *Not Attending:* ${stats.notAttending}\n` +
            `🍲 *Veg Meals:* ${stats.confirmedVeg}\n` +
            `📝 *Total Responses:* ${stats.responses}\n\n` +
            `_Generated via NimantranStudio_`;

        const encodedSummary = encodeURIComponent(summary);
        window.open(`https://wa.me/?text=${encodedSummary}`, '_blank');
    };

    const handleExportCSV = () => {
        if (!event) return;

        const headers = ['Guest Name', 'Status', 'Counts', 'Dietary', 'Phone', 'Companions'];
        const rows = guests.map(g => [
            g.name,
            g.status,
            (1 + (g.companions || 0)).toString(),
            g.dietary || '-',
            g.phone || '-',
            (g.companions || 0).toString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}_guests.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!event) {
        return <div className={styles.container}>Event not found</div>;
    }

    return (
        <div className={styles.container}>
            {/* Sidebar Reuse */}
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
                            <span>{event.date || 'Date TBD'}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <MapPin size={16} />
                            <span>{event.venue || 'Venue TBD'}</span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>
                            TOTAL ATTENDING
                            <span style={{ opacity: 0.5 }}>👥</span>
                        </div>
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

                {/* Guest List Table */}
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.listTitle}>Guest List</h2>

                        <div className={styles.tableControls}>
                            <div className={styles.searchContainer}>
                                <Search className={styles.searchIcon} size={16} />
                                <input
                                    type="text"
                                    placeholder="Search guests..."
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <button onClick={handleWhatsAppShare} className={styles.btnWhatsapp}>
                                <Share2 size={16} />
                                Copy for WhatsApp
                            </button>

                            <button onClick={handleExportCSV} className={styles.btnExport}>
                                <Download size={16} />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>GUEST NAME</th>
                                <th>STATUS</th>
                                <th>COUNTS</th>
                                <th>DIETARY</th>
                                <th>PHONE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
                                        {guests.length === 0 ? "No guests have RSVP'd yet." : "No matching guests found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => {
                                    const pax = 1 + (guest.companions || 0);

                                    let statusBadgeClass = styles.statusPending;
                                    let statusLabel = 'PENDING';
                                    if (guest.status === 'attending') {
                                        statusBadgeClass = styles.statusYes;
                                        statusLabel = 'YES';
                                    } else if (guest.status === 'declined') {
                                        statusBadgeClass = styles.statusNo;
                                        statusLabel = 'NO';
                                    }

                                    return (
                                        <tr key={guest.id}>
                                            <td className={styles.guestName}>{guest.name}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${statusBadgeClass}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td className={styles.pax}>{params.id === 'demo' ? 4 : pax}</td>
                                            <td className={styles.dietary}>{guest.dietary || '-'}</td>
                                            <td>{guest.phone || '-'}</td>
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
