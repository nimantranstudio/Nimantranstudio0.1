"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { clsx } from 'clsx';
import { motion } from "framer-motion";
import { THEMES } from "@/lib/constants/themes";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { FloatingHearts } from "@/components/ui/FloatingHearts";
import { useWeddingStore } from "@/store/wedding-store";


// ... existing imports

export default function Home() {
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
        <FloatingHearts />
        {/* ... Motifs ... */}

        <div className="container">
          <div className={styles.heroContent}>
            {/* ... Title & Subtitle ... */}

            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Created with a click, <br />
              <span style={{ color: 'var(--secondary)' }}>sent with love. (Updated)</span>
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              One form. One click. Your entire wedding invitation bundle ready for WhatsApp.
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
            {["Choose Theme", "Fill Details", "Preview All", "Share & Love"].map((step, i) => (
              <motion.div
                key={step}
                className={styles.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span className={styles.stepNum}>0{i + 1}</span>
                <h3>{step}</h3>
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
                src="/bundle-mockup.jpg"
                alt="Wedding Bundle Preview"
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
            {THEMES.slice(0, 4).map((theme, i) => (
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
            ))}
          </div>

          <div className={styles.showcaseActions}>
            <Link href="/themes" className="btn btn-secondary">
              BROWSE ALL THEMES
            </Link>
          </div>
        </div>
      </section>

      {/* Indian Wedding Features Section */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.featuresTitle}>Designed for the Indian Wedding</h2>
          <div className={styles.featuresGrid}>
            {[
              { title: "One-time form", desc: "Save hours of stress. Enter names, dates, and venues once. We handle the rest." },
              { title: "Consistent design", desc: "Your Haldi, Mehndi, and Wedding invites will speak the same visual language." },
              { title: "WhatsApp-ready", desc: "Optimized sizes and formats for perfect sharing with family and guests." },
              { title: "Family-approved", desc: "Colors and fonts chosen to feel respectful, traditional, and premium." }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.featureItem}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
