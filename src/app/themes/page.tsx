'use client';

import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { THEMES } from '@/lib/constants/themes';
import { ThemeCard } from '@/components/ui/ThemeCard';
import styles from './themes.module.css';

export default function ThemesPage() {
    const router = useRouter();
    const { selectedThemeId, setThemeId } = useWeddingStore();

    const handleContinue = () => {
        if (selectedThemeId) {
            router.push('/details'); // Next step
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Choose your wedding theme</h1>
                    <p className={styles.subtitle}>Select a design that matches your style. You can customize the details later.</p>
                </div>
            </header>

            <main className="container">
                <div className={styles.grid}>
                    {THEMES.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            theme={theme}
                            isSelected={selectedThemeId === theme.id}
                            onSelect={setThemeId}
                        />
                    ))}
                </div>
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.bar}>
                        <div className={styles.summary}>
                            {selectedThemeId ? (
                                <span>Selected: <strong>{THEMES.find(t => t.id === selectedThemeId)?.name}</strong></span>
                            ) : (
                                <span>Please select a theme</span>
                            )}
                        </div>
                        <button
                            className="btn btn-primary"
                            disabled={!selectedThemeId}
                            onClick={handleContinue}
                        >
                            Continue to Details
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
