'use client';

import {
    ArrowLeft,
    Check,
    Download,
    Loader2,
    Sparkles,
    CheckCircle2,
    FileText,
    ChevronRight,
    CreditCard,
    Zap,
    LayoutDashboard,
    IndianRupee,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDisplayDate, formatDisplayTime } from '@/lib/format-date';
import dashboardStyles from '../dashboard.module.css';
import styles from './orders.module.css';

interface OrderSummary {
    id: string;
    status: string;
    totalAmount: number;
    paymentMethod: string | null;
    razorpayPaymentId: string | null;
    invoiceNumber: string | null;
    invoiceIssuedAt: string | null;
    createdAt: string;
    planName: string | null;
    bundleName: string | null;
    themeName: string | null;
    themeThumbnail: string | null;
    coupleNames: string | null;
}

function paidTimestamp(order: OrderSummary): { date: string; time: string } {
    const d = new Date(order.createdAt);
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return { date: formatDisplayDate(d), time: formatDisplayTime(time) };
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderSummary[] | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/orders')
            .then((res) => res.json())
            .then((data) => setOrders(data?.success ? data.orders : []))
            .catch(() => setOrders([]));
    }, []);

    const handleCopy = (value: string, id: string) => {
        navigator.clipboard.writeText(value);
        setCopiedId(id);
        setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
    };

    const handleDownloadInvoice = async (orderId: string) => {
        setDownloadError(null);
        setDownloadingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/invoice`);
            if (!res.ok) throw new Error('Could not generate the invoice right now.');
            const blob = await res.blob();
            const disposition = res.headers.get('Content-Disposition') || '';
            const match = /filename="([^"]+)"/.exec(disposition);
            const filename = match?.[1] || 'invoice.pdf';

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            setDownloadError(err?.message || 'Could not download the invoice. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    const latest = orders?.[0];
    const history = orders?.slice(1) || [];

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <main className={dashboardStyles.main}>
                <div className={styles.header}>
                    <button onClick={() => router.back()} className={styles.backBtn}>
                        <ArrowLeft size={20} />
                        <span>Payment Details</span>
                    </button>
                </div>

                <div className={styles.content}>
                    {orders === null && (
                        <div className={styles.detailsCard}>
                            <p className={styles.planSub}>Loading your payment details…</p>
                        </div>
                    )}

                    {orders !== null && !latest && (
                        <div className={styles.detailsCard}>
                            <h3 className={styles.sectionTitleSmall}>No payments yet</h3>
                            <p className={styles.planSub} style={{ marginTop: '0.5rem' }}>
                                Once you complete a purchase, your receipt and tax invoice will show up here.
                            </p>
                        </div>
                    )}

                    {latest && (
                        <>
                            {/* 1. Recreated Equal 50/50 Split Payment Successful Card (UI/UX Pro Max) */}
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                border: '1px solid rgba(0, 0, 0, 0.07)',
                                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
                                padding: '2.25rem',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '2.5rem',
                                alignItems: 'stretch',
                                marginBottom: '2.5rem'
                            }}>
                                {/* Left Column: Celebration & Action Buttons (50%) */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '0.75rem 1rem' }}>
                                    {/* Glowing Brand Gold Checkmark Badge */}
                                    <div style={{
                                        width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.25rem',
                                        background: 'radial-gradient(circle, rgba(200, 169, 81, 0.2) 0%, rgba(200, 169, 81, 0.03) 100%)',
                                        border: '1px solid rgba(200, 169, 81, 0.35)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                        boxShadow: '0 8px 24px rgba(200, 169, 81, 0.15)'
                                    }}>
                                        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #C8A951 0%, #B4933E 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(180, 147, 62, 0.3)' }}>
                                            <Check size={24} strokeWidth={2.8} />
                                        </div>
                                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', fontSize: '0.85rem' }}>✨</span>
                                        <span style={{ position: 'absolute', bottom: '-2px', left: '-4px', fontSize: '0.75rem' }}>✦</span>
                                    </div>

                                    <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2rem', color: '#111827', margin: 0, lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.02em' }}>
                                        Payment Successful!
                                    </h1>

                                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#6B7280', fontWeight: 500, letterSpacing: '0.01em' }}>
                                        {paidTimestamp(latest).date} • {paidTimestamp(latest).time}
                                    </p>

                                    <p style={{ margin: '1.25rem 0 0.25rem', fontFamily: 'var(--font-serif, serif)', fontSize: '1.1rem', color: '#111827', fontWeight: 600, lineHeight: 1.3 }}>
                                        {latest.planName || 'WhatsApp Essentials'} Activated 🎊
                                    </p>

                                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: '#6B7280', maxWidth: '300px' }}>
                                        All your wedding invites and RSVP tools are ready to use.
                                    </p>

                                    {/* Action Buttons with Primary Theme Colors */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '280px', marginTop: '1.75rem', alignItems: 'center' }}>
                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            style={{
                                                width: '100%',
                                                background: 'linear-gradient(135deg, #ECC878 0%, #D4AF37 100%)',
                                                color: '#111111',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '0.85rem 1.5rem',
                                                fontSize: '0.925rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.32)',
                                                transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 160ms ease-out'
                                            }}
                                        >
                                            <span>Go to My Dashboard</span>
                                            <ChevronRight size={16} />
                                        </button>

                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#9E7D2B',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                padding: '0.35rem 0.75rem'
                                            }}
                                        >
                                            <span>View Invitation Suite</span>
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Right Column: Payment Details Box (50%) */}
                                <div style={{ background: '#FAFBFB', borderRadius: '20px', border: '1px solid #F3F4F6', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                                    <div style={{ padding: '1.65rem 1.65rem 1.25rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 1.25rem 0', letterSpacing: '-0.01em' }}>
                                            Payment Details
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.05rem' }}>
                                            {/* Amount Paid */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                                                        <IndianRupee size={15} />
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Amount Paid</span>
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, color: '#B4933E' }}>
                                                    ₹{latest.totalAmount.toLocaleString('en-IN')}
                                                </span>
                                            </div>

                                            {/* Receipt No */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                                                        <FileText size={15} />
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Receipt No.</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937' }}>
                                                        {latest.invoiceNumber || 'NS/2026-27/0001'}
                                                    </span>
                                                    {latest.invoiceNumber && (
                                                        <button 
                                                            onClick={() => handleCopy(latest.invoiceNumber!, latest.id)}
                                                            style={{
                                                                background: '#FFFFFF',
                                                                border: '1px solid #D1D5DB',
                                                                borderRadius: '6px',
                                                                padding: '0.15rem 0.5rem',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 600,
                                                                color: copiedId === latest.id ? '#B4933E' : '#4B5563',
                                                                cursor: 'pointer',
                                                                transition: 'all 160ms ease-out'
                                                            }}
                                                        >
                                                            {copiedId === latest.id ? 'Copied' : 'Copy'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Plan */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                                                        <Zap size={15} />
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Plan</span>
                                                </div>
                                                <span style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid rgba(217, 119, 6, 0.2)', padding: '0.2rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
                                                    {latest.planName || 'WhatsApp Essentials'}
                                                </span>
                                            </div>

                                            {/* Validity */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                                                        <CheckCircle2 size={15} />
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Validity</span>
                                                </div>
                                                <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.2rem 0.75rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600 }}>
                                                    Lifetime Access
                                                </span>
                                            </div>

                                            {/* Theme Purchased */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                                                        <LayoutDashboard size={15} />
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Theme Purchased</span>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937' }}>
                                                    {latest.themeName || latest.bundleName || 'Suvarna Sohala'}
                                                </span>
                                            </div>

                                            {/* Payment Method */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                                                        <CreditCard size={15} />
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Payment Method</span>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9CA3AF' }}>
                                                    {latest.paymentMethod ? latest.paymentMethod.toUpperCase() : '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Download Receipt PDF Strip */}
                                    <button
                                        onClick={() => handleDownloadInvoice(latest.id)}
                                        disabled={downloadingId === latest.id}
                                        style={{
                                            background: 'linear-gradient(180deg, #FAF8F2 0%, #F5EFE0 100%)',
                                            border: 'none',
                                            borderTop: '1px solid #EBE4D2',
                                            padding: '0.95rem',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: '#9E7D2B',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'background-color 160ms ease-out'
                                        }}
                                    >
                                        {downloadingId === latest.id ? (
                                            <Loader2 size={16} className={styles.spin} />
                                        ) : (
                                            <Download size={16} />
                                        )}
                                        <span>Download Receipt (PDF)</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2b. Past Payments */}
                            {history.length > 0 && (
                                <div className={styles.detailsCard}>
                                    <h3 className={styles.sectionTitleSmall} style={{ marginBottom: '1.25rem' }}>
                                        Payment History
                                    </h3>
                                    <div className={styles.historyList}>
                                        {history.map((order) => {
                                            const { date } = paidTimestamp(order);
                                            return (
                                                <div key={order.id} className={styles.historyRow}>
                                                    <FileText size={16} className={styles.kitCheck} />
                                                    <div className={styles.historyMeta}>
                                                        <span className={styles.historyTitle}>
                                                            {order.planName || 'Wedding Suite'}
                                                        </span>
                                                        <span className={styles.historySub}>
                                                            {date} · ₹{order.totalAmount.toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className={styles.historyDownloadBtn}
                                                        onClick={() => handleDownloadInvoice(order.id)}
                                                        disabled={downloadingId === order.id}
                                                    >
                                                        {downloadingId === order.id ? (
                                                            <Loader2 size={14} className={styles.spin} />
                                                        ) : (
                                                            <Download size={14} />
                                                        )}
                                                        Receipt
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 3. Communication Kit Section */}
                            <div className={styles.kitSection}>
                                <h2 className={styles.kitHeader}>
                                    <Sparkles className={styles.sparkleIcon} size={20} />
                                    Your Wedding Communication Kit
                                </h2>
                                <p className={styles.kitSub}>
                                    All assets created for your {latest.planName || 'Wedding Suite'} plan.
                                </p>

                                <div className={styles.kitCard}>
                                    <h3 className={styles.kitTitle}>What&apos;s Included</h3>
                                    <div className={styles.kitGrid}>
                                        <div className={styles.kitItem}>
                                            <Check className={styles.kitCheck} size={16} />
                                            Covers up to 7 wedding events
                                        </div>
                                        <div className={styles.kitItem}>
                                            <Check className={styles.kitCheck} size={16} />
                                            Unlimited WhatsApp sharing
                                        </div>
                                        <div className={styles.kitItem}>
                                            <Check className={styles.kitCheck} size={16} />
                                            Live RSVP guest tracking
                                        </div>
                                        <div className={styles.kitItem}>
                                            <Check className={styles.kitCheck} size={16} />
                                            Guest management dashboard
                                        </div>
                                        <div className={styles.kitItem}>
                                            <Check className={styles.kitCheck} size={16} />
                                            No watermark on final assets
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
