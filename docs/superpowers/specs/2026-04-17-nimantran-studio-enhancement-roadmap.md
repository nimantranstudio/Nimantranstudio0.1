# Nimantran Studio — Comprehensive Enhancement Roadmap
**Date:** 2026-04-17  
**Reviewed by:** Claude Code (all 15 skills)  
**Strategy:** Option C — Parallel Tracks  
**Primary Pain Points:** Conversion (A) + Retention/Referral (C)

---

## Executive Summary

Nimantran Studio is a well-conceived, thoughtfully designed product with a clear market: Indian families who want elegant, WhatsApp-first digital wedding invitations without subscription fees. The core design intent (warm antique gold + deep teal + Playfair Display + Inter) is correct and confirmed by design system analysis. The product has real traction signals — the RSVP dashboard creates genuine return visits.

**The core problem is not the product. It is that the product is not yet working for you.**

- You have **no analytics** — you are optimizing blind
- You have **no viral loop** — every invitation shared on WhatsApp is a missed acquisition
- You have **no real payment** — the payment page shows an `alert()` dialog
- You have **critical security vulnerabilities** — hardcoded OTP bypasses in production code
- Your **brand voice is inconsistent** — the copy does not match the premium visual intent

This roadmap fixes all of the above across two parallel tracks.

---

## Roadmap Structure

```
Track 1 (Weeks 1–4): Foundation & Quick Wins
├── 1.1  Security — Fix critical vulnerabilities
├── 1.2  Analytics — Install observability before anything else
├── 1.3  Viral Loop Seed — Brand every invitation image
├── 1.4  Conversion — Fix trust signals and copy
└── 1.5  Stability — Fix crashes and silent failures

Track 2 (Weeks 5–12): Growth & Consolidation
├── 2.1  Revenue — Integrate real payment (Razorpay)
├── 2.2  Retention — Make RSVP dashboard stickier
├── 2.3  Referral — Build active referral mechanism
├── 2.4  Design System — Consolidate CSS chaos
└── 2.5  Architecture — Remove tech debt and harden security
```

---

## Track 1: Foundation & Quick Wins (Weeks 1–4)

### 1.1 Security — CRITICAL, Fix Before Anything Else

**Skill source:** `simplify` + code audit

These are production security holes that must be fixed immediately, before any marketing or growth work.

#### Finding 1: Hardcoded OTP Bypass
**File:** `src/app/api/auth/otp/verify/route.ts:18-29`  
**Severity:** CRITICAL

```typescript
// CURRENT — DANGEROUS: Anyone who reads your source code can log in as any account
if (
    (mobileNumber === '8087084358' && otp === '422101') ||
    (mobileNumber === ADMIN_MOBILE && otp === '422101')
) { ... }
```

**Fix:**
- Remove the hardcoded bypass entirely
- Move admin mobile number to an environment variable (`ADMIN_MOBILE_NUMBER`)
- Use a test environment flag (`NODE_ENV !== 'production'`) for any development bypasses
- Rotate the admin OTP immediately

#### Finding 2: Admin Mobile Hardcoded in Source
**File:** `src/app/api/auth/otp/verify/route.ts:3`
```typescript
const ADMIN_MOBILE = '8884678194'; // Remove this line
```
Move to `.env`: `ADMIN_MOBILE_NUMBER=8884678194`

#### Finding 3: Client-Side Admin State — Auth Bypass Risk
**File:** `src/store/wedding-store.ts`  
The `isAdmin` flag is stored in Zustand with `persist` middleware, meaning it's saved to localStorage. A user can open DevTools and set `isAdmin: true`.

**Fix:** Never trust client-side `isAdmin`. All admin API routes must validate the session server-side (check user role from database, not from the request body or a client cookie).

#### Finding 4: No Rate Limiting on OTP Endpoint
**File:** `src/app/api/auth/otp/send/route.ts`  
No rate limiting means anyone can flood your SMS/OTP provider with requests using any phone number.

**Fix:** Add rate limiting using `attemptCount` check already in your schema, or use Upstash Redis for IP-based rate limiting. Limit to 3 OTP requests per phone number per 10 minutes.

