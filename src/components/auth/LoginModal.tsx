'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Phone } from 'lucide-react';
import styles from './LoginModal.module.css';

import { useWeddingStore } from '@/store/wedding-store';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (phone: string) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const { userPhone, isAuthenticated } = useWeddingStore();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (isAuthenticated && userPhone) {
                // Determine if we should auto-close or just fill
                // If the user opened this, it implies they think they needed to login, OR the app forced them.
                // If the app forced them but they ARE logged in, we should auto-succeed.
                onSuccess(userPhone);
            } else if (userPhone) {
                setPhoneNumber(userPhone);
            }
        }
    }, [isOpen, isAuthenticated, userPhone, onSuccess]);

    if (!isOpen) return null;

    const handleGetOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 10) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
        }, 800);
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) return; // Changed condition

        setIsLoading(true);
        // Simulate verification
        setTimeout(() => {
            setIsLoading(false);
            onSuccess(phoneNumber); // Pass phone number
        }, 1500); // Changed timeout duration
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

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
                            We sent a 4-digit code to +91 {phoneNumber}
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
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Proceed'}
                            </button>

                            <button
                                type="button"
                                className={styles.resendBtn}
                                onClick={() => setStep('phone')}
                            >
                                Change Number
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
