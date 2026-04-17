import { prisma } from '@/lib/prisma';
import styles from './rsvp.module.css';
import { RSVPForm } from './RSVPForm';

export const dynamic = 'force-dynamic';

export default async function RSVPPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    // Fetch the wedding from the database
    let wedding = null;
    try {
        wedding = await prisma.wedding.findFirst({
            where: { id },
            include: { events: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (e) {
        console.error('Database connection error in /rsvp/[id]:', e);
    }

    if (!wedding) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', color: '#6b7280' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Invitation not found</p>
                    <p style={{ fontSize: '0.875rem' }}>This link may be invalid or has expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <RSVPForm wedding={wedding} />
        </div>
    );
}
