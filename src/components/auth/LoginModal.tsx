'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import styles from './LoginModal.module.css';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { describeFirebaseAuthError } from '@/lib/auth/firebase-auth-errors';

import { useWeddingStore } from '@/store/wedding-store';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (phone: string) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const { userPhone, isAuthenticated, login } = useWeddingStore();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
    const confirmationRef = useRef<ConfirmationResult | null>(null);

    // Resend cooldown ticker — a plain visual throttle; Firebase enforces the
    // real rate limiting server-side regardless.
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    // Lazily create an invisible reCAPTCHA verifier (required by Firebase Phone Auth)
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

    // Reset verifier when the modal closes so a fresh one is made next open
    useEffect(() => {
        if (!isOpen) {
            try { recaptchaRef.current?.clear(); } catch { }
            recaptchaRef.current = null;
            confirmationRef.current = null;
            setError('');
            setOtp('');
            setStep('phone');
            setResendCooldown(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (userPhone) {
                setPhoneNumber(userPhone);
            }
        }
    }, [isOpen, isAuthenticated, userPhone, onSuccess]);

    if (!isOpen) return null;

    // Shared by the initial "Send OTP" and the OTP-step "Resend" button — both are just
    // signInWithPhoneNumber again, per Firebase's own supported resend flow (no custom
    // OTP mechanism of our own).
    const sendOtp = async (setBusy: (v: boolean) => void) => {
        setError('');
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Enter a valid 10-digit number');
            return;
        }
        if (!auth || !(auth as any).app) {
            setError('Login is not configured yet. Please try again shortly.');
            return;
        }

        setBusy(true);
        try {
            const verifier = getRecaptcha();
            if (!verifier) throw new Error('Verification setup failed');

            const confirmation = await signInWithPhoneNumber(auth as any, `+91${phoneNumber}`, verifier);
            confirmationRef.current = confirmation;
            setStep('otp');
            setOtp('');
            setResendCooldown(30);
        } catch (err: any) {
            console.error('Failed to send OTP:', err);
            // Reset reCAPTCHA so the next attempt gets a clean token
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
        setError('');
        if (otp.length < 6) {
            setError('Enter the 6-digit code');
            return;
        }
        if (!confirmationRef.current) {
            setError('Please request a new code.');
            setStep('phone');
            return;
        }

        setIsVerifying(true);
        try {
            const result = await confirmationRef.current.confirm(otp);
            // Firebase has now created/authenticated the Firebase user. Sync it to our
            // own User table (by phone number) and get the real ns_session cookie the
            // rest of the app (verifyAuth()/middleware.ts) checks — without this the
            // browser would hold a valid Firebase session that the server never sees.
            const idToken = await result.user.getIdToken();
            const syncRes = await fetch('/api/auth/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            if (!syncRes.ok) {
                setError('Signed in, but could not finish setting up your account. Please try again.');
                return;
            }
            const data = await syncRes.json().catch(() => null);
            login(phoneNumber, data?.isAdmin === true);
            onSuccess(phoneNumber);
        } catch (err: any) {
            console.error('OTP verification failed:', err);
            setError(describeFirebaseAuthError(err));
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                {/* Invisible reCAPTCHA host required by Firebase Phone Auth */}
                <div id="recaptcha-container" />
                {error && (
                    <p style={{ color: '#c62828', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 0.75rem' }}>
                        {error}
                    </p>
                )}

                {step === 'phone' ? (
                    <>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/nimantran-bundle.jpg"
                                alt="Wedding Bundle"
                                width={280}
                                height={180}
                                className={styles.image}
                                priority
                            />
                        </div>

                        <h2 className={styles.title}>
                            You are just one step away<br />from your bundle!
                        </h2>

                        <form onSubmit={handleGetOTP} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="tel"
                                    className={styles.input}
                                    placeholder="+91  10-digit WhatsApp number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                    maxLength={10}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="modal-whatsapp-consent"
                                    className={styles.checkbox}
                                    defaultChecked
                                />
                                <label htmlFor="modal-whatsapp-consent" className={styles.checkboxLabel}>
                                    I agree to receive OTP & important trial updates on WhatsApp
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : (
                                    'Continue'
                                )}
                            </button>

                            <button
                                type="button"
                                className={styles.footerLink}
                                onClick={() => {
                                    const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
                                    if (input) input.focus();
                                }}
                            >
                                Already Registered? Log In Here
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className={styles.title}>Enter Verification Code</h2>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>
                            We sent a 6-digit code to +91 {phoneNumber}
                        </p>

                        <form onSubmit={handleVerifyOTP} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className={`${styles.input} ${styles.otpInput}`}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    autoFocus
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isVerifying}
                            >
                                {isVerifying ? 'Verifying...' : 'Verify & Proceed'}
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                <button
                                    type="button"
                                    className={styles.resendBtn}
                                    onClick={() => setStep('phone')}
                                >
                                    Change Number
                                </button>
                                <button
                                    type="button"
                                    className={styles.resendBtn}
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
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
