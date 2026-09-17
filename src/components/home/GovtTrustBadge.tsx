'use client';

import { motion } from 'framer-motion';
import styles from './GovtTrustBadge.module.css';

export function GovtTrustBadge() {
  return (
    <motion.div
      className={styles.trustBadgeWrapper}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
    >
      <div className={styles.trustPill}>
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

        {/* Text Content */}
        <div className={styles.content}>
          <div className={styles.mainLine}>
            <span>Government of India</span>
            <span className={styles.dot}>·</span>
            <strong className={styles.highlight}>Udyam Registered MSME</strong>
          </div>
          <span className={styles.subLine}>Udyam Reg. No. UDYAM-MH-26-0098485</span>
        </div>
      </div>
    </motion.div>
  );
}

