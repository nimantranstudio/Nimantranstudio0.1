# Standardized Template Model — Structured Cards + Auto Video

Date: 2026-07-26
Status: Approved design (pending spec review → implementation plan)

## Problem

Today each invitation template is a hand-authored **HTML file** (built in Google
AI Studio, downloaded, uploaded via admin). The HTML embeds a base64 background
image plus absolutely-positioned `.text-block` elements, and couple data is
injected into it via an iframe + `postMessage`. Separately, **videos** use a
structured JSON (`VideoTemplate.config` — layers/text/animations/audio) rendered
by Remotion. The two pipelines are divergent, and authoring a new card means
writing bespoke HTML every time.

## Goal

Replace per-template HTML with a single **structured card model**. The admin
uploads a background and positions text zones visually — no HTML. The same model
drives the static card, the download, the WhatsApp hero image, **and** an
auto-generated animated video, from one renderer.

## Decisions (confirmed)

1. **Every background is different** → text must be positioned per-card → a
   visual drag/resize editor, not fixed layouts.
2. **Video = animated version of the card** (text reveals, gentle background
   motion, music) auto-generated from the same layout — no extra per-card
   authoring.
3. **Replace everything** → migrate all existing HTML templates into the new
   model via a semi-automated converter, then retire the iframe path.
4. **Renderer: one React component shared by app + video + editor** (Approach A).
   Remotion is React, so the same component renders the static card, the Remotion
   video, and the editor — they cannot drift.

## Architecture

```
                     ┌──────────────────────────┐
   Admin editor ───▶ │   CardDocument (JSON)     │ ◀─── Migration converter
   (upload bg,       │  bg + positioned layers   │      (from legacy HTML)
    drag zones)      └────────────┬─────────────┘
                                  │  + coupleData
                     ┌────────────▼─────────────┐
                     │   <CardRenderer/>        │  one component, three modes
                     └──┬──────────┬──────────┬─┘
              static ───┘   video ─┘   edit ──┘
           (card, download,   (Remotion      (draggable
            WhatsApp hero)     composition)    zones)
```

## 1. The Card Document (data model)

A template is this object (no longer a file). All positions/sizes are
**percentages of the canvas** → resolution-independent (renders crisp on the card
preview, the high-res download, and a 1080×1440 video frame from one definition).

```jsonc
{
  "id": "...", "name": "Sohala — Mehendi", "eventType": "mehendi",
  "canvas": { "aspectRatio": "3:4" },
  "background": {
    "imageUrl": "https://.../sohala-mehendi-bg.png",   // Firebase Storage
    "fit": "cover",
    "motion": { "type": "zoom", "amount": 1.08 }        // video only; card ignores
  },
  "layers": [
    { "id": "l1", "binding": "eventName",  "box": {"x":12,"y":18,"w":76,"h":8},
      "style": {"fontFamily":"Great Vibes","fontSize":9,"weight":400,"color":"#5b3a1a","align":"center"},
      "anim":  {"type":"fade-up","delay":300,"duration":700} },
    { "id": "l2", "binding": "groomName",  "box": {"x":10,"y":30,"w":80,"h":8}, "style": {...}, "anim": {...} },
    { "id": "l3", "binding": "brideName",  "box": {"x":10,"y":42,"w":80,"h":8}, "style": {...}, "anim": {...} },
    { "id": "l4", "binding": "static", "text": "Venue:", "box": {...}, "style": {...}, "anim": {...} },
    { "id": "l5", "binding": "venue",      "box": {...}, "style": {...}, "anim": {...} }
  ],
  "audio": { "url": "https://.../track.mp3" }             // video only
}
```

Design decisions:
- **Percent geometry** (`box.x/y/w/h`) → one document, every output size.
- **Per-layer `binding`** → the couple's data fills the zone at render time; admin
  positions the zone, never the actual names.
- **Per-layer `style`** → each zone carries its own font/size/color/alignment,
  because every background is different.
- **Per-layer `anim` + background `motion` + `audio`** → read only by the video
  path; the static card ignores them. One document, two outputs, no duplication.

Grounding in the real Sohala templates: the current `.text-block` elements map
onto bound layers — `eventName` → `eventName`; the couple/heading line(s) →
`groomName` + `brideName`; the `details` block (which holds "Venue:", a date,
etc.) is **decomposed** into separate zones: `static` labels ("Venue:") plus
`venue` / `eventDate` value zones. Any line that doesn't map cleanly becomes a
`static` layer preserving its current text, for the admin to re-bind in the
editor. `fontSize` is expressed relative to the canvas (replacing the templates'
`cqi` container-query units), so the percentage model preserves the existing
responsive behavior.

## 2. CardRenderer (one component, three modes)

`<CardRenderer document data mode="static|video|edit" frame? />`

Renders a fixed-aspect container → the background (with `fit`, and in `video` mode
the `motion`) → each layer as an absolutely-positioned styled element whose text
is `data[layer.binding]` (or `layer.text` for `static`).

