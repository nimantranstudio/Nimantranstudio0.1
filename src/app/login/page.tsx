'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { Loader2, AlertCircle } from 'lucide-react';

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
            <div className={styles.card}>
                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '#991b1b',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* Recaptcha Container (Invisible) */}
                <div id="recaptcha-container"></div>

                {step === 'phone' ? (
                    <>
                        <h1 className={styles.title}>Welcome to Nimantranstudio</h1>
                        <p className={styles.subtitle}>Enter your WhatsApp number to continue</p>

                        <form onSubmit={handleGetOTP} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="+91  10-digit number"
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
                    </>
                ) : (
                    <>
                        <h1 className={styles.title}>Enter OTP</h1>
                        <p className={styles.subtitle}>We sent a code to +91 {identifier}</p>

                        <form onSubmit={handleVerifyOTP} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    className={`${styles.input} ${styles.otpInput}`}
                                    placeholder="XXXXXX"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

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
                                ) : 'Verify & Login'}
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
                            Change number
                        </button>
                    </>
                )}
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
