'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
    Users,
    UserPlus,
    MessageSquare,
    Copy,
    ExternalLink,
    CheckCircle,
    XCircle,
    Share2
} from 'lucide-react';
import styles from './dashboard-wedding.module.css';
import dashboardStyles from '../dashboard.module.css';
import { clsx } from 'clsx';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

interface RSVP {
    id: string;
    guestName: string;
    adultCount: number;
    childCount: number;
    attending: boolean;
    message: string | null;
    createdAt: string;
}

export default function DashboardPage() {
    const { weddingId } = useParams();
    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchRSVPs = async () => {
            try {
                await auth.authStateReady();
                const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
                const response = await fetch(`/api/rsvp/${weddingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setRsvps(data.rsvps);
                }
            } catch (error) {
                console.error('Failed to fetch RSVPs:', error);
            } finally {
                setLoading(false);
            }
        };

        if (weddingId) fetchRSVPs();
    }, [weddingId]);

    const stats = rsvps.reduce((acc, rsvp) => {
        if (rsvp.attending) {
            acc.attending += 1;
            acc.adults += rsvp.adultCount;
            acc.children += rsvp.childCount;
        } else {
            acc.regrets += 1;
        }
        return acc;
    }, { attending: 0, regrets: 0, adults: 0, children: 0 });

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/${weddingId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className={styles.loading}>Loading your dashboard...</div>;

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <DashboardSidebar />
            
            <main className={dashboardStyles.main}>
                <header className={dashboardStyles.header}>
                    <h1 className={dashboardStyles.title}>Guest Management</h1>
                    <div className={styles.shareBox}>
                        <div className={styles.shareInput}>
                            <input readOnly value={shareUrl} />
                            <button onClick={copyToClipboard} className={styles.copyBtn}>
                                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied' : 'Copy Link'}
                            </button>
                        </div>
                        <a
                            href={`https://wa.me/?text=We'd love to have you at our wedding! Please RSVP here: ${shareUrl}`}
                            target="_blank"
                            className={styles.waBtn}
                        >
                            <Share2 size={16} /> WhatsApp
                        </a>
                    </div>
                </header>

                <div className={styles.statsGrid}>
                    <StatCard icon={<Users size={20} />} label="Total Attending" value={stats.attending + " Responses"} />
                    <StatCard icon={<UserPlus size={20} />} label="Total Headcount" value={stats.adults + stats.children} />
                    <StatCard icon={<Users size={20} />} label="Adults / Children" value={`${stats.adults} / ${stats.children}`} />
                    <StatCard icon={<XCircle size={20} />} label="Total Regrets" value={stats.regrets} color="danger" />
                </div>

            <section className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <h2>Recent Responses</h2>
                    <div className={styles.badge}>{rsvps.length} Total</div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>GUEST NAME</th>
                                <th>STATUS</th>
                                <th>ADULTS</th>
                                <th>CHILDREN</th>
                                <th>DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rsvps.map((rsvp) => (
                                <tr key={rsvp.id}>
                                    <td className={styles.guestName}><strong>{rsvp.guestName}</strong></td>
                                    <td>
                                        <span className={rsvp.attending ? styles.statusYes : styles.statusNo}>
                                            {rsvp.attending ? 'Attending' : 'Regret'}
                                        </span>
                                    </td>
                                    <td className={styles.paxCell}>{rsvp.attending ? rsvp.adultCount : '-'}</td>
                                    <td className={styles.paxCell}>{rsvp.attending ? rsvp.childCount : '-'}</td>
                                    <td className={styles.dateCell}>
                                        {new Date(rsvp.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </td>
                                </tr>
                            ))}
                            {rsvps.length === 0 && (
                                <tr>
                                    <td colSpan={5} className={styles.empty}>No responses yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: any, color?: string }) {
    return (
        <div className={styles.statCard}>
            <div className={clsx(styles.statIcon, color === 'danger' ? styles.statIconDanger : styles.statIconPrimary)}>
                {icon}
            </div>
            <div className={styles.statInfo}>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
            </div>
        </div>
    );
}
