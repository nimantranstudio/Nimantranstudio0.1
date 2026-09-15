import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RevenueChart } from '../RevenueChart';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 30;
// The chart's own window — independent of the paginated list below it, so
// paging through older payments never changes what the chart shows.
const CHART_DAYS = 30;

export default async function RevenuePage({ searchParams }: { searchParams: Promise<{ page?: string; filter?: string }> | { page?: string; filter?: string } }) {
    const params = await searchParams;
    // Defaults to "week" — same reasoning as active-weddings defaulting to
    // "today": avoid rendering the full history (and its per-day grouping
    // work) on every load as order volume grows. "All Time" is one click away.
    const filter = params?.filter || 'week';
    const page = Math.max(1, parseInt(params?.page || '1', 10) || 1);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start of week
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let dateFilter = {};
    if (filter === 'today') dateFilter = { gte: startOfDay };
    else if (filter === 'week') dateFilter = { gte: startOfWeek };
    else if (filter === 'month') dateFilter = { gte: startOfMonth };
    const whereClause = filter !== 'all' ? { createdAt: dateFilter } : {};

    const [allOrders, pagedOrders] = await Promise.all([
        // Lightweight — just the two columns the chart needs — and unconditional
        // (never date-filtered) so the chart's own 30-day window and the filter
        // tab counts below both come from one full scan instead of five queries.
        prisma.order.findMany({ select: { totalAmount: true, createdAt: true } }),
        // The filtered, paginated list that Payment History actually renders.
        prisma.order.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            select: {
                totalAmount: true,
                createdAt: true,
                paymentMethod: true,
                contactPhone: true,
                bundle: { select: { BundleName: true } }
            }
        })
    ]);

    const revenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const countToday = allOrders.filter((o) => o.createdAt >= startOfDay).length;
    const countWeek = allOrders.filter((o) => o.createdAt >= startOfWeek).length;
    const countMonth = allOrders.filter((o) => o.createdAt >= startOfMonth).length;
    const countAll = allOrders.length;
    const totalForFilter = filter === 'today' ? countToday : filter === 'week' ? countWeek : filter === 'month' ? countMonth : countAll;
    const totalPages = Math.max(1, Math.ceil(totalForFilter / PAGE_SIZE));

    const getFilterStyle = (currentFilter: string) => ({
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: '500' as const,
        textDecoration: 'none',
        background: filter === currentFilter ? '#1A1A1A' : '#F3F4F6',
        color: filter === currentFilter ? 'white' : '#4B5563'
    });

    const filterTabs = (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link href="?filter=all" style={getFilterStyle('all')}>All Time ({countAll})</Link>
            <Link href="?filter=today" style={getFilterStyle('today')}>Today ({countToday})</Link>
            <Link href="?filter=week" style={getFilterStyle('week')}>This Week ({countWeek})</Link>
            <Link href="?filter=month" style={getFilterStyle('month')}>This Month ({countMonth})</Link>
        </div>
    );

    const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const byDay = new Map<string, { amount: number; count: number }>();
    for (const o of allOrders) {
        const key = dayKey(o.createdAt);
        const entry = byDay.get(key) || { amount: 0, count: 0 };
        entry.amount += o.totalAmount;
        entry.count += 1;
        byDay.set(key, entry);
    }
    const revenueByDay = Array.from(byDay.entries())
        .map(([date, v]) => ({ date, amount: v.amount, count: v.count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-CHART_DAYS);

    const recentPayments = pagedOrders.map((o) => ({
        date: o.createdAt.toISOString(),
        amount: o.totalAmount,
        bundleName: o.bundle?.BundleName || 'Unknown Bundle',
        paymentMethod: o.paymentMethod,
        contactPhone: o.contactPhone
    }));

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: 0 }}>Revenue & Payments</h1>
                <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>₹{revenue.toLocaleString('en-IN')} all-time · {countAll} order{countAll === 1 ? '' : 's'}</span>
            </div>

            <RevenueChart revenueByDay={revenueByDay} recentPayments={recentPayments} windowDays={CHART_DAYS} historyFilterTabs={filterTabs} />

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <Link
                        href={`?filter=${filter}&page=${page - 1}`}
                        aria-disabled={page <= 1}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            textDecoration: 'none',
                            background: '#F3F4F6',
                            color: page <= 1 ? '#D1D5DB' : '#4B5563',
                            pointerEvents: page <= 1 ? 'none' : 'auto'
                        }}
                    >
                        Previous
                    </Link>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Page {page} of {totalPages}
                    </span>
                    <Link
                        href={`?filter=${filter}&page=${page + 1}`}
                        aria-disabled={page >= totalPages}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            textDecoration: 'none',
                            background: '#F3F4F6',
                            color: page >= totalPages ? '#D1D5DB' : '#4B5563',
                            pointerEvents: page >= totalPages ? 'none' : 'auto'
                        }}
                    >
                        Next
                    </Link>
                </div>
            )}
        </div>
    );
}
