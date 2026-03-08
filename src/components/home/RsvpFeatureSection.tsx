import styles from '@/app/page.module.css';
import { motion } from 'framer-motion';

export const RsvpFeatureSection = () => {
    return (
        <section className={styles.rsvpFeatureSection}>
            <div className="container">
                <motion.div
                    className={styles.rsvpFeatureContainer}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Left Text & Stats Content */}
                    <div className={styles.rsvpFeatureLeft}>
                        <h2 className={styles.rsvpFeatureTitle}>Stay Ahead of Your Guest List</h2>
                        <p className={styles.rsvpFeatureDesc}>
                            Our intuitive dashboard gives you a bird's-eye view of your entire wedding journey. Monitor engagement, manage budgets, and ensure every guest is accounted for.
                        </p>

                        <div className={styles.rsvpFeatureStatsRow}>
                            <div className={styles.rsvpStatCard}>
                                <span className={styles.rsvpStatLabel}>TOTAL GUESTS</span>
                                <span className={styles.rsvpStatValue}>250</span>
                            </div>
                            <div className={styles.rsvpStatCard}>
                                <span className={styles.rsvpStatLabel}>RSVP RATE</span>
                                <span className={styles.rsvpStatValue}>82%</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Dashboard UI Mock */}
                    <div className={styles.rsvpFeatureRight}>
                        <div className={styles.dashboardMockCard}>

                            <div className={styles.mockSection}>
                                <h4 className={styles.mockSectionTitle}>RSVP BREAKDOWN</h4>
                                <div className={styles.mockDonutContainer}>
                                    {/* CSS Donut Chart */}
                                    <div className={styles.donutChart}></div>
                                    <div className={styles.donutLegend}>
                                        <span className={styles.legendItem}><span className={styles.legendDot} style={{ backgroundColor: '#1C1C1C' }}></span>Attending</span>
                                        <span className={styles.legendItem}><span className={styles.legendDot} style={{ backgroundColor: '#EBE2D5' }}></span>Declined</span>
                                        <span className={styles.legendItem}><span className={styles.legendDot} style={{ backgroundColor: '#F3F4F6' }}></span>Pending</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.mockSection}>
                                <h4 className={styles.mockSectionTitle}>EVENT OVERVIEW</h4>
                                <div className={styles.mockBarChart}>
                                    <div className={styles.mockBarCol}>
                                        <div className={styles.mockBar} style={{ height: '60%' }}></div>
                                        <span className={styles.mockBarLabel}>Sangeet</span>
                                    </div>
                                    <div className={styles.mockBarCol}>
                                        <div className={styles.mockBar} style={{ height: '100%' }}></div>
                                        <span className={styles.mockBarLabel}>Wedding</span>
                                    </div>
                                    <div className={styles.mockBarCol}>
                                        <div className={styles.mockBar} style={{ height: '80%' }}></div>
                                        <span className={styles.mockBarLabel}>Reception</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};
