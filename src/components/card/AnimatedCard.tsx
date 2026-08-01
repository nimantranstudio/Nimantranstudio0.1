'use client';

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CardRenderer } from './CardRenderer';
import { TemplateFonts } from './TemplateFonts';
import type { CardDocument, CardData } from '@/lib/templates/card-document';

export interface AnimatedCardProps {
    document: CardDocument;
    data: CardData;
}

/**
 * The video form of a CardDocument. Drives the SAME CardRenderer in `video` mode
 * with the current frame, so the card and the video can never visually drift.
 * Usable in three places: an in-app @remotion/player preview, Remotion Studio, and
 * headless render — the component is identical; only the host differs.
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({ document: doc, data }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return (
        <AbsoluteFill style={{ backgroundColor: '#0b0b0b', alignItems: 'center', justifyContent: 'center' }}>
            <TemplateFonts />
            <CardRenderer document={doc} data={data} mode="video" frame={frame} fps={fps} />
        </AbsoluteFill>
    );
};
