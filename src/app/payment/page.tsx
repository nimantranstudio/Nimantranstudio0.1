'use client';

import { useWeddingStore } from '@/store/wedding-store';
import styles from './payment.module.css';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PaymentPage() {
    const router = useRouter();
    const { formData, selectedThemeId, selectedPlan } = useWeddingStore();
    
    // In a real flow, this would integrate Razorpay or similar
    const handlePay = () => {
        alert("Payment Gateway Integration Pending!");
        // Simulate a success and go to dashboard
        router.push('/dashboard/demo-id');
    };

    const [isDownloading, setIsDownloading] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [themeBundle, setThemeBundle] = useState<any>(null);

    useEffect(() => {
        if (!selectedThemeId || !selectedPlan) return;
        
        Promise.all([
            fetch(`/api/themes/${selectedThemeId}`),
            fetch('/api/admin/packages')
        ]).then(async ([themeRes, pkgsRes]) => {
            const themeData = await themeRes.json();
            const pkgsData = await pkgsRes.json();
            
            const bundle = themeData.theme?.bundles?.[0];
            setThemeBundle(bundle);
            
            if (bundle && pkgsData.packages) {
                const pkg = pkgsData.packages.find((p: any) => p.name === selectedPlan);
                if (pkg && bundle.bundleInvoices) {
                    const invoice = bundle.bundleInvoices.find((inv: any) => inv.packageId === pkg.id);
                    if (invoice) {
                        setInvoiceData(invoice);
                    }
                }
            }
        }).catch(err => console.error("Failed to load invoice", err));
    }, [selectedThemeId, selectedPlan]);

    const generateBundleBlobs = async () => {
        const currentStore = useWeddingStore.getState();
        const { events, defaultVenueName, primaryDate, primaryTime, groomName, brideName, groomParents, brideParents, invitationMessage } = currentStore.formData;
        const actualBundleItems = currentStore.bundleItems || [];
        
        let items: any[] = [];
        
        if (!actualBundleItems || actualBundleItems.length === 0) {
            const images = (currentStore.bundleImages && currentStore.bundleImages.length > 0) ? currentStore.bundleImages : [];
            images.forEach((img, i) => items.push({ name: `Design_${i+1}`, file: img }));
        } else {
            const weddingEvents = currentStore.formData.events || [];
            actualBundleItems.forEach(bi => {
                if (!bi.templatePath) return; // Renamed
                const biType = bi.eventType.toUpperCase().replace(/_/g, '');
                let matchedEvent = weddingEvents.find(evt => {
                    const evtId = evt.id.toUpperCase();
                    const evtType = (evt.eventType || '').toUpperCase();
                    const evtName = (evt.name || '').toUpperCase();
                    if (biType.includes(evtId) || evtId.includes(biType)) return true;
                    if (evtType && (biType.includes(evtType) || evtType.includes(biType))) return true;
                    if (biType.includes(evtName) || evtName.includes(biType)) return true;
                    return false;
                });
                items.push({
                    name: bi.templateName || bi.eventType,
                    file: bi.templatePath, // Renamed
                    event: matchedEvent
                });
            });
        }

        const blobs: { name: string, blob: Blob, ext: string }[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.file) continue;
            
            try {
                const res = await fetch(item.file);
                if (!res.ok) continue;
                
                const isHTML = item.file.toLowerCase().endsWith('.html');
                
                if (isHTML) {
                    const htmlText = await res.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    
                    const displayEventName = item.event?.heading || item.event?.name || item.name;
                    const displayWelcome = currentStore.formData.invitationMessage || item.event?.tagline || '';
                    
                    const mapping: Record<string, string | undefined> = {
                        'event-name': displayEventName,
                        'welcome-message': displayWelcome,
                        'groom-name': currentStore.formData.groomName,
                        'bride-name': currentStore.formData.brideName,
                        'groom-parents': currentStore.formData.groomParents,
                        'groom-parent-name': currentStore.formData.groomParents,
                        'bride-parents': currentStore.formData.brideParents,
                        'bride-parent-name': currentStore.formData.brideParents,
                        'event-date': item.event?.date || currentStore.formData.primaryDate,
                        'event-time': item.event?.time || currentStore.formData.primaryTime,
                        'event-venue': (item.event?.isCustomVenue && item.event?.venue) ? item.event.venue : currentStore.formData.defaultVenueName,
                        'venue': (item.event?.isCustomVenue && item.event?.venue) ? item.event.venue : currentStore.formData.defaultVenueName,
                    };

                    Object.entries(mapping).forEach(([id, value]) => {
                        if (value !== undefined && value !== null) {
                            const el = doc.getElementById(id);
                            if (el) el.innerHTML = value.toString().replace(/\\n/g, '<br/>');
                        }
                    });
                    
                    const styleTags = doc.querySelectorAll('style:not(#runtime-preview-fix)');
                    styleTags.forEach(tag => {
                        if (tag.innerHTML.includes('vw')) tag.innerHTML = tag.innerHTML.replace(/([\d.]+)vw/g, '$1vmax');
                    });
                    
                    const finalHtml = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

                    // Render HTML to PNG Blob using hidden iframe
                    const blob = await new Promise<Blob>((resolve, reject) => {
                        const iframe = document.createElement('iframe');
                        iframe.style.position = 'absolute';
                        iframe.style.top = '-9999px';
                        iframe.style.width = '500px';
                        iframe.style.height = '889px';
                        document.body.appendChild(iframe);
                        
                        iframe.onload = () => {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                            if (!iframeDoc) return reject();
                            
                            setTimeout(() => {
                                const win = iframe.contentWindow as any;
                                const execute = () => {
                                    win.html2canvas(iframeDoc.body, { useCORS: true, scale: 2 }).then((canvas: HTMLCanvasElement) => {
                                        canvas.toBlob(b => {
                                            document.body.removeChild(iframe);
                                            if (b) resolve(b); else reject();
                                        }, 'image/png');
                                    });
                                };

                                if (!win.html2canvas) {
                                    const script = iframeDoc.createElement('script');
                                    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
                                    script.onload = execute;
                                    iframeDoc.head.appendChild(script);
                                } else {
                                    execute();
                                }
                            }, 1200); // 1.2s to wait for fonts and layout
                        };
                        
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                        if (iframeDoc) {
                            iframeDoc.open();
                            iframeDoc.write(finalHtml);
                            iframeDoc.close();
                        }
                    });

                    blobs.push({ name: item.name, blob, ext: 'png' });
                } else {
                    const blob = await res.blob();
                    const ext = item.file.split('.').pop() || 'png';
                    blobs.push({ name: item.name, blob, ext });
                }
            } catch(e) { console.error("Could not fetch or format", item.file, e); }
        }
        return blobs;
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            if (!(window as any).JSZip) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error("Failed to load JSZip"));
                    document.head.appendChild(script);
                });
            }
            
            const JSZip = (window as any).JSZip;
            const zip = new JSZip();
            
            const blobs = await generateBundleBlobs();
            blobs.forEach(b => {
                zip.file(`Nimantran_${b.name.replace(/[^a-zA-Z0-9]/g, '_')}.${b.ext}`, b.blob);
            });

            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `Nimantran-Wedding-Bundle.zip`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error(err);
            alert("Error generating zip bundle!");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={styles.paymentPage}>
            <header className={styles.header}>
                <div className="container">
                    <button onClick={() => router.back()} className={styles.backButton}>
                        <ChevronLeft size={20} />
                        Back to Preview
                    </button>
                    <h1 className={styles.title}>Secure Checkout</h1>
                </div>
            </header>

            <main className="container">
                <div className={styles.mainLayout}>
                    <div className={styles.leftColumn}>
                        <div className={styles.sectionCard}>
                            <h2 className={styles.sectionTitle}>Order Summary</h2>
                            {invoiceData ? (
                                <>
                                    {invoiceData.invitationDesignSuite > 0 && (
                                        <div className={styles.summaryItem}>
                                            <span>Invitation Design Suite</span>
                                            <span>₹{invoiceData.invitationDesignSuite}</span>
                                        </div>
                                    )}
                                    {invoiceData.rsvpManagementTracking > 0 && (
                                        <div className={styles.summaryItem}>
                                            <span>RSVP Management Tracking</span>
                                            <span>₹{invoiceData.rsvpManagementTracking}</span>
                                        </div>
                                    )}
                                    {invoiceData.guestDashboard > 0 && (
                                        <div className={styles.summaryItem}>
                                            <span>Guest Dashboard & Hosting</span>
                                            <span>₹{invoiceData.guestDashboard}</span>
                                        </div>
                                    )}
                                    <div className={styles.divider}></div>
                                    <div className={styles.summaryItem}>
                                        <span>Total Wedding Suite Value</span>
                                        <span>₹{invoiceData.totalWeddingSuiteValue}</span>
                                    </div>
                                    {invoiceData.discount > 0 && (
                                        <div className={styles.summaryItem} style={{ color: '#16a34a' }}>
                                            <span>Offer / Discount ({invoiceData.discount}%)</span>
                                            <span>- ₹{invoiceData.totalWeddingSuiteValue - invoiceData.discountedPrice}</span>
                                        </div>
                                    )}
                                    <div className={styles.divider}></div>
                                    <div className={`${styles.summaryItem} ${styles.totalItem}`}>
                                        <span>Total Amount to Pay</span>
                                        <span>₹{invoiceData.finalSellingPrice || invoiceData.discountedPrice}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.summaryItem}>
                                        <span>{selectedPlan || 'Theme Complete Bundle'}</span>
                                        <span>...</span>
                                    </div>
                                    <div className={styles.divider}></div>
                                    <div className={`${styles.summaryItem} ${styles.totalItem}`}>
                                        <span>Total Amount to Pay</span>
                                        <span>...</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.sectionCard}>
                            <h2 className={styles.sectionTitle}>Contact Informatiom</h2>
                            <div className={styles.contactInfo}>
                                <p><strong>Name:</strong> {formData.groomName || 'Couple'} & {formData.brideName || 'Partner'}</p>
                                <p><strong>Email:</strong> (Associated with account)</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.paymentCard}>
                            <div className={styles.secureBadge}>
                                <Lock size={16} />
                                100% Secure Payment
                            </div>
                            
                            <h2 className={styles.sectionTitle}>Select Payment Method</h2>
                            
                            <div className={styles.paymentMethods}>
                                <button className={styles.methodBtn} onClick={handlePay}>
                                    <div className={styles.methodIcon}>UPI</div>
                                    <div className={styles.methodText}>Google Pay, PhonePe, Paytm</div>
                                </button>
                                
                                <button className={styles.methodBtn} onClick={handlePay}>
                                    <div className={styles.methodIcon}>💳</div>
                                    <div className={styles.methodText}>Credit / Debit Cards</div>
                                </button>
                                
                                <button className={styles.methodBtn} onClick={handlePay}>
                                    <div className={styles.methodIcon}>🏦</div>
                                    <div className={styles.methodText}>Net Banking</div>
                                </button>
                            </div>
                            
                            <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                            
                            <h2 className={styles.sectionTitle}>Or Download Directly</h2>
                            <button className={styles.downloadBtn} onClick={handleDownload} disabled={isDownloading}>
                                {isDownloading ? (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}} className={styles.spin}>
                                            <line x1="12" y1="2" x2="12" y2="6"></line>
                                            <line x1="12" y1="18" x2="12" y2="22"></line>
                                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                            <line x1="2" y1="12" x2="6" y2="12"></line>
                                            <line x1="18" y1="12" x2="22" y2="12"></line>
                                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download Bundle Now
                                    </>
                                )}
                            </button>
                            
                            <button className={styles.whatsappBtn} onClick={async () => {
                                setIsDownloading(true);
                                try {
                                    // 1. Generate individual images
                                    const blobs = await generateBundleBlobs();
                                    
                                    // 2. Download them individually so they can be dragged cleanly
                                    for(let i=0; i<blobs.length; i++) {
                                        const b = blobs[i];
                                        const url = URL.createObjectURL(b.blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `Nimantran_${b.name.replace(/[^a-zA-Z0-9]/g, '_')}.${b.ext}`;
                                        link.click();
                                        setTimeout(() => URL.revokeObjectURL(url), 1000);
                                        await new Promise(r => setTimeout(r, 200)); // Stagger downloads slightly
                                    }
                                    
                                    // 3. Open WhatsApp pre-filled with the message
                                    const currentStore = useWeddingStore.getState();
                                    const rawPhone = currentStore.userPhone || '';
                                    const userPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
                                    
                                    const message = `Hey! Here is the finalized wedding invitation bundle from Nimantran Studio! 💍✨ (Please attach the images that were just downloaded)`;
                                    
                                    setTimeout(() => {
                                        window.open(`https://api.whatsapp.com/send?phone=${userPhone}&text=${encodeURIComponent(message)}`, '_blank');
                                    }, 1000); // Give user a second after the last download
                                } catch (err) {
                                    console.error(err);
                                    alert("Error generating images for WhatsApp.");
                                } finally {
                                    setIsDownloading(false);
                                }
                            }} disabled={isDownloading}>
                                {isDownloading ? (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}} className={styles.spin}>
                                            <line x1="12" y1="2" x2="12" y2="6"></line>
                                            <line x1="12" y1="18" x2="12" y2="22"></line>
                                        </svg>
                                        Preparing Bundle...
                                    </>
                                ) : (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                                            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
                                        </svg>
                                        Send on WhatsApp
                                    </>
                                )}
                            </button>
                            
                            <p className={styles.trustText}>
                                By proceeding, you agree to our Terms and Conditions and Privacy Policy. All transactions are securely encrypted.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
