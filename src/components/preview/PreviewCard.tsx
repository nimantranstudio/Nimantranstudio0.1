'use client';

import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { InvitationCard, InvitationCardRef } from './InvitationCard';
import { CardRenderer } from '@/components/card/CardRenderer';
import { TemplateFonts } from '@/components/card/TemplateFonts';
import { CardDocument, CardData, buildCardData } from '@/lib/templates/card-document';
import { isStructuredMarker, structuredIdOf, fetchTemplateLayout } from '@/lib/templates/client-layout';
import { captureElementToDataUrl } from '@/lib/capture';

type InvitationCardProps = React.ComponentProps<typeof InvitationCard>;

type PreviewCardProps = InvitationCardProps & {
    /** When present, this item is a designed (CardDocument) template — render it via CardRenderer. */
    structuredLayout?: CardDocument | null;
    /** Couple form data used to bind the designed template's text zones. */
    structuredCouple?: any;
};

/**
 * Designed-card branch: renders a CardDocument via CardRenderer and exposes the
 * same imperative surface as InvitationCard (capture / download), so the hero
 * capture and download flows work identically for designed and HTML cards.
 */
const StructuredPreviewCard = forwardRef<
    InvitationCardRef,
    { layout: CardDocument; data: CardData; className?: string }
>(function StructuredPreviewCard({ layout, data, className }, ref) {
    const boxRef = useRef<HTMLDivElement>(null);
    const capture = () => captureElementToDataUrl(boxRef.current);

    useImperativeHandle(ref, () => ({
        saveEdits: () => ({}),
        captureDataUrl: capture,
        downloadImage: async () => {
            const url = await capture();
            if (!url) return;
            const a = document.createElement('a');
            a.download = 'Wedding-Invitation.png';
            a.href = url;
            a.click();
        },
        sendMessage: () => { /* designed cards are not edited on the client */ },
        getSerializedHtml: () => '',
    }), []);

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TemplateFonts />
            <div ref={boxRef} style={{ width: '100%' }}>
                <CardRenderer document={layout} data={data} mode="static" className={className} />
            </div>
        </div>
    );
});

/**
 * One card surface for the customer flow. Renders a designed (structured) card via
 * CardRenderer, otherwise forwards untouched to the HTML InvitationCard.
 *
 * The layout is taken from the `structuredLayout` prop when available, but if a
 * caller only has a `structured:<id>` marker (in customImage) the layout is fetched
 * on the client — so a designed card renders even when the store/theme cache
 * doesn't carry the layout. The switch lives here so callers stay agnostic.
 */
export const PreviewCard = forwardRef<InvitationCardRef, PreviewCardProps>(function PreviewCard(
    { structuredLayout, structuredCouple, ...rest },
    ref
) {
    const customImage = (rest as any).customImage as string | undefined;
    const markerId = !structuredLayout && isStructuredMarker(customImage) ? structuredIdOf(customImage!) : null;

    const [resolvedLayout, setResolvedLayout] = useState<CardDocument | null>(structuredLayout ?? null);
    useEffect(() => {
        if (structuredLayout) { setResolvedLayout(structuredLayout); return; }
        if (markerId) {
            let alive = true;
            fetchTemplateLayout(markerId).then((l) => { if (alive) setResolvedLayout(l); });
            return () => { alive = false; };
        }
        setResolvedLayout(null);
    }, [structuredLayout, markerId]);

    const isStructured = !!structuredLayout || !!markerId;

    if (isStructured) {
        if (!resolvedLayout) {
            // Layout still loading — hold the card's box so layout doesn't jump.
            return <div style={{ width: '100%', height: '100%', minHeight: 120, background: '#f3f2ef' }} />;
        }
        const r = rest as any;
        // Bind from structuredCouple when given, else fall back to the same couple
        // props InvitationCard receives — so PreviewCard is a true drop-in.
        const couple = structuredCouple || {
            groomName: r.groomName,
            brideName: r.brideName,
            groomParents: r.groomParents,
            brideParents: r.brideParents,
            primaryDate: r.event?.date,
            primaryTime: r.event?.time,
            defaultVenueName: r.event?.venue,
        };
        const data = buildCardData(couple, r.event);
        return (
            <StructuredPreviewCard
                ref={ref}
                layout={resolvedLayout}
                data={data}
                className={(rest as any).className}
            />
        );
    }
    return <InvitationCard ref={ref} {...rest} />;
});
