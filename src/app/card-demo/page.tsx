'use client';

/**
 * Dev-only smoke test for the structured template renderer (Phase 1).
 * Renders the sample CardDocument with sample data. Remove after the editor
 * (Phase 2) exists.
 */
import { CardRenderer } from '@/components/card/CardRenderer';
import { TemplateFonts } from '@/components/card/TemplateFonts';
import { SAMPLE_DOCUMENT } from '@/lib/templates/sample-document';
import { SAMPLE_DATA } from '@/lib/templates/card-document';

export default function CardDemoPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                padding: 24,
                background: '#f8f7f5',
            }}
        >
            <TemplateFonts />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24 }}>
                CardRenderer — Phase 1 smoke test
            </h1>
            <p style={{ color: '#555', fontSize: 14 }}>
                One CardDocument + sample data, rendered by the shared renderer.
            </p>
            <div style={{ width: 360, maxWidth: '90vw', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
                <CardRenderer document={SAMPLE_DOCUMENT} data={SAMPLE_DATA} mode="static" />
            </div>
        </div>
    );
}
