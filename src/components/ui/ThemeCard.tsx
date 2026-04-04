import Image from 'next/image';
import { Check } from 'lucide-react';
import type { Theme } from '@/lib/constants/themes';
import styles from './ThemeCard.module.css';
import clsx from 'clsx';

interface ThemeCardProps {
    theme: Theme;
    onSelect: (id: string) => void;
}

export const ThemeCard = ({ theme, onSelect }: ThemeCardProps) => {
    return (
        <div
            className={styles.card}
            onClick={() => onSelect(theme.id)}
        >
            <div className={styles.imageWrapper}>
                <Image
                    src={theme.thumbnail}
                    alt={theme.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                {(theme.tag || theme.isBestSeller || theme.isPopular) && (
                    <div className={styles.tag} style={{
                        background: theme.isBestSeller ? '#F59E0B' : (theme.isPopular ? '#EF4444' : 'rgba(0,0,0,0.6)')
                    }}>
                        {theme.isBestSeller ? 'BEST SELLER' : (theme.isPopular ? 'POPULAR' : theme.tag)}
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{theme.name}</h3>
                <div className={styles.pricing}>
                    {(() => {
                        const bundle = theme.bundles?.[0];
                        if (!bundle || !bundle.bundleInvoices || bundle.bundleInvoices.length === 0) {
                            return <span className={styles.currentPrice}>Check Details</span>;
                        }

                        // Try to find specific invoices or just use min/max
                        const essentials = bundle.bundleInvoices.find((inv: any) => inv.packageId === 'WhatsApp Essentials' || inv.packageId === 'pkg_1');
                        const complete = bundle.bundleInvoices.find((inv: any) => inv.packageId === 'Complete Wedding Suite' || inv.packageId === 'pkg_3');

                        const currentPrice = essentials?.finalSellingPrice || bundle.bundleInvoices[0].finalSellingPrice || 0;
                        const originalPrice = complete?.totalWeddingSuiteValue || bundle.bundleInvoices[bundle.bundleInvoices.length-1].totalWeddingSuiteValue || 0;
                        
                        const discount = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

                        return (
                            <>
                                <span className={styles.currentPrice}>₹{currentPrice.toLocaleString('en-IN')}</span>
                                {originalPrice > currentPrice && (
                                    <>
                                        <span className={styles.originalPrice}>₹{originalPrice.toLocaleString('en-IN')}</span>
                                        <span className={styles.discount}>{discount}% OFF</span>
                                    </>
                                )}
                            </>
                        );
                    })()}
                </div>
                <div className={styles.details}>
                    Pack of 12 Assets
                </div>
            </div>
        </div>
    );
};