#### Finding 5: RSVP Silent Success on Failure
**File:** `src/app/rsvp/[id]/RSVPForm.tsx:55-68`
```typescript
} else {
    // FAILOVER: Allow successful UI state even if database submission fails
    console.warn('Simulating successful submission due to DB error');
    setShowSuccessPetals(true);
    setTimeout(() => setStep('SUCCESS'), 500);
}
```
This means guests believe they RSVP'd when they did not. The couple sees wrong headcount. This is a data integrity issue, not a UX improvement.

**Fix:** Show a proper error state with retry option. Do not pretend success on failure.

---

### 1.2 Analytics — Install Before Optimizing Anything

**Skill source:** `brainstorming` (Question 5: no analytics), `update-config`, `claude-api`

You cannot improve conversion or referral without knowing where people come from and where they drop off.

#### Step 1: Install Vercel Analytics (5 minutes)
```bash
npm install @vercel/analytics
```
Add to `src/app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';
// Inside <body>:
<Analytics />
```
This gives you: page views, unique visitors, top pages, referrers, countries — for free on Vercel.

#### Step 2: Add Conversion Funnel Events
Track these specific events using a lightweight custom hook or `va.track()`:

| Event | Where | Why |
|-------|-------|-----|
| `theme_viewed` | ThemeCard click | Which themes get interest |
| `theme_selected` | Theme detail → Select | Intent signal |
| `bundle_selected` | Bundle picker | Which plan converts |
| `payment_initiated` | Payment page load | Funnel entry |
| `payment_completed` | Post-payment | Revenue |
| `rsvp_submitted` | RSVP form submit | Viral metric |
| `invitation_shared` | Share button click | Viral metric |

#### Step 3: Set Up a Simple Dashboard
Use Vercel Analytics dashboard or export data to a Google Sheet weekly. Track these KPIs:
- **Conversion rate:** Theme views → Purchase
- **Drop-off point:** Where in the funnel users leave
- **Top traffic source:** Once you have data, double down on what works
- **Viral coefficient:** RSVPs submitted per invitation (proxy for sharing)

---

### 1.3 Viral Loop Seed — Brand Every Invitation

**Skill source:** `brainstorming` (Question 4: branding unknown), `brand`, `banner-design`

Every invitation shared on WhatsApp is seen by 50–300 guests. At ₹999 per sale, if 1% of guests become future customers, each invitation generates ₹500–₹3,000 in future revenue — without any marketing spend.

**Current state:** Unknown. The invitation images likely have no branding.

#### Action: Add "Made with Nimantran Studio" to Every Invitation

Two places:
1. **Invitation images** — A subtle, elegant footer watermark on the bottom of every generated image. Must be tasteful, not obtrusive. Use the antique gold color `#C8A951` in small Playfair Display italic.
2. **RSVP landing page** — Footer: "Powered by Nimantran Studio · nimantranstudio.com" with link.

**Design guidance** (`ui-ux-pro-max` + `design`):
- Position: Bottom center of invitation image, 12px Playfair Display italic
- Color: `rgba(200, 169, 81, 0.7)` — visible but not dominant
- Text: "nimantranstudio.com" (just the URL, no logo needed on image)
- On RSVP page: Full "Made with ♥ by Nimantran Studio" in footer

**This single change is the highest ROI item in this entire document.**

---

### 1.4 Conversion — Fix Trust Signals and Copy

**Skill source:** `brand`, `ui-ux-pro-max` (landing domain: Hero + Testimonials + CTA pattern)

#### Finding: Testimonials Are Fabricated
**File:** `src/components/home/TestimonialSection.tsx`  
Testimonials reference dates like "Married March 2026" (future as of writing). These appear to be placeholder copy.

**Fix options (choose one):**
- **A) Remove testimonials entirely** until you have 5 real ones with photos and permission to use
- **B) Replace with metrics**: "500+ families trust Nimantran" or "4.8★ from early users" if you have real data
- **C) Clearly label as "Early Feedback"** and collect real testimonials immediately by emailing every customer

Real social proof > fabricated social proof. Fabricated testimonials erode trust when discovered.

#### Finding: Hero Copy Is Functional, Not Emotional

**Current H1:** "Digital Wedding Invitations and Smart RSVP Tracking"  
This describes the product. It does not speak to the feeling.

