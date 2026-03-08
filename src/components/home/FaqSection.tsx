'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FaqSection.module.css';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
    {
        question: "Do guests need an app to RSVP?",
        answer: "No, guests simply click the WhatsApp link and open it in their browser. No apps or sign-ups required."
    },
    {
        question: "Can I customize the design themes?",
        answer: "Yes! Every bundle is fully matched to one of our premium Indian wedding themes, customizable with your event details."
    },
    {
        question: "How long does it take to generate?",
        answer: "Instantly. Once you pay and submit your details, your full invite bundle is generated and ready to share."
    },
    {
        question: "Can I change my event details later?",
        answer: "Yes, you can edit your event details from your dashboard at any time, and your live RSVP link will automatically update."
    }
];

export const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className={styles.faqSection}>
            <div className={`container ${styles.faqContainer}`}>
                {/* Left Column: Heading */}
                <div className={styles.faqHeader}>
                    <h2 className={styles.faqTitle}>FAQ Section</h2>
                    <p className={styles.faqDescription}>
                        Find answers to common questions about creating invitations, sharing them on WhatsApp, collecting RSVPs, and tracking your wedding guests.
                    </p>
                </div>

                {/* Right Column: Accordion */}
                <div className={styles.faqAccordion}>
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className={styles.faqItem}>
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                >
                                    <span className={styles.faqIcon}>
                                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                    </span>
                                    <span className={styles.faqQuestionText}>
                                        {faq.question}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className={styles.faqAnswerWrapper}
                                        >
                                            <div className={styles.faqAnswer}>
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
