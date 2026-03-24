'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { 
    ArrowLeft, 
    Check, 
    Copy, 
    Download, 
    Sparkles, 
    MessageCircle, 
    CheckCircle2, 
    HelpCircle,
    Info,
    LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import dashboardStyles from '../dashboard.module.css';
import styles from './orders.module.css';

export default function MyOrdersPage() {
    const router = useRouter();
    const { formData } = useWeddingStore();
    const [copied, setCopied] = useState(false);

    const handleCopyOrderId = () => {
        navigator.clipboard.writeText('NIH_2025_176398');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <DashboardSidebar />

            <main className={dashboardStyles.main}>
                <div className={styles.header}>
                    <button onClick={() => router.back()} className={styles.backBtn}>
                        <ArrowLeft size={20} />
                        <span>Payment Details</span>
                    </button>
                </div>

                <div className={styles.content}>
                    {/* 1. Success Banner Card */}
                    <div className={styles.successBanner}>
                        <div className={styles.bannerLeft}>
                            <div className={styles.successHeader}>
                                <div className={styles.checkIcon}>
                                    <Check size={24} />
                                </div>
                                <div className={styles.headerInfo}>
                                    <h1 className={styles.bannerTitle}>Payment Successful!</h1>
                                    <p className={styles.bannerSub}>22 March 2026 • 11:24 AM</p>
                                </div>
                            </div>

                            <div className={styles.topPriceContainer}>
                                <div className={styles.amountLabelSmall}>Amount Paid</div>
                                <div className={styles.amountValueLarge}>₹999</div>
                            </div>
                            
                            <h2 className={styles.planTitle}>
                                WhatsApp Essentials Plan Activated 🎊
                            </h2>
                            <p className={styles.planSub}>
                                All your wedding invites and RSVP tools are ready to use.
                            </p>

                            <div className={styles.badgeRow}>
                                <div className={styles.badge}>
                                    <CheckCircle2 size={14} />
                                    Unlimited invite sharing
                                </div>
                                <div className={styles.badge}>
                                    <CheckCircle2 size={14} />
                                    Guest response tracking enabled
                                </div>
                                <div className={styles.badge}>
                                    <CheckCircle2 size={14} />
                                    Assets available for download & print
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 2. Purchase Details Grid */}
                    <div className={styles.detailsCard}>
                        <div className={styles.detailsHeader}>
                            <h3 className={styles.sectionTitleSmall}>Your Purchase Details</h3>
                            <button className={styles.downloadTaxBtn}>
                                <Download size={16} />
                                Download Tax Invoice (PDF)
                            </button>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailsItem}>
                                <div className={styles.label}>Order ID</div>
                                <div className={styles.valueRow}>
                                    <span>NIH_2025_176398</span>
                                    <button onClick={handleCopyOrderId} className={styles.copyBtn}>
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <div className={styles.detailsItem}>
                                <div className={styles.label}>Wedding Name</div>
                                <div className={styles.valueLarge}>Vivek & Priyanka</div>
                            </div>
                            <div className={styles.detailsItem}>
                                <div className={styles.label}>Plan</div>
                                <div className={styles.planPill}>WhatsApp Essentials</div>
                            </div>
                            <div className={styles.detailsItem}>
                                <div className={styles.label}>Validity</div>
                                <div className={styles.validityPill}>Lifetime Access</div>
                            </div>
                            <div className={styles.detailsItem}>
                                <div className={styles.label}>Theme Purchased</div>
                                <div className={styles.themeValue}>
                                    <img src="/themes/forest-elegance-thumbnail.jpg" alt="" className={styles.themeThumb} />
                                    <span>Forest Elegance</span>
                                </div>
                            </div>
                            <div className={styles.detailsItem}>
                                <div className={styles.label}>Payment Method</div>
                                <div className={styles.valuePlain}>UPI •••• 2845</div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Communication Kit Section */}
                    <div className={styles.kitSection}>
                        <h2 className={styles.kitHeader}>
                            <Sparkles className={styles.sparkleIcon} size={20} />
                            Your Wedding Communication Kit
                        </h2>
                        <p className={styles.kitSub}>
                            All assets created for your WhatsApp Essentials plan.
                        </p>

                        <div className={styles.kitCard}>
                            <h3 className={styles.kitTitle}>WhatsApp Essentials Includes</h3>
                            <div className={styles.kitGrid}>
                                <div className={styles.kitItem}>
                                    <Check className={styles.kitCheck} size={16} />
                                    Covers up to 7 wedding events
                                </div>
                                <div className={styles.kitItem}>
                                    <Check className={styles.kitCheck} size={16} />
                                    Un’ l Limited whatsapp sharing
                                </div>
                                <div className={styles.kitItem}>
                                    <Check className={styles.kitCheck} size={16} />
                                    Unlimited WhatsApp sharing
                                </div>
                                <div className={styles.kitItem}>
                                    <Check className={styles.kitCheck} size={16} />
                                    Live RSVP guest tracking
                                </div>
                                <div className={styles.kitItem}>
                                    <Check className={styles.kitCheck} size={16} />
                                    Guest management dashboard
                                </div>
                                <div className={styles.kitItem}>
                                    <Check className={styles.kitCheck} size={16} />
                                    No watermark on final assets
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