**Brand voice analysis** (`brand` skill — Voice Framework):  
Nimantran's voice should be: **Warm, Confident, Culturally Attuned**  
- Formal/Casual balance: Slightly casual (talking to family, not a corporation)
- Simple/Complex: Simple — target is not tech-savvy
- Serious/Playful: Warm celebration, not playful or gimmicky
- Reserved/Expressive: Expressive — this is a joyous life event

**Messaging Framework** (`brand` skill):

| Layer | Content |
|-------|---------|
| **Mission** | We help Indian families celebrate milestones beautifully, without the stress |
| **Vision** | Every Indian wedding invite is a digital keepsake, not a printed afterthought |
| **Value Prop** | For Indian families planning a wedding, Nimantran is the invitation platform that handles everything — design, sharing, and guest tracking — in one place. Unlike printing shops or generic tools, we are built for the Indian wedding format with multiple events, WhatsApp sharing, and live RSVP |
| **Primary message** | Your wedding deserves a beautiful invitation. We make it effortless. |

**Recommended H1 rewrites:**

Option A (Emotional):  
> "Your Wedding, Beautifully Announced"  
> *Create elegant digital invitations for every ceremony — shared in minutes on WhatsApp.*

Option B (Benefit-first):  
> "One Invitation Suite. Every Ceremony. No Stress."  
> *From Haldi to Reception — create, share, and track RSVPs for your entire wedding in under 5 minutes.*

Option C (Family-centric):  
> "Send Wedding Invitations the Way India Celebrates"  
> *Beautiful digital invites for all your ceremonies, delivered on WhatsApp with live RSVP tracking.*

#### Finding: ThemeCard Has a Debug Hack
**File:** `src/components/ui/ThemeCard.tsx:10`
```typescript
const isBestSeller = theme.isBestSeller || theme.name.toLowerCase().includes('test theme');
```
Remove the `test theme` string check. This is a development artifact in production.

#### Finding: Pricing Section CTA Is Broken
**File:** `src/components/home/PricingSection.tsx`  
The "Create My Invitation" CTA button in `PricingSection` has no `onClick` or `href`. It renders as a dead button.

**Fix:** Add `onClick={() => router.push('/themes')}` or wrap in a `<Link href="/themes">`.

---

### 1.5 Stability — Fix Crashes and Broken Configurations

**Skill source:** `simplify`, `ui-ux-pro-max`, `update-config`

#### Fix 1: Tailwind Config Is Empty
**File:** `tailwind.config.js`
```javascript
// CURRENT — Tailwind is installed but not purging anything
module.exports = {
  content: [],  // BUG: No files listed
  theme: { extend: {} },
  plugins: [],
}
```
**Fix:**
```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
```
Without this, Tailwind ships its entire CSS bundle (several MB) to every user.

#### Fix 2: html font-size: 80% — Accessibility Violation
**File:** `src/app/globals.css:43`
```css
html {
  font-size: 80%; /* BUG: Overrides user browser zoom preference */
}
```
`ui-ux-pro-max` confirms: minimum 16px body text on mobile. Using a percentage on `html` undermines browser accessibility settings for users who need larger text.

**Fix:** Remove `font-size: 80%` from `html`. Instead, use `clamp()` on specific headings that need size control:
```css
html { font-size: 100%; } /* Respect user preference */
h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
```

#### Fix 3: package.json Name
**File:** `package.json:2`
```json
"name": "temp-app"  // Change to "nimantran-studio"
```

#### Fix 4: Add Loading Skeletons for Theme Grid
**File:** `src/app/page.tsx:117`  
The theme grid shows plain text "Loading themes..." while fetching. `ui-ux-pro-max` (Animation: Loading States, Severity: High) recommends skeleton screens.

Minimum viable skeleton:
```tsx
// While loading, show 4 placeholder cards matching ThemeCard dimensions
{loading && Array.from({ length: 4 }).map((_, i) => (
  <div key={i} style={{ 
    height: '380px', background: 'var(--muted)', 
    borderRadius: 'var(--radius)', animation: 'pulse 1.5s infinite' 
  }} />
))}
```

---

## Track 2: Growth & Consolidation (Weeks 5–12)

### 2.1 Revenue — Integrate Real Payment

**Skill source:** `claude-api` (AI-enhanced recommendations), `simplify`

**Current state:** `src/app/payment/page.tsx` shows `alert("Payment Gateway Integration Pending!")`.

#### Recommended: Razorpay Integration

Razorpay is the standard for Indian SaaS. It supports UPI, net banking, cards, and wallets natively.

