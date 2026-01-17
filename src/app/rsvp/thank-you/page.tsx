import { CheckCircle, Heart } from 'lucide-react';
import Link from 'next/link';
import styles from './thank-you.module.css';

export default function ThankYouPage() {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <CheckCircle size={64} color="#2E594A" className={styles.icon} />
                <h1 className={styles.title}>Thank You!</h1>
                <p className={styles.text}>
                    Your RSVP has been sent to the couple. We're so excited to see you there!
                </p>
                <div className={styles.love}>
                    Sent with love <Heart size={16} fill="#D4AF37" />
                </div>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Planning your own wedding?
                    </p>
                    <Link href="/" className={`${styles.ctaBtn} btn btn-outline`}>
                        Create Your Invitation Today
                    </Link>
                </div>
            </div>
        </div>
    );
}
