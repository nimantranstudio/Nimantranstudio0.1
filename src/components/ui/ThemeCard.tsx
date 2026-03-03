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
                    {theme.bundles && theme.bundles.length > 0 ? (
                        <>
                            <span className={styles.currentPrice}>₹{theme.bundles[0].whatsappPrice}</span>
                            <span className={styles.originalPrice}>₹{theme.bundles[0].completePrice}</span>
                            <span className={styles.discount}>
                                {Math.round(((theme.bundles[0].completePrice - theme.bundles[0].whatsappPrice) / theme.bundles[0].completePrice) * 100)}% OFF
                            </span>
                        </>
                    ) : (
                        <span className={styles.currentPrice}>Check Details</span>
                    )}
                </div>
                <div className={styles.details}>
                    Pack of 12 Assets
                </div>
            </div>
        </div>
    );
};
