import prisma from '@/lib/prisma';
import { THEMES } from '@/lib/constants/themes';
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

    const wedding = await prisma.wedding.findUnique({
        where: { id },
        include: { events: true },
    });

    if (!wedding) {
        notFound();
    }

    const theme = THEMES.find(t => t.id === wedding.themeId) || THEMES[0];

    return (
        <div className={styles.page} style={{ '--theme-bg': theme.colors[0], '--theme-primary': theme.colors[1] } as any}>
            <div className="container">
                <div className={styles.card}>
                    <header className={styles.header}>
                        <p className={styles.eyebrow}>The Wedding of</p>
                        <h1 className={styles.names}>{wedding.groomName} & {wedding.brideName}</h1>
                        <div className={styles.divider}></div>
                        <p className={styles.subtitle}>We would love to have you with us!</p>
                    </header>

                    <main className={styles.main}>
                        {/* Event Summary */}
                        <div className={styles.inviteInfo}>
                            {wedding.events.map((event: any) => (
                                <div key={event.id} className={styles.eventItem}>
                                    <strong>{event.name}</strong>
                                    <span>{event.date} • {event.venue}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.formWrapper}>
                            <h2>RSVP</h2>
                            <RSVPForm weddingId={wedding.id} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
