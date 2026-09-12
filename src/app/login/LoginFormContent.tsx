'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { Loader2, AlertCircle, ShieldCheck, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FloatingHearts } from '@/components/ui/FloatingHearts';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { describeFirebaseAuthError } from '@/lib/auth/firebase-auth-errors';

export default function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    const login = useWeddingStore((state) => state.login);
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Mirrors Firebase's own send — this is a UX convenience only. Firebase enforces
    // the real resend/rate protection server-side regardless of what this shows.
    const [resendCooldown, setResendCooldown] = useState(0);
    const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
    const confirmationRef = useRef<ConfirmationResult | null>(null);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    // Clean up the reCAPTCHA verifier on unmount so a stale widget never lingers
    // across a client-side navigation away from /login.
    useEffect(() => {
        return () => {
            try { 
                recaptchaRef.current?.clear(); 
            } catch { }
            recaptchaRef.current = null;
        };
    }, []);

    // Lazily create an invisible reCAPTCHA verifier (required by Firebase Phone Auth).
    const getRecaptcha = () => {
        if (typeof window === 'undefined') return null;

        // Reset and clear any existing verifier instance before creating a fresh one
        if (recaptchaRef.current) {
            try {
                recaptchaRef.current.clear();
            } catch { }
            recaptchaRef.current = null;
        }

        const container = document.getElementById('recaptcha-container');
        if (container) {
            container.innerHTML = '';
        }

        const verifier = new RecaptchaVerifier(auth as any, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved
            },
            'expired-callback': () => {
                try { verifier.clear(); } catch { }
                recaptchaRef.current = null;
            }
        });

        recaptchaRef.current = verifier;
        return verifier;
    };

    // Shared by the initial "Get OTP" and the OTP-step "Resend" — both are just
    // signInWithPhoneNumber again, Firebase's own supported resend flow.
    const sendOtp = async (setBusy: (v: boolean) => void) => {
        if (!identifier || identifier.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!auth || !(auth as any).app) {
            setError('Login is not configured yet. Please try again shortly.');
            return;
        }

        setError(null);
        setBusy(true);

        try {
            const verifier = getRecaptcha();
            if (!verifier) throw new Error('Verification setup failed');

            const confirmation = await signInWithPhoneNumber(auth as any, `+91${identifier}`, verifier);
            confirmationRef.current = confirmation;
            setStep('otp');
            setOtp('');
            setResendCooldown(30);
        } catch (err: any) {
            console.error('Failed to send OTP:', err);
            // Reset reCAPTCHA so the next attempt gets a clean token.
            try { 
                recaptchaRef.current?.clear(); 
            } catch { }
            recaptchaRef.current = null;
            const container = document.getElementById('recaptcha-container');
            if (container) container.innerHTML = '';
            setError(describeFirebaseAuthError(err));
        } finally {
            setBusy(false);
        }
    };

    const handleGetOTP = (e: React.FormEvent) => {
        e.preventDefault();
        sendOtp(setIsLoading);
    };

    const handleResendOTP = () => {
        if (resendCooldown > 0 || isResending) return;
        sendOtp(setIsResending);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return;
        if (!confirmationRef.current) {
            setError('Please request a new code.');
            setStep('phone');
            return;
        }

        setError(null);
        setIsVerifying(true);

        try {
            const result = await confirmationRef.current.confirm(otp);
            // Firebase has now authenticated the user. Sync that to our own User
            // table and get the real ns_session cookie every existing protected
            // route already checks — without this the browser would hold a valid
            // Firebase session the server never sees.
            const idToken = await result.user.getIdToken();
            const syncRes = await fetch('/api/auth/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            const data = await syncRes.json().catch(() => null);
            if (!syncRes.ok) {
                setError('Signed in, but could not finish setting up your account. Please try again.');
                return;
            }
            const isAdmin = data?.isAdmin === true;
            login(identifier, isAdmin);
            router.push(isAdmin ? '/admin' : redirectPath);
        } catch (err: any) {
            console.error('OTP verification failed:', err);
            setError(describeFirebaseAuthError(err));
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className={styles.page}>
            <FloatingHearts />
            {/* Animated Premium Background */}
            <div className={styles.backgroundAnimation}>
                <div className={`${styles.blob} ${styles.blob1}`}></div>
                <div className={`${styles.blob} ${styles.blob2}`}></div>
                <div className={`${styles.blob} ${styles.blob3}`}></div>
            </div>

            {/* Invisible reCAPTCHA host required by Firebase Phone Auth */}
            <div id="recaptcha-container" />

            <div className={styles.formPanel}>
                <div className={styles.card}>
                    <div className={styles.cardBranding}>
                        <div className={styles.brandBody}>
                            <h2 className={styles.brandHeadline}>
                                Beautiful Invitations.<br />Smart RSVP Tracking.
                            </h2>
                            <p className={styles.brandSubtext}>
                                Create, share and manage your entire wedding communication in minutes.
                            </p>
                            <ul className={styles.trustList}>
                                <li><Zap size={14} /><span>Ready to share on WhatsApp</span></li>
                                <li><Heart size={14} /><span>Trusted by Indian couples</span></li>
                                <li><ShieldCheck size={14} /><span>One-time payment only</span></li>
                            </ul>
                        </div>
                        <p className={styles.brandFootnote}>© 2026 Nimantran Studio</p>
                    </div>

                    <div className={styles.cardForm}>
                        <div className={styles.welcomeLogoWrapper}>
                            <Link href="/">
                                <Image 
                                    src="/nimantran-symbol.png" 
                                    alt="Nimantran Studio" 
                                    width={56} 
                                    height={56} 
                                    priority 
                                    className={styles.welcomeLogo}
                                />
                            </Link>
                        </div>

                        {error && (
                            <div className={styles.errorBanner}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {step === 'phone' ? (
                            <>
                                <h1 className={styles.title}>Welcome</h1>
                                <p className={styles.subtitle}>You&apos;re just one step away from your perfect invitation experience.</p>
                                <p className={styles.subtitle}>Enter your WhatsApp number to continue</p>

                                <form onSubmit={handleGetOTP} className={styles.form}>
                                    <div className={styles.inputGroup}>
                                        <span className={styles.inputPrefix}>+91</span>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="10-digit mobile number"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${styles.submitBtn}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} />
                                                Sending Code...
                                            </>
                                        ) : 'Get OTP'}
                                    </button>
                                </form>

                                <p className={styles.loginNote}>
                                    New here?{' '}
                                    <Link href="/themes" className={styles.loginNoteLink}>Browse themes first →</Link>
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className={styles.title}>Enter OTP</h1>
                                <p className={styles.subtitle}>We sent a 6-digit code to +91 {identifier}</p>

                                <form onSubmit={handleVerifyOTP} className={styles.form}>
                                    <input
                                        type="text"
                                        className={styles.otpInput}
                                        placeholder="• • • • • •"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        autoFocus
                                    />

                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${styles.submitBtn}`}
                                        disabled={isVerifying || otp.length < 6}
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} />
                                                Verifying...
                                            </>
                                        ) : 'Verify & Continue'}
                                    </button>
                                </form>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        type="button"
                                        className={styles.linkButton}
                                        onClick={() => {
                                            setStep('phone');
                                            setError(null);
                                            setResendCooldown(0);
                                        }}
                                    >
                                        ← Change number
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.linkButton}
                                        onClick={handleResendOTP}
                                        disabled={resendCooldown > 0 || isResending}
                                    >
                                        {isResending
                                            ? 'Resending...'
                                            : resendCooldown > 0
                                                ? `Resend in ${resendCooldown}s`
                                                : 'Resend OTP'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
