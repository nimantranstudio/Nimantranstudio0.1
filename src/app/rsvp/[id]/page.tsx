import { prisma } from '@/lib/prisma';
import styles from './rsvp.module.css';
import { RSVPForm } from './RSVPForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    try {
        const wedding = await prisma.wedding.findFirst({
            where: {
                OR: [{ id }, { slug: id }],
            },
        });

        if (wedding) {
            const title = `${wedding.groomName} & ${wedding.brideName}'s Wedding Invitation | Nimantran Studio`;
            const description = `You are joyfully invited to the wedding celebration of ${wedding.groomName} & ${wedding.brideName}. View event itinerary, venue location & RSVP online.`;

            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    type: 'website',
                    images: ['/og-image.png'],
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: ['/og-image.png'],
                },
            };
        }
    } catch (e) {
        console.error('Metadata fetch error in /rsvp/[id]:', e);
    }

    return {
        title: 'Wedding Invitation & RSVP | Nimantran Studio',
        description: 'Digital wedding invitation and online RSVP tracking.',
    };
}

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
            where: {
                OR: [{ id }, { slug: id }],
            },
            include: { events: true },
            orderBy: { createdAt: 'desc' },
        });
    } catch (e) {
        console.error('Database connection error in /rsvp/[id]:', e);
    }

    if (!wedding) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-sans)',
                    color: '#6b7280',
                    background: '#FDFBF7',
                }}
            >
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: '#1A1A1A', marginBottom: '0.5rem' }}>
                        Invitation Not Found
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>This invitation link may be invalid or has expired.</p>
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
