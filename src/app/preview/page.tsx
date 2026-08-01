'use client';

export const dynamic = 'force-dynamic';

import { useWeddingStore } from '@/store/wedding-store';
import type { Theme } from '@/lib/constants/themes';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import { PreviewCard } from '@/components/preview/PreviewCard';
import styles from '@/components/preview/Preview.module.css';
import { ChevronLeft, ChevronRight, X, Headphones, Play, Edit, Download, Share2, Check, Lock, Link as LinkIcon, Copy, Sparkles, MessageCircle, Activity, ShieldCheck, Type, Image as ImageIcon, MapPin, Bold, AlignLeft, AlignCenter, AlignRight, Type as FormatIcon, Maximize, Sticker, Trash2, Palette, Square, AlignJustify, ChevronDown, Users, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import modalStyles from '@/app/themes/[themeId]/theme-detail.module.css';
import { clsx } from 'clsx';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';
import { auth } from '@/lib/firebase';
import confetti from 'canvas-confetti';
import { Suspense } from 'react';

const ALL_ASSETS = [
    { id: 'poster', name: "Wedding poster", type: 'image' },
    { id: 'wedding', name: "Wedding", type: 'image' },
    { id: 'video', name: "Cinematic Video", type: 'video' },
    { id: 'sangeet', name: "Sangeet", type: 'image' },
    { id: 'mehendi', name: "Mehendi", type: 'image' },
    { id: 'haldi', name: "Haldi", type: 'image' },
    { id: 'sangeet_poster', name: "Sangeet Poster", type: 'image' },
    { id: 'mehendi_poster', name: "Mehendi Poster", type: 'image' },
    { id: 'haldi_poster', name: "Haldi Poster", type: 'image' },
    { id: 'save_the_date', name: "Save The Date", type: 'image' },
    { id: 'initials', name: "Initials", type: 'image' },
    { id: 'thank_you', name: "Thank you card", type: 'image' },
];

export default function PreviewPage() {
    return (
        <Suspense fallback={<div>Loading preview...</div>}>
            <PreviewContent />
        </Suspense>
    );
}

import { ProcessingOverlay } from '@/components/processing/ProcessingOverlay';

function PreviewContent() {
    const { formData, selectedThemeId, isAuthenticated, login, bundleImages, bundleItems, selectedPlan, userPhone, setCheckoutComplete } = useWeddingStore();
    const [packages, setPackages] = useState<any[]>([]);
    const [theme, setTheme] = useState<any | null>(null);

    // Dynamic pricing lookup based on selected plan and available packages
    const planLabelMap: Record<string, string> = {
        'essentials': 'WhatsApp Essentials',
        'posters': 'WhatsApp + Posters',
        'complete': 'Complete Wedding Suite'
    };

    const targetPackage = packages.find(p => p.name === planLabelMap[selectedPlan || 'essentials']);
    const activeBundle = theme?.bundles?.[0];
    const activeInvoice = activeBundle?.bundleInvoices?.find((inv: any) => inv.packageId === targetPackage?.id);

    // Pricing values from DB with dynamic fallbacks
    const pricing = {
        packageName: targetPackage?.name || 'WhatsApp Essentials',
        designSuite: activeInvoice?.invitationDesignSuite || 0,
        rsvpTracking: activeInvoice?.rsvpManagementTracking || 0,
        guestDashboard: activeInvoice?.guestDashboard || 0,
        totalValue: activeInvoice?.totalWeddingSuiteValue || 0,
        discount: activeInvoice?.discount || 0,
        discountedPrice: activeInvoice?.discountedPrice || 0,
        finalPrice: activeInvoice?.finalSellingPrice || 0
    };
    
    const discountPercent = pricing.discount;
    const amountSaved = pricing.discountedPrice;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const [activeSliderIndex, setActiveSliderIndex] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const [cardLayout, setCardLayout] = useState<{ width: number; height: number; aspectRatio: number }>({
        width: 500,
        height: 889,
        aspectRatio: 9/16
    });

    const handleLayoutMeasure = (layout: { width: number; height: number; aspectRatio: number }) => {
        setCardLayout(prev => {
            if (prev.width === layout.width && prev.height === layout.height && prev.aspectRatio === layout.aspectRatio) {
                return prev;
            }
            return layout;
        });
    };

    // Reset card layout to default vertical aspect ratio when selecting a new card to prevent layout jumping/glitching
    useEffect(() => {
        if (selectedPreviewIndex !== null) {
            setCardLayout({ width: 500, height: 889, aspectRatio: 9/16 });
        }
    }, [selectedPreviewIndex]);

    const [isEditMode, setIsEditMode] = useState(false);
    const [activeSelection, setActiveSelection] = useState<any | null>(null);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [isQrPopoverOpen, setIsQrPopoverOpen] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [qrLink, setQrLink] = useState('');
    const [qrTitle, setQrTitle] = useState('SCAN FOR LOCATION');
    const [uploadedPhotos, setUploadedPhotos] = useState<Record<number, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<InvitationCardRef>(null);
    const suiteRefs = useRef<Record<string, InvitationCardRef | null>>({});
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'SELECTION_CHANGED') {
                setActiveSelection(e.data.payload);
            } else if (e.data?.type === 'SELECTION_CLEARED') {
                setActiveSelection(null);
            } else if (e.data?.type === 'LAYOUT_CHANGED') {
                if (cardRef.current && typeof (cardRef.current as any).saveLayout === 'function') {
                    try {
                        (cardRef.current as any).saveLayout();
                    } catch (e) { }
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const isPoppingHistoryState = useRef(false);

    useEffect(() => {
        if (!isEditMode) return;

        // Push state so back button pops it first instead of leaving the page
        window.history.pushState({ noBackExitsEditMode: true }, '');

        const handlePopState = (e: PopStateEvent) => {
            if (isPoppingHistoryState.current) {
                isPoppingHistoryState.current = false;
                return;
            }
            // Put it back
            window.history.pushState({ noBackExitsEditMode: true }, '');
            setShowExitConfirm(true);
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isEditMode]);
    
    // Fluid transition state
    const [showProcessing, setShowProcessing] = useState(searchParams.get('processing') === 'true');

    useEffect(() => {
        if (searchParams.get('processing') === 'true') {
            // Clean the URL immediately so refreshing doesn't replay the animation
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('processing');
            window.history.replaceState({}, '', newUrl.pathname + newUrl.search);
        }
    }, [searchParams]);
    const [copyStatus, setCopyStatus] = useState(false);

    // Generate RSVP Link based on actual saved wedding ID and current origin
    const weddingId = searchParams.get('id');
    const rsvpSlug = weddingId || `${formData.groomName?.toLowerCase().split(' ')[0] || 'wedding'}-${formData.brideName?.toLowerCase().split(' ')[0] || 'rsvp'}`;
    const [origin, setOrigin] = useState('');
    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);
    const rsvpFullUrl = origin ? `${origin}/rsvp/${rsvpSlug}` : `https://nimantran.app/rsvp/${rsvpSlug}`;

    const handleCopyRsvpLink = async () => {
        try {
            await navigator.clipboard.writeText(rsvpFullUrl);
            setCopyStatus(true);
            // Brief celebratory micro-burst
            confetti({
                particleCount: 30,
                spread: 40,
                origin: { y: 0.7 },
                colors: ['#D4AF37', '#F3E8D2'],
                gravity: 0.8,
                scalar: 0.8,
                zIndex: 1000
            });
            setTimeout(() => setCopyStatus(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const { updateFormData, updateEvent } = useWeddingStore();

    // Trigger seamless celebratory confetti if coming from old processing route
    useEffect(() => {
        if (searchParams.get('confetti') === 'true') {
            const trigger = (delay: number) => {
                setTimeout(() => {
                    confetti({
                        particleCount: 150,
                        spread: 160,
                        origin: { y: 0.6 },
                        colors: ['#D4AF37', '#AA861E', '#FFFFFF'],
                        gravity: 0.5,
                        scalar: 1.4,
                        zIndex: 20000
                    });
                }, delay);
            };
            trigger(0);
            trigger(1500);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch packages first
                const pkgRes = await fetch('/api/admin/packages');
                if (pkgRes.ok) {
                    const pkgData = await pkgRes.json();
                    setPackages(pkgData.packages || []);
                }

                if (!selectedThemeId) return;
                const res = await fetch(`/api/themes/${selectedThemeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTheme(data.theme);
                }
            } catch (error) {
                console.error("Failed to fetch theme or packages", error);
            }
        }
        fetchData();
    }, [selectedThemeId]);

    // Auto-close modal if auth state changes to true (e.g. cross-tab login or delayed hydration)
    // useEffect(() => {
    //     if (isAuthenticated && showLoginModal) {
    //         setShowLoginModal(false);
    //         setIsSecuring(true);
    //     }
    // }, [isAuthenticated, showLoginModal]);



    const handlePay = async () => {
        setIsProcessing(true);
        try {
            // Create Order — server derives the price from theme + package.
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    themeId: selectedThemeId,
                    packageName: pricing.packageName,
                    currency: 'INR'
                })
            });

            const data = await res.json();

            if (!data.orderId || !data.key) {
                if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.warn('Razorpay order creation failed. Falling back to Mock Payment in development.');
                    const confirmMock = window.confirm(
                        `Razorpay Order Creation Failed: ${data.error || 'Check server logs'}\n\nDo you want to simulate a successful payment to unlock your wedding suite on localhost?`
                    );
                    if (confirmMock) {
                        // DEV: real payment (and thus /api/payment/verify, which sends the
                        // WhatsApp welcome) is skipped in the mock flow. Fire the welcome
                        // here so it can be tested on localhost. Ask for a test number
                        // since there is no Razorpay payment contact to read.
                        const testPhone = window.prompt(
                            'DEV TEST — enter a WhatsApp number (10 digits) to receive the welcome message (blank to skip):'
                        );
                        if (testPhone && testPhone.replace(/\D/g, '').length >= 10) {
                            const isImg = (u: any) => typeof u === 'string' && /\.(png|jpe?g|webp)(\?|$)/i.test(u);
                            // Prefer the couple's real card (capture + host); fall back to a bundle image.
                            let heroImageUrl: string | undefined =
                                (bundleImages || []).find(isImg) ||
                                (bundleItems || []).map((i: any) => i?.image).find(isImg) ||
                                undefined;
                            try {
                                const dataUrl = await cardRef.current?.captureDataUrl();
                                if (dataUrl) {
                                    const up = await fetch('/api/cards/upload', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ dataUrl, name: `${formData.groomName || 'wedding'}-${formData.brideName || 'invite'}` }),
                                    });
                                    const upData = await up.json().catch(() => ({}));
                                    if (up.ok && upData?.success && upData?.url) heroImageUrl = upData.url;
                                }
                            } catch { /* keep the fallback image */ }

                            try {
                                const wRes = await fetch('/api/dev/mock-welcome', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        mobile: testPhone,
                                        coupleNames: `${formData.groomName || ''} ${formData.brideName || ''}`.trim(),
                                        heroImageUrl,
                                    }),
                                });
                                const wData = await wRes.json().catch(() => ({}));
                                if (wData?.success) {
                                    alert(`✅ Welcome WhatsApp dispatched to ${testPhone}${wData.heroSent ? ' (with hero image)' : ' (text-only — no image URL)'}. Check the phone.`);
                                } else {
                                    alert(`⚠️ WhatsApp not sent: ${wData?.error || 'unknown error'}`);
                                }
                            } catch (e: any) {
                                alert(`⚠️ WhatsApp request failed: ${e?.message || 'network error'}`);
                            }
                        }

                        setPaymentStatus('success');
                        await fetch('/api/generate-bundle', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ bundleId: bundleItems?.[0]?.id })
                        });
                        router.push('/dashboard?welcome=true');
                        return;
                    }
                }
                throw new Error(data.error || 'Failed to create order - missing orderId or key');
            }

            console.log('Order created:', data);

            // Open Razorpay Modal
            if (typeof (window as any).Razorpay === 'undefined') {
                console.log('Razorpay script not found, loading manually...');
                await new Promise<void>((resolve, reject) => {
                    const existing = document.getElementById('razorpay-checkout-js');
                    if (existing) {
                        resolve();
                        return;
                    }
                    const script = document.createElement('script');
                    script.id = 'razorpay-checkout-js';
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Razorpay'));
                    document.head.appendChild(script);
                });
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Nimantran Studio",
                description: "Wedding Essentials Bundle",
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        console.log('Payment successful:', response);
                        // Hero image for the WhatsApp welcome: first real (non-.html) bundle image.
                        const isImg = (u: any) => typeof u === 'string' && /\.(png|jpe?g|webp)(\?|$)/i.test(u);
                        const heroImageUrl =
                            (bundleImages || []).find(isImg) ||
                            (bundleItems || []).map((i: any) => i?.image).find(isImg) ||
                            undefined;

                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                formData,
                                heroImageUrl
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            setPaymentStatus('success');

                            // Record the provisioned wedding + auth so the dashboard resolves.
                            setCheckoutComplete(verifyData.weddingId, userPhone);

                            // Generate Bundle
                            await fetch('/api/generate-bundle', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ bundleId: bundleItems?.[0]?.id })
                            });

                            router.push('/dashboard?welcome=true');
                        } else {
                            throw new Error(verifyData.error || 'Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Payment verification error:', err);
                        setPaymentStatus('failed');
                        setIsProcessing(false);
                        alert("Payment failed or verification issue. Please try again.");
                    }
                },
                prefill: {
                    name: formData.groomName || formData.brideName ? `${formData.groomName || ''} ${formData.brideName || ''}`.trim() : '',
                    email: auth.currentUser?.email || '',
                    contact: userPhone || formData.rsvpContact || ''
                },
                theme: {
                    color: "#C8A951"
                },
                modal: {
                    ondismiss: function() {
                        console.log('Payment modal closed');
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response);
                setPaymentStatus('failed');
                setIsProcessing(false);
                alert("Payment failed. Nothing has been charged.");
            });

            rzp.open();

        } catch (error: any) {
            console.error('Error initiating payment:', error);
            setIsProcessing(false);
            const errorMessage = error?.message || 'Unknown error';
            alert(`Payment Error: ${errorMessage}`);
        }
    };

    const handleCheckout = () => {
        // Payment IS the onboarding — no login gate. /api/payment/verify reads the
        // customer's phone from the Razorpay payment contact and creates/attaches
        // the account + session on success. Go straight to Razorpay.
        handlePay();
    };

    const handleLoginSuccess = (phone: string) => {
        setShowLoginModal(false);
        login(phone);
        setTimeout(() => {
            handlePay();
        }, 100);
    };

    if (!theme) {
        return (
            <div className={styles.previewPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#666' }}>
                    <div>Loading theme details...</div>
                </div>
            </div>
        );
    }



    const buildPreviewItems = () => {
        if (!bundleItems || bundleItems.length === 0) {
            return [];
        }

        const ID_MAPPING: Record<string, string> = {
            'evt_1': 'wedding',              // Initials logo
            'evt_2': 'wedding',              // Wedding contract
            'evt_3': 'wedding',              // Do not disturb
            'evt_4': 'wedding',              // Ladke wale tag
            'evt_5': 'wedding',              // Ladki wale tag
            'evt_6': 'save_the_date',        // Save the date
            'evt_7': 'wedding',              // Wedding Invitation
            'evt_8': 'haldi',                // Haldi Invitation
            'evt_9': 'sangeet',              // Sangeet Invitation
            'evt_10': 'mehendi',             // Mehendi Invitation
            'evt_11': 'wedding',             // Cinematic Video 
            'evt_12': 'rsvp',                // RSVP
            'evt_13': 'reception',           // Reception
            'evt_14': 'wedding',             // Welcome Wedding Poster
            'evt_15': 'haldi',               // Welcome Haldi Poster
            'evt_16': 'mehendi',             // Welcome Mehendi Poster
            'evt_17': 'wedding'              // Thank you card
        };

        // Match bundleItems to wedding events by eventType or ID mapping
        const weddingEvents = formData.events || [];
        const items: Array<{ id: string; name: string; image: string; event: any; layout?: any }> = [];

        for (const bi of bundleItems) {
            if (!bi.templatePath) continue; 

            const rawType = bi.eventType || bi.event?.eventName || '';
            const biType = rawType.toUpperCase().replace(/_/g, '');
            const dbEventId = bi.eventId;

            // Find matching wedding event using multiple fallbacks
            let matchedEvent = weddingEvents.find(evt => {
                const masterId = evt.id.toLowerCase();
                
                // 1. Check ID Mapping first for precision (Highly reliable)
                if (dbEventId && ID_MAPPING[dbEventId] === masterId) return true;

                // Only if mapping fails, try name matching
                if (!biType) return false;

                const evtType = (evt.eventType || '').toUpperCase();
                const evtName = (evt.name || '').toUpperCase();

                // 2. Check name (Avoid empty string matching)
                if (evtName && biType.includes(evtName)) return true;

                // 3. Special cases for common naming
                if (biType.includes('WEDDING') && masterId.includes('wedding')) return true;
                if (biType.includes('HALDI') && masterId.includes('haldi')) return true;
                if (biType.includes('MEHENDI') && masterId.includes('mehendi')) return true;
                if (biType.includes('SANGEET') && masterId.includes('sangeet')) return true;
                if (biType.includes('RECEPTION') && masterId.includes('reception')) return true;

                return false;
            });

            // If no match found, default to 'wedding' for generic wedding items
            if (!matchedEvent && biType.includes('WEDDING')) {
                matchedEvent = weddingEvents.find(e => e.id === 'wedding');
            }

            const displayName = matchedEvent?.heading || matchedEvent?.name || bi.event?.eventName || bi.templateName || bi.eventType || 'Invitation';

            items.push({
                id: bi.id,
                name: displayName,
                image: bi.templatePath,
                layout: (bi as any).layout, // present only for designed (structured) items
                event: matchedEvent ? {
                    id: matchedEvent.id,
                    name: matchedEvent.heading || matchedEvent.name,
                    date: matchedEvent.date || formData.primaryDate,
                    time: matchedEvent.time || formData.primaryTime,
                    venue: matchedEvent.venue || formData.defaultVenueName,
                    tagline: matchedEvent.tagline,
                    description: matchedEvent.description,
                    heading: matchedEvent.heading
                } : {
                    id: bi.id,
                    name: displayName,
                    date: formData.primaryDate,
                    time: formData.primaryTime,
                    venue: formData.defaultVenueName
                }
            });
        }

        return items;
    };

    const getItemDescription = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('video')) return "Short modern invite announcement video";
        if (n.includes('rsvp')) return "Personalized link to collect responses";
        if (n.includes('save the date')) return "WhatsApp and story-formatted image";
        if (n.includes('haldi')) return "Delightful WhatsApp-ready image card";
        if (n.includes('mehendi')) return "Delightful WhatsApp-ready image card";
        if (n.includes('sangeet')) return "Sophisticated WhatsApp-ready image card";
        if (n.includes('reception')) return "Classy WhatsApp-ready image card";
        return "Elegant WhatsApp-ready image card";
    };

    const previewItems = buildPreviewItems();


    const handleFormat = (payload: any) => {
        if (cardRef.current && cardRef.current.sendMessage) {
            cardRef.current.sendMessage({ type: 'FORMAT_TEXT', payload });
            
            // Optimistically update local state so UI feels instantly responsive
            if (activeSelection) {
                setActiveSelection(prev => prev ? { ...prev, ...payload } : null);
            }

            // Auto-save layout so formatting changes persist even if closed directly
            setTimeout(() => {
                if (cardRef.current && typeof (cardRef.current as any).saveLayout === 'function') {
                    try {
                        (cardRef.current as any).saveLayout();
                    } catch (e) { }
                }
            }, 100);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedPreviewIndex !== null) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUploadedPhotos(prev => ({
                        ...prev,
                        [selectedPreviewIndex]: event.target!.result as string
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
        // Reset input so the same file can be uploaded again if needed
        if (e.target) {
            e.target.value = '';
        }
    };

    return (
        <div className={styles.previewPage}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => console.log('Razorpay script loaded')} />
            
            {/* Success Overlay */}
            {paymentStatus === 'success' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: '#FDFBF7', zIndex: 9999, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-sans)', color: '#1F1F1F'
                }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '16px' }}>🎉 Payment Successful</h1>
                    <p style={{ fontSize: '18px', color: 'var(--muted-foreground)', marginBottom: '32px' }}>Your Wedding Bundle has been unlocked successfully.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
                        <div className="spinner" style={{
                            width: '24px', height: '24px', border: '3px solid var(--muted)',
                            borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'
                        }} />
                        Preparing your wedding assets...
                    </div>
                    <style dangerouslySetInnerHTML={{__html: `
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}} />
                </div>
            )}

            {/* Hidden File Input for Photo Upload */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
            />
            {/* Fullscreen Preview Modal */}
            {selectedPreviewIndex !== null && theme && (
                <div className={modalStyles.overlayBackdrop} onClick={() => !isEditMode && setSelectedPreviewIndex(null)}>
                    <div className={modalStyles.overlayContent} style={isEditMode ? { width: '100vw', height: '100vh', maxWidth: '100%', maxHeight: '100%', borderRadius: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', paddingBottom: '80px' } : {}} onClick={(e) => e.stopPropagation()}>
                        
                        <button 
                            className={modalStyles.closeBtn} 
                            onClick={() => {
                                if (isEditMode) {
                                    setShowExitConfirm(true);
                                } else {
                                    setSelectedPreviewIndex(null);
                                }
                            }} 
                            style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 100 }}
                        >
                            <X size={28} />
                        </button>

                        {/* Top Toolbar (Edit Mode) */}
                        {isEditMode && (
                            <div className={styles.topToolbar}>
                                <button className={styles.toolbarBtn} onClick={() => handleFormat({ edit: true })} style={{ opacity: activeSelection ? 1 : 0.5, pointerEvents: activeSelection ? 'auto' : 'none' }}>
                                    <Edit size={24} />
                                    <span>Edit</span>
                                </button>
                                
                                <div style={{ position: 'relative' }}>
                                    <button className={styles.toolbarBtn} style={{ opacity: activeSelection ? 1 : 0.5, pointerEvents: activeSelection ? 'auto' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span style={{ fontSize: '20px', fontFamily: 'serif', fontStyle: 'italic', lineHeight: 1 }}>Style</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Font</span>
                                            <ChevronDown size={16} />
                                        </div>
                                    </button>
                                    {activeSelection && (
                                        <select 
                                            value={activeSelection?.fontFamily || 'inherit'}
                                            onChange={(e) => handleFormat({ fontFamily: e.target.value })}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        >
                                            <option value="inherit">Default</option>
                                            <option value="Arial, sans-serif">Arial</option>
                                            <option value="'Times New Roman', serif">Times New Roman</option>
                                            <option value="'Courier New', monospace">Courier</option>
                                            <option value="Georgia, serif">Georgia</option>
                                            <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                                            <option value="Verdana, sans-serif">Verdana</option>
                                        </select>
                                    )}
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button className={styles.toolbarBtn} style={{ opacity: activeSelection ? 1 : 0.5, pointerEvents: activeSelection ? 'auto' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1 }}>A+</span>
                                        <span>Resize</span>
                                    </button>
                                    {activeSelection && (
                                        <select
                                            value={activeSelection?.fontSize || ''}
                                            onChange={(e) => handleFormat({ fontSize: e.target.value })}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        >
                                            <option value="">Default</option>
                                            <option value="12px">12px</option>
                                            <option value="14px">14px</option>
                                            <option value="16px">16px</option>
                                            <option value="18px">18px</option>
                                            <option value="20px">20px</option>
                                            <option value="24px">24px</option>
                                            <option value="28px">28px</option>
                                            <option value="32px">32px</option>
                                            <option value="36px">36px</option>
                                            <option value="48px">48px</option>
                                            <option value="64px">64px</option>
                                        </select>
                                    )}
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button className={styles.toolbarBtn} style={{ opacity: activeSelection ? 1 : 0.5, pointerEvents: activeSelection ? 'auto' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Maximize size={24} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Box Resize</span>
                                            <ChevronDown size={16} />
                                        </div>
                                    </button>
                                    {activeSelection && (
                                        <select
                                            defaultValue=""
                                            onChange={(e) => { if (e.target.value) handleFormat({ boxWidth: e.target.value }); }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        >
                                            <option value="">Width…</option>
                                            <option value="fit">Fit content</option>
                                            <option value="40%">Narrow (40%)</option>
                                            <option value="60%">Medium (60%)</option>
                                            <option value="80%">Wide (80%)</option>
                                            <option value="100%">Full (100%)</option>
                                        </select>
                                    )}
                                </div>

                                <button
                                    className={styles.toolbarBtn}
                                    onClick={() => handleFormat({ delete: true })}
                                    title={activeSelection?.isCustom ? 'Delete this element' : 'Only elements you added can be deleted'}
                                    style={{ opacity: activeSelection?.isCustom ? 1 : 0.4, pointerEvents: activeSelection?.isCustom ? 'auto' : 'none' }}
                                >
                                    <Trash2 size={24} />
                                    <span>Delete</span>
                                </button>

                                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: activeSelection ? 1 : 0.5, pointerEvents: activeSelection ? 'auto' : 'none', cursor: 'pointer' }} className={styles.toolbarBtn}>
                                    <Palette size={24} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <span>Color</span>
                                        <ChevronDown size={16} />
                                    </div>
                                    {activeSelection && (
                                        <input 
                                            type="color" 
                                            value={activeSelection?.color || '#000000'}
                                            onChange={(e) => handleFormat({ color: e.target.value })}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        />
                                    )}
                                </div>

                                <button 
                                    className={styles.toolbarBtn} 
                                    onClick={() => handleFormat({ fontWeight: activeSelection?.fontWeight === 'bold' ? 'normal' : 'bold' })} 
                                    style={{ 
                                        opacity: activeSelection ? 1 : 0.5, 
                                        pointerEvents: activeSelection ? 'auto' : 'none',
                                        background: activeSelection?.fontWeight === 'bold' ? '#FEF3C7' : 'transparent',
                                        color: activeSelection?.fontWeight === 'bold' ? '#D97706' : '#6B7280',
                                        border: activeSelection?.fontWeight === 'bold' ? '1px solid #FDE68A' : '1px solid transparent'
                                    }}
                                >
                                    <Bold size={24} />
                                    <span>Bold</span>
                                </button>

                                <div style={{ position: 'relative' }}>
                                    <button className={styles.toolbarBtn} style={{ opacity: activeSelection ? 1 : 0.5, pointerEvents: activeSelection ? 'auto' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <AlignJustify size={24} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Format</span>
                                            <ChevronDown size={16} />
                                        </div>
                                    </button>
                                    {activeSelection && (
                                        <select
                                            value={activeSelection?.align || 'center'}
                                            onChange={(e) => handleFormat({ align: e.target.value })}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        >
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                            <option value="justify">Justify</option>
                                        </select>
                                    )}
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button className={styles.toolbarBtn} style={{ opacity: activeSelection ? 1 : 0.5, pointerEvents: activeSelection ? 'auto' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Square size={24} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Border</span>
                                            <ChevronDown size={16} />
                                        </div>
                                    </button>
                                    {activeSelection && (
                                        <select
                                            defaultValue=""
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                if (v === 'none') handleFormat({ border: 'none', borderRadius: '0px' });
                                                else if (v === 'thin') handleFormat({ border: '1px solid currentColor' });
                                                else if (v === 'medium') handleFormat({ border: '2px solid currentColor' });
                                                else if (v === 'thick') handleFormat({ border: '4px solid currentColor' });
                                                else if (v === 'rounded') handleFormat({ border: '2px solid currentColor', borderRadius: '12px' });
                                            }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        >
                                            <option value="">Border…</option>
                                            <option value="none">None</option>
                                            <option value="thin">Thin</option>
                                            <option value="medium">Medium</option>
                                            <option value="thick">Thick</option>
                                            <option value="rounded">Rounded</option>
                                        </select>
                                    )}
                                </div>

                                <button 
                                    className={styles.toolbarBtn} 
                                    onClick={() => handleFormat({ textTransform: activeSelection?.textTransform === 'uppercase' ? 'none' : 'uppercase' })} 
                                    style={{ 
                                        opacity: activeSelection ? 1 : 0.5, 
                                        pointerEvents: activeSelection ? 'auto' : 'none',
                                        background: activeSelection?.textTransform === 'uppercase' ? '#F3F4F6' : 'transparent',
                                    }}
                                >
                                    <span style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1 }}>Aa</span>
                                    <span>CAPITAL</span>
                                </button>
                            </div>
                        )}

                        <div className={modalStyles.previewImageWrapper} style={{ 
                            borderRadius: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            position: 'relative',
                            width: cardLayout.aspectRatio > 1 ? 'min(90vw, 1000px)' : 'auto',
                            height: cardLayout.aspectRatio > 1 ? 'auto' : (isEditMode ? 'calc(100vh - 160px)' : 'min(85vh, 850px)'),
                            aspectRatio: cardLayout.aspectRatio,
                            transition: 'width 0.3s ease, height 0.3s ease, aspect-ratio 0.3s ease'
                        }}>
                            <PreviewCard
                                ref={cardRef}
                                key={`preview-${selectedPreviewIndex}-${resetKey}`}
                                event={previewItems[selectedPreviewIndex]?.event || {
                                    id: `design-${selectedPreviewIndex}`,
                                    name: `Design ${selectedPreviewIndex + 1}`,
                                    date: formData.primaryDate,
                                    time: formData.primaryTime,
                                    venue: formData.defaultVenueName
                                }}
                                theme={theme}
                                groomName={formData.groomName || ''}
                                brideName={formData.brideName || ''}
                                groomParents={formData.groomParents || ''}
                                brideParents={formData.brideParents || ''}
                                welcomeMessage={formData.invitationMessage || ''}
                                isPlaceholder={true}
                                isRawPreview={false}
                                type='image'
                                customImage={uploadedPhotos[selectedPreviewIndex] || previewItems[selectedPreviewIndex]?.image}
                                structuredLayout={previewItems[selectedPreviewIndex]?.layout}
                                structuredCouple={formData}
                                isSecured={true}
                                showSizingBoxes={isEditMode}
                                onLayoutMeasure={handleLayoutMeasure}
                            />



                            {/* On-Invite Action Buttons */}
                            {!isEditMode ? (
                                <div style={{
                                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                                    display: 'flex', flexWrap: 'wrap', gap: '0.75rem', zIndex: 10, justifyContent: 'flex-end', maxWidth: '80%'
                                }}>
                                    <button
                                        onClick={() => {
                                            if (cardRef.current) {
                                                cardRef.current.downloadImage();
                                            }
                                        }}
                                        style={{
                                            background: 'white', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '50%',
                                            width: '40px', height: '40px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                                        title="Download High Res"
                                    >
                                        <Download size={20} />
                                    </button>
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        style={{
                                            background: 'white', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '50%',
                                            width: '40px', height: '40px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                                        title="Live Edit"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const text = encodeURIComponent(`Check out our wedding invitation!\n\n${window.location.href}`);
                                            window.open(`https://wa.me/?text=${text}`, '_blank');
                                        }}
                                        style={{
                                            background: 'white', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '50%',
                                            width: '40px', height: '40px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                                        title="Share Link"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            ) : (
                                /* Bottom Toolbar (Edit Mode) */
                                <div className={styles.bottomToolbar}>
                                    <button className={styles.toolbarBtn} onClick={() => setShowExitConfirm(true)}>
                                        <X size={24} />
                                        <span>Cancel</span>
                                    </button>

                                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                        <button className={styles.toolbarBtn} onClick={() => cardRef.current?.sendMessage({ type: 'ADD_TEXT' })}>
                                            <Type size={24} />
                                            <span>Add Text</span>
                                        </button>
                                        <button className={styles.toolbarBtn} onClick={() => fileInputRef.current?.click()}>
                                            <ImageIcon size={24} />
                                            <span>Photo</span>
                                        </button>
                                        <button className={styles.toolbarBtn} onClick={() => cardRef.current?.sendMessage({ type: 'ADD_STICKER', payload: { emoji: '❤️' } })}>
                                            <Sticker size={24} />
                                            <span>Sticker</span>
                                        </button>
                                        <button className={styles.toolbarBtn} onClick={() => setIsQrPopoverOpen(true)}>
                                            <MapPin size={24} />
                                            <span>QR Map</span>
                                        </button>
                                    </div>

                                    <button className={styles.toolbarBtn} onClick={() => {
                                        if (cardRef.current && selectedPreviewIndex !== null) {
                                            const edits = cardRef.current.saveEdits();
                                            // Apply global edits
                                            const newFormData = { ...formData };
                                            let formDataChanged = false;
                                            
                                            const currentItem = previewItems[selectedPreviewIndex];
                                            const currentEvent = currentItem?.event;

                                            if (edits['groom-name'] !== undefined && edits['groom-name'] !== formData.groomName) {
                                                newFormData.groomName = edits['groom-name'];
                                                formDataChanged = true;
                                            }
                                            if (edits['bride-name'] !== undefined && edits['bride-name'] !== formData.brideName) {
                                                newFormData.brideName = edits['bride-name'];
                                                formDataChanged = true;
                                            }
                                            if ((edits['groom-parents'] !== undefined || edits['groom-parent-name'] !== undefined)) {
                                                const gp = edits['groom-parents'] !== undefined ? edits['groom-parents'] : edits['groom-parent-name'];
                                                if (gp !== undefined && gp !== formData.groomParents) {
                                                    newFormData.groomParents = gp;
                                                    formDataChanged = true;
                                                }
                                            }
                                            if ((edits['bride-parents'] !== undefined || edits['bride-parent-name'] !== undefined)) {
                                                const bp = edits['bride-parents'] !== undefined ? edits['bride-parents'] : edits['bride-parent-name'];
                                                if (bp !== undefined && bp !== formData.brideParents) {
                                                    newFormData.brideParents = bp;
                                                    formDataChanged = true;
                                                }
                                            }

                                            if ((edits['event-venue'] !== undefined || edits['venue'] !== undefined)) {
                                                const v = edits['event-venue'] !== undefined ? (edits['event-venue'] || currentEvent?.venue) : (edits['venue'] || currentEvent?.venue);
                                                if (v !== undefined && v !== formData.defaultVenueName) {
                                                    newFormData.defaultVenueName = v;
                                                    formDataChanged = true;
                                                }
                                            }
                                            if (edits['event-date'] !== undefined && edits['event-date'] !== formData.primaryDate) {
                                                newFormData.primaryDate = edits['event-date'];
                                                formDataChanged = true;
                                            }
                                            if (edits['event-time'] !== undefined && edits['event-time'] !== formData.primaryTime) {
                                                newFormData.primaryTime = edits['event-time'];
                                                formDataChanged = true;
                                            }

                                            if (formDataChanged) {
                                                updateFormData(newFormData);
                                            }

                                            if (currentEvent) {
                                                let eventChanged = false;
                                                const updatedEvent = { ...currentEvent };

                                                if (edits['event-name'] !== undefined && edits['event-name'] !== (currentEvent.heading || currentEvent.name)) {
                                                    updatedEvent.heading = edits['event-name'];
                                                    eventChanged = true;
                                                }
                                                if (edits['event-date'] !== undefined && edits['event-date'] !== currentEvent.date) {
                                                    updatedEvent.date = edits['event-date'];
                                                    eventChanged = true;
                                                }
                                                if (edits['event-time'] !== undefined && edits['event-time'] !== currentEvent.time) {
                                                    updatedEvent.time = edits['event-time'];
                                                    eventChanged = true;
                                                }
                                                if ((edits['event-venue'] !== undefined || edits['venue'] !== undefined)) {
                                                    const v = edits['event-venue'] !== undefined ? edits['event-venue'] : edits['venue'];
                                                    if (v !== undefined && v !== currentEvent.venue) {
                                                        updatedEvent.venue = v;
                                                        updatedEvent.isCustomVenue = true;
                                                        eventChanged = true;
                                                    }
                                                }
                                                
                                                if (eventChanged) {
                                                    updateEvent(currentEvent.id, updatedEvent);
                                                }
                                            }
                                            
                                            // Call saveLayout to persist the custom html design layout & QR maps
                                            if (cardRef.current && typeof (cardRef.current as any).saveLayout === 'function') {
                                                try {
                                                    (cardRef.current as any).saveLayout();
                                                } catch (e) {
                                                    console.error("Error saving card layout:", e);
                                                }
                                            }
                                        }
                                        setIsEditMode(false);
                                    }} style={{ 
                                        background: '#EAB308', 
                                        color: '#000', 
                                        border: 'none', 
                                        borderRadius: '9999px',
                                        padding: '12px 24px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        <span>Save</span>
                                    </button>
                                </div>
                            )}
                        </div>



                        <div className={modalStyles.navContainer}>
                            <button 
                                className={clsx(modalStyles.navBtn, modalStyles.prevBtn)} 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setSelectedPreviewIndex((prev) => prev !== null && prev > 0 ? prev - 1 : previewItems.length - 1); 
                                }}
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button 
                                className={clsx(modalStyles.navBtn, modalStyles.nextBtn)} 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setSelectedPreviewIndex((prev) => prev !== null && prev < previewItems.length - 1 ? prev + 1 : 0); 
                                }}
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <main className="container">
                <div className={styles.mainLayout}>
                    {/* Left Column: Premium Carousel Slider */}
                    <div className={styles.leftColumn}>
                        <h2 className={styles.suiteCarouselTitle}>
                            Your complete wedding communication suite is ready.
                        </h2>
                        <p className={styles.suiteCarouselDesc}>
                            Beautiful invites, smart RSVP tracking and seamless sharing — everything you need to host stress-free.
                        </p>

                        {(previewItems.length > 0) ? (
                            <div className={styles.carouselWrapper}>
                                <div className={styles.carouselContainer}>
                                    <button 
                                        className={clsx(styles.arrowBtn, styles.arrowLeft)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveSliderIndex((prev) => (prev > 0 ? prev - 1 : previewItems.length - 1));
                                        }}
                                        aria-label="Previous card"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <div className={styles.carouselTrack}>
                                        {/* Far Left Card (-2) */}
                                        {previewItems.length >= 5 && (() => {
                                            const idx = (activeSliderIndex - 2 + previewItems.length) % previewItems.length;
                                            const item = previewItems[idx];
                                            return (
                                                <div key={`farleft-${item.id}`} className={clsx(styles.carouselCard, styles.cardFarLeft)}>
                                                    <PreviewCard
                                                        event={item.event}
                                                        theme={theme}
                                                        groomName={formData.groomName || ''}
                                                        brideName={formData.brideName || ''}
                                                        groomParents={formData.groomParents}
                                                        brideParents={formData.brideParents}
                                                        welcomeMessage={formData.invitationMessage}
                                                        isPlaceholder={true}
                                                        isRawPreview={false}
                                                        customImage={item.image}
                                                        structuredLayout={item.layout}
                                                        structuredCouple={formData}
                                                        className={styles.suiteThumbCard}
                                                        isSecured={true}
                                                    />
                                                </div>
                                            );
                                        })()}

                                        {/* Left Card (-1) */}
                                        {previewItems.length >= 3 && (() => {
                                            const idx = (activeSliderIndex - 1 + previewItems.length) % previewItems.length;
                                            const item = previewItems[idx];
                                            return (
                                                <div key={`left-${item.id}`} className={clsx(styles.carouselCard, styles.cardLeft)}>
                                                    <PreviewCard
                                                        event={item.event}
                                                        theme={theme}
                                                        groomName={formData.groomName || ''}
                                                        brideName={formData.brideName || ''}
                                                        groomParents={formData.groomParents}
                                                        brideParents={formData.brideParents}
                                                        welcomeMessage={formData.invitationMessage}
                                                        isPlaceholder={true}
                                                        isRawPreview={false}
                                                        customImage={item.image}
                                                        structuredLayout={item.layout}
                                                        structuredCouple={formData}
                                                        className={styles.suiteThumbCard}
                                                        isSecured={true}
                                                    />
                                                </div>
                                            );
                                        })()}

                                        {/* Center Active iPhone Mockup Card */}
                                        {(() => {
                                            const item = previewItems[activeSliderIndex];
                                            return (
                                                <div 
                                                    key={`center-${item.id}`} 
                                                    className={styles.iphoneMockup}
                                                    onClick={() => setSelectedPreviewIndex(activeSliderIndex)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className={styles.iphoneScreen}>
                                                        <div className={styles.iphoneCamera}></div>
                                                        <div className={styles.iphoneScreenCard}>
                                                            <PreviewCard
                                                                ref={el => { suiteRefs.current[item.id] = el; }}
                                                                event={item.event}
                                                                theme={theme}
                                                                groomName={formData.groomName || ''}
                                                                brideName={formData.brideName || ''}
                                                                groomParents={formData.groomParents}
                                                                brideParents={formData.brideParents}
                                                                welcomeMessage={formData.invitationMessage}
                                                                isPlaceholder={true}
                                                                isRawPreview={false}
                                                                customImage={item.image}
                                                                structuredLayout={item.layout}
                                                                structuredCouple={formData}
                                                                className={styles.suiteThumbCard}
                                                                isSecured={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Right Card (+1) */}
                                        {previewItems.length >= 3 && (() => {
                                            const idx = (activeSliderIndex + 1) % previewItems.length;
                                            const item = previewItems[idx];
                                            return (
                                                <div key={`right-${item.id}`} className={clsx(styles.carouselCard, styles.cardRight)}>
                                                    <PreviewCard
                                                        event={item.event}
                                                        theme={theme}
                                                        groomName={formData.groomName || ''}
                                                        brideName={formData.brideName || ''}
                                                        groomParents={formData.groomParents}
                                                        brideParents={formData.brideParents}
                                                        welcomeMessage={formData.invitationMessage}
                                                        isPlaceholder={true}
                                                        isRawPreview={false}
                                                        customImage={item.image}
                                                        structuredLayout={item.layout}
                                                        structuredCouple={formData}
                                                        className={styles.suiteThumbCard}
                                                        isSecured={true}
                                                    />
                                                </div>
                                            );
                                        })()}

                                        {/* Far Right Card (+2) */}
                                        {previewItems.length >= 5 && (() => {
                                            const idx = (activeSliderIndex + 2) % previewItems.length;
                                            const item = previewItems[idx];
                                            return (
                                                <div key={`farright-${item.id}`} className={clsx(styles.carouselCard, styles.cardFarRight)}>
                                                    <PreviewCard
                                                        event={item.event}
                                                        theme={theme}
                                                        groomName={formData.groomName || ''}
                                                        brideName={formData.brideName || ''}
                                                        groomParents={formData.groomParents}
                                                        brideParents={formData.brideParents}
                                                        welcomeMessage={formData.invitationMessage}
                                                        isPlaceholder={true}
                                                        isRawPreview={false}
                                                        customImage={item.image}
                                                        structuredLayout={item.layout}
                                                        structuredCouple={formData}
                                                        className={styles.suiteThumbCard}
                                                        isSecured={true}
                                                    />
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <button 
                                        className={clsx(styles.arrowBtn, styles.arrowRight)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveSliderIndex((prev) => (prev < previewItems.length - 1 ? prev + 1 : 0));
                                        }}
                                        aria-label="Next card"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                                
                                <div className={styles.cardLabel}>
                                    {previewItems[activeSliderIndex]?.name.includes('Invite') 
                                        ? previewItems[activeSliderIndex]?.name 
                                        : `${previewItems[activeSliderIndex]?.name} Invite`
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className={styles.noPreviews} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                No preview cards available for this theme.
                            </div>
                        )}

                        {/* Bento Grid of Features */}
                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIconWrapper}>
                                    <Sparkles size={22} />
                                </div>
                                <div className={styles.featureInfo}>
                                    <h4 className={styles.featureTitle}>12 Premium Assets</h4>
                                    <p className={styles.featureDesc}>Invitations tailored for every single wedding event</p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIconWrapper}>
                                    <LinkIcon size={22} />
                                </div>
                                <div className={styles.featureInfo}>
                                    <h4 className={styles.featureTitle}>RSVP Website</h4>
                                    <p className={styles.featureDesc}>Track responses and attendance in real time</p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIconWrapper}>
                                    <Users size={22} />
                                </div>
                                <div className={styles.featureInfo}>
                                    <h4 className={styles.featureTitle}>Guest Dashboard</h4>
                                    <p className={styles.featureDesc}>Manage your guest list, dietary choices, and companions easily</p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIconWrapper}>
                                    <MessageCircle size={22} />
                                </div>
                                <div className={styles.featureInfo}>
                                    <h4 className={styles.featureTitle}>WhatsApp Sharing</h4>
                                    <p className={styles.featureDesc}>One click sharing for all guests directly from WhatsApp</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges Section */}
                        <div className={styles.trustSection}>
                            <div className={styles.avatarGroup}>
                                <img src="https://picsum.photos/seed/user1/100/100" alt="Couple" className={styles.avatarImg} />
                                <img src="https://picsum.photos/seed/user2/100/100" alt="Couple" className={styles.avatarImg} />
                                <img src="https://picsum.photos/seed/user3/100/100" alt="Couple" className={styles.avatarImg} />
                                <img src="https://picsum.photos/seed/user4/100/100" alt="Couple" className={styles.avatarImg} />
                                <img src="https://picsum.photos/seed/user5/100/100" alt="Couple" className={styles.avatarImg} />
                                <div className={styles.avatarPlus}>+</div>
                            </div>
                            <div className={styles.trustText}>
                                Trusted by <span>1000+ families</span> across India
                                <div className={styles.starsRow}>
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <span style={{ marginLeft: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#4B5563' }}>4.9/5</span>
                                </div>
                                <span style={{ fontSize: '0.8125rem', color: '#6B7280', display: 'block', marginTop: '4px' }}>Loved for simplicity & design</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Title and Summary Card */}
                    <div className={styles.rightColumn}>
                        <div className={styles.summaryView}>
                            <div className={styles.summaryCard}>
                                <h1 className={styles.designTitle}>
                                    Unlock Your Wedding Suite
                                </h1>

                                <div className={styles.breakdownBox}>
                                    <div className={styles.popularBadge}>
                                        <div className={styles.badgeCheck}>
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                        <span>Popular this month</span>
                                    </div>
                                    <div className={styles.designDetailsList}>
                                        <div className={styles.designDetailSubheader}>{pricing.packageName}</div>
                                        <div className={styles.themeNameLabel}>{theme?.name || 'Wedding Theme ✨'}</div>
                                        <div className={styles.designDetailRow}>
                                            <span>Invitation design suite</span>
                                            <span>₹{pricing.designSuite}</span>
                                        </div>
                                        <div className={styles.designDetailRow}>
                                            <span>RSVP management & tracking</span>
                                            <span>₹{pricing.rsvpTracking}</span>
                                        </div>
                                        <div className={styles.designDetailRow}>
                                            <span>Guest dashboard + hosting</span>
                                            <span>₹{pricing.guestDashboard}</span>
                                        </div>
                                        <div className={styles.designDivider}></div>
                                        <div className={styles.totalValueRow}>
                                            <span>Total Wedding Suite Value</span>
                                            <span>₹{pricing.totalValue}</span>
                                        </div>
                                    </div>

                                    <div className={styles.offerRow}>
                                        <span>Launch Offer Discount</span>
                                        <span>{discountPercent}% OFF</span>
                                    </div>

                                    <div className={styles.finalPriceSection}>
                                        <div className={styles.priceLeft}>
                                            <span className={styles.originalPrice}>Total Amount</span>
                                        </div>
                                        <div className={styles.finalPriceRight}>
                                            <span className={styles.strikethroughPrice}>₹{pricing.totalValue}</span>
                                            <span className={`${styles.finalPrice} ${isButtonHovered ? styles.finalPriceMagnetic : ''}`}>₹{pricing.finalPrice}</span>
                                        </div>
                                    </div>

                                    <div className={styles.savingsBanner}>
                                        ✨ You saved ₹{pricing.discountedPrice} on your wedding communication suite
                                    </div>
                                    <div className={styles.socialProofLine}>
                                        ✨ Chosen by 24 families this month
                                    </div>
                                </div>

                                <button
                                    className={styles.unlockButton}
                                    onClick={handleCheckout}
                                    onMouseEnter={() => setIsButtonHovered(true)}
                                    onMouseLeave={() => setIsButtonHovered(false)}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                            <Loader2 className="animate-spin" size={18} />
                                            Processing...
                                        </div>
                                    ) : (
                                        "Unlock My Wedding Suite"
                                    )}
                                </button>

                                <div className={styles.featureList}>
                                    <div className={styles.featureItem}>
                                        <div className={styles.checkWrapper}><Check size={10} strokeWidth={4} /></div>
                                        <span>Instant delivery</span>
                                    </div>
                                    <div className={styles.featureItem}>
                                        <div className={styles.checkWrapper}><Check size={10} strokeWidth={4} /></div>
                                        <span>Secure Payments</span>
                                    </div>
                                    <div className={styles.featureItem}>
                                        <div className={styles.checkWrapper}><Check size={10} strokeWidth={4} /></div>
                                        <span>Free edits for 15 days</span>
                                    </div>
                                </div>

                                <p className={styles.footerNote}>
                                    Most couples start sharing invites within 10 minutes after payment.
                                </p>
                            </div>
                        </div>

                        {/* Info Blocks below the card */}
                        <div className={styles.infoBlockContainer}>
                            <div className={styles.infoBoxFull}>
                                <h3 className={styles.infoBoxTitle}>SATISFACTION GUARANTEED</h3>
                                <p className={styles.infoBoxText}>
                                    Final assets will be generated without watermarks in high definition immediately after payment. Editing allowed for next 15 days.
                                </p>
                            </div>
                            <div className={styles.infoBoxSplit}>
                                <div className={styles.infoBoxHalf}>
                                    <Headphones size={24} className={styles.infoIcon} />
                                    <div className={styles.infoContent}>
                                        <span className={styles.infoLabel}>Need Help? Contact Us</span>
                                        <span className={styles.infoValue}>+91 80105 81916</span>
                                    </div>
                                </div>
                                <div className={styles.infoBoxHalf}>
                                    <ShieldCheck size={24} className={styles.infoIcon} />
                                    <span className={styles.infoValue}>SECURE PAYMENTS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Authentication Gateway */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
            {showProcessing && (
                <ProcessingOverlay onComplete={() => setShowProcessing(false)} />
            )}

            {isQrPopoverOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-sans)'
                }} onClick={() => {
                    setIsQrPopoverOpen(false);
                    setQrLink('');
                }}>
                    <div style={{
                        background: 'var(--background)',
                        borderRadius: '20px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        {/* Text Area Dotted Field */}
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <textarea
                                value={qrLink}
                                onChange={(e) => setQrLink(e.target.value)}
                                placeholder="Paste your Google Maps link here..."
                                style={{
                                    width: '100%',
                                    minHeight: '90px',
                                    padding: '12px',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    textAlign: 'center',
                                    border: '1.5px dashed var(--primary)',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    resize: 'none',
                                    color: 'var(--foreground)',
                                    background: '#FFFFFF',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(200, 169, 81, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Title input field */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                color: 'var(--primary)',
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                marginBottom: '6px',
                                letterSpacing: '0.05em'
                            }}>
                                Title
                            </label>
                            <input
                                type="text"
                                value={qrTitle}
                                onChange={(e) => setQrTitle(e.target.value.slice(0, 32))}
                                maxLength={32}
                                placeholder="e.g., SCAN FOR LOCATION"
                                style={{
                                    width: '100%',
                                    padding: '6px 0',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    border: 'none',
                                    borderBottom: '1.5px solid var(--border)',
                                    outline: 'none',
                                    color: 'var(--foreground)',
                                    background: 'transparent',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderBottomColor = 'var(--primary)'}
                                onBlur={(e) => e.currentTarget.style.borderBottomColor = 'var(--border)'}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontSize: '11px',
                                color: 'var(--muted-foreground)',
                                marginTop: '4px'
                            }}>
                                <span>Max character limit is 32</span>
                            </div>
                        </div>

                        {/* Info link */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--foreground)',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginBottom: '20px',
                            transition: 'color 0.2s'
                        }} 
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--foreground)'}
                        onClick={() => window.open('https://support.google.com/maps/answer/144154', '_blank')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>How to copy location link from Google Maps</span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px'
                        }}>
                            <button
                                onClick={() => {
                                    setIsQrPopoverOpen(false);
                                    setQrLink('');
                                }}
                                style={{
                                    background: 'var(--muted)',
                                    color: 'var(--foreground)',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    padding: '10px 20px',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#DFDEDC'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'var(--muted)'}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!qrLink.trim()}
                                onClick={() => {
                                    if (cardRef.current && qrLink.trim()) {
                                        cardRef.current.sendMessage({
                                            type: 'ADD_QR',
                                            payload: {
                                                link: qrLink.trim(),
                                                title: qrTitle.trim() || 'SCAN FOR LOCATION'
                                            }
                                        });
                                        
                                        // Auto-save the layout after adding the QR code so the user doesn't lose it if they exit directly
                                        setTimeout(() => {
                                            if (cardRef.current && typeof (cardRef.current as any).saveLayout === 'function') {
                                                try {
                                                    (cardRef.current as any).saveLayout();
                                                } catch (e) { }
                                            }
                                        }, 100);
                                        
                                        setIsQrPopoverOpen(false);
                                        setQrLink('');
                                    }
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #ECC878 0%, #D4AF37 100%)',
                                    color: '#111111',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    padding: '10px 20px',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: qrLink.trim() ? 'pointer' : 'not-allowed',
                                    opacity: qrLink.trim() ? 1 : 0.5,
                                    boxShadow: qrLink.trim() ? '0 4px 12px rgba(212, 175, 55, 0.2)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    if (qrLink.trim()) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #f0d59a 0%, #e0c15a 100%)';
                                        e.currentTarget.style.boxShadow = '0 8px 18px rgba(212, 175, 55, 0.3)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (qrLink.trim()) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ECC878 0%, #D4AF37 100%)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.2)';
                                        e.currentTarget.style.transform = 'none';
                                    }
                                }}
                            >
                                Generate QR Code
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExitConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-sans)'
                }} onClick={() => setShowExitConfirm(false)}>
                    <div style={{
                        background: 'var(--background)',
                        borderRadius: '16px',
                        padding: '28px 24px',
                        width: '90%',
                        maxWidth: '380px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        {/* Exclamation Circle */}
                        <div style={{
                            border: '1.5px solid var(--primary)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                            backgroundColor: 'rgba(200, 169, 81, 0.05)'
                        }}>
                            <span style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: 400, lineHeight: 1 }}>!</span>
                        </div>

                        {/* Title */}
                        <h3 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '21px',
                            fontWeight: '500',
                            textAlign: 'center',
                            color: 'var(--foreground)',
                            margin: '0 0 8px',
                            letterSpacing: '0.02em'
                        }}>
                            Do you want to exit?
                        </h3>

                        {/* Description */}
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--muted-foreground)',
                            textAlign: 'center',
                            lineHeight: '1.5',
                            margin: '0 0 24px',
                            padding: '0 10px'
                        }}>
                            If you exit now, any unsaved layout changes will be lost.
                        </p>

                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            gap: '10px'
                        }}>
                            <button
                                onClick={() => setShowExitConfirm(false)}
                                style={{
                                    flex: 1,
                                    background: 'var(--muted)',
                                    color: 'var(--foreground)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '11px 0',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#DFDEDC'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'var(--muted)'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setResetKey(prev => prev + 1); // Discard layout changes by force remounting
                                    setIsEditMode(false);
                                    setShowExitConfirm(false);
                                    if (typeof window !== 'undefined' && window.history.state?.noBackExitsEditMode) {
                                        isPoppingHistoryState.current = true;
                                        window.history.back();
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    background: 'var(--foreground)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '11px 0',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#000000';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'var(--foreground)';
                                    e.currentTarget.style.transform = 'none';
                                }}
                            >
                                Exit Without Saving
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
