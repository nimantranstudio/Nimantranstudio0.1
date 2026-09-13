'use client';

/**
 * Maps a Firebase Auth error to a message a user can act on. Shared by every
 * Firebase Phone Auth surface (the main /login page and the checkout page's
 * LoginModal) so error copy stays consistent and raw Firebase error objects
 * never reach the UI.
 */
export function describeFirebaseAuthError(err: any): string {
    const code = err?.code || '';
    switch (code) {
        case 'auth/invalid-app-credential':
            return 'Phone verification could not complete. Please refresh the page and try again.';
        case 'auth/app-not-authorized':
            return 'Domain not authorized for authentication. Please check Firebase settings.';
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
            return err?.message || 'Something went wrong. Please try again.';
    }
}
