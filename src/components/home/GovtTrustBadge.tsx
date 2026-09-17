'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './GovtTrustBadge.module.css';

export function GovtTrustBadge() {
  return (
    <motion.div
      className={styles.trustBadgeWrapper}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
    >
      <div className={styles.trustBadge}>
        {/* Left Metallic Seal / Crest */}
        <div className={styles.sealIcon} aria-hidden="true">
          <svg
            className={styles.sealSvg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Government / Registered Enterprise Seal Motif */}
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        </div>

        {/* Hairline Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Official Designation Text */}
        <div className={styles.content}>
          <span className={styles.eyebrow}>GOVERNMENT OF INDIA · MINISTRY OF MSME</span>
          <span className={styles.title}>Udyam Registered Micro Enterprise</span>
          <span className={styles.subtitle}>Udyam Reg. No. UDYAM-MH-26-0098485</span>
        </div>

        {/* Verified Pill */}
        <div className={styles.verifiedPill}>
          <span className={styles.checkIcon} aria-hidden="true">
            <Check size={9} strokeWidth={3.5} />
          </span>
          <span>VERIFIED</span>
        </div>
      </div>
    </motion.div>
  );
}
