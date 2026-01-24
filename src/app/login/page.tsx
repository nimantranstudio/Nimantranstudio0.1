'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { clsx } from 'clsx';
import { useWeddingStore } from '@/store/wedding-store';
import { Loader2, MessageSquare, AlertCircle } from 'lucide-react';

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

    // Mobile Flow Handlers
    const handleGetOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || identifier.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setError(null);
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber: identifier })
            });

            const data = await res.json();
            if (res.ok) {
                setStep('otp');
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) return;

        setError(null);
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber: identifier, otp })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                // Determine if user is admin based on role returned from API
                const isAdmin = data.user.role === 'admin';
                login(identifier, isAdmin);

                // Redirect based on role
                if (isAdmin) {
                    router.push('/admin');
                } else {
                    router.push(redirectPath);
                }
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
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

                {step === 'phone' ? (
                    <>
                        <h1 className={styles.title}>Welcome to Nimantranstudio</h1>
                        <p className={styles.subtitle}>Enter your WhatsApp number to continue</p>

                        <form onSubmit={handleGetOTP} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="+91  10-digit WhatsApp number"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    autoFocus
                                />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="whatsapp-consent"
                                    className={styles.checkbox}
                                    defaultChecked
                                />
                                <label htmlFor="whatsapp-consent" style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem' }}>
                                    Receive OTP on WhatsApp
                                </label>
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
                                    placeholder="XXXX"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary ${styles.submitBtn}`}
                                disabled={isLoading || otp.length < 4}
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

                <div className={styles.divider}>Or continue with</div>
                <button
                    className={styles.socialBtn}
                    onClick={() => { }} // Placeholder for future Google logic
                    disabled={isLoading}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