**Integration steps:**
1. Install: `npm install razorpay`
2. Server: Create `/api/payment/create-order` route that creates a Razorpay order
3. Client: Load Razorpay checkout script, open modal on payment page
4. Webhook: Create `/api/payment/webhook` to handle payment success/failure
5. On success: Create the `Order` record in your DB, unlock dashboard access

**What to unlock post-payment:**
- Dashboard access for the purchased wedding
- Download capability for invitation images
- RSVP link generation

**Pricing architecture review:**  
Currently showing ₹999 as a single price in the homepage but your database schema supports multiple packages (`BundleInvoice`). Consider surfacing this:
- **WhatsApp Essentials** ₹999 — WhatsApp images + RSVP (current)
- **Print Ready** ₹1,499 — Adds print-quality PDFs
- **Complete Suite** ₹1,999 — All digital + print assets

The Complete Suite anchors the Essentials price as a bargain, increasing Essentials conversion.

---

### 2.2 Retention — Make the RSVP Dashboard Stickier

**Skill source:** `ui-ux-pro-max`, `brainstorming` (Q3: RSVP brings some back), `claude-api`

The RSVP dashboard is your best retention asset. Currently it shows guest count and responses. To make couples visit daily (or have a reason to share it with family):

#### Enhancement 1: Live RSVP Counter Widget
Add a shareable, live-updating guest count widget. A URL like `nimantranstudio.com/rsvp/[id]/live` that families can put on a group chat shows real-time attendance count as a simple, beautiful display. This creates daily return visits from the couple AND exposes the brand to the family group chat.

#### Enhancement 2: WhatsApp Reminder Templates
Add one-click buttons to send RSVP reminder messages to non-responders via WhatsApp Web deep links:
```
wa.me/?text=Hi! We noticed you haven't responded to our wedding RSVP. Please confirm your attendance at [link]
```

#### Enhancement 3: Event Countdown on Dashboard
Show a countdown to the wedding day prominently on the dashboard. Creates daily emotional engagement — the couple checks the dashboard to see "17 days to go, 48 confirmed guests."

#### Enhancement 4: Guest Segmentation View
Beyond total count, show: Attending / Declined / No response — with a list the couple can filter. Currently this data is collected but the dashboard UI is basic.

---

### 2.3 Referral — Build the Flywheel

**Skill source:** `brainstorming`, `brand`, `claude-api`

A referral loop turns customers into acquisition channels. For a ₹999 product in a high-trust category (weddings), referrals are the most effective growth channel.

#### Mechanism: "Thank a Friend" Post-Purchase Flow

After successful payment, show a dedicated referral screen:

> "Your invitations are ready! Share Nimantran with a newly engaged couple and you'll both get ₹100 off."

**Implementation:**
1. Generate a unique referral code per user (stored in `User` model, add `referralCode` field)
2. Landing page URL: `nimantranstudio.com/r/[code]`
3. When a referred user purchases, credit ₹100 to referrer (store as `referralCredit`)
4. Apply credit at checkout

**Why this works:** Wedding guests become the top-of-funnel. Every person who receives an invitation from a Nimantran customer is a warm lead — they just attended or are attending an Indian wedding.

#### Mechanism: "Powered by" as a Referral Signal

The subtle watermark from Track 1.3 passively acquires. The active referral from this section converts those who notice it. These work together.

---

### 2.4 Design System — Consolidate CSS Chaos

**Skill source:** `design-system`, `ui-styling`, `ui-ux-pro-max`

#### Current State Assessment

| Problem | File | Impact |
|---------|------|--------|
| `page.module.css` is 1,876 lines | `src/app/page.module.css` | Unmaintainable, high specificity conflicts |
| `theme-detail.module.css` is 1,428 lines | `src/app/themes/[themeId]/` | Same issue |
| `dashboard.module.css` is 1,773 lines | `src/app/dashboard/` | Same issue |
| Tailwind content is empty | `tailwind.config.js` | Full Tailwind bundle shipped |
| `html { font-size: 80% }` | `globals.css` | Accessibility violation |
| Design tokens defined but not systematically used | `globals.css` | Inconsistency |

**The core problem:** CSS Modules were chosen for scoping but the files have grown monolithic. Tailwind was added later but never properly configured. The result is two parallel systems that don't reinforce each other.

