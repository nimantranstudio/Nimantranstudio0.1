import { prisma } from '@/lib/prisma';
import styles from './rsvp.module.css';
import { RSVPForm } from './RSVPForm';
import { PublishedWebsiteRenderer } from '@/website/components/PublishedWebsiteRenderer';
import { getWebsiteTemplate } from '@/website/templates/registry';
import type { WebsiteWedding } from '@/website/templates/types';
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
            const description = `Join us as ${wedding.groomName} & ${wedding.brideName} celebrate their wedding. Tap to view the full invitation, event details & RSVP online — Nimantran Studio.`;

            // Prefer the main "Wedding" ceremony's card over whichever event
            // happens to be first — that's the one guests care about.
            const mainEvent =
                wedding.events.find((e) => (e.eventType || e.name || '').toLowerCase().includes('wedding')) ||
                wedding.events[0];

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

            const toAbsoluteUrl = (url: string) => {
                if (/^https?:\/\//i.test(url)) return url;
                return `https://www.nimantranstudio.in${url.startsWith('/') ? '' : '/'}${url}`;
            };

            const image = toAbsoluteUrl(cardImage || '/og-image.png');
            const canonicalSlugOrId = wedding.slug || id;
            const rsvpUrl = `https://www.nimantranstudio.in/rsvp/${canonicalSlugOrId}`;

            return {
                title,
                description,
                alternates: {
                    canonical: rsvpUrl,
                },
                robots: {
                    index: false,
                    follow: true,
                },
                openGraph: {
                    title,
                    description,
                    url: rsvpUrl,
                    type: 'website',
                    siteName: 'Nimantran Studio',
                    locale: 'en_IN',
                    images: [
                        {
                            url: image,
                            width: 1200,
                            height: 630,
                            alt: `${wedding.groomName} & ${wedding.brideName} Wedding Invitation`,
                        },
                    ],
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
        openGraph: {
            title: 'Wedding Invitation & RSVP | Nimantran Studio',
            description: 'Digital wedding invitation and online RSVP tracking.',
            url: `https://www.nimantranstudio.in/rsvp/${id}`,
            siteName: 'Nimantran Studio',
            images: [{ url: 'https://www.nimantranstudio.in/og-image.png', width: 1200, height: 630 }],
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

const SAMPLE_PREVIEW_WEDDING = {
    id: 'demo-preview',
    slug: 'aarav-weds-ananya',
    ownerId: 'preview-owner',
    themeId: 'cmnkf7nv40000g2h3gyu2r9uq',
    groomName: 'Aarav',
    brideName: 'Ananya',
    groomParents: 'Mr. & Mrs. Sharma',
    brideParents: 'Mr. & Mrs. Kapoor',
    invitationMessage: 'Together with their families, Aarav & Ananya invite you to share in the joy of their wedding celebration.',
    rsvpContact: '+91 98765 43210',
    rsvpDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    events: [
        {
            id: 'evt_haldi',
            weddingId: 'demo-preview',
            name: 'Haldi Ceremony',
            eventType: 'Haldi',
            date: '27-12-2026',
            time: '10:30 AM',
            venue: 'The Courtyard Pavilion, Pune',
            mapLink: 'https://maps.google.com',
            description: 'Blessings of golden turmeric, marigold petals, and joyful laughter.',
            allowCompanions: true,
            collectDietary: true,
            rsvpDeadline: '2026-12-20',
        },
        {
            id: 'evt_mehendi',
            weddingId: 'demo-preview',
            name: 'Mehendi Ceremony',
            eventType: 'Mehendi',
            date: '27-12-2026',
            time: '04:00 PM',
            venue: 'The Royal Palms Resort, Pune',
            mapLink: 'https://maps.google.com',
            description: 'Hands full of mehendi, hearts full of love.',
            allowCompanions: true,
            collectDietary: true,
            rsvpDeadline: '2026-12-20',
        },
        {
            id: 'evt_sangeet',
            weddingId: 'demo-preview',
            name: 'Sangeet Night',
            eventType: 'Sangeet',
            date: '27-12-2026',
            time: '08:00 PM',
            venue: 'Grand Imperial Ballroom, Pune',
            mapLink: 'https://maps.google.com',
            description: 'An evening of rhythm, music, and celebration.',
            allowCompanions: true,
            collectDietary: true,
            rsvpDeadline: '2026-12-20',
        },
        {
            id: 'evt_wedding',
            weddingId: 'demo-preview',
            name: 'Wedding Ceremony',
            eventType: 'Wedding',
            date: '28-12-2026',
            time: '11:00 AM',
            venue: 'Lakeside Palace Mandap, Pune',
            mapLink: 'https://maps.google.com',
            description: 'The auspicious union and sacred pheras.',
            allowCompanions: true,
            collectDietary: true,
            rsvpDeadline: '2026-12-20',
        },
        {
            id: 'evt_reception',
            weddingId: 'demo-preview',
            name: 'Grand Reception',
            eventType: 'Reception',
            date: '29-12-2026',
            time: '08:00 PM',
            venue: 'The Palace Lawns, Pune',
            mapLink: 'https://maps.google.com',
            description: 'Join us for a royal dinner and celebrations.',
            allowCompanions: true,
            collectDietary: true,
            rsvpDeadline: '2026-12-20',
        },
    ],
};

export default async function RSVPPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await params;
    const sp = searchParams ? await searchParams : {};
    const isPreview = sp.preview === 'true';

    // Fetch the wedding from the database
    let wedding: any = null;
    try {
        // 'latest' used to load the newest wedding in the whole database, which
        // showed a real customer's names, venues and contact number to anyone.
        // It now falls through to the sample wedding below, like 'demo'.
        if (id !== 'latest' && id !== 'demo' && id !== 'preview') {
            wedding = await prisma.wedding.findFirst({
                where: {
                    OR: [{ id }, { slug: id }],
                },
                include: { events: true },
                orderBy: { createdAt: 'desc' },
            });
        }
    } catch (e) {
        console.error('Database connection error in /rsvp/[id]:', e);
    }

    if (!wedding) {
        if (isPreview || id === 'latest' || id === 'demo' || id === 'preview') {
            wedding = SAMPLE_PREVIEW_WEDDING;
        } else {
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
    }

    // Resolve selected website template (if this wedding purchased a website design).
    // Wrapped in its own try/catch so card-only weddings or environments without
    // the WeddingWebsite table fall back cleanly to Royal Sanctuary (`<RSVPForm>`).
    let resolvedTemplateCode: string | null = null;
    const requestedPreviewTemplate =
        typeof sp.template === 'string' && getWebsiteTemplate(sp.template) ? sp.template : null;

    if (isPreview || id === 'latest' || id === 'demo' || id === 'preview') {
        resolvedTemplateCode = requestedPreviewTemplate;
    } else if (wedding?.id) {
        try {
            const site = await prisma.weddingWebsite.findUnique({
                where: { weddingId: wedding.id },
                select: { template: { select: { code: true } } },
            });
            if (site?.template?.code && getWebsiteTemplate(site.template.code)) {
                resolvedTemplateCode = site.template.code;
            }
        } catch {
            // Fall back to default Royal Sanctuary template
        }
        if (isPreview && requestedPreviewTemplate) {
            resolvedTemplateCode = requestedPreviewTemplate;
        }
    }

    if (resolvedTemplateCode && resolvedTemplateCode !== 'royal-sanctuary') {
        const serializedWedding: WebsiteWedding = {
            id: String(wedding.id),
            groomName: wedding.groomName || '',
            brideName: wedding.brideName || '',
            groomParents: wedding.groomParents ?? undefined,
            brideParents: wedding.brideParents ?? undefined,
            invitationMessage: wedding.invitationMessage ?? undefined,
            rsvpContact: wedding.rsvpContact ?? undefined,
            rsvpDeadline:
                wedding.rsvpDeadline instanceof Date
                    ? wedding.rsvpDeadline.toISOString()
                    : wedding.rsvpDeadline ?? null,
            events: Array.isArray(wedding.events)
                ? wedding.events.map((evt: any) => ({
                      id: String(evt.id),
                      name: evt.name || '',
                      date: evt.date ?? undefined,
                      time: evt.time ?? undefined,
                      venue: evt.venue ?? undefined,
                      mapLink: evt.mapLink ?? undefined,
                      description: evt.description ?? undefined,
                      eventType: evt.eventType ?? undefined,
                  }))
                : [],
        };

        return (
            <PublishedWebsiteRenderer
                templateCode={resolvedTemplateCode}
                wedding={serializedWedding}
                isPreview={isPreview}
            />
        );
    }

    return (
        <div className={`${styles.page} ${isPreview ? styles.previewPage : ''}`}>
            <RSVPForm wedding={wedding} isPreview={isPreview} />
        </div>
    );
}
