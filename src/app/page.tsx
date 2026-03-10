"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import { ArrowRight, Check, Sparkles, Heart, Smartphone, Users, CreditCard, Clock, Printer, Languages, ShieldCheck, X } from "lucide-react";
import { clsx } from 'clsx';
import { motion, AnimatePresence } from "framer-motion";
import { ThemeCard } from "@/components/ui/ThemeCard";
import HeroGradient from "@/components/ui/HeroGradient";
import { FloatingHearts } from "@/components/ui/FloatingHearts";
import dynamic from "next/dynamic";
import { useWeddingStore } from "@/store/wedding-store";

// Lazy load heavy below-the-fold components
const PricingSection = dynamic(() => import("@/components/home/PricingSection").then(mod => mod.PricingSection), { ssr: false });
const CTASection = dynamic(() => import("@/components/home/CTASection").then(mod => mod.CTASection), { ssr: false });
const BundleGridSection = dynamic(() => import("@/components/home/BundleGridSection").then(mod => mod.BundleGridSection), { ssr: false });
const RsvpFeatureSection = dynamic(() => import("@/components/home/RsvpFeatureSection").then(mod => mod.RsvpFeatureSection), { ssr: false });
const FaqSection = dynamic(() => import("@/components/home/FaqSection").then(mod => mod.FaqSection), { ssr: false });
const TestimonialSection = dynamic(() => import("@/components/home/TestimonialSection").then(mod => mod.TestimonialSection), { ssr: false });
import HeroImage from "@/components/home/HeroImage";
import { useState, useEffect } from "react";
import type { Theme } from "@/lib/constants/themes";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useWeddingStore();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStrip, setShowStrip] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch('/api/themes');
        const data = await res.json();
        if (data.themes) {
          setThemes(data.themes);
        }
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const handleThemeSelect = (id: string) => {
    router.push(`/themes/${id}`);
  };

  const handleCreateRSVP = () => {
    if (isAuthenticated) {
      router.push('/dashboard/rsvp');
    } else {
      router.push('/login?redirect=/dashboard/rsvp');
    }
  };

  return (
    <main className={styles.main}>
      {/* Announcement Strip */}
      <AnimatePresence>
        {showStrip && (
          <motion.div
            className={styles.announcementStrip}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.stripContent}>
              <span className={styles.stripIcon}>✦</span>
              <span className={styles.stripMessage}>Get your wedding invites ready in under 5 minutes with <strong>15% discount</strong></span>
              <span className={styles.stripBadge}>New<span className={styles.stripBadgeIcon}>🎉</span></span>
              <Link href="/themes" className={styles.stripCta}>CREATE NOW</Link>
            </div>
            <button className={styles.stripClose} onClick={() => setShowStrip(false)} aria-label="Close">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... Hero Section ... */}
      <section className={styles.hero}>
        <HeroGradient />
        {/* ... Motifs ... */}

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextSection}>
              {/* ... Title & Subtitle ... */}

              <motion.div
                className={styles.trustedBadge}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Sparkles size={18} fill="#D4AF37" color="#D4AF37" />
                <span>INDIA'S 1ST WEDDING COMMUNICATION PLATFORM</span>
              </motion.div>

              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span style={{ display: 'block' }}>Digital Wedding Invitations</span>
                <span style={{ display: 'block', marginTop: '0.5rem' }}>& RSVP Tracker</span>
                <span style={{ fontSize: '0.45em', display: 'block', marginTop: '2rem', fontWeight: 300, lineHeight: '1.5', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.02em', color: '#666' }}>
                  <span style={{ display: 'block' }}>Everything your wedding invitation journey needs all in one single platform.</span>
                </span>
              </motion.h1>


              <motion.div
                className={styles.actions}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link href="/themes" className="btn btn-primary">
                  Create Your Invitation
                </Link>
                <button
                  onClick={handleCreateRSVP}
                  className={clsx("btn btn-secondary", styles.secondaryBtn)}
                >
                  Create RSVP Event
                </button>
              </motion.div>

              <motion.div
                className={styles.heroTrustText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p>
                  <strong>Trusted by couples</strong> creating simple digital wedding invites with instant WhatsApp sharing.
                </p>
              </motion.div>

            </div>
            {/* Right Column - Hero Image */}
            <HeroImage />
          </div>
        </div>
      </section>

      {/* Simple Process Section */}
      <section className={styles.process}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              A simple process for busy weddings
            </motion.h2>
            <motion.p
              className={styles.sectionSubtitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Four simple steps to your perfect digital invitation and wedding communication
            </motion.p>
          </div>
          <div className={styles.steps}>
            {[
              {
                title: "Select Theme",
                desc: "Select from our curated Indian designs."
              },
              {
                title: "Personalize",
                desc: "Enter your details and see everything generated instantly."
              },
              {
                title: "One-Time Payment",
                desc: "Make a single secure payment to unlock all high-quality assets."
              },
              {
                title: "Send & Track",
                desc: "Share via WhatsApp and track via RSVP Dashboard."
              }
            ].map((step, i) => (
              <motion.div
                key={step.title}
                className={styles.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className={styles.stepNumber}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid & RSVP Sections Replacing Old Bundle */}
      <BundleGridSection />

      {/* Theme Showcase Section */}
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
            {loading ? (
              <div style={{ color: '#6b7280', gridColumn: '1/-1', textAlign: 'center' }}>Loading themes...</div>
            ) : themes.length > 0 ? (
              themes.slice(0, 4).map((theme, i) => (
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


      {/* New Pricing Section */}
      <PricingSection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* FAQ Section */}
      <FaqSection />
    </main>
  );
}
