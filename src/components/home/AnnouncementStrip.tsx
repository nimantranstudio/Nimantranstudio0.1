'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import styles from "@/app/page.module.css";
import { useState, useEffect } from "react";

export function AnnouncementStrip() {
  const [messages, setMessages] = useState([
    {
      icon: '✦',
      text: 'Your wedding communication ready in <strong>5 mins</strong>. Try now for free.',
      badge: 'New 🎉',
    },
    {
      icon: '✦',
      text: '<strong>Launch Offer</strong> - Create Your Complete Wedding Invitation Suite in Minutes',
      badge: 'Hot 🔥',
    }
  ]);
  const [isActive, setIsActive] = useState(true);
  const [showStrip, setShowStrip] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          if (data.settings?.banner_messages) {
            setMessages(data.settings.banner_messages);
          }
          if (data.settings?.banner_active !== undefined) {
            setIsActive(data.settings.banner_active);
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!mounted) return null;

  const current = messages[msgIndex];
  if (!showStrip || !isActive || !current) return null;

  return (
    <AnimatePresence>
      {showStrip && (
        <div className={styles.announcementContainer}>
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIndex}
              className={styles.animatedTextWrapper}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <div className={styles.stripContent}>
                <span className={styles.stripIcon}>{current.icon}</span>
                <span className={styles.stripMessage} dangerouslySetInnerHTML={{ __html: current.text }}></span>
                <span className={styles.stripBadge}>{current.badge}</span>
              </div>
            </motion.div>
          </AnimatePresence>
          <button className={styles.stripClose} onClick={() => setShowStrip(false)} aria-label="Close">
            <X size={14} />
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}
