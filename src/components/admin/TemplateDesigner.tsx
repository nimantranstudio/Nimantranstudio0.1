'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CardRenderer } from '@/components/card/CardRenderer';
import { TemplateFonts } from '@/components/card/TemplateFonts';
import { TEMPLATE_FONTS } from '@/lib/templates/fonts';
import {
    CardDocument,
    Layer,
    Binding,
    BINDINGS,
    SAMPLE_DATA,
} from '@/lib/templates/card-document';

export interface SavedTemplate {
    id: string;
    name: string;
    eventType?: string;
    layout: CardDocument;
    status: string;
}

interface TemplateDesignerProps {
    /** Existing template id to load & edit. Omit to start a blank template. */
    templateId?: string | null;
    /** Prefill the event type on a fresh template. */
    defaultEventType?: string;
    /** Called after a successful save with the created/updated template. */
    onSaved?: (template: SavedTemplate) => void;
    /** If provided, a Close button is shown (modal usage). */
    onClose?: () => void;
    /** Embedded (modal) mode: fills its container instead of the viewport, suppresses alerts. */
    embedded?: boolean;
}

function blankDocument(eventType = ''): CardDocument {
    return {
        name: 'Untitled template',
        eventType,
        canvas: { aspectRatio: '3:4' },
        background: { imageUrl: '', fit: 'cover' },
        layers: [],
    };
}

