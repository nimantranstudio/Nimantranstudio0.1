'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './GovtTrustBadge.module.css';

export function GovtTrustBadge() {
  return (
    <motion.div
      className={styles.trustBadgeWrapper}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
    >
      <div className={styles.trustContainer}>
        {/* Official Designation Text */}
        <div className={styles.content}>
          <span className={styles.eyebrow}>GOVERNMENT OF INDIA · MINISTRY OF MSME</span>
          <h3 className={styles.title}>Udyam Registered Micro Enterprise</h3>
          <span className={styles.subtitle}>Udyam Reg. No. UDYAM-MH-26-0098485</span>
        </div>

        {/* Verified Tag */}
        <div className={styles.verifiedPill}>
          <span className={styles.checkIcon} aria-hidden="true">
            <Check size={10} strokeWidth={3.5} />
          </span>
          <span>VERIFIED</span>
        </div>
      </div>
    </motion.div>
  );
}
