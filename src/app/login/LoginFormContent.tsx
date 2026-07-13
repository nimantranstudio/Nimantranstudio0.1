'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { useWeddingStore } from '@/store/wedding-store';
import { Loader2, AlertCircle, ShieldCheck, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FloatingHearts } from '@/components/ui/FloatingHearts';

export default function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    const login = useWeddingStore((state) => state.login);
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                body: JSON.stringify({ mobileNumber: identifier }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStep('otp');
            } else {
                setError(data.error || 'Failed to send OTP. Please try again.');
            }
        } catch (err: any) {
            setError(err?.message || 'Network error. Please try again.');
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
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber: identifier, otp }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                const isAdmin = data.isAdmin === true;
                login(identifier, isAdmin);
                router.push(isAdmin ? '/admin' : redirectPath);
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch (err: any) {
            setError(err?.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
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
            
            <div className={styles.formPanel}>
                <div className={styles.card}>
                    <div className={styles.cardBranding}>
                        <Link href="/" className={styles.brandLogo}>
                            <Image src="/logo.png" alt="Nimantran Studio" width={140} height={38} priority />
                        </Link>
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
                        <Link href="/" className={styles.mobileLogo}>
                            <Image src="/logo.png" alt="Nimantran Studio" width={140} height={38} priority />
                        </Link>

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
        </div>
    );
}
