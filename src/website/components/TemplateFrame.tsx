'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { useWeddingStore } from '@/store/wedding-store';
import { getWebsiteTemplate } from '../templates/registry';
import { getSampleWedding } from '../templates/sample-wedding';
import { formDataToWebsiteWedding } from '../data/form-to-website';
import type { WebsiteTemplateProps } from '../templates/types';

const WEDDING_STORE_KEY = 'nimantran-wedding-storage';

export type FrameSource = 'sample' | 'draft' | 'draft-with-samples';

/**
 * Renders one website design inside the preview iframe. Being its own page
 * gives the design a real phone- or desktop-width viewport, so its CSS media
 * queries behave exactly as on a guest's device.
 *
 * - sample: the sample couple.
 * - draft: exactly what the customer entered (review page).
 * - draft-with-samples: entered details, with sample names for untouched
 *   fields (live preview beside the details form).
 *
 * Draft data is read from the details form's own browser storage — this frame
 * is same-origin, so it sees the same localStorage, and the `storage` event
 * tells it when the form in the parent page changes. Nothing is read from or
 * written to the database.
 */
export function TemplateFrame({ templateId, source }: { templateId: string; source: FrameSource }) {
    const template = getWebsiteTemplate(templateId);
    const [Renderer, setRenderer] = useState<ComponentType<WebsiteTemplateProps> | null>(null);
    const [mounted, setMounted] = useState(false);
    const formData = useWeddingStore((s) => s.formData);
    const touchedFields = useWeddingStore((s) => s.touchedFields);

    useEffect(() => {
        setMounted(true);
        if (!template) return;
        let cancelled = false;
        template.load().then((mod) => {
            if (!cancelled) setRenderer(() => mod.default);
        });
        return () => {
            cancelled = true;
        };
    }, [template]);

    // Follow edits made in the details form in the parent window.
    useEffect(() => {
        if (source === 'sample') return;
        const onStorage = (e: StorageEvent) => {
            if (e.key === WEDDING_STORE_KEY) useWeddingStore.persist.rehydrate();
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [source]);

    // The design submits its RSVP form to /api/rsvp/{wedding.id}. In a preview
    // the id is 'preview', so answer that request here instead of letting it
    // reach the server. Scoped to this iframe's own window.
    useEffect(() => {
        const realFetch = window.fetch;
        window.fetch = (input, init) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
            if (url.includes('/api/rsvp/preview')) {
                return Promise.resolve(
                    new Response(JSON.stringify({ success: true, preview: true }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    })
                );
            }
            return realFetch(input, init);
        };
        return () => {
            window.fetch = realFetch;
        };
    }, []);

    const wedding = useMemo(() => {
        if (source === 'sample') return getSampleWedding();
        return formDataToWebsiteWedding(formData, source === 'draft-with-samples' ? { touchedFields } : {});
    }, [source, formData, touchedFields]);

    // A preview RSVP marks the first event as "already answered" in this
    // browser; clear it so every preview starts at the invitation.
    useEffect(() => {
        const firstId = wedding.events[0]?.id;
        if (!firstId) return;
        try {
            localStorage.removeItem(`rsvp_submitted_${firstId}`);
        } catch {
            // Storage unavailable — nothing to clear.
        }
    }, [wedding.events]);

    if (!template) {
        return <p style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>This design isn't available.</p>;
    }
    // The form lives in browser storage, so render only after mounting to avoid
    // a server/client mismatch.
    if (!mounted || !Renderer) return <div style={{ minHeight: '100vh', background: '#FAF7F2' }} />;

    return <Renderer wedding={wedding} isPreview={false} />;
}
