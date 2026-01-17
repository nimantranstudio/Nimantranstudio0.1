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
                {theme.tag && (
                    <div className={styles.tag}>
                        {theme.tag}
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{theme.name}</h3>
                <div className={styles.pricing}>
                    <span className={styles.currentPrice}>₹1200</span>
                    <span className={styles.originalPrice}>₹3800</span>
                    <span className={styles.discount}>68% OFF</span>
                </div>
                <div className={styles.details}>
                    Pack of 12 Assets
                </div>
            </div>
        </div>
    );
};
