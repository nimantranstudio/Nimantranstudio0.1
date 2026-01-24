'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';

import { useWeddingStore } from '@/store/wedding-store';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    const login = useWeddingStore((state) => state.login);
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || identifier.length < 10) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
        }, 800);
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) return;

        setIsLoading(true);
        // Simulate verification
        setTimeout(() => {
            setIsLoading(false);
            login(identifier); // Use the identifier as the phone number
            router.push(redirectPath);
        }, 1000); // 1s delay for realistic feel
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {step === 'phone' ? (
                    <>
                        {/* Header Section */}
                        <div style={{ marginBottom: '2rem' }}>
                        </div>

                        <h1 className={styles.title}>Welcome to Nimantranstudio</h1>
                        <p className={styles.subtitle}>We'll send a one-time OTP on WhatsApp only for verification</p>

                        <div className={styles.features}>
                            <div className={styles.featureItem}>No card details required</div>
                            <div className={styles.featureItem}>Invite ready in 5 minutes</div>
                        </div>

                        <form onSubmit={handleGetOTP} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="+91  10-digit WhatsApp number"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
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
                                <label htmlFor="whatsapp-consent" className={styles.checkboxLabel}>
                                    I agree to receive OTP & important trial updates on WhatsApp
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary ${styles.submitBtn}`}
                                disabled={isLoading}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {/* Using a standard icon or text if icon not imported */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                {isLoading ? 'Sending...' : 'Get OTP'}
                            </button>
                        </form>

                        <div className={styles.footerContainer}>
                            <button className={styles.footerLink} onClick={() => console.log('Navigate to login')}>
                                Already Registered? Log In Here
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className={styles.title}>Enter OTP</h1>
                        <p className={styles.subtitle}>We sent a code to {identifier}</p>

                        <form onSubmit={handleVerifyOTP} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    className={`${styles.input} ${styles.otpInput}`}
                                    placeholder="E n t e r   4 - d i g i t   O T P"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={4}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary ${styles.submitBtn}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                        </form>

                        <button
                            type="button"
                            className={styles.linkButton}
                            onClick={() => setStep('phone')}
                        >
                            Change number
                        </button>
                    </>
                )}
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
