'use client';

import { motion } from "framer-motion";
import { ThemeCard } from "@/components/ui/ThemeCard";
import styles from "@/app/page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Theme } from "@/lib/constants/themes";

interface ThemeShowcaseProps {
  initialThemes: any[];
}

export function ThemeShowcase({ initialThemes }: ThemeShowcaseProps) {
  const router = useRouter();

  const handleThemeSelect = (id: string) => {
    router.push(`/themes/${id}`);
  };

  return (
    <section className={styles.showcase}>
      <div className="container">
        <div className={styles.showcaseHeader}>
          <motion.h2
            className={styles.showcaseTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Choose your wedding theme
          </motion.h2>
          <motion.p
            className={styles.showcaseSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Select a visual language that resonates with your family's style.
          </motion.p>
        </div>

        <div className={styles.showcaseGrid}>
          {initialThemes.length > 0 ? (
            initialThemes.slice(0, 4).map((theme, i) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <ThemeCard
                  theme={theme}
                  onSelect={handleThemeSelect}
                />
              </motion.div>
            ))
          ) : (
            <div style={{ color: '#6b7280', gridColumn: '1/-1', textAlign: 'center' }}>No themes available at the moment.</div>
          )}
        </div>

        <div className={styles.showcaseActions}>
          <Link href="/themes" className="btn btn-secondary">
            BROWSE ALL THEMES
          </Link>
        </div>
      </div>
    </section>
  );
}
