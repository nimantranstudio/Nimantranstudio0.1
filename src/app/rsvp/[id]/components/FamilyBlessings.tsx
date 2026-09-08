'use client';

import React from 'react';
import styles from '../rsvp.module.css';
import { Heart } from 'lucide-react';

interface FamilyBlessingsProps {
    groomName: string;
    brideName: string;
    groomParents?: string | null;
    brideParents?: string | null;
    invitationMessage?: string | null;
}

export const FamilyBlessings: React.FC<FamilyBlessingsProps> = ({
    groomName,
    brideName,
    groomParents,
    brideParents,
    invitationMessage,
}) => {
    const defaultInviteMsg =
        "Two souls, two families, united by love and destined forever. We request the honour of your gracious presence and heartfelt blessings as we begin this new chapter of our lives.";

    return (
        <section className={styles.blessingsSection}>
            {/* Header */}
            <div className={styles.sectionHeaderWrap}>
                <span className={styles.sectionSubHead}>FAMILY BLESSINGS</span>
                <h2 className={styles.sectionTitle}>In Love & Gratitude</h2>
                <div className={styles.ornamentLineSmall}>
                    <span>❦</span>
                </div>
            </div>

            {/* Heartfelt Quote */}
            <div className={styles.quoteCard}>
                <p className={styles.quoteText}>
                    &ldquo;{invitationMessage && invitationMessage.trim() ? invitationMessage : defaultInviteMsg}&rdquo;
                </p>
            </div>

            {/* Family Cards Grid */}
            {(groomParents || brideParents) && (
                <div className={styles.familyGrid}>
                    {/* Groom's Family */}
                    <div className={styles.familyCard}>
                        <div className={styles.familyBadge}>GROOM&apos;S FAMILY</div>
                        <h4 className={styles.familyPersonName}>{groomName}</h4>
                        <p className={styles.familyRoleText}>
                            {groomParents && groomParents.trim()
                                ? `Son of ${groomParents.includes('Smt') || groomParents.includes('Mr') ? groomParents : `Smt. & Shri ${groomParents}`}`
                                : 'With the blessings of elders'}
                        </p>
                    </div>

                    {/* Bride's Family */}
                    <div className={styles.familyCard}>
                        <div className={styles.familyBadge}>BRIDE&apos;S FAMILY</div>
                        <h4 className={styles.familyPersonName}>{brideName}</h4>
                        <p className={styles.familyRoleText}>
                            {brideParents && brideParents.trim()
                                ? `Daughter of ${brideParents.includes('Smt') || brideParents.includes('Mr') ? brideParents : `Smt. & Shri ${brideParents}`}`
                                : 'With the blessings of elders'}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};
