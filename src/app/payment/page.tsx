'use client';

import { useWeddingStore } from '@/store/wedding-store';
import styles from './payment.module.css';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Lock, Check, ShieldCheck, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { InvitationCardRef } from '@/components/preview/InvitationCard';
import { PreviewCard } from '@/components/preview/PreviewCard';
import { ProvisioningOverlay } from '@/components/payment/ProvisioningOverlay';
import { WelcomeDialog } from '@/components/dashboard/WelcomeDialog';
import clsx from 'clsx';

export default function PaymentPage() {
    const router = useRouter();
    const { formData, selectedThemeId, selectedPlan, userPhone, bundleItems: storeBundleItems, bundleImages, setCheckoutComplete } = useWeddingStore();
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [theme, setTheme] = useState<any>(null);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');

    const handlePay = async () => {
        setIsProcessing(true);
        try {
            // Step 2: Create Order — the server derives the price from the
            // theme + package; no client-supplied amount is trusted.
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    themeId: selectedThemeId,
                    packageName: selectedPlan,
                    currency: 'INR'
                })
            });

            const data = await res.json();

            if (!data.orderId || !data.key) {
                throw new Error(data.error || 'Failed to create order - missing orderId or key');
            }

            console.log('Order created:', data);

            // Step 4: Open Razorpay Modal
            // Ensure Razorpay script is loaded before trying to instantiate
            if (typeof (window as any).Razorpay === 'undefined') {
                console.log('Razorpay script not found, loading manually...');
                // Script not yet loaded — load it manually and wait
                await new Promise<void>((resolve, reject) => {
                    const existing = document.getElementById('razorpay-checkout-js');
                    if (existing) {
                        console.log('Razorpay script already exists');
                        resolve();
                        return;
                    }
                    const script = document.createElement('script');
                    script.id = 'razorpay-checkout-js';
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => {
                        console.log('Razorpay script loaded successfully');
                        resolve();
                    };
                    script.onerror = () => {
                        console.error('Failed to load Razorpay script');
                        reject(new Error('Failed to load Razorpay'));
                    };
                    document.head.appendChild(script);
                });
            } else {
                console.log('Razorpay already available');
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Nimantran Studio",
                description: "Wedding Essentials Bundle",
                order_id: data.orderId,
                handler: async function (response: any) {
                    // Show the provisioning overlay immediately; the backend work
                    // (verify → account → session → provision) runs behind it.
                    setPaymentStatus('success');

                    // Hero image for the WhatsApp welcome. First try to capture the
                    // couple's REAL personalized card and host it; if capture/upload
                    // fails for any reason, fall back to a hosted bundle image.
                    const isImg = (u: any) => typeof u === 'string' && /\.(png|jpe?g|webp)(\?|$)/i.test(u);
                    let heroImageUrl: string | undefined =
                        (bundleImages || []).find(isImg) ||
                        (storeBundleItems || []).map((i: any) => i?.image).find(isImg) ||
                        undefined;
                    try {
                        const dataUrl = await heroCardRef.current?.captureDataUrl();
                        if (dataUrl) {
                            const up = await fetch('/api/cards/upload', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    dataUrl,
                                    name: `${formData.groomName || 'wedding'}-${formData.brideName || 'invite'}`,
                                }),
                            });
                            const upData = await up.json().catch(() => ({}));
                            if (up.ok && upData?.success && upData?.url) heroImageUrl = upData.url;
                        }
                    } catch {
                        /* keep the fallback bundle image */
                    }

                    try {
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
                        if (!verifyRes.ok || !verifyData.success) {
                            throw new Error(verifyData.error || 'Payment verification failed');
                        }

                        // Record the provisioned wedding + auth state client-side so
                        // the dashboard's server-linked features (RSVP links) resolve.
                        setCheckoutComplete(verifyData.weddingId, userPhone);

                        // The session cookie is set server-side; head straight to
                        // the dashboard. A small floor keeps the overlay legible.
                        await new Promise((r) => setTimeout(r, 900));
                        router.push('/dashboard?welcome=true');
                    } catch (err: any) {
                        console.error('Payment verification error:', err);
                        setPaymentStatus('failed');
                        setIsProcessing(false);
                        alert(err?.message || 'We received your payment but hit a snag setting things up. Please contact support with your payment reference.');
                    }
                },
                prefill: {
                    name: formData.groomName || formData.brideName ? `${formData.groomName || ''} ${formData.brideName || ''}`.trim() : '',
                    email: '',
                    contact: formData.rsvpContact || userPhone || ""
                },
                // UPI only — no cards/netbanking/wallets/EMI, so no card-linked bank offers show up.
                method: {
                    upi: true,
                    card: false,
                    netbanking: false,
                    wallet: false,
                    paylater: false,
                    emi: false,
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

            console.log('Creating Razorpay instance with options:', options);
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response);
                setPaymentStatus('failed');
                setIsProcessing(false);
                alert("Payment failed. Nothing has been charged.");
            });

            console.log('Opening Razorpay modal...');
            // Open immediately instead of with delay
            rzp.open();

        } catch (error: any) {
            console.error('Error initiating payment:', error);
            setIsProcessing(false);
            const errorMessage = error?.message || 'Unknown error';
            alert(`Payment Error: ${errorMessage}`);
        }
    };

    useEffect(() => {
        if (!selectedThemeId || !selectedPlan) return;
        
        Promise.all([
            fetch(`/api/themes/${selectedThemeId}`),
            fetch('/api/admin/packages')
        ]).then(async ([themeRes, pkgsRes]) => {
            const themeData = await themeRes.json();
            const pkgsData = await pkgsRes.json();
            
            if (themeData.theme) {
                setTheme(themeData.theme);
                const bundle = themeData.theme?.bundles?.[0];
                if (bundle) {
                    if (pkgsData.packages) {
                        const pkg = pkgsData.packages.find((p: any) => p.name === selectedPlan);
                        if (pkg && bundle.bundleInvoices) {
                            const invoice = bundle.bundleInvoices.find((inv: any) => inv.packageId === pkg.id);
                            if (invoice) {
                                setInvoiceData(invoice);
                            }
                        }
                    }
                }
            }
        }).catch(err => console.error("Failed to load data", err));
    }, [selectedThemeId, selectedPlan]);

    // Same mapping logic as preview/page.tsx
    const buildPreviewItems = () => {
        if (!storeBundleItems || storeBundleItems.length === 0) return [];

        const ID_MAPPING: Record<string, string> = {
            'evt_1': 'wedding', 'evt_2': 'wedding', 'evt_3': 'wedding',
            'evt_4': 'wedding', 'evt_5': 'wedding', 'evt_6': 'save_the_date',
            'evt_7': 'wedding', 'evt_8': 'haldi', 'evt_9': 'sangeet',
            'evt_10': 'mehendi', 'evt_11': 'wedding', 'evt_12': 'rsvp',
            'evt_13': 'reception', 'evt_14': 'wedding', 'evt_15': 'haldi',
            'evt_16': 'mehendi', 'evt_17': 'wedding'
        };

        const weddingEvents = formData.events || [];
        const items: Array<{ id: string; name: string; image: string; event: any; layout?: any }> = [];

        for (const bi of storeBundleItems) {
            if (!bi.templatePath) continue; 
            
            // Only show images, not SVGs/HTMLs if possible, actually we render all in phone mockups
            const rawType = bi.eventType || bi.event?.eventName || '';
            const biType = rawType.toUpperCase().replace(/_/g, '');
            const dbEventId = bi.eventId;

            let matchedEvent = weddingEvents.find(evt => {
                const masterId = evt.id.toLowerCase();
                if (dbEventId && ID_MAPPING[dbEventId] === masterId) return true;
                if (!biType) return false;
                const evtName = (evt.name || '').toUpperCase();
                if (evtName && biType.includes(evtName)) return true;
                if (biType.includes('WEDDING') && masterId.includes('wedding')) return true;
                if (biType.includes('HALDI') && masterId.includes('haldi')) return true;
                if (biType.includes('MEHENDI') && masterId.includes('mehendi')) return true;
                if (biType.includes('SANGEET') && masterId.includes('sangeet')) return true;
                if (biType.includes('RECEPTION') && masterId.includes('reception')) return true;
                return false;
            });

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

    const previewItems = buildPreviewItems();

    // Hidden hero card used to capture the couple's real Wedding Invitation as a
    // PNG for the WhatsApp welcome. Prefer the wedding item; fall back to first.
    const heroCardRef = useRef<InvitationCardRef>(null);
    const heroItem =
        previewItems.find((it: any) => /wedding/i.test(`${it?.name || ''} ${it?.id || ''}`)) ||
        previewItems[0];

    // Auto-slide effect
    useEffect(() => {
        if (previewItems.length <= 1) return;
        
        const interval = setInterval(() => {
            setSelectedPreviewIndex((prevIndex) => 
                prevIndex === previewItems.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [previewItems.length]);
    // Dynamic user details
    const groom = formData.groomName || 'Vivek';
    const bride = formData.brideName || 'Priyanka';
    const coupleNames = `${groom} & ${bride}`;

    // Pricing — derived from the configured invoice (server re-derives and is
    // the source of truth at checkout; this is the display value).
    const totalAmount = invoiceData?.finalSellingPrice ?? invoiceData?.discountedPrice ?? 0;
    const basePrice = totalAmount > 0 ? +(totalAmount / 1.18).toFixed(2) : 0;
    const gstAmount = +(totalAmount - basePrice).toFixed(2);

    return (
        <div className={styles.paymentPage}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => console.log('Razorpay script loaded')} />

            {/* Hidden, full-size Wedding Invitation card — kept in layout (off-screen)
                so it's fully rendered/loaded and can be captured to a PNG at payment
                success for the WhatsApp welcome hero image. */}
            {heroItem && theme && (
                <div aria-hidden style={{ position: 'fixed', left: '-99999px', top: 0, width: '500px', zIndex: -1, pointerEvents: 'none', opacity: 0 }}>
                    <PreviewCard
                        ref={heroCardRef}
                        event={heroItem.event}
                        theme={theme}
                        groomName={groom}
                        brideName={bride}
                        groomParents={formData.groomParents}
                        brideParents={formData.brideParents}
                        customImage={heroItem.image}
                        structuredLayout={(heroItem as any).layout}
                        structuredCouple={formData}
                        isPlaceholder={false}
                        isRawPreview={false}
                        type='image'
                    />
                </div>
            )}

            {/* Fullscreen payment success card modal */}
            {paymentStatus === 'success' && (
                <WelcomeDialog 
                    open={paymentStatus === 'success'} 
                    onClose={() => router.push('/dashboard')} 
                    coupleNames={coupleNames}
                    autoDismiss={false} 
                />
            )}

            <div className={styles.breadcrumbBar}>
                <div className={styles.breadcrumbContainer}>
                    <button onClick={() => router.back()} className={styles.backLink}>
                        <ChevronLeft size={16} />
                        Back
                    </button>
                </div>
            </div>
            
            <main className={styles.mainContainer}>
                <div className={styles.premiumLayout}>
                    {/* Left Column - Gallery Layout (Thumbnails + Phone Frame) */}
                    <div className={styles.gallerySection}>
                        
                        {/* Thumbnails */}
                        <div className={styles.thumbnailList}>
                            {previewItems.map((item, idx) => (
                                <div 
                                    key={item.id + idx}
                                    className={clsx(styles.thumbnailWrapper, {
                                        [styles.thumbnailActive]: idx === selectedPreviewIndex
                                    })}
                                    onClick={() => setSelectedPreviewIndex(idx)}
                                >
                                    <div className={styles.thumbnailInner}>
                                        <PreviewCard
                                            event={item.event}
                                            theme={theme}
                                            groomName={groom}
                                            brideName={bride}
                                            groomParents={formData.groomParents}
                                            brideParents={formData.brideParents}
                                            customImage={item.image}
                                            structuredLayout={(item as any).layout}
                                            structuredCouple={formData}
                                            isPlaceholder={true}
                                            isRawPreview={false}
                                            type='image'
                                        />
                                    </div>
                                    <div className={styles.thumbnailLabel}>{item.name}</div>
                                </div>
                            ))}
                        </div>

                        {/* Phone Mockup Frame */}
                        <div className={styles.phoneFrameWrapper}>
                            {previewItems.length > 1 && (
                                <button 
                                    className={styles.carouselButton} 
                                    onClick={() => setSelectedPreviewIndex(prev => prev === 0 ? previewItems.length - 1 : prev - 1)}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            <div className={styles.phoneMockup}>
                                <div className={styles.phoneNotch}></div>
                                {previewItems.length > 0 && (
                                    <div className={styles.phoneScreen}>
                                        {previewItems.map((item, idx) => (
                                            <div 
                                                key={`slider-item-${idx}`}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: idx === selectedPreviewIndex ? 1 : 0,
                                                    transition: 'none',
                                                    pointerEvents: idx === selectedPreviewIndex ? 'auto' : 'none',
                                                    zIndex: idx === selectedPreviewIndex ? 1 : 0
                                                }}
                                            >
                                                <PreviewCard
                                                    event={item.event}
                                                    theme={theme}
                                                    groomName={groom}
                                                    brideName={bride}
                                                    groomParents={formData.groomParents}
                                                    brideParents={formData.brideParents}
                                                    customImage={item.image}
                                                    structuredLayout={(item as any).layout}
                                                    structuredCouple={formData}
                                                    isPlaceholder={true}
                                                    isRawPreview={false}
                                                    type='image'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {previewItems.length > 1 && (
                                <button 
                                    className={styles.carouselButton} 
                                    onClick={() => setSelectedPreviewIndex(prev => prev === previewItems.length - 1 ? 0 : prev + 1)}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Payment Actions (Consolidated) */}
                    <div className={styles.paymentActionSection}>
                        
                        <div className={styles.orderSummaryHeader}>
                            <h1 className={styles.pageTitle}>Review Your Wedding Suite</h1>
                            <p className={styles.pageSubtitle}>Everything below is unlocked for {coupleNames} the moment you pay — no account setup, no passwords.</p>
                        </div>

                        <div className={styles.actionCard}>
                            <div className={styles.productSummaryHeader}>
                                <h3 className={styles.productName}>Your Complete Wedding Suite</h3>
                                <p className={styles.productDesc}>One payment. Your entire celebration, ready to share.</p>

                                <ul className={styles.premiumChecklist}>
                                    <li><Check size={14} /> Save the Date</li>
                                    <li><Check size={14} /> Wedding Invitation</li>
                                    <li><Check size={14} /> Haldi Invitation</li>
                                    <li><Check size={14} /> Mehendi Invitation</li>
                                    <li><Check size={14} /> Reception Invitation</li>
                                    <li><Check size={14} /> RSVP Website</li>
                                    <li><Check size={14} /> Guest Dashboard</li>
                                    <li><Check size={14} /> Unlimited WhatsApp Sharing</li>
                                </ul>
                            </div>
                            
                            <div className={styles.pricingBreakdown}>
                                <div className={styles.priceItem}>
                                    <span className={styles.priceLabel}>Base Price</span>
                                    <span className={styles.priceValue}>₹{basePrice.toFixed(2)}</span>
                                </div>
                                <div className={styles.priceItem}>
                                    <span className={styles.priceLabel}>Taxes (18% GST)</span>
                                    <span className={styles.priceValue}>₹{gstAmount.toFixed(2)}</span>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.totalPriceItem}>
                                    <span className={styles.totalLabel}>Total Payable</span>
                                    <span className={styles.totalValue}>₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>



                            <button 
                                className={styles.premiumPayBtn} 
                                onClick={handlePay}
                                disabled={isProcessing}
                                style={{
                                    opacity: isProcessing ? 0.7 : 1,
                                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="spinner" style={{
                                            width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite',
                                            marginRight: '8px', display: 'inline-block', verticalAlign: 'middle'
                                        }} />
                                        Preparing Secure Checkout...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} />
                                        Unlock My Wedding Suite · ₹{totalAmount.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <div className={styles.trustBadges}>
                                <div className={styles.trustItem}>
                                    <ShieldCheck size={16} />
                                    <span>256-bit SSL</span>
                                </div>
                                <div className={styles.trustItem}>
                                    <Zap size={16} />
                                    <span>Instant Access</span>
                                </div>
                            </div>
                            
                            <p className={styles.termsText}>
                                By proceeding, you agree to our <Link href="/terms">Terms</Link> & <Link href="/privacy">Privacy Policy</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
