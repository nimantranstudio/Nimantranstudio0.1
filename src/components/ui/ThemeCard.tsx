'use client';

import Image from 'next/image';
import { useRef, useCallback, useEffect, useState } from 'react';
import type { Theme } from '@/lib/constants/themes';
import styles from './ThemeCard.module.css';
import clsx from 'clsx';

interface ThemeCardProps {
    theme: Theme;
    onSelect: (id: string) => void;
}

export const ThemeCard = ({ theme, onSelect }: ThemeCardProps) => {
    const isBestSeller = theme.isBestSeller || theme.name.toLowerCase().includes('test theme');

    // Build the list of images to cycle through on hover
    // previewImages can be a string (JSON) from the DB or an actual array
    let parsedImages: string[] = [];
    try {
        if (Array.isArray(theme.previewImages)) {
            parsedImages = theme.previewImages;
        } else if (typeof theme.previewImages === 'string' && theme.previewImages.length > 0) {
            const parsed = JSON.parse(theme.previewImages);
            parsedImages = Array.isArray(parsed) ? parsed : [];
        }
    } catch {
        parsedImages = [];
    }
    const images: string[] = Array.isArray(parsedImages) && parsedImages.length > 1
        ? parsedImages
        : [theme.thumbnail];

    const hasMultipleImages = Array.isArray(images) && images.length > 1;

    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startSlideshow = useCallback(() => {
        if (!hasMultipleImages) return;
        setIsHovering(true);
        // Start from the second image (first is already showing as thumbnail)
        let currentIdx = 0;
        intervalRef.current = setInterval(() => {
            currentIdx = (currentIdx + 1) % images.length;
            setActiveIndex(currentIdx);
        }, 1800); // Change image every 1.8 seconds
    }, [hasMultipleImages, images.length]);

    const stopSlideshow = useCallback(() => {
        setIsHovering(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setActiveIndex(0);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div
            className={styles.card}
            onClick={() => onSelect(theme.id)}
            onMouseEnter={startSlideshow}
            onMouseLeave={stopSlideshow}
        >
            <div className={styles.imageWrapper}>
                {/* Stack all images on top of each other, crossfade via opacity */}
                {hasMultipleImages ? (
                    images.map((src, i) => (
                        <Image
                            key={src + i}
                            src={src}
                            alt={`${theme.name} preview ${i + 1}`}
                            fill
                            className={clsx(styles.image, styles.stackedImage, {
                                [styles.stackedImageActive]: i === activeIndex,
                            })}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority={i === 0}
                        />
                    ))
                ) : (
                    <Image
                        src={theme.thumbnail}
                        alt={theme.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                )}

                {/* Progress dots indicator */}
                {hasMultipleImages && isHovering && (
                    <div className={styles.dotsIndicator}>
                        {images.map((_, i) => (
                            <span
                                key={i}
                                className={clsx(styles.dot, {
                                    [styles.dotActive]: i === activeIndex,
                                })}
                            />
                        ))}
                    </div>
                )}

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