#### Recommended: Three-Layer Token System (`design-system` skill)

```
Layer 1: Primitive tokens (raw values)
  --color-gold-500: #C8A951
  --color-teal-900: #0A252C
  --space-4: 1rem

Layer 2: Semantic tokens (intent)
  --color-primary: var(--color-gold-500)
  --color-surface: var(--color-warm-50)
  --space-section: var(--space-16)

Layer 3: Component tokens (component-specific)
  --card-padding: var(--space-4)
  --card-radius: var(--radius)
  --card-shadow: 0 2px 8px rgba(0,0,0,0.08)
```

Your `globals.css` already has layer 2 partially defined. The missing pieces are layer 1 primitives and layer 3 component tokens.

#### Migration Strategy (don't rewrite everything at once)

1. **Fix Tailwind config** (Track 1.5, already listed)
2. **Stop adding to large CSS files** — any new components go into Tailwind utilities
3. **Extract components** — when touching an existing CSS Module file, extract repeated patterns into Tailwind classes
4. **Component library target:** `ThemeCard`, `Navbar`, `Footer`, `Button` — convert these to Tailwind-first as they are shared everywhere

#### Typography Upgrade Option

`ui-ux-pro-max` confirmed Playfair Display + Inter is the right pairing ("Classic Elegant" — Best For: Luxury brands, editorial, high-end). You do not need to change fonts.

**Optional enhancement:** Add `Cormorant Garamond` as a display/script accent for invitation templates only (the invitation images themselves, not the UI). This gives the invitations a distinctly romantic feeling while keeping the UI clean with Playfair + Inter.

---

### 2.5 Architecture — Remove Tech Debt

**Skill source:** `simplify`, `update-config`, `schedule`

#### Debt 1: Two Prisma Generated Clients
**Files:** `src/generated/client/` AND `src/generated/client_new/`  
Two generated Prisma clients means double the bundle size and potential for using the wrong client in different files.

