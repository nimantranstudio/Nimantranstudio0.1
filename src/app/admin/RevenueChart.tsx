'use client';

import { useState } from 'react';

interface DayRevenue {
    date: string; // "YYYY-MM-DD", IST calendar day
    amount: number;
    count: number;
}

interface Payment {
    date: string; // ISO datetime
    amount: number;
    bundleName: string;
    paymentMethod: string | null;
    contactPhone: string | null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Parsed from the "YYYY-MM-DD" key directly (no Date object) so the label
// always matches the IST calendar day the backend already bucketed by,
// regardless of the viewer's own browser timezone.
function formatDayLabel(dateStr: string): string {
    const [, m, d] = dateStr.split('-').map(Number);
    return `${d} ${MONTHS[m - 1]}`;
}

function roundedTick(max: number): number {
    if (max <= 0) return 0;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / magnitude) * magnitude;
}

export function RevenueChart({ revenueByDay, recentPayments, windowDays = 14, historyFilterTabs }: { revenueByDay: DayRevenue[]; recentPayments: Payment[]; windowDays?: number; historyFilterTabs?: React.ReactNode }) {
    const [hovered, setHovered] = useState<number | null>(null);

    const total = revenueByDay.reduce((sum, d) => sum + d.amount, 0);
    const maxAmount = Math.max(0, ...revenueByDay.map((d) => d.amount));
    const yTick = roundedTick(maxAmount);
    const peakIndex = revenueByDay.reduce((best, d, i) => (d.amount > (revenueByDay[best]?.amount ?? -1) ? i : best), 0);

    // Group the flat, newest-first payment list into IST day buckets. A Map
    // preserves insertion order, so groups stay newest-first without re-sorting.
    const groups = new Map<string, Payment[]>();
    for (const p of recentPayments) {
        const key = new Date(p.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(p);
    }

    return (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Revenue by day */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #E5E0D8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}>Revenue — Last {windowDays} Days</h2>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>₹{total.toLocaleString('en-IN')} total</span>
                </div>

                {revenueByDay.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem 0' }}>No payments in this window.</div>
                ) : (
                    <div style={{ position: 'relative' }}>
                        {yTick > 0 && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '1px dashed #E5E7EB', fontSize: '0.7rem', color: '#9CA3AF' }}>
                                <span style={{ position: 'relative', top: '-9px', background: 'white', paddingRight: '0.4rem' }}>
                                    ₹{yTick.toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '180px', borderBottom: '1px solid #E5E0D8', paddingTop: '1.25rem' }}>
                            {revenueByDay.map((d, i) => {
                                const heightPct = yTick > 0 ? Math.max((d.amount / yTick) * 100, d.amount > 0 ? 3 : 0) : 0;
                                const isPeak = i === peakIndex && d.amount > 0;
                                return (
                                    <div
                                        key={d.date}
                                        onMouseEnter={() => setHovered(i)}
                                        onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                                        style={{ flex: 1, maxWidth: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', cursor: 'default' }}
                                    >
                                        {isPeak && (
                                            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#1A1A1A', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>
                                                ₹{d.amount.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                        {hovered === i && (
                                            <div style={{
                                                position: 'absolute', bottom: 'calc(100% + 6px)', background: '#1A1A1A', color: 'white',
                                                padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 10,
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                                            }}>
                                                {formatDayLabel(d.date)}: ₹{d.amount.toLocaleString('en-IN')} · {d.count} payment{d.count === 1 ? '' : 's'}
                                            </div>
                                        )}
                                        <div style={{
                                            width: '100%',
                                            height: `${heightPct}%`,
                                            minHeight: d.amount > 0 ? '3px' : 0,
                                            background: hovered === i || isPeak ? '#D4A373' : '#E1A639',
                                            borderRadius: '4px 4px 0 0',
                                            transition: 'background 0.15s'
                                        }} />
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '0.5rem' }}>
                            {revenueByDay.map((d) => (
                                <div key={d.date} style={{ flex: 1, maxWidth: '28px', textAlign: 'center', fontSize: '0.65rem', color: '#9CA3AF' }}>
                                    {formatDayLabel(d.date)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Payment history, grouped by day */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E0D8', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', padding: '1.5rem 2rem 1rem', borderBottom: '1px solid #E5E0D8' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}>Payment History</h2>
                    {historyFilterTabs}
                </div>

                {groups.size === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem' }}>No payments found for the selected time period.</div>
                ) : (
                    Array.from(groups.entries()).map(([day, payments]) => {
                        const dayTotal = payments.reduce((sum, p) => sum + p.amount, 0);
                        return (
                            <div key={day}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 2rem', background: '#F9FAFB', fontSize: '0.8rem', fontWeight: '600', color: '#4B5563' }}>
                                    <span>{formatDayLabel(day)}</span>
                                    <span>₹{dayTotal.toLocaleString('en-IN')} · {payments.length} payment{payments.length === 1 ? '' : 's'}</span>
                                </div>
                                {payments.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 2rem', borderBottom: '1px solid #F3F1EC', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', color: '#4B5563' }}>
                                            <span style={{ color: '#9CA3AF', minWidth: '58px' }}>
                                                {new Date(p.date).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' })}
                                            </span>
                                            <span style={{ color: '#1A1A1A' }}>{p.bundleName}</span>
                                            {p.paymentMethod && <span style={{ color: '#9CA3AF', textTransform: 'uppercase', fontSize: '0.7rem', alignSelf: 'center' }}>{p.paymentMethod}</span>}
                                            {p.contactPhone && <span style={{ color: '#9CA3AF' }}>{p.contactPhone}</span>}
                                        </div>
                                        <span style={{ fontWeight: '600', color: '#1A1A1A' }}>₹{p.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
