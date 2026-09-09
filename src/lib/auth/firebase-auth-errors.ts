'use client';

/**
 * Maps a Firebase Auth error to a message a user can act on. Shared by every
 * Firebase Phone Auth surface (the main /login page and the checkout page's
 * LoginModal) so error copy stays consistent and raw Firebase error objects
 * never reach the UI.
 */
export function describeFirebaseAuthError(err: any): string {
    switch (err?.code) {
        case 'auth/too-many-requests':
            return 'Too many attempts. Please wait a while before trying again.';
        case 'auth/invalid-phone-number':
            return 'That phone number looks invalid.';
        case 'auth/invalid-verification-code':
            return 'Incorrect code. Please check and try again.';
        case 'auth/code-expired':
            return 'This code has expired. Request a new one.';
        case 'auth/captcha-check-failed':
        case 'auth/missing-recaptcha-token':
            return 'Verification check failed. Please try again.';
        case 'auth/network-request-failed':
            return 'Network error. Check your connection and try again.';
        case 'auth/quota-exceeded':
            return 'SMS limit reached for now. Please try again later.';
        default:
            return 'Something went wrong. Please try again.';
    }
}
