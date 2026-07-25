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
    selectedLayerId,
    onSelectLayer,
    className,
}: CardRendererProps) {
    const ratio = aspectRatioValue(doc.canvas.aspectRatio);

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
                    style={{ objectFit: doc.background.fit ?? 'cover' }}
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
                        style={layerStyle(layer)}
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
