'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { WebsiteTemplateProps } from '../templates/types';

const RoyalHeritage = dynamic(() => import('../templates/royal-heritage'));
const ModernRomance = dynamic(() => import('../templates/modern-romance'));
const GardenOfLove = dynamic(() => import('../templates/garden-of-love'));

export interface PublishedWebsiteRendererProps extends WebsiteTemplateProps {
    templateCode: string;
}

/**
 * Renders the customer's selected wedding website template on the live guest
 * invitation route (`/rsvp/[id]`). Note that `royal-sanctuary` continues to
 * render via the original `<RSVPForm>` path in `src/app/rsvp/[id]/page.tsx` so
 * existing invitations remain 100% untouched.
 */
export function PublishedWebsiteRenderer({
    templateCode,
    wedding,
    isPreview = false,
}: PublishedWebsiteRendererProps) {
    switch (templateCode) {
        case 'royal-heritage':
            return <RoyalHeritage wedding={wedding} isPreview={isPreview} />;
        case 'modern-romance':
            return <ModernRomance wedding={wedding} isPreview={isPreview} />;
        case 'garden-of-love':
            return <GardenOfLove wedding={wedding} isPreview={isPreview} />;
        default:
            return null;
    }
}

