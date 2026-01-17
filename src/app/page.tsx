"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { ArrowRight } from "lucide-react";
import { clsx } from 'clsx';
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Floating Motifs */}
        <motion.div
          className={clsx(styles.motif, styles.motif1)}
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C60 30 90 40 100 50C90 60 60 70 50 100C40 70 10 60 0 50C10 40 40 30 50 0Z" /></svg>
        </motion.div>
        <motion.div
          className={clsx(styles.motif, styles.motif2)}
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C60 30 90 40 100 50C90 60 60 70 50 100C40 70 10 60 0 50C10 40 40 30 50 0Z" /></svg>
        </motion.div>
        <motion.div
          className={clsx(styles.motif, styles.motif3)}
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C60 30 90 40 100 50C90 60 60 70 50 100C40 70 10 60 0 50C10 40 40 30 50 0Z" /></svg>
        </motion.div>
        <motion.div
          className={clsx(styles.motif, styles.motif4)}
          animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C60 30 90 40 100 50C90 60 60 70 50 100C40 70 10 60 0 50C10 40 40 30 50 0Z" /></svg>
        </motion.div>
        <motion.div
          className={clsx(styles.motif, styles.motif5)}
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C60 30 90 40 100 50C90 60 60 70 50 100C40 70 10 60 0 50C10 40 40 30 50 0Z" /></svg>
        </motion.div>
        <motion.div
          className={clsx(styles.motif, styles.motif6)}
          animate={{ y: [0, 15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C60 30 90 40 100 50C90 60 60 70 50 100C40 70 10 60 0 50C10 40 40 30 50 0Z" /></svg>
        </motion.div>

        <div className="container">
          <motion.div
            className={styles.heroContent}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 className={styles.title} variants={fadeIn}>
              Created with a click, <br />sent with love.
            </motion.h1>
            <motion.p className={styles.subtitle} variants={fadeIn}>
              Helping beyond invitations, with love. One form, one click, your entire wedding bundle ready for WhatsApp.
            </motion.p>
            <motion.div className={styles.actions} variants={fadeIn}>
              <Link href="/themes" className="btn btn-primary">
                Create Your Invitation Bundle <ArrowRight size={18} className={styles.heroIcon} />
              </Link>
              <Link href="/themes" className={clsx("btn btn-outline", styles.secondaryBtn)}>
                Create RSVP Event
              </Link>
            </motion.div>
          </motion.div>
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
          >
            A simple process for busy weddings
          </motion.h2>
          <motion.div
            className={styles.steps}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {["Choose Theme", "Fill Details", "Preview All", "Share & Love"].map((step, i) => (
              <motion.div key={step} className={styles.step} variants={fadeIn}>
                <span className={styles.stepNum}>0{i + 1}</span>
                <h3>{step}</h3>
              </motion.div>
            ))}
          </motion.div>
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
                {["SAVE THE DATE", "ENGAGEMENT", "HALDI", "MEHNDI", "SANGEET", "WEDDING", "RECEPTION", "WELCOME POSTER", "THANK YOU CARD"].map((item) => (
                  <li key={item}>{item}</li>
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
              <img src="/bundle-mockup.jpg" alt="Wedding Bundle Preview" className={styles.bundleImage} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Theme Showcase Section */}
      <section className={styles.showcase}>
        <div className="container">
          <div className={styles.showcaseHeader}>
            <h2 className={styles.showcaseTitle}>Choose your wedding theme</h2>
            <p className={styles.showcaseSubtitle}>Select a visual language that resonates with your family's style.</p>
          </div>

          <motion.div
            className={styles.showcaseGrid}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { id: 'rajputana', name: 'Royal Rajputana', img: '/theme-rajputana.png' },
              { id: 'emerald', name: 'Emerald Forest', img: '/theme-emerald.png' },
              { id: 'gold', name: 'Classic Gold', img: '/theme-gold.png' },
              { id: 'sand', name: 'Minimal Sand', img: '/theme-sand.png' }
            ].map((theme) => (
              <motion.div key={theme.id} className={styles.showcaseCard} variants={fadeIn}>
                <div className={styles.showcaseImageWrapper}>
                  <img src={theme.img} alt={theme.name} className={styles.showcaseImage} />
                </div>
                <div className={styles.showcaseInfo}>
                  <h3>{theme.name}</h3>
                  <Link href="/themes" className={styles.viewLink}>VIEW THEME</Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className={styles.showcaseActions}>
            <Link href="/themes" className="btn btn-outline">
              BROWSE ALL THEMES
            </Link>
          </div>
        </div>
      </section>

      {/* Indian Wedding Features Section */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.featuresTitle}>Designed for the Indian Wedding</h2>
          <motion.div
            className={styles.featuresGrid}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { title: "One-time form", desc: "Save hours of stress. Enter names, dates, and venues once. We handle the rest." },
              { title: "Consistent design", desc: "Your Haldi, Mehndi, and Wedding invites will speak the same visual language." },
              { title: "WhatsApp-ready", desc: "Optimized sizes and formats for perfect sharing with family and guests." },
              { title: "Family-approved", desc: "Colors and fonts chosen to feel respectful, traditional, and premium." }
            ].map((f) => (
              <motion.div key={f.title} className={styles.featureItem} variants={fadeIn}>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
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