function newLayer(binding: Binding): Layer {
    return {
        id: (crypto as any).randomUUID ? crypto.randomUUID() : `l${Date.now()}`,
        binding,
        text: binding === 'static' ? 'Text' : undefined,
        box: { x: 25, y: 45, w: 50, h: 8 },
        style: { fontFamily: 'Playfair Display', fontSize: 5, weight: 400, color: '#ffffff', align: 'center' },
        anim: { type: 'fade', delay: 300, duration: 600 },
    };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function TemplateDesigner({ templateId: propTemplateId, defaultEventType, onSaved, onClose, embedded }: TemplateDesignerProps) {
    const [doc, setDoc] = useState<CardDocument>(() => blankDocument(defaultEventType));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [templateId, setTemplateId] = useState<string | null>(propTemplateId ?? null);
    const [saving, setSaving] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ mode: 'move' | 'resize'; sx: number; sy: number; box: Layer['box']; rect: DOMRect } | null>(null);

    // Load existing template when an id is provided.
    useEffect(() => {
        if (!propTemplateId) return;
        setTemplateId(propTemplateId);
        fetch(`/api/admin/templates/${propTemplateId}`)
            .then((r) => r.json())
            .then((d) => { if (d.template?.layout) setDoc(d.template.layout as CardDocument); })
            .catch(() => {});
    }, [propTemplateId]);

    const selected = doc.layers.find((l) => l.id === selectedId) || null;

    const patchLayer = useCallback((id: string, patch: Partial<Layer>) => {
        setDoc((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
    }, []);
    const patchStyle = (id: string, patch: Partial<Layer['style']>) =>
        setDoc((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, style: { ...l.style, ...patch } } : l)) }));
    const patchBox = (id: string, patch: Partial<Layer['box']>) =>
        setDoc((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, box: { ...l.box, ...patch } } : l)) }));

    // ---- drag / resize on the selected layer ----
    const startDrag = (e: React.PointerEvent, mode: 'move' | 'resize') => {
        if (!selected || !canvasRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { mode, sx: e.clientX, sy: e.clientY, box: { ...selected.box }, rect: canvasRef.current.getBoundingClientRect() };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current || !selected) return;
        const { mode, sx, sy, box, rect } = drag.current;
        const dxPct = ((e.clientX - sx) / rect.width) * 100;
        const dyPct = ((e.clientY - sy) / rect.height) * 100;
        if (mode === 'move') {
            patchBox(selected.id, {
                x: clamp(box.x + dxPct, 0, 100 - box.w),
                y: clamp(box.y + dyPct, 0, 100 - box.h),
            });
        } else {
            patchBox(selected.id, {
                w: clamp(box.w + dxPct, 4, 100 - box.x),
                h: clamp(box.h + dyPct, 2, 100 - box.y),
            });
        }
    };
    const endDrag = () => { drag.current = null; };

    // ---- background upload (reuses the Firebase card-upload pipeline) ----
    const uploadBg = async (file: File) => {
        const dataUrl: string = await new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(fr.result as string);
            fr.onerror = rej;
            fr.readAsDataURL(file);
        });
        const r = await fetch('/api/cards/upload', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl, name: 'template-bg' }),
        });
        const d = await r.json();
        if (d.success && d.url) setDoc((doc) => ({ ...doc, background: { ...doc.background, imageUrl: d.url } }));
        else alert('Background upload failed: ' + (d.error || 'unknown'));
    };

    const save = async () => {
        setSaving(true);
        try {
            const payload = { name: doc.name, eventType: doc.eventType, layout: doc, status: 'ready' };
            const url = templateId ? `/api/admin/templates/${templateId}` : '/api/admin/templates';
            const method = templateId ? 'PUT' : 'POST';
            const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const d = await r.json();
            if (d.template) {
                if (!templateId) setTemplateId(d.template.id);
                onSaved?.(d.template as SavedTemplate);
                if (!embedded) alert('Saved ✓');
            } else {
                alert('Save failed: ' + (d.error || 'unknown'));
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', height: embedded ? '100%' : '100vh', fontFamily: 'var(--font-sans)', fontSize: 13, background: '#fff' }}>
            <TemplateFonts />

            {/* Left: layers */}
            <aside style={{ borderRight: '1px solid #e6e4de', padding: 12, overflowY: 'auto' }}>
                <input value={doc.name} onChange={(e) => setDoc({ ...doc, name: e.target.value })}
                    style={{ width: '100%', fontWeight: 600, padding: 6, marginBottom: 8, border: '1px solid #ddd', borderRadius: 6 }} />
                <label style={{ color: '#777' }}>Event type</label>
                <input value={doc.eventType || ''} onChange={(e) => setDoc({ ...doc, eventType: e.target.value })} placeholder="wedding / haldi …"
                    style={{ width: '100%', padding: 6, margin: '2px 0 12px', border: '1px solid #ddd', borderRadius: 6 }} />

                <div style={{ fontWeight: 600, margin: '8px 0 6px' }}>Layers</div>
                {doc.layers.map((l) => (
                    <div key={l.id} onClick={() => setSelectedId(l.id)}
                        style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
                            background: l.id === selectedId ? '#f3eeda' : 'transparent' }}>
                        <span>{l.binding === 'static' ? `"${l.text}"` : BINDINGS.find((b) => b.value === l.binding)?.label}</span>
                        <button onClick={(e) => { e.stopPropagation(); setDoc((d) => ({ ...d, layers: d.layers.filter((x) => x.id !== l.id) })); }}
                            style={{ border: 'none', background: 'none', color: '#c00', cursor: 'pointer' }}>✕</button>
                    </div>
                ))}
                <select value="" onChange={(e) => { if (e.target.value) { const nl = newLayer(e.target.value as Binding); setDoc((d) => ({ ...d, layers: [...d.layers, nl] })); setSelectedId(nl.id); } }}
                    style={{ width: '100%', marginTop: 8, padding: 6, border: '1px dashed #bbb', borderRadius: 6 }}>
                    <option value="">+ Add zone…</option>
                    {BINDINGS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
            </aside>

            {/* Center: canvas */}
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 20, background: '#f0efeb', overflow: 'auto' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label style={{ background: '#fff', border: '1px solid #ddd', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
                        Upload background
                        <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadBg(e.target.files[0])} />
                    </label>
                    <select value={doc.canvas.aspectRatio} onChange={(e) => setDoc({ ...doc, canvas: { aspectRatio: e.target.value } })}
                        style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}>
                        <option value="3:4">3:4 (portrait)</option>
                        <option value="4:5">4:5</option>
                        <option value="9:16">9:16 (story)</option>
                        <option value="1:1">1:1 (square)</option>
                    </select>
                    <button onClick={save} disabled={saving}
                        style={{ background: 'var(--primary,#c8a951)', color: '#fff', border: 'none', padding: '7px 18px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                    {onClose && (
                        <button onClick={onClose}
                            style={{ background: '#fff', color: '#444', border: '1px solid #ddd', padding: '7px 14px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                            Close
                        </button>
                    )}
                </div>

                <div ref={canvasRef} style={{ position: 'relative', width: 380, maxWidth: '90%', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
                    onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag}>
                    <CardRenderer document={doc} data={SAMPLE_DATA} mode="edit" selectedLayerId={selectedId || undefined} onSelectLayer={setSelectedId} />
                    {/* interaction overlay for the selected layer */}
                    {selected && (
                        <div style={{ position: 'absolute', left: `${selected.box.x}%`, top: `${selected.box.y}%`, width: `${selected.box.w}%`, height: `${selected.box.h}%`, outline: '2px solid var(--primary,#c8a951)', cursor: 'move', touchAction: 'none' }}
                            onPointerDown={(e) => startDrag(e, 'move')}>
                            <div onPointerDown={(e) => startDrag(e, 'resize')}
                                style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: 'var(--primary,#c8a951)', borderRadius: 2, cursor: 'nwse-resize', touchAction: 'none' }} />
                        </div>
                    )}
                </div>
                {!doc.background.imageUrl && <p style={{ color: '#888' }}>Upload a background to start.</p>}
            </main>

            {/* Right: style panel */}
            <aside style={{ borderLeft: '1px solid #e6e4de', padding: 12, overflowY: 'auto' }}>
                {!selected ? (
                    <p style={{ color: '#999' }}>Select a layer to style it.</p>
                ) : (
                    <>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Layer</div>
                        <label>Binding</label>
                        <select value={selected.binding} onChange={(e) => patchLayer(selected.id, { binding: e.target.value as Binding })} style={row}>
                            {BINDINGS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                        </select>
                        {selected.binding === 'static' && (
                            <>
                                <label>Text</label>
                                <input value={selected.text || ''} onChange={(e) => patchLayer(selected.id, { text: e.target.value })} style={row} />
                            </>
                        )}
                        <label>Font</label>
                        <select value={selected.style.fontFamily} onChange={(e) => patchStyle(selected.id, { fontFamily: e.target.value })} style={row}>
                            {TEMPLATE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <label>Size (cqw): {selected.style.fontSize}</label>
                        <input type="range" min={1.5} max={16} step={0.1} value={selected.style.fontSize} onChange={(e) => patchStyle(selected.id, { fontSize: +e.target.value })} style={{ width: '100%' }} />
                        <div style={{ display: 'flex', gap: 8, margin: '6px 0' }}>
                            <div><label>Color</label><input type="color" value={selected.style.color || '#000000'} onChange={(e) => patchStyle(selected.id, { color: e.target.value })} /></div>
                            <div><label>Weight</label>
                                <select value={selected.style.weight || 400} onChange={(e) => patchStyle(selected.id, { weight: +e.target.value })} style={{ width: 70 }}>
                                    {[300, 400, 500, 600, 700].map((w) => <option key={w} value={w}>{w}</option>)}
                                </select>
                            </div>
                        </div>
                        <label>Align</label>
                        <select value={selected.style.align || 'center'} onChange={(e) => patchStyle(selected.id, { align: e.target.value as any })} style={row}>
                            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                        </select>
                        <label style={{ display: 'block', marginTop: 6 }}>
                            <input type="checkbox" checked={!!selected.style.italic} onChange={(e) => patchStyle(selected.id, { italic: e.target.checked })} /> Italic
                        </label>
                        <div style={{ fontWeight: 600, margin: '12px 0 6px' }}>Position (%)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                            {(['x', 'y', 'w', 'h'] as const).map((k) => (
                                <label key={k}>{k.toUpperCase()}
                                    <input type="number" value={Math.round(selected.box[k])} onChange={(e) => patchBox(selected.id, { [k]: clamp(+e.target.value, 0, 100) } as any)} style={{ width: '100%', padding: 4 }} />
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}

const row: React.CSSProperties = { width: '100%', padding: 6, margin: '2px 0 10px', border: '1px solid #ddd', borderRadius: 6 };
