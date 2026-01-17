import type { WeddingEvent } from '@/lib/schemas/wedding-form';
import type { Theme } from '@/lib/constants/themes';
import styles from './Preview.module.css';
import { useWeddingStore } from '@/store/wedding-store';

interface InvitationCardProps {
    event: WeddingEvent;
    theme: Theme;
    groomName: string;
    brideName: string;
}

export const InvitationCard = ({ event, theme, groomName, brideName }: InvitationCardProps) => {
    return (
        <div className={styles.invitationCard} style={{ '--theme-primary': theme.colors[1], '--theme-bg': theme.colors[0] } as any}>
            {/* Watermark Overlay */}
            <div className={styles.watermark}>
                <span>NimantranStudio</span>
                <span>NimantranStudio</span>
                <span>NimantranStudio</span>
            </div>

            <div className={styles.content}>
                <p className={styles.eyebrow}>The Wedding of</p>
                <h2 className={styles.names}>
                    {groomName || 'Groom'} <br /> & <br /> {brideName || 'Bride'}
                </h2>

                <div className={styles.divider}></div>

                <h3 className={styles.eventName}>{event.name}</h3>

                <div className={styles.details}>
                    <p>{event.date || 'Date TBD'}</p>
                    <p>{event.time || 'Time TBD'}</p>
                    <p className={styles.venue}>{event.venue || 'Venue TBD'}</p>
                </div>

                <div className={styles.footer}>
                    Helping beyond invitations, with love.
                </div>
            </div>
        </div>
    );
};
