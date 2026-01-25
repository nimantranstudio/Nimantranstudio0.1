import { prisma } from '@/lib/prisma';
// import { THEMES } from '@/lib/constants/themes';
import styles from './rsvp.module.css';
import { RSVPForm } from './RSVPForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RSVPPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // The ID in the URL is now an EVENT ID, so we must query the Event model
    const event = await prisma.event.findUnique({
        where: { id },
        include: { wedding: true },
    });

    if (!event) {
        notFound();
    }

    // Construct a wedding object that matches what RSVPForm expects
    // We only show the specific event for this link
    const wedding = {
        ...event.wedding,
        events: [event]
    };

    const dbTheme = await prisma.theme.findUnique({
        where: { id: wedding.themeId }
    });

    const themeColors = ['#D4AF37', '#800000', '#F5E6BE']; // Default placeholder colors

    return (
        <div className={styles.page} style={{ '--theme-bg': themeColors[0], '--theme-primary': themeColors[1] } as any}>
            <RSVPForm wedding={wedding} />
        </div>
    );
}
