import Image from 'next/image';
import { Check } from 'lucide-react';
import type { Theme } from '@/lib/constants/themes';
import styles from './ThemeCard.module.css';
import clsx from 'clsx';

interface ThemeCardProps {
    theme: Theme;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export const ThemeCard = ({ theme, isSelected, onSelect }: ThemeCardProps) => {
    return (
        <div
            className={clsx(styles.card, isSelected && styles.selected)}
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
                {isSelected && (
                    <div className={styles.overlay}>
                        <Check size={48} className={styles.checkIcon} />
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{theme.name}</h3>
                <p className={styles.description}>{theme.description}</p>
                <div className={styles.colors}>
                    {theme.colors.map(color => (
                        <span key={color} className={styles.colorDot} style={{ backgroundColor: color }} />
                    ))}
                </div>
            </div>
        </div>
    );
};
