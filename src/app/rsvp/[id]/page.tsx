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
            include: {
                events: { include: { generatedCard: true } },
            },
        });

        if (wedding) {
            const title = `${wedding.groomName} & ${wedding.brideName} — Wedding Invitation`;

            // Prefer the main "Wedding" ceremony's venue/card over whichever
            // event happens to be first — that's the one guests care about.
            const mainEvent =
                wedding.events.find((e) => (e.eventType || e.name || '').toLowerCase().includes('wedding')) ||
                wedding.events[0];

            const description = mainEvent?.venue
                ? `Join us as ${wedding.groomName} & ${wedding.brideName} celebrate their wedding at ${mainEvent.venue}. RSVP online — Nimantran Studio.`
                : `You are joyfully invited to the wedding celebration of ${wedding.groomName} & ${wedding.brideName}. View event itinerary, venue location & RSVP online.`;

            // Use the couple's own rendered card when one exists — the actual
            // Wedding ceremony card specifically (the same event `mainEvent`
            // already resolved above), not whichever event's card happens to
            // exist first (that was landing on "Save the Date" in practice,
            // since it's created before "Wedding" in the event list). Only
            // falls back to another event's card, then generic branding, if
            // the couple hasn't generated the Wedding card yet.
            const isImageUrl = (url?: string | null): url is string =>
                !!url && /\.(png|jpe?g|webp)(\?|$)/i.test(url);
            const cardImage =
                (isImageUrl(mainEvent?.generatedCard?.imageUrl) ? mainEvent.generatedCard.imageUrl : undefined) ||
                wedding.events.map((e) => e.generatedCard?.imageUrl).find(isImageUrl);
            const image = cardImage || '/og-image.png';

            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    type: 'website',
                    images: [image],
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [image],
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
