'use client';

import { CSSProperties } from 'react';
import {
    CardDocument,
    CardData,
    Layer,
    resolveText,
    aspectRatioValue,
} from '@/lib/templates/card-document';
import styles from './CardRenderer.module.css';

export interface CardRendererProps {
    document: CardDocument;
    data: CardData;
    /** static = final card; edit = with handles (Phase 2); video = animated (Phase 4). */
    mode?: 'static' | 'edit' | 'video';
    /** Video mode only. */
    frame?: number;
    fps?: number;
    /** edit mode only — selection wiring, added in Phase 2. */
    selectedLayerId?: string;
    onSelectLayer?: (id: string) => void;
    className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * Video-only: progress + transform for a layer's reveal at a given frame. Pure
 * math (no Remotion import) so CardRenderer stays usable in the app and editor;
 * the Remotion composition just feeds it `frame`/`fps`. Distances use `em` so the
 * motion scales with font size and stays resolution-independent.
 */
function layerAnim(layer: Layer, frame: number, fps: number): CSSProperties {
    const anim = layer.anim;
    if (!anim || anim.type === 'none') return {};
    const tMs = (frame / (fps || 30)) * 1000;
    const p = easeOutCubic(clamp01((tMs - anim.delay) / Math.max(1, anim.duration)));
    switch (anim.type) {
        case 'fade':
            return { opacity: p };
        case 'fade-up':
            return { opacity: p, transform: `translate3d(0, ${(1 - p) * 0.8}em, 0)` };
        case 'scale-in':
            return { opacity: p, transform: `scale(${0.9 + 0.1 * p})` };
        default:
            return {};
    }
}

function layerStyle(layer: Layer): CSSProperties {
    const s = layer.style;
    return {
        position: 'absolute',
        left: `${layer.box.x}%`,
        top: `${layer.box.y}%`,
        width: `${layer.box.w}%`,
        height: `${layer.box.h}%`,
        display: 'flex',
        alignItems: 'center',
        justifyContent:
            s.align === 'left' ? 'flex-start' : s.align === 'right' ? 'flex-end' : 'center',
        textAlign: s.align ?? 'center',
        fontFamily: s.fontFamily,
        // cqw ≈ % of canvas width → resolution independent (mirrors the old cqi units)
        fontSize: `${s.fontSize}cqw`,
        fontWeight: s.weight ?? 400,
        fontStyle: s.italic ? 'italic' : 'normal',
        color: s.color ?? '#1f1f1f',
        lineHeight: s.lineHeight ?? 1.2,
        letterSpacing: s.letterSpacing != null ? `${s.letterSpacing}em` : undefined,
        textTransform: s.textTransform ?? 'none',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
    };
}

/**
 * Renders a CardDocument + data. Used by the app (static card, download, WhatsApp
 * hero), the admin editor (edit), and the Remotion video (video). One component,
 * three consumers — they cannot drift.
 */
export function CardRenderer({
    document: doc,
    data,
    mode = 'static',
    frame = 0,
    fps = 30,
    selectedLayerId,
    onSelectLayer,
    className,
}: CardRendererProps) {
    const ratio = aspectRatioValue(doc.canvas.aspectRatio);
    const isVideo = mode === 'video';

    // Video-only: gentle background zoom over ~8s (ignored by static/edit).
    const motion = doc.background?.motion;
    const bgTransform =
        isVideo && motion?.type === 'zoom'
            ? `scale(${1 + (motion.amount ?? 0.08) * clamp01(frame / (fps * 8))})`
            : undefined;

    return (
        <div
            className={`${styles.canvas} ${className ?? ''}`}
            style={{ aspectRatio: String(ratio) }}
        >
            {doc.background?.imageUrl && (
                <img
                    src={doc.background.imageUrl}
                    alt=""
                    aria-hidden
                    className={styles.background}
                    style={{ objectFit: doc.background.fit ?? 'cover', transform: bgTransform, transformOrigin: 'center' }}
                    crossOrigin="anonymous"
                />
            )}

            {doc.layers.map((layer) => {
                const text = resolveText(layer, data);
                const isSelected = mode === 'edit' && layer.id === selectedLayerId;
                return (
                    <div
                        key={layer.id}
                        className={
                            mode === 'edit'
                                ? `${styles.layerEdit} ${isSelected ? styles.layerSelected : ''}`
                                : undefined
                        }
                        style={{ ...layerStyle(layer), ...(isVideo ? layerAnim(layer, frame, fps) : null) }}
                        onPointerDown={
                            mode === 'edit' && onSelectLayer
                                ? () => onSelectLayer(layer.id)
                                : undefined
                        }
                    >
                        {text}
                    </div>
                );
            })}
        </div>
    );
}
