import styles from "./page.module.css";
import { Sparkles, Heart, Smartphone, Users, CreditCard, Clock, Printer, Languages, ShieldCheck } from "lucide-react";
import HeroGradient from "@/components/ui/HeroGradient";
import { FloatingHearts } from "@/components/ui/FloatingHearts";
import dynamic from "next/dynamic";
import HeroImage from "@/components/home/HeroImage";

import { ThemeShowcase } from "@/components/home/ThemeShowcase";
import { HeroActions } from "@/components/home/HeroActions";
import { prisma } from "@/lib/prisma";
import * as motion from "framer-motion/client";

import { PricingSection } from "@/components/home/PricingSection";
import { CTASection } from "@/components/home/CTASection";
import { BundleGridSection } from "@/components/home/BundleGridSection";
import { RsvpFeatureSection } from "@/components/home/RsvpFeatureSection";
import { FaqSection } from "@/components/home/FaqSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";

async function getThemes() {
  try {
    const themes = await prisma.theme.findMany({
      where: { isActive: true },
      orderBy: [
        { sequence: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 4,
      include: { 
        bundles: {
          include: { 
            bundleInvoices: true,
            bundleItems: true
          }
        } 
      }
    });

    return themes.map((theme: any) => ({
      id: theme.id,
      name: theme.name,
      description: theme.description || '',
      thumbnail: theme.thumbnailUrl || '/placeholder-theme.jpg',
      previewImages: theme.previewImages ? JSON.parse(theme.previewImages as string) : [],
      isBestSeller: theme.isBestSeller || false,
      isPopular: theme.isPopular || false,
      bundles: (theme.bundles || []).map((b: any) => ({
        id: b.id,
        name: b.BundleName,
        whatsappPrice: b.whatsappPrice,
        printablePrice: b.printablePrice,
        completePrice: b.completePrice,
        description: b.bundleDescription || '',
        bundleInvoices: b.bundleInvoices,
      }))
    }));
  } catch (error) {
    console.error('Failed to fetch themes server-side:', error);
    return [];
  }
}

export default async function Home() {
  const themes = await getThemes();

  return (
    <main className={styles.main}>


      {/* Hero Section */}
      <section className={styles.hero}>
        <HeroGradient />
        <FloatingHearts />

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextSection}>
              <motion.div
                className={styles.trustedBadge}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
              >
                <span><strong>Trusted by</strong> Indian families for stress-free wedding invites</span>
              </motion.div>

              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.1 }}
              >
                <span style={{ display: 'block' }}>Digital Wedding Invitations</span>
                <span style={{ display: 'block', marginTop: '0.5rem' }}>and Smart RSVP Tracking</span>
                <span style={{ fontSize: '0.45em', display: 'block', marginTop: '2rem', fontWeight: 300, lineHeight: '1.5', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.02em', color: '#666' }}>
                  <span style={{ display: 'block' }}>Create, share and manage beautiful wedding invites,<br /> RSVPs and guest updates all in one simple platform.</span>
                </span>
              </motion.h1>

              <HeroActions />

              <motion.p
                className={styles.heroNote}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              >
                Preview free · Pay once, yours forever · Trusted by Indian couples
              </motion.p>
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
              transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
            >
              A simple process for busy weddings
            </motion.h2>
            <motion.p
              className={styles.sectionSubtitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.1 }}
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
                transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: i * 0.15 }}
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

      <BundleGridSection />

      <ThemeShowcase initialThemes={themes} />

      <PricingSection />
      <TestimonialSection />
      <FaqSection />
    </main>
  );
}
