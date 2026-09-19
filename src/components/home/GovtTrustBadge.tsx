'use client';

import styles from './GovtTrustBadge.module.css';

interface GovtTrustBadgeProps {
  className?: string;
  showIcon?: boolean;
  theme?: 'light' | 'dark';
}

export function GovtTrustBadge({ className, showIcon = true, theme = 'light' }: GovtTrustBadgeProps) {
  return (
    <div className={`${styles.trustBadgeWrapper} ${theme === 'dark' ? styles.darkTheme : styles.lightTheme} ${className || ''}`}>
      <div className={styles.trustPill}>
        {showIcon && (
          <>
            {/* Shield with Check Icon */}
            <div className={styles.shieldIcon} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.shieldSvg}
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            {/* Hairline Divider */}
            <div className={styles.divider} aria-hidden="true" />
          </>
        )}

        {/* Text Content */}
        <div className={styles.content}>
          <div className={styles.mainLine}>
            <span>Government of India</span>
            <span className={styles.dot}>·</span>
            <span>Udyam Registered MSME</span>
          </div>
          <span className={styles.subLine}>Udyam Reg. No. UDYAM-MH-26-1127815</span>
        </div>
      </div>
    </div>
  );
}
