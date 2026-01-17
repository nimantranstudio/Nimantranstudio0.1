import Link from "next/link";
import styles from "./page.module.css";
import { ArrowRight, Heart } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Created with a click, <br />sent with love.</h1>
            <p className={styles.subtitle}>Helping beyond invitations, with love. One form, one click, your entire wedding bundle ready for WhatsApp.</p>
            <div className={styles.actions}>
              <Link href="/themes" className="btn btn-primary">
                Create Your Invitation Bundle <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
              <Link href="/themes" className="btn btn-outline" style={{ marginLeft: '1rem' }}>
                Create RSVP Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Process Section */}
      <section className={styles.process}>
        <div className="container">
          <h2 className={styles.sectionTitle}>A simple process for busy weddings</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>01</span>
              <h3>Choose Theme</h3>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>02</span>
              <h3>Fill Details</h3>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <h3>Preview All</h3>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>04</span>
              <h3>Share & Love</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
