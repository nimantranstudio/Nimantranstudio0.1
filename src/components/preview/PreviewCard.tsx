'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import { InvitationCard, InvitationCardRef } from './InvitationCard';
import { CardRenderer } from '@/components/card/CardRenderer';
import { TemplateFonts } from '@/components/card/TemplateFonts';
import { CardDocument, CardData, buildCardData } from '@/lib/templates/card-document';
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
 * One card surface for the customer flow. If the bundle item is a designed
 * (structured) template it renders CardRenderer with the couple's data bound;
 * otherwise it forwards untouched to the existing HTML InvitationCard. The switch
 * lives here so callers never have to know which kind they're showing.
 */
export const PreviewCard = forwardRef<InvitationCardRef, PreviewCardProps>(function PreviewCard(
    { structuredLayout, structuredCouple, ...rest },
    ref
) {
    if (structuredLayout) {
        const data = buildCardData(structuredCouple, (rest as any).event);
        return (
            <StructuredPreviewCard
                ref={ref}
                layout={structuredLayout}
                data={data}
                className={(rest as any).className}
            />
        );
    }
    return <InvitationCard ref={ref} {...rest} />;
});
