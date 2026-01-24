'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { clsx } from 'clsx';
import { useWeddingStore } from '@/store/wedding-store';
import { Lock, User as UserIcon, X } from 'lucide-react';

const GOOGLE_ACCOUNTS = [
    { id: '1', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', color: '#1a73e8', initials: 'P' },
    { id: '2', name: 'Nimantran Office', email: 'admin@nimantranstudio.com', color: '#ea4335', initials: 'N' },
    { id: '3', name: 'Test User', email: 'test.user@example.com', color: '#fbbc04', initials: 'T' },
];

function GoogleAccountModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (email: string) => void }) {
    if (!isOpen) return null;

    return (
        <div className={styles.googleModalOverlay} onClick={onClose}>
            <div className={styles.googleModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.googleHeader}>
                    {/* SVG Google Logo */}
                    <svg viewBox="0 0 75 24" height="24" width="75" style={{ marginBottom: '0.5rem' }}>
                        <path d="M9.6 11.77V7.95h9.8c.17.93.26 1.9.26 2.92 0 4.67-3.13 8.12-8.03 8.12-4.63 0-8.38-3.75-8.38-8.38S7 2.23 11.63 2.23c2.5 0 4.62.92 6.27 2.47l-2.77 2.66c-1.28-1.23-2.31-1.63-3.5-1.63-2.92 0-5.22 2.45-5.22 5.37s2.3 5.38 5.22 5.38c3.34 0 4.6-2.39 4.79-3.63h-4.82z" fill="#4285F4"></path>
                        <path d="M23.63 11.13c-2.82 0-5.12 2.12-5.12 4.88s2.3 4.88 5.12 4.88c2.82 0 5.13-2.12 5.13-4.88s-2.3-4.88-5.13-4.88zm0 7.82c-1.57 0-3.03-1.28-3.03-2.94s1.46-2.94 3.03-2.94c1.57 0 3.03 1.28 3.03 2.94s-1.46 2.94-3.03 2.94z" fill="#EA4335"></path>
                        <path d="M35.63 11.13c-2.82 0-5.12 2.12-5.12 4.88s2.3 4.88 5.12 4.88c2.82 0 5.13-2.12 5.13-4.88s-2.3-4.88-5.13-4.88zm0 7.82c-1.57 0-3.03-1.28-3.03-2.94s1.46-2.94 3.03-2.94c1.57 0 3.03 1.28 3.03 2.94s-1.46 2.94-3.03 2.94z" fill="#FBBC05"></path>
                        <path d="M47.1 5.92V20.4h-2.01V6.36h1.9l.1 2.5h.06c.58-1.78 2.08-2.95 3.65-2.95.42 0 .61.03.83.07v2.24c-.28-.1-.66-.11-1.07-.11-2.02 0-3.13 1.57-3.46 3.66v8.63z" fill="#4285F4"></path>
                    </svg>
                    <h2 className={styles.googleTitle}>Choose an account</h2>
                    <p className={styles.googleSubtitle}>to continue to NimantranStudio</p>
                </div>

                <ul className={styles.accountList}>
                    {GOOGLE_ACCOUNTS.map((account) => (
                        <li key={account.id} className={styles.accountItem} onClick={() => onSelect(account.email)}>
                            <div className={styles.accountAvatar} style={{ backgroundColor: account.color }}>
                                {account.initials}
                            </div>
                            <div className={styles.accountInfo}>
                                <span className={styles.accountName}>{account.name}</span>
                                <span className={styles.accountEmail}>{account.email}</span>
                            </div>
                        </li>
                    ))}
                    <li className={styles.addAccount}>
                        <UserIcon size={20} /> Use another account
                    </li>
                </ul>
            </div>
        </div>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    const login = useWeddingStore((state) => state.login);
    const [authMethod, setAuthMethod] = useState<'mobile' | 'password'>('mobile');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

    // Mobile Auth State
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');

    // Password Auth State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // Mobile Flow Handlers
    const handleGetOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || identifier.length < 10) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
        }, 800);
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            login(identifier);
            router.push(redirectPath);
        }, 1000);
    };

    // Password Flow Handler (Admin Check)
    const handlePasswordLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // Check for Admin
            if (username === 'NSAdmin' && password === '1234') {
                login(username, true); // Login as Admin
                router.push('/admin');
            } else {
                alert('Invalid credentials. (Hint: Try NSAdmin / 1234 for admin access)');
            }
        }, 1000);
    };

    // Google Login Handler (Opens Modal)
    const handleGoogleBtnClick = () => {
        setIsGoogleModalOpen(true);
    };

    const handleGoogleAccountSelect = (email: string) => {
        setIsGoogleModalOpen(false);
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            login(email, false); // Login as regular user with email
            router.push(redirectPath);
        }, 1000);
    };

    return (
        <div className={styles.page}>
            <GoogleAccountModal
                isOpen={isGoogleModalOpen}
                onClose={() => setIsGoogleModalOpen(false)}
                onSelect={handleGoogleAccountSelect}
            />

            <div className={styles.card}>

                {/* Method Tabs */}
                {step === 'phone' && (
                    <div className={styles.tabs}>
                        <button
                            className={clsx(styles.tab, authMethod === 'mobile' && styles.active)}
                            onClick={() => setAuthMethod('mobile')}
                        >
                            Mobile
                        </button>
                        <button
                            className={clsx(styles.tab, authMethod === 'password' && styles.active)}
                            onClick={() => setAuthMethod('password')}
                        >
                            Username
                        </button>
                    </div>
                )}

                {/* Mobile OTP Flow */}
                {authMethod === 'mobile' && (
                    <>
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
                                        <label htmlFor="whatsapp-consent" style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem' }}>
                                            Receive OTP on WhatsApp
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${styles.submitBtn}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Get OTP'}
                                    </button>
                                </form>
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
                                            placeholder="XXXX"
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
                    </>
                )}

                {/* Password / Admin Flow */}
                {authMethod === 'password' && (
                    <>
                        <h1 className={styles.title}>Admin / User Login</h1>
                        <p className={styles.subtitle}>Enter your credentials to access the dashboard</p>

                        <form onSubmit={handlePasswordLogin} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <input
                                    type="password"
                                    className={styles.input}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary ${styles.submitBtn}`}
                                disabled={isLoading}
                            >
                                <Lock size={16} style={{ marginRight: '8px' }} />
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </>
                )}

                {/* Social Login (Divider + Google) - Show only on initial step */}
                {step === 'phone' && (
                    <>
                        <div className={styles.divider}>Or continue with</div>
                        <button
                            className={styles.socialBtn}
                            onClick={handleGoogleBtnClick}
                            disabled={isLoading}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
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
