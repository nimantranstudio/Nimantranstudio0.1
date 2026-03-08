import styles from '@/app/page.module.css';
import { motion } from 'framer-motion';

export const BundleGridSection = () => {
    return (
        <section className={styles.bundleGridSection}>
            <div className="container">
                <div className={styles.bundleGridHeader}>
                    <h2 className={styles.bundleGridTitle}>
                        Create Invitations, Collect RSVPs, Manage Your Guest List — All in One Place
                    </h2>
                </div>
                <div className={styles.featureGrid}>
                    {/* Top Large Card */}
                    <motion.div
                        className={`${styles.featureCard} ${styles.featureCardLarge}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.featureCardContent}>
                            <h3>One Form. Complete Wedding Bundle.</h3>
                            <p>
                                Enter your wedding details once and instantly generate a full invitation suite for every event in your celebration.
                            </p>
                            <div className={styles.featureTags}>
                                <span>Save the Date</span>
                                <span>Haldi</span>
                                <span>Mehndi</span>
                                <span>Sangeet</span>
                                <span>Wedding</span>
                                <span>Reception</span>
                            </div>
                        </div>
                        <div className={styles.featureCardImageWrapper}>
                            <img src="/bundle-mockup.jpeg" alt="Wedding Suite Mockups" className={styles.featureImageFull} />
                        </div>
                    </motion.div>

                    {/* Bottom Left Card */}
                    <motion.div
                        className={styles.featureCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className={styles.featureCardContent}>
                            <h3>Simple RSVP Dashboard</h3>
                            <p>
                                Track guest confirmations in real time with a clean dashboard. See who's attending, declined, or pending at a glance.
                            </p>
                        </div>
                        <div className={styles.featureCardGraphicWrapper}>
                            <div className={styles.mockRsvpContainer}>
                                <div className={styles.mockRsvpMiniDash}>
                                    <div className={styles.miniDashHeader}>
                                        <span className={styles.miniDashTag}>HALDI</span>
                                        <span className={styles.miniDashStatus}>RSVP LIVE</span>
                                    </div>
                                    <h4 className={styles.miniDashTitle}>Rahul weds Anjalee</h4>
                                    <div className={styles.miniDashCards}>
                                        <div className={`${styles.miniCard} ${styles.miniCardGray}`}>
                                            <span className={styles.miniCardValue}>142</span>
                                            <span className={styles.miniCardLabel}>RESPONSES</span>
                                        </div>
                                        <div className={`${styles.miniCard} ${styles.miniCardGreen}`}>
                                            <span className={styles.miniCardValue}>120</span>
                                            <span className={styles.miniCardLabel}>ATTENDING</span>
                                        </div>
                                        <div className={`${styles.miniCard} ${styles.miniCardRed}`}>
                                            <span className={styles.miniCardValue}>12</span>
                                            <span className={styles.miniCardLabel}>NOT ATTENDING</span>
                                        </div>
                                        <div className={`${styles.miniCard} ${styles.miniCardYellow}`}>
                                            <span className={styles.miniCardValue}>10</span>
                                            <span className={styles.miniCardLabel}>MAYBE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Right Card */}
                    <motion.div
                        className={styles.featureCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.featureCardContent}>
                            <h3>One-Click WhatsApp Sharing</h3>
                            <p>
                                Export your digital invite instantly and share it with guests directly on WhatsApp, perfectly optimized for mobile viewing.
                            </p>
                        </div>
                        <div className={styles.featureCardGraphicWrapper}>
                            <div className={styles.mockPhoneGraphic}>
                                <div className={styles.mockPhoneContent}>
                                    <div className={styles.mockPhoneImg}></div>
                                    <div className={styles.mockPhoneLine1}></div>
                                    <div className={styles.mockPhoneLine2}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
