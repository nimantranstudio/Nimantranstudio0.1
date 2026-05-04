'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { Loader2, AlertCircle, ShieldCheck, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Firebase Imports
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    const login = useWeddingStore((state) => state.login);
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Firebase state
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    // Initialize Recaptcha
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {
                    // reCAPTCHA solved
                },
                'expired-callback': () => {
                    // Response expired
                }
            });
        }
    }, []);

    // Mobile Flow Handlers
    const handleGetOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || identifier.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setError(null);
        setIsLoading(true);

        const formattedNumber = `+91${identifier.replace(/\D/g, '').slice(-10)}`;

        // BYPASS FIREBASE for Admin/Guest
        if (identifier === '8087084358' || identifier === '8010581916') {
            setStep('otp');
            setIsLoading(false);
            return;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
            setConfirmationResult(result);
            setStep('otp');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-app-credential') {
                setError('Firebase Config Error: Please check .env settings.');
            } else {
                setError(err.message || 'Failed to send OTP. Try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return;

        setError(null);
        setIsLoading(true);
        
        // BYPASS FIREBASE for Admin/Guest
        if ((identifier === '8087084358' || identifier === '8010581916') && otp === '422101') {
            try {
                const res = await fetch('/api/auth/otp/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobileNumber: identifier, otp })
                });
                const data = await res.json();
                if (data.success) {
                    const isAdmin = data.user.role === 'admin';
                    login(identifier, isAdmin);
                    router.push(isAdmin ? '/admin' : redirectPath);
                } else {
                    setError('Invalid Bypass OTP');
                }
            } catch (err) {
                setError('Network error during login bypass');
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            if (!confirmationResult) throw new Error("No verification session found.");

            // 1. Verify with Firebase
            const result = await confirmationResult.confirm(otp);
            const user = result.user; // Firebase User
            const idToken = await user.getIdToken();
            console.log("Firebase Verified User:", user.phoneNumber);

            // 2. Sync with our Backend (SQL Server)
            const res = await fetch('/api/auth/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                const isAdmin = data.user.role === 'admin';
                login(identifier, isAdmin);

                if (isAdmin) {
                    router.push('/admin');
                } else {
                    router.push(redirectPath);
                }
            } else {
                setError(data.error || 'Login Sync Failed');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Left branding panel — hidden on mobile */}
            <div className={styles.brandPanel}>
                <Link href="/" className={styles.brandLogo}>
                    <Image src="/logo.png" alt="Nimantran Studio" width={160} height={44} priority />
                </Link>
                <div className={styles.brandBody}>
                    <h2 className={styles.brandHeadline}>
                        Beautiful Invitations.<br />Smart RSVP Tracking.
                    </h2>
                    <p className={styles.brandSubtext}>
                        Create, share and manage your entire wedding communication in minutes.
                    </p>
                    <ul className={styles.trustList}>
                        <li><Zap size={15} /><span>Ready to share on WhatsApp in 5 minutes</span></li>
                        <li><Heart size={15} /><span>Trusted by Indian couples across India</span></li>
                        <li><ShieldCheck size={15} /><span>One-time payment · No subscription ever</span></li>
                    </ul>
                </div>
                <p className={styles.brandFootnote}>© 2026 Nimantran Studio</p>
            </div>

            {/* Right form panel */}
            <div className={styles.formPanel}>
                <div className={styles.card}>
                    {/* Mobile-only logo */}
                    <Link href="/" className={styles.mobileLogo}>
                        <Image src="/logo.png" alt="Nimantran Studio" width={140} height={38} priority />
                    </Link>

                    {error && (
                        <div className={styles.errorBanner}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Recaptcha Container (Invisible) */}
                    <div id="recaptcha-container"></div>

                    {step === 'phone' ? (
                        <>
                            <h1 className={styles.title}>Welcome back</h1>
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
                                    disabled={isLoading || otp.length < 6}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} />
                                            Verifying...
                                        </>
                                    ) : 'Verify & Continue'}
                                </button>
                            </form>

                            <button
                                type="button"
                                className={styles.linkButton}
                                onClick={() => {
                                    setStep('phone');
                                    setError(null);
                                }}
                            >
                                ← Change number
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Add Type Definition for Window
declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
