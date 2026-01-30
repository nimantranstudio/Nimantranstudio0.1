'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
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
import styles from '../dashboard.module.css';
import { clsx } from 'clsx';

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
                const response = await fetch(`/api/rsvp/${weddingId}`);
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

    const stats = useMemo(() => {
        return rsvps.reduce((acc, rsvp) => {
            if (rsvp.attending) {
                acc.attending += 1;
                acc.adults += rsvp.adultCount;
                acc.children += rsvp.childCount;
            } else {
                acc.regrets += 1;
            }
            return acc;
        }, { attending: 0, regrets: 0, adults: 0, children: 0 });
    }, [rsvps]);

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/${weddingId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className={styles.loading}>Loading your dashboard...</div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerTop}>
                        <h1 className={styles.title}>Guest Management</h1>
                        <div className={styles.shareBox}>
                            <span className={styles.shareLabel}>Your RSVP Link:</span>
                            <div className={styles.shareInput}>
                                <input readOnly value={shareUrl} />
                                <button onClick={copyToClipboard} className={styles.copyBtn}>
                                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                            <a
                                href={`https://wa.me/?text=We'd love to have you at our wedding! Please RSVP here: ${shareUrl}`}
                                target="_blank"
                                className={styles.waBtn}
                            >
                                <Share2 size={16} /> Share on WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        <StatCard icon={<Users size={24} />} label="Total Attending" value={stats.attending + " Responses"} />
                        <StatCard icon={<UserPlus size={24} />} label="Total Headcount" value={stats.adults + stats.children} />
                        <StatCard icon={<Users size={24} />} label="Adults / Children" value={`${stats.adults} / ${stats.children}`} />
                        <StatCard icon={<XCircle size={24} />} label="Total Regrets" value={stats.regrets} color="#E55B5B" />
                    </div>
                </div>
            </header>

            <main className="container">
                <section className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h2>Guest List</h2>
                        <div className={styles.badge}>{rsvps.length} Total Responses</div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Guest Name</th>
                                    <th>Status</th>
                                    <th>Adults</th>
                                    <th>Children</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rsvps.map((rsvp) => (
                                    <tr key={rsvp.id}>
                                        <td><strong>{rsvp.guestName}</strong></td>
                                        <td>
                                            <span className={rsvp.attending ? styles.statusYes : styles.statusNo}>
                                                {rsvp.attending ? 'Attending' : 'Regret'}
                                            </span>
                                        </td>
                                        <td>{rsvp.attending ? rsvp.adultCount : '-'}</td>
                                        <td>{rsvp.attending ? rsvp.childCount : '-'}</td>
                                        <td className={styles.messageCell}>
                                            {rsvp.message ? (
                                                <div className={styles.messageTooltip}>
                                                    <MessageSquare size={14} /> View Note
                                                    <span className={styles.tooltipText}>{rsvp.message}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className={styles.dateCell}>
                                            {new Date(rsvp.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {rsvps.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className={styles.empty}>No responses yet. Share your link to start collecting RSVPs!</td>
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
            <div className={clsx(styles.statIcon, color === '#E55B5B' ? styles.statIconDanger : styles.statIconPrimary)}>
                {icon}
            </div>
            <div>
                <div className={styles.statLabel}>{label}</div>
                <div className={styles.statValue}>{value}</div>
            </div>
        </div>
    );
}
