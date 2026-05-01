'use client';

import Link from "next/link";
import styles from "@/app/page.module.css";
import { motion } from "framer-motion";

export function HeroActions() {
  return (
    <motion.div
      className={styles.actions}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <Link href="/themes" className="btn btn-primary">
        Create My Invitation — ₹999
      </Link>
    </motion.div>
  );
}
