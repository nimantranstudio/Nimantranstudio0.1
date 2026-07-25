# Implementation Plan — Standardized Template Model

Spec: `docs/superpowers/specs/2026-07-26-standardized-template-model-design.md`
Date: 2026-07-26

Five independently-shippable phases. Each ends buildable and testable; the app
keeps working throughout (legacy iframe stays live until Phase 5 cutover).

---

## Phase 1 — Model + Renderer (foundation)

**Goal:** the CardDocument type and a shared `<CardRenderer>` that renders a
document + couple data as a static card, demoable end-to-end.

1. `src/lib/templates/card-document.ts`
   - Types: `CardDocument`, `Layer`, `Binding` (union of the field vocabulary +
     `"static"`), `Box`, `LayerStyle`, `LayerAnim`, `BackgroundMotion`.
   - `BINDINGS` list + `resolveBinding(binding, data, layer)` → returns the text.
   - `SAMPLE_DATA` (placeholder couple) for previews.
2. `src/lib/templates/fonts.ts` — the curated web-font list (Playfair Display,
   Great Vibes, Cormorant Garamond, Montserrat, Alex Brush, Pinyon Script,
   Dancing Script) + a `<TemplateFonts/>` loader (or a globals.css @import).
3. `src/components/card/CardRenderer.tsx`
   - Props: `{ document, data, mode?: "static" | "edit" | "video", frame?, fps? }`.
   - Fixed-aspect container from `canvas.aspectRatio`; background layer (`fit`);
     each layer absolutely positioned by `box` (%), styled by `style`, content =
     `resolveBinding(...)`. `fontSize` interpreted as % of canvas height.
   - `static` mode fully implemented; `edit`/`video` hooks stubbed (no-ops now).
   - `CardRenderer.module.css`.
4. `src/lib/templates/sample-document.ts` — one hand-written CardDocument matching
   a Sohala card (bg URL + ~5 layers) as a fixture.
5. Demo route `src/app/(dev)/card-demo/page.tsx` (or a temporary admin page) that
   renders the sample with SAMPLE_DATA. Build + eyeball.

**Done when:** the sample document renders a recognizable card; bound fields
appear at their % positions; `npm run build` passes.

---

## Phase 2 — Admin editor

**Goal:** author a CardDocument visually; no HTML.

1. `CardRenderer` `edit` mode: per-layer drag + resize handles (pointer events →
   update `box` in %), selection state.
2. `src/app/admin/templates/editor/page.tsx` (client):
   - Background upload → reuse `/api/cards/upload` (Firebase Storage) → set
     `background.imageUrl`.
   - Canvas aspect-ratio picker.
   - "Add zone" → append a layer with a chosen `binding`; drag/resize on canvas.
   - Style panel (font, size, weight, italic, color, align, line-height,
     letter-spacing) bound to the selected layer.
   - Live preview with `SAMPLE_DATA`; "Preview animation" toggles `video` mode
     (works after Phase 4; until then it just shows static).
3. Persistence: `POST /api/admin/templates` → save the CardDocument (see storage
   below). List/edit existing.
4. Storage (schema): add a `Template` model (or extend the current one) with
   `layout Json`, `name`, `eventType`, `themeId?`. `prisma db push` (project uses
   db push, not migrations).

**Done when:** create a template from scratch (upload bg → place zones → style →
save), reload, and it round-trips + renders via CardRenderer.

---

## Phase 3 — Migration converter (legacy HTML → CardDocument)

**Goal:** turn existing HTML templates into draft CardDocuments.

1. `scripts/migrate-templates.ts` (Node, run locally):
   - For each legacy template (files under `public/Image/bundle/*.html` and/or
     `BundleItem.templatePath`): parse with a DOM lib (`node-html-parser` or
     `jsdom`).
   - Extract base64 background from `background-image: url(data:image...)` →
     decode → upload to Firebase Storage → get URL.
   - For each `.text-block`: compute `box` (%) from its inline position/size,
     map `style`, infer `binding` per the spec (eventName/couple/details→venue+
     date; else `static`). Emit a draft CardDocument JSON.
   - Write drafts to `Template` rows (status `draft`) or JSON files for review.
2. Report: per template, N layers + inferred bindings + any unmapped lines.
3. Admin opens each draft in the Phase 2 editor, nudges, confirms, marks ready.

**Done when:** a real Sohala template converts to a draft that renders in
CardRenderer with the background + plausible zones.

---

## Phase 4 — Video (Remotion AnimatedCard)

**Goal:** auto video from the same document.

1. `remotion-templates/AnimatedCard.tsx` — a Remotion composition rendering
   `<CardRenderer mode="video" document data frame fps />` over ~8–12s; wire
   `useCurrentFrame()` into each layer's `anim` (opacity/translate via
   `interpolate`) and background `motion` (scale), plus `<Audio>` from
   `document.audio`.
2. `CardRenderer` `video` mode: apply the per-layer anim + bg motion using the
   passed `frame`/`fps`.
3. Register the composition in `remotion-templates/index.tsx`; drive it from
   `src/lib/video-renderer.ts` (pass the CardDocument + data as input props).
4. Absorb `VideoTemplate.config` into the CardDocument (animation on layers).

**Done when:** rendering a document produces an MP4 whose final frame matches the
static card, with text reveals + bg motion + audio.

---

## Phase 5 — Cutover

**Goal:** one renderer; retire the iframe.

1. Migrate all remaining legacy templates (Phase 3 converter + review).
2. Switch every app surface that renders `InvitationCard` (preview, payment,
   dashboard, assets, hero capture) to `CardRenderer` reading the template's
   `layout`.
3. Replace the WhatsApp hero-capture path with a DOM capture of `CardRenderer`
   (simpler than the iframe html2canvas).
4. Remove the iframe `InvitationCard` and `templatePath` file dependencies once
   nothing references them.

**Done when:** no code path renders legacy HTML; all cards + videos come from
CardDocuments.

---

## Cross-cutting

- **Reuse:** background upload = existing `/api/cards/upload` + Firebase Storage.
- **Testing per phase:** as listed in the spec's Testing section.
- **Safety:** legacy path stays live until Phase 5; each phase builds green.
- **DB:** project uses `prisma db push` (no migrations) — apply schema via push.