**Fix:** Determine which is canonical (likely `client_new` since it's newer), update all imports to use one, delete the other, update `prisma.schema` generator output path.

#### Debt 2: Root-Level Debug Scripts
Files like `check_bundles.js`, `check_events.js`, `check_packages.js`, `clear_db.js`, `debug_events.js` are in the repo root. These are developer utilities that:
- Expose database schema knowledge if repo becomes public
- Add noise to the project root
- Risk being accidentally run

**Fix:** Move to `scripts/debug/` directory with a clear README, and add to `.gitignore` if containing sensitive output patterns.

#### Debt 3: No Error Monitoring
Without Sentry or equivalent, production errors are invisible. You only know about bugs when customers complain.

**Fix:** Install Sentry Next.js SDK:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### Debt 4: No CI/CD Pipeline
No `.github/workflows/` directory exists. There is no automated testing, linting, or deployment checks.

**Minimum viable CI** (GitHub Actions):
```yaml
# .github/workflows/ci.yml
- Lint (eslint)
- Type check (tsc --noEmit)
- Build check (next build)
```
This prevents broken builds from reaching production.

#### Debt 5: TypeScript `any` Types
Extensive use of `any` in API responses and component props removes the safety net TypeScript provides. Priority files to type:
1. `src/app/api/admin/packages/route.ts`
2. `src/app/dashboard/page.tsx` (uses `any[]` for preview items)
3. `src/app/payment/page.tsx` (uses `any` throughout)

Add `"strict": true` to `tsconfig.json` as a long-term goal.

---

## Skill-by-Skill Contribution Summary

| Skill | Finding | Track |
|-------|---------|-------|
| `brainstorming` | Identified conversion + referral as core pain; no analytics as root cause | Foundation |
| `ui-ux-pro-max` | Confirmed Playfair+Inter pairing; flagged font-size:80%, empty Tailwind, skeleton loaders, loading states | 1.5, 2.4 |
| `design-system` | Three-layer token architecture; CSS Module file size crisis | 2.4 |
| `brand` | Voice = Warm/Confident/Cultural; H1 copy rewrites; testimonial crisis | 1.4 |
| `design` | Cormorant Garamond for invitation templates; watermark design spec | 1.3 |
| `banner-design` | Invitation watermark as brand asset; social sharing card design | 1.3 |
| `simplify` | 5 critical security findings; Tailwind config bug; duplicate Prisma; debug scripts | 1.1, 2.5 |
| `claude-api` | AI-enhanced RSVP features; smart referral matching; live counter | 2.2, 2.3 |
| `ui-styling` | Tailwind migration path; component library priority list | 2.4 |
| `update-config` | CI/CD pipeline spec; ESLint strict config; TypeScript strict mode | 2.5 |
| `schedule` | Automated weekly KPI report from Vercel Analytics to email | 2.5 |
| `loop` | Monitor RSVP submission rate; alert on zero-submission periods | 2.2 |
| `slides` | This roadmap can be exported as a board presentation via `/slides` | — |
| `keybindings-help` | Add project-specific shortcuts for dev workflow | — |
| `using-superpowers` | Orchestrated all 14 other skills into this document | — |

---

## Priority Matrix

```
         HIGH IMPACT
              │
    1.1 ──── 1.3      ← Fix these first, in this week
    Security  Branding
              │
LOW ──────────┼────────────── HIGH EFFORT
 EFFORT       │
    1.2 ──── 1.4
    Analytics Copy
              │
    2.1 ──── 2.3      ← These require more effort but compound
    Payment   Referral
              │
         LOW IMPACT
```

### Week-by-Week Plan

| Week | Focus | Owner skill |
|------|-------|-------------|
| 1 | Fix security holes (1.1) + Install analytics (1.2) | `simplify` |
| 2 | Add invitation branding/watermark (1.3) + Fix Tailwind (1.5) | `design` + `update-config` |
| 3 | Rewrite hero copy (1.4) + Replace testimonials + Fix stability (1.5) | `brand` |
| 4 | Skeleton loaders + Payment page prep (Razorpay account setup) | `ui-ux-pro-max` |
| 5–6 | Razorpay integration (2.1) | `simplify` |
| 7–8 | RSVP dashboard enhancements (2.2) | `ui-ux-pro-max` + `claude-api` |
| 9–10 | Referral mechanism (2.3) | `brand` + `claude-api` |
| 11–12 | Design system consolidation (2.4) + Architecture cleanup (2.5) | `design-system` + `simplify` |

---

## What NOT to Do (Anti-Patterns)

From `ui-ux-pro-max` analysis:
- Do not add dark mode yet — it requires systematic token work first, and your audience (Indian families) is on mobile WhatsApp, not developer dark-mode users
- Do not rewrite in shadcn/ui — your current CSS Modules are working; migration would be pure churn
- Do not add more Framer Motion animations — the current `animate-bounce` on decorative elements (flagged by UX audit) is already distracting; more animation is not better
- Do not add a blog until you have 10 real case studies — generic "How to send wedding invitations" posts will not rank and waste time

From `brand` analysis:
- Do not use emojis in UI elements (current strip uses 🎉) — replace with Lucide icons
- Do not fabricate more social proof — it undermines the entire trust architecture

---

## Metrics to Watch

Once analytics is installed (Track 1.2), track these weekly:

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-----------------|-----------------|
| Theme page visits | Baseline | +20% |
| Theme → Bundle selection rate | Baseline | >40% |
| Bundle → Payment initiation | Baseline | >60% |
| Payment completion rate | — | >70% |
| RSVP submissions per invitation | Baseline | >15 |
| Invitation → new visitor referral | 0 (no tracking) | Measurable |

---

## Immediate Action Checklist (Do This Today)

- [ ] Remove hardcoded OTP bypass from `src/app/api/auth/otp/verify/route.ts`
- [ ] Move admin mobile number to `.env`
- [ ] Fix RSVP silent success to show actual error state
- [ ] Install Vercel Analytics (`npm install @vercel/analytics`)
- [ ] Fix `tailwind.config.js` content array
- [ ] Change `package.json` name from `temp-app` to `nimantran-studio`
- [ ] Remove `test theme` string hack from `ThemeCard.tsx`
- [ ] Fix dead CTA button in `PricingSection.tsx`
- [ ] Remove `html { font-size: 80% }` from globals.css

**Time estimate:** 2–4 hours for a developer. All of the above are single-line or small fixes.

---

*Generated by Claude Code using: brainstorming · ui-ux-pro-max · design · design-system · brand · banner-design · ui-styling · simplify · claude-api · update-config · schedule · loop · slides · keybindings-help · using-superpowers*
