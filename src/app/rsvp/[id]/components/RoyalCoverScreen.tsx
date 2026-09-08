'use client';

import React, { useState } from 'react';
import styles from '../rsvp.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { IntricateMandalaSvg } from '@/components/ui/IntricateMandala';
import { Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface RoyalCoverScreenProps {
    wedding: any;
    onOpen: () => void;
    isPreview?: boolean;
}

export const RoyalCoverScreen: React.FC<RoyalCoverScreenProps> = ({
    wedding,
    onOpen,
    isPreview = false,
}) => {
    const [isWhiteWashing, setIsWhiteWashing] = useState(false);

    // Extract first letters for couple monogram (e.g. Vivek & Priyanka -> V & P)
    const getInitials = (groom?: string, bride?: string) => {
        const g = (groom || 'G').trim().charAt(0).toUpperCase();
        const b = (bride || 'B').trim().charAt(0).toUpperCase();
        return { groomInitial: g, brideInitial: b };
    };

    const { groomInitial, brideInitial } = getInitials(
        wedding?.groomName,
        wedding?.brideName
    );

    const coupleNames = `${wedding?.groomName || 'Groom'} & ${wedding?.brideName || 'Bride'}`;

    const handleOpenClick = () => {
        if (isWhiteWashing) return;
        setIsWhiteWashing(true);

        // Allow the white wash / light flash animation to reach peak opacity (350ms) before opening the RSVP page
        setTimeout(() => {
            onOpen();
        }, 400);
    };

    return (
        <div className={clsx(styles.coverScreenWrapper, isPreview && styles.previewCoverWrapper)}>
            {/* White Wash Radiant Flash Overlay */}
            <AnimatePresence>
                {isWhiteWashing && (
                    <motion.div
                        className={styles.whiteWashOverlay}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{
                            opacity: [0, 0.98, 1, 0],
                            scale: [0.85, 1.5, 2.6, 3.4],
                        }}
                        transition={{
                            duration: 0.75,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Main Cover Card Surface */}
            <motion.div
                className={clsx(styles.coverCard, isPreview && styles.previewCoverCard)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                    opacity: isWhiteWashing ? 0 : 1,
                    scale: isWhiteWashing ? 1.05 : 1,
                    filter: isWhiteWashing ? 'blur(6px)' : 'blur(0px)',
                }}
                transition={{
                    type: 'spring',
                    bounce: 0,
                    duration: 0.55,
                }}
            >
                {/* Cover Header Inscription */}
                <div className={styles.coverHeaderBlock}>
                    <span className={styles.coverPreTag}>WEDDING INVITATION</span>
                </div>

                {/* Center Stage: Rotating Golden Mandala + Interactive Royal Seal Disc */}
                <div className={styles.coverCenterStage}>
                    {/* Golden Rotating Mandala (Exact SVG from Wedding Details Page) */}
                    <div className={styles.coverRotatingMandala} aria-hidden="true">
                        <IntricateMandalaSvg idPrefix="rsvp-cover-mandala" />
                    </div>

                    {/* Ambient Glowing Halo around Seal */}
                    <div className={styles.coverSealHalo} aria-hidden="true" />

                    {/* Royal Interactive Seal Disc */}
                    <motion.button
                        type="button"
                        className={styles.coverSealDisc}
                        onClick={handleOpenClick}
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                        aria-label="Tap to open wedding invitation"
                    >
                        {/* Star / Emblem at Top of Seal */}
                        <div className={styles.coverSealStar}>
                            <Sparkles size={16} />
                        </div>

                        {/* Monogram Couple Initials */}
                        <div className={styles.coverMonogram}>
                            <span className={styles.coverMonogramInitial}>{groomInitial}</span>
                            {wedding?.brideName && wedding.brideName.trim() ? (
                                <>
                                    <span className={styles.coverMonogramAmp}>&amp;</span>
                                    <span className={styles.coverMonogramInitial}>{brideInitial}</span>
                                </>
                            ) : null}
                        </div>

                        {/* Gold Hairline Divider with Diamond */}
                        <div className={styles.coverDiscDivider}>
                            <span className={styles.coverDiscLine} />
                            <span className={styles.coverDiscDiamond}>◆</span>
                            <span className={styles.coverDiscLine} />
                        </div>

                        {/* Tap to Open Prompt */}
                        <span className={styles.coverTapText}>TAP TO OPEN</span>
                    </motion.button>
                </div>

                {/* Cover Footer Notice */}
                <div className={styles.coverFooterBlock}>
                    <div className={styles.coverPromptHint}>
                        <span className={styles.coverPulseDot} />
                        <span>Tap the seal to open invitation</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
