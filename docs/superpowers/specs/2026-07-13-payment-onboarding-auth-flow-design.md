# Payment-as-Onboarding & Passwordless Auth — Design Spec

Date: 2026-07-13
Status: Approved for implementation

## Goal

Make payment the onboarding step. No registration, no password, no login screen
after purchase. Returning users log in with a mobile OTP only. Firebase Phone Auth
and its reCAPTCHA are removed from the critical path. The SMS/WhatsApp vendor
(MSG91 today) sits behind a swappable adapter so it can be replaced without touching
auth logic.

## Core principles

- **Own the OTP, rent the pipe.** The server generates, hashes, stores, expires and
  rate-limits the OTP (existing `OTPRequest` table). The vendor only delivers text.
- **WhatsApp is delight, never a gate.** Welcome + receipt are fire-and-forget after
  provisioning. Failure never blocks the user, who is already inside the dashboard.
- **Session cookie authenticates everything.** One HMAC-signed HttpOnly cookie,
  sent automatically on same-origin requests, replaces Firebase ID tokens.

## New user journey

Landing → Template → Details → Editor (form + live preview) → Review Your Wedding
Suite → "Unlock My Wedding Suite" → Razorpay popup → progress overlay → Dashboard.
No separate login, no intermediate payment-review page.

Returning user: enter mobile → SMS OTP → verify → dashboard. Unknown numbers get an
account auto-created and land on an empty-state dashboard.

## Architecture

### 1. Universal session (`src/lib/session.ts`)
Generalize the existing admin-session HMAC pattern into a signed `ns_session` cookie
carrying `{ uid, mobile, role, exp }`, 30-day expiry, HttpOnly + Secure + SameSite=Lax.
`admin-session.ts` semantics fold into it (role claim). `SESSION_SECRET` env, dev fallback.

- `createSessionToken(user)` / `verifySessionToken(token)` / `setSessionCookie(res, user)`.

### 2. `verifyAuth` (`src/lib/auth-server.ts`)
Read `ns_session` cookie first → resolve user → return. Keep admin cookie support
during transition. Firebase ID-token branch removed. Because the cookie rides on every
same-origin fetch, existing client calls that used a Firebase Bearer token authenticate
transparently with no per-file changes.

### 3. Middleware
Extend matcher from `/admin*` to also protect `/dashboard*` server-side (redirect
unauthenticated users to `/login?redirect=...`).

### 4. Messaging adapter (`src/lib/messaging/`)
`types.ts` (interface: `sendSms`, `sendWhatsAppTemplate`), `msg91.ts` (adapter),
`index.ts` (selects adapter, falls back to a console-logging dev stub when
`MSG91_AUTHKEY` is empty). Swapping vendors = one new adapter file.

### 5. `create-order` (`/api/payment/create-order`)
- Input: `bundleId`, `packageName`, `formData` (for later provisioning), `contact`.
- **Server derives the price** from `BundleInvoice.finalSellingPrice` for
  `(bundleId, package.id)` — the client-sent amount is ignored (fixes a real
  under-payment vulnerability).
- Create the Razorpay order, then persist a local `Order` row (status `created`)
  storing `razorpayOrderId`, amount, and the buyer's intended bundle. Return
  `{ orderId, amount, currency, key }`.

### 6. `verify` (`/api/payment/verify`)
1. Verify HMAC signature. Fail → no user, no session, 400 error.
2. Fetch payment from Razorpay API to read authoritative `contact` + `email`
   (never trust the client for identity).
3. Find user by mobile, then by email; create if absent. Attach order to user.
4. Provision: create the Wedding + events from `formData` (validated by existing
   schema), idempotent per order. Mark order `paid` → `ready`.
5. Issue `ns_session` cookie. Return success.
6. Fire-and-forget WhatsApp welcome + receipt via adapter.
- If provisioning throws after payment: still issue the session, mark order for
  attention, return success so the user lands on a "preparing your suite" dashboard.
  A paid customer is never stranded.

### 7. OTP (`/api/auth/otp/send`, `/verify`)
- `send`: rate-limit (existing 3/hr), generate 6-digit code, store bcrypt hash,
  deliver via messaging adapter (SMS primary). No WhatsApp OTP (Meta tier blocks it).
- `verify`: check hash + expiry, mark used, find-or-create user, issue `ns_session`
  cookie. Keep the env-flagged test-bypass code for non-production only.

### 8. Frontend
- **Login page**: strip Firebase / reCAPTCHA / `signInWithPhoneNumber`. Two steps:
  mobile → OTP, calling the two routes above.
- **Payment page**: rename to "Review Your Wedding Suite" with the full itemized
  suite; single "Unlock My Wedding Suite" button opens Razorpay directly. On success,
  show a fullscreen progress overlay with staged checkmarks until verify resolves,
  then `router.push('/dashboard')`.

### 9. Schema (`Order`)
Add `razorpayOrderId String? @unique`, `razorpayPaymentId String?`,
`contactEmail String?`, `contactPhone String?`. Status walks
`created → paid → ready` (or `failed`). Additive + nullable → safe migration.

## Out of scope (deferred)
- Email sending (provider undecided) — email is captured onto `User` only.
- WhatsApp OTP (Meta authentication-tier restriction).
- Email-OTP login.
- Real asset/invitation generation logic (existing stub stays wired).
- Migrating admin/RSVP pages off the Firebase shim (cookie authenticates them already;
  the `firebase.ts` dummy shim stays so those files keep compiling).

## Testing
- Signature-fail path creates no user/session.
- Duplicate purchase from a known mobile/email attaches to the existing account.
- Under-payment attempt (client sends low amount) is ignored; server price wins.
- OTP: wrong code rejected, expired code rejected, rate limit enforced.
- Dashboard unreachable without a session cookie (middleware).
