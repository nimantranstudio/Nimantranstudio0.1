'use client';

import { RSVPForm } from '../[id]/RSVPForm';
import styles from '../[id]/rsvp.module.css';

export default function WeddingRSVPPage() {
    // Mock data for the "User Side RSVP View" demonstration
    const mockWedding = {
        id: 'demo-wedding',
        groomName: 'Rahul',
        brideName: 'Anjalee',
        themeId: 'premium-white',
        invitationMessage: "We're so excited to celebrate our special day with our dearest friends and family! Please join us for an evening of love and laughter.",
        allowCompanions: true,
        collectDietary: true,
        events: [
            {
                id: 'event-1',
                name: "Rahul and Anjalee's Wedding",
                venue: 'The Grand Palace, Jodhpur',
                date: '2026-12-15',
                time: '19:00',
                description: "Join us for the big day!",
            }
        ]
    };

    const themeColors = {
        primary: '#C8A75A', // Elegant Gold
        background: '#FFFFFF',
    };

    return (
        <div 
            className={styles.page} 
            style={{ 
                '--theme-bg': themeColors.background, 
                '--theme-primary': themeColors.primary,
                minHeight: '100vh',
                backgroundColor: '#FDFBF7'
            } as any}
        >
            <RSVPForm wedding={mockWedding} />
        </div>
    );
}