- **static** — final card: app display, PNG download, WhatsApp hero capture.
- **video** — same output; applies each layer's `anim` and the background `motion`
  via Remotion's `interpolate(frame, ...)`.
- **edit** — same output; wraps each zone in drag/resize handles + a style panel.

Fonts: a shared, curated web-font list (the fonts already used across templates —
Playfair Display, Great Vibes, Cormorant Garamond, Montserrat, Alex Brush, etc.)
loaded once, so all three modes render identically.

**Bonus:** because CardRenderer is plain React DOM (no iframe), the WhatsApp
hero-card capture (previously fragile `html2canvas`-on-iframe) becomes reliable —
this design fixes that as a side effect.

## 3. Admin editor (`/admin/templates`)

Replaces the Google-AI-Studio → download → upload loop:
1. Upload background → Firebase Storage (reuses the existing card-upload pipeline).
2. Pick canvas aspect ratio.
3. Add zone → choose a binding from a dropdown; drag to position, resize.
4. Style panel per zone: font, size, weight, italic, color, alignment,
   line-height, letter-spacing.
5. Live preview with sample couple data; "Preview animation" plays the video
   reveal inline (same CardRenderer, `mode="video"`).
6. Save → persists the CardDocument JSON.

## 4. Video composition (Remotion)

One generic composition `<AnimatedCard document data />` renders CardRenderer in
`video` mode over an ~8–12s timeline: text zones reveal per their `anim`, the
background does its `motion`, `audio` plays. Rendered server-side through the
existing `src/lib/video-renderer.ts` (Remotion `bundle` + `renderMedia`). The
current `VideoTemplate.config` is absorbed into the CardDocument (animation now
lives on the layers), unifying the two systems.

## 5. Data binding vocabulary

Fixed set, sourced from `WeddingFormData`:
`brideName, groomName, brideParents, groomParents, eventName, eventDate,
eventTime, venue, mapLink, message, rsvpContact`, plus `static` (literal text).
The renderer resolves `binding → coupleData[field]` with graceful fallback (empty
or a subtle placeholder in edit mode). The same vocabulary applies to every
event type; `eventType` on the document is a label/filter only.

## 6. Migration converter (legacy HTML → CardDocument)

A one-time, semi-automated tool:
- Parse each existing template HTML.
- Extract the base64 background from `background-image: url(data:image...)` →
  decode → upload to Firebase Storage → get the URL.
- For each `.text-block`, read its computed position/size (→ percentage `box`) and
  inline/class style (→ `style`), and infer `binding` from the class against the
  Section 5 vocabulary (`eventName` → `eventName`; couple/heading line →
  `groomName`/`brideName`; a `details` block is split into `static` labels +
  `venue`/`eventDate` value zones). Anything ambiguous → `static` carrying its
  current text, for the admin to re-bind in the editor.
- Emit a **draft CardDocument** per template.
- Admin opens each draft in the new editor, nudges positions, confirms bindings,
  saves. ~80% automatic; human finishes.

Rollout: keep legacy iframe rendering live for un-migrated templates; switch a
template to CardRenderer once its CardDocument is verified; retire the iframe path
after all are migrated.

## 7. Storage / data model changes

- New/updated `Template` record carries `layout Json` (the CardDocument),
  replacing `BundleItem.templatePath` (a file path) with a structured reference.
- Backgrounds live in Firebase Storage.
- `VideoTemplate` is absorbed (animation lives in the layout); retained only if a
  global video setting (default audio, duration) is still wanted.
- `InvitationCard` (iframe) is replaced by `CardRenderer`; its `captureDataUrl`
  path simplifies to a standard DOM capture.

## Phasing (to de-risk the "replace everything" scope)

- **Phase 1 — Model + renderer:** CardDocument type + `<CardRenderer>` (static +
  edit modes). Render one migrated template end-to-end in the app.
- **Phase 2 — Editor:** the admin drag/style editor + background upload + save.
- **Phase 3 — Migration converter:** batch-convert legacy templates to drafts.
- **Phase 4 — Video:** Remotion `AnimatedCard` composition + wire into
  `video-renderer.ts`.
- **Phase 5 — Cutover:** migrate all, switch app to CardRenderer, retire iframe.

Each phase is independently shippable and testable.

## Out of scope (for now)

- Multi-scene "story" videos (the model leaves room for it later via richer
  `anim`, but Phase 4 is animated-card only).
- Non-text layers (stickers, shapes) beyond background + text zones.
- End-user (couple-facing) template editing — this is admin authoring only.

## Testing

- CardRenderer: snapshot a known CardDocument + sample data in static mode; assert
  each bound field appears at the expected % position.
- Binding: missing field → graceful fallback, no crash.
- Editor: create → position → save → reload round-trips the CardDocument.
- Migration: run the converter on a real Sohala template; assert background
  extracted + N layers with plausible bindings; open in editor and render.
- Video: render a short AnimatedCard; assert output dimensions + that the same
  document produces a card whose final frame matches the static card.
