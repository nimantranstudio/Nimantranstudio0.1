/**
 * ============================================================================
 * TODO: REMOVE DEVELOPMENT OTP BYPASS BEFORE PRODUCTION
 * DEVELOPMENT TEST BYPASS — MUST BE REMOVED BEFORE PRODUCTION
 * ============================================================================
 *
 * Lets a fixed test phone number + OTP (and, optionally, a separately
 * configured code) skip the real OTP flow entirely, so login is testable
 * locally without a working SMS vendor. This is the ONLY place either bypass
 * is defined — nowhere else in the codebase should reference these values or
 * duplicate this check.
 *
 * PRODUCTION BLOCKER: to remove the bypass, delete this file and its one call
 * site in src/app/api/auth/otp/verify/route.ts (the `isDevOtpBypass(...)`
 * check). That is the entire removal — nothing else references this module.
 *
 * Gated to non-production (NODE_ENV !== 'production'), the same signal this
 * codebase already trusts elsewhere for dev-only branches (see the
 * OTP_BYPASS_CODE handling this replaces) — so it cannot activate on a
 * standard production build. It previously did NOT check this at all for the
 * fixed test number, which is fixed here.
 */
const DEV_BYPASS_MOBILE = '8884678194';
const DEV_BYPASS_OTP = '422101';

/** Optional second form: any phone number + this one configured code, for
 * environments (staging, CI) where the fixed number/code pair doesn't fit. */
const CONFIGURED_BYPASS_CODE = process.env.OTP_BYPASS_CODE || '';

export function isDevOtpBypass(mobileNumber: string, otp: string): boolean {
    if (process.env.NODE_ENV === 'production') return false;
    if (mobileNumber === DEV_BYPASS_MOBILE && otp === DEV_BYPASS_OTP) return true;
    if (CONFIGURED_BYPASS_CODE && otp === CONFIGURED_BYPASS_CODE) return true;
    return false;
}
