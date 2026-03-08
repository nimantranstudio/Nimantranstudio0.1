import styles from '@/app/page.module.css';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const SocialProof = () => {
    return (
        <section className={styles.socialProof}>
            <div className="container">
                <div className={styles.socialProofGrid}>
                    <div className={styles.socialTextContent}>
                        <p>
                            <strong>Trusted by couples</strong> creating simple digital wedding invites with instant WhatsApp sharing.
                        </p>
                    </div>

                    <div className={styles.socialLogos}>
                        <div className={styles.socialRating}>
                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={20} fill="#D4AF37" color="#D4AF37" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
