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
    // For demonstration purposes, if the theme is named "test theme", we show it as best seller
    const isBestSeller = theme.isBestSeller || theme.name.toLowerCase().includes('test theme');
    
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
                {(theme.tag || isBestSeller || theme.isPopular) && (
                    <div className={clsx(styles.tag, {
                        [styles.bestSeller]: isBestSeller,
                        [styles.popular]: theme.isPopular && !isBestSeller
                    })}>
                        {isBestSeller ? 'Bestseller' : (theme.isPopular ? 'Popular' : theme.tag)}
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{theme.name}</h3>
                <div className={styles.pricing}>
                    {(() => {
                        const bundle = theme.bundles?.[0];
                        const invoices = bundle?.bundleInvoices;

                        if (!bundle || !invoices || invoices.length === 0) {
                            return (
                                <span className={styles.currentPrice}>Price TBD</span>
                            );
                        }

                        const displayedInvoices = invoices.filter((inv: any) => inv.isDisplay === true);

                        if (displayedInvoices.length === 0) {
                            return (
                                <span className={styles.currentPrice}>Price TBD</span>
                            );
                        }

                        const prices = displayedInvoices
                            .map((inv: any) => inv.finalSellingPrice)
                            .filter((p: number) => p > 0);

                        if (prices.length === 0) {
                            return (
                                <span className={styles.currentPrice}>Price TBD</span>
                            );
                        }

                        const currentPrice = Math.min(...prices);
                        const originalPrices = displayedInvoices
                            .map((inv: any) => inv.totalWeddingSuiteValue)
                            .filter((p: number) => p > 0);
                        const originalPrice = originalPrices.length > 0 ? Math.max(...originalPrices) : 0;
                        const discount = originalPrice > currentPrice
                            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                            : 0;

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
                    {theme.description || 'A complete wedding communication system not just an invite'}
                </div>
                <button 
                    className={styles.cta}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(theme.id);
                    }}
                >
                    Select Theme
                </button>
            </div>
        </div>
    );
};
