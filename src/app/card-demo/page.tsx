'use client';

/**
 * Dev smoke test for the structured template renderer.
 * Left: the static card. Right: the SAME CardDocument played as video via
 * @remotion/player (CardRenderer in `video` mode). One document, two outputs.
 */
import { Player } from '@remotion/player';
import { CardRenderer } from '@/components/card/CardRenderer';
import { AnimatedCard } from '@/components/card/AnimatedCard';
import { TemplateFonts } from '@/components/card/TemplateFonts';
import { SAMPLE_DOCUMENT } from '@/lib/templates/sample-document';
import { SAMPLE_DATA, aspectRatioValue } from '@/lib/templates/card-document';

const FPS = 30;
const doc = SAMPLE_DOCUMENT;
const ratio = aspectRatioValue(doc.canvas.aspectRatio);
const COMPOSITION_WIDTH = 1080;
const COMPOSITION_HEIGHT = Math.round(COMPOSITION_WIDTH / ratio);

// Duration = last zone's reveal end + a tail, so the whole card has animated in.
const lastRevealMs = doc.layers.reduce(
    (max, l) => Math.max(max, l.anim ? l.anim.delay + l.anim.duration : 0),
    0,
);
const DURATION_IN_FRAMES = Math.max(90, Math.ceil(((lastRevealMs + 1800) / 1000) * FPS));

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
                CardRenderer — static + video
            </h1>
            <p style={{ color: '#555', fontSize: 14 }}>
                One CardDocument + sample data — rendered static (left) and as an animated video (right).
            </p>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ textAlign: 'center', color: '#888', fontSize: 12, marginBottom: 8 }}>Static card</div>
                    <div style={{ width: 320, maxWidth: '90vw', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
                        <CardRenderer document={doc} data={SAMPLE_DATA} mode="static" />
                    </div>
                </div>
                <div>
                    <div style={{ textAlign: 'center', color: '#888', fontSize: 12, marginBottom: 8 }}>Video (same document)</div>
                    <Player
                        component={AnimatedCard}
                        inputProps={{ document: doc, data: SAMPLE_DATA }}
                        durationInFrames={DURATION_IN_FRAMES}
                        fps={FPS}
                        compositionWidth={COMPOSITION_WIDTH}
                        compositionHeight={COMPOSITION_HEIGHT}
                        style={{ width: 320, maxWidth: '90vw', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                        controls
                        loop
                        autoPlay
                        acknowledgeRemotionLicense
                    />
                </div>
            </div>
        </div>
    );
}
