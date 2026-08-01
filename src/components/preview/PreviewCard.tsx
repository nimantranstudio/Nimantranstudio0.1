'use client';

import { forwardRef } from 'react';
import { InvitationCard, InvitationCardRef } from './InvitationCard';
import { CardRenderer } from '@/components/card/CardRenderer';
import { TemplateFonts } from '@/components/card/TemplateFonts';
import { CardDocument, buildCardData } from '@/lib/templates/card-document';

type InvitationCardProps = React.ComponentProps<typeof InvitationCard>;

type PreviewCardProps = InvitationCardProps & {
    /** When present, this item is a designed (CardDocument) template — render it via CardRenderer. */
    structuredLayout?: CardDocument | null;
    /** Couple form data used to bind the designed template's text zones. */
    structuredCouple?: any;
};

/**
 * One card surface for the customer preview. If the bundle item is a designed
 * (structured) template it renders CardRenderer with the couple's data bound;
 * otherwise it forwards untouched to the existing HTML InvitationCard. Keeping the
 * switch here means the preview page never has to know which kind it's showing.
 */
export const PreviewCard = forwardRef<InvitationCardRef, PreviewCardProps>(function PreviewCard(
    { structuredLayout, structuredCouple, ...rest },
    ref
) {
    if (structuredLayout) {
        const data = buildCardData(structuredCouple, (rest as any).event);
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TemplateFonts />
                <CardRenderer
                    document={structuredLayout}
                    data={data}
                    mode="static"
                    className={(rest as any).className}
                />
            </div>
        );
    }
    return <InvitationCard ref={ref} {...rest} />;
});
