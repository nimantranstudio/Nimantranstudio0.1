import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ActiveWeddingsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> | { filter?: string } }) {
    const params = await searchParams;
    const filter = params?.filter || 'all';
    
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {weddings.map((wedding) => {
                    const totalGuests = wedding.rsvps.reduce((acc, rsvp) => acc + rsvp.adultCount + rsvp.childCount, 0);
                    const attendingRSVPs = wedding.rsvps.filter(r => r.attending);
                    const attendingGuests = attendingRSVPs.reduce((acc, rsvp) => acc + rsvp.adultCount + rsvp.childCount, 0);
                    const totalPurchases = wedding.owner?.orders?.reduce((acc, order) => acc + order.totalAmount, 0) || 0;

                    return (
                        <div key={wedding.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E0D8', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            
                            {/* Header */}
                            <div style={{ borderBottom: '1px solid #E5E0D8', paddingBottom: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1A1A1A', marginBottom: '0.5rem' }}>
                                        {wedding.brideName} & {wedding.groomName}
                                    </h2>
                                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                        Theme: {wedding.theme?.name || 'N/A'} • Created: {new Date(wedding.createdAt).toLocaleDateString()}
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        Owner: {wedding.owner?.name || 'N/A'} ({wedding.owner?.email || wedding.owner?.mobileNumber})
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {/* RSVP Section */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1A1A1A', marginBottom: '1rem' }}>RSVP Activity</h3>
                                    <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ color: '#4B5563' }}>Total RSVPs Received:</span>
                                            <span style={{ fontWeight: '500' }}>{wedding.rsvps.length}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ color: '#4B5563' }}>Attending Guests:</span>
                                            <span style={{ fontWeight: '500', color: '#10B981' }}>{attendingGuests}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#4B5563' }}>Total Guests (Inc. Pending/Not):</span>
                                            <span style={{ fontWeight: '500' }}>{totalGuests}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Purchases Section */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1A1A1A', marginBottom: '1rem' }}>Purchases (By Owner)</h3>
                                    {wedding.owner?.orders && wedding.owner.orders.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {wedding.owner.orders.map((order) => (
                                                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '500', color: '#1A1A1A' }}>{order.bundle?.BundleName || 'Unknown Bundle'}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                    <div style={{ fontWeight: '600', color: '#1A1A1A' }}>
                                                        ₹{order.totalAmount}
                                                    </div>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', marginTop: '0.5rem', borderTop: '1px solid #E5E7EB' }}>
                                                <span style={{ fontWeight: '600', color: '#4B5563' }}>Total Spent:</span>
                                                <span style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '1.1rem' }}>₹{totalPurchases}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#6b7280', fontStyle: 'italic', padding: '1rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                            No purchases found for this user.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    );
                })}

                {weddings.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px solid #E5E0D8' }}>
                        No active weddings found for the selected time period.
                    </div>
                )}
            </div>
        </div>
    );
}
