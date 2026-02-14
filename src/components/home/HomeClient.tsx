"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";
import { ArrowRight, Sparkles, Heart, Smartphone, Users, CreditCard, Clock, Printer, Languages, ShieldCheck } from "lucide-react";
import clsx from 'clsx';
import { motion } from "framer-motion";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { FloatingHearts } from "@/components/ui/FloatingHearts";
import { CurvedBackground } from "@/components/ui/CurvedBackground";
import { PricingSection } from "@/components/home/PricingSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { useWeddingStore } from "@/store/wedding-store";
import type { Theme } from "@/lib/constants/themes";

interface HomeClientProps {
  themes: Theme[];
}

export default function HomeClient({ themes }: HomeClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useWeddingStore();

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
      {/* ... Hero Section ... */}
      <section className={styles.hero}>
        <CurvedBackground />
        <FloatingHearts />
        {/* ... Motifs ... */}

        <div className="container">
          <div className={styles.heroContent}>
            {/* ... Title & Subtitle ... */}

            <motion.div
              className={styles.trustedBadge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles size={18} fill="#D4AF37" color="#D4AF37" />
              <span>TRUSTED BY 1,000+ INDIAN WEDDINGS</span>
            </motion.div>

            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span style={{ display: 'block' }}>Everything your wedding needs</span>
              <span style={{ fontSize: '0.6em', display: 'block', marginTop: '15px', fontWeight: 500, lineHeight: '1.4' }}>
                <span style={{ display: 'block' }}>A beautifully designed theme bundle,</span>
                <span style={{ display: 'block' }}>ready instantly with one click.</span>
              </span>
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              From WhatsApp invites to print-ready boards. No follow-ups. No confusion.
            </motion.p>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/themes" className="btn btn-primary">
                Create Your Invitation Bundle <ArrowRight size={18} className={styles.heroIcon} />
              </Link>
              <button
                onClick={handleCreateRSVP}
                className={clsx("btn btn-secondary", styles.secondaryBtn)}
              >
                Create RSVP Event
              </button>
            </motion.div>

            <motion.div
              className={styles.trustIndicators}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: Clock, text: "Delivered in 2–5 minutes" },
                { icon: Printer, text: "WhatsApp & Print ready" },
                { icon: Languages, text: "Hindi • English • Marathi" },
                { icon: ShieldCheck, text: "No watermark • One-time pay" }
              ].map((item, i) => (
                <div key={i} className={styles.trustItem}>
                  <div className={styles.trustIcon}>
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple Process Section */}
      <section className={styles.process}>
        <div className="container">
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            A simple process for busy weddings
          </motion.h2>
          <div className={styles.steps}>
            {[
              {
                title: "Choose Theme",
                icon: Sparkles,
                desc: "Select from our curated Indian designs."
              },
              {
                title: "Fill Details",
                icon: Heart,
                desc: "Enter your wedding details once."
              },
              {
                title: "Preview All",
                icon: Smartphone,
                desc: "See everything generated instantly."
              },
              {
                title: "Pay & Generate",
                icon: CreditCard,
                desc: "Make a single secure payment to unlock all high-quality assets."
              },
              {
                title: "Share & Love",
                icon: Users,
                desc: "Pay securely and share via WhatsApp."
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
                <div className={styles.stepIconWrapper}>
                  <step.icon size={24} strokeWidth={1.5} color="#D4AF37" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Bundle Section */}
      <section className={styles.bundle}>
        <div className="container">
          <div className={styles.bundleGrid}>
            <motion.div
              className={styles.bundleContent}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.bundleTitle}>Complete Wedding Bundle</h2>
              <p className={styles.bundleDescription}>
                No more repeated requests. No more design mismatches. One bundle to handle every single event of your celebration.
              </p>
              <ul className={styles.bundleList}>
                {["SAVE THE DATE", "ENGAGEMENT", "HALDI", "MEHNDI", "SANGEET", "WEDDING", "RECEPTION", "WELCOME POSTER", "THANK YOU CARD"].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className={styles.bundleImageWrapper}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/wedding-bundle-suite.jpg"
                alt="Complete Wedding Invitation Suite"
                className={styles.bundleImage}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

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
            {themes.length > 0 ? (
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

      {/* New Features Section (Dark) */}
      <FeaturesSection />

      {/* New Pricing Section */}
      <PricingSection />

      {/* Bottom CTA Section */}
      <CTASection />

      {/* FAQ/About Section */}
      <section className={styles.faq}>
        <div className="container">
          <div className={styles.faqBar}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          <div className={styles.faqContent}>
            <p>
              At NimantranStudio, we believe that invitations are more than just announcements — they are the first emotion of your celebration. Built for modern Indian weddings, NimantranStudio helps couples and families create beautifully designed digital wedding invitations, video invites, and RSVP links with ease. With a simple one-time form, you can generate a complete wedding invitation bundle that includes everything from Save the Date to Wedding, Reception, Welcome posters, Thank You cards, and more — all perfectly matched in one elegant theme and ready to share on WhatsApp.
            </p>
            <p>
              Our platform is thoughtfully designed to respect Indian traditions while embracing modern convenience. From Marathi, Hindi, and English wedding invitations to family-approved colors, fonts, and layouts, every design is crafted with care and cultural sensitivity. Whether you're planning a wedding, engagement, haldi, mehndi, sangeet, housewarming, or special family event, NimantranStudio offers handpicked themes and customizable video invitations that feel personal, polished, and heartfelt. With built-in RSVP management, guest tracking, and instant sharing, we go beyond invitations — helping you coordinate your celebration smoothly, with love.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
