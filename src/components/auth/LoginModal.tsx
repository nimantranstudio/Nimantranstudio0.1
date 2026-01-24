'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Phone } from 'lucide-react';
import styles from './LoginModal.module.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (phone: string) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"
                                alt="Wedding Bundle"
                                width={240}
                                height={240}
                                className={styles.image}
                                priority
                            />
                            <div className={styles.imageOverlay}>
                                <span className={styles.overlayTitle}>Wedding</span>
                                <span className={styles.overlaySubtitle}>Essentials Bundle</span>
                            </div>
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
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <Phone size={18} /> Get OTP
                                    </span>
                                )}
                            </button>

                            <button type="button" className={styles.footerLink} onClick={() => console.log('Login clicked')}>
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
                                    className={styles.input}
                                    style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem' }}
                                    placeholder="0 0 0 0"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
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
