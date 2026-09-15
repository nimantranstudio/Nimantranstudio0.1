import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DeleteWeddingButton } from './DeleteWeddingButton';

// "9/15/2026, 5:42 PM" — date alone made it hard to tell rapid-fire test
// weddings apart (several created within the same minute).
const formatCreatedAt = (date: Date) =>
    date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export const dynamic = 'force-dynamic';

// Was previously an unbounded findMany — with ~7,900 wedding rows in the DB,
// each pulled in with a deep owner→orders→bundle + rsvps + theme include, that
// rendered every row on one page and made the page effectively never finish
// loading. Page it like any admin list of this size.
const PAGE_SIZE = 20;

export default async function ActiveWeddingsPage({ searchParams }: { searchParams: Promise<{ filter?: string; page?: string }> | { filter?: string; page?: string } }) {
    const params = await searchParams;
    // Defaults to "today" — this list has held thousands of rows before (see
    // the pagination note above); opening straight into "All Time" is the
    // slow, overwhelming path. An admin can still click over to it.
    const filter = params?.filter || 'today';
    const page = Math.max(1, parseInt(params?.page || '1', 10) || 1);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start of week
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let dateFilter = {};
    if (filter === 'today') {
        dateFilter = { gte: startOfDay };
    } else if (filter === 'week') {
        dateFilter = { gte: startOfWeek };
    } else if (filter === 'month') {
        dateFilter = { gte: startOfMonth };
    }

    const whereClause = filter !== 'all' ? { createdAt: dateFilter } : {};

    const [weddings, countToday, countWeek, countMonth, countAll] = await Promise.all([
        prisma.wedding.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            include: {
                owner: {
                    include: {
                        orders: {
                            include: {
                                bundle: true
                            }
                        }
                    }
                },
                rsvps: true,
                theme: true
            }
        }),
        prisma.wedding.count({ where: { createdAt: { gte: startOfDay } } }),
        prisma.wedding.count({ where: { createdAt: { gte: startOfWeek } } }),
        prisma.wedding.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.wedding.count()
    ]);

    // The tab count that matches the currently active filter also happens to be
    // the total row count to paginate over — no extra query needed.
    const totalForFilter = filter === 'today' ? countToday : filter === 'week' ? countWeek : filter === 'month' ? countMonth : countAll;
    const totalPages = Math.max(1, Math.ceil(totalForFilter / PAGE_SIZE));

    const getFilterStyle = (currentFilter: string) => ({
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: '500',
        textDecoration: 'none',
        background: filter === currentFilter ? '#1A1A1A' : '#F3F4F6',
        color: filter === currentFilter ? 'white' : '#4B5563',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: 0 }}>
                    Active Weddings & Purchases
                </h1>
                
                {/* Date Filter */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href="?filter=all" style={getFilterStyle('all')}>All Time ({countAll})</Link>
                    <Link href="?filter=today" style={getFilterStyle('today')}>Today ({countToday})</Link>
                    <Link href="?filter=week" style={getFilterStyle('week')}>This Week ({countWeek})</Link>
                    <Link href="?filter=month" style={getFilterStyle('month')}>This Month ({countMonth})</Link>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E0D8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E0D8' }}>
                                {['Couple', 'Theme', 'Created', 'Owner', 'RSVPs', 'Purchase', ''].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#4B5563', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weddings.map((wedding, i) => {
                                const attendingGuests = wedding.rsvps
                                    .filter((r) => r.attending)
                                    .reduce((acc, rsvp) => acc + rsvp.adultCount + rsvp.childCount, 0);
                                // Only this wedding's own order(s) — an owner's *other* weddings each
                                // carry their own separate order via Order.weddingId. Previously this
                                // showed the owner's entire order history under every wedding they'd
                                // ever created, so one owner with several weddings saw the same full
                                // purchase list (and total) repeated identically on each one.
                                const weddingOrders = wedding.owner?.orders?.filter((order) => order.weddingId === wedding.id) || [];
                                const totalPurchases = weddingOrders.reduce((acc, order) => acc + order.totalAmount, 0);

                                return (
                                    <tr key={wedding.id} style={{ background: i % 2 === 1 ? '#FCFCFB' : 'white', borderBottom: '1px solid #F3F1EC' }}>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#1A1A1A' }}>
                                            {wedding.brideName} & {wedding.groomName}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{wedding.theme?.name || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{formatCreatedAt(new Date(wedding.createdAt))}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{wedding.owner?.email || wedding.owner?.mobileNumber || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>
                                            <span style={{ color: '#10B981', fontWeight: '500' }}>{attendingGuests}</span> attending • {wedding.rsvps.length} total
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', color: weddingOrders.length > 0 ? '#1A1A1A' : '#9CA3AF', fontWeight: weddingOrders.length > 0 ? '600' : '400', fontStyle: weddingOrders.length > 0 ? 'normal' : 'italic' }}>
                                            {weddingOrders.length > 0 ? `₹${totalPurchases}${weddingOrders.length > 1 ? ` (${weddingOrders.length})` : ''}` : 'None'}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <DeleteWeddingButton weddingId={wedding.id} coupleLabel={`${wedding.brideName} & ${wedding.groomName}`} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {weddings.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>
                        No active weddings found for the selected time period.
                    </div>
                )}
            </div>

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
                        Page {page} of {totalPages} ({totalForFilter} weddings)
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
