import Link from 'next/link';
import { Twitter, Instagram, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Branding */}
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>Nimantran</span>
                            <span className={styles.logoAccent}>Studio</span>
                        </div>
                        <p className={styles.brandDesc}>
                            Helping families beyond invitations. Trusted by thousands of couples across India and abroad.
                        </p>
                    </div>

                    {/* Productivity Links */}
                    <div className={styles.linkCol}>
                        <h4>PRODUCT</h4>
                        <ul>
                            <li><Link href="/themes">Themes</Link></li>
                            <li><Link href="/rsvp">RSVP System</Link></li>
                            <li><Link href="/pricing">Pricing & Products</Link></li>
                            <li><Link href="/video-invitations">Video Invitations</Link></li>
                            <li><Link href="/guest-management">Guest Management</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className={styles.linkCol}>
                        <h4>COMPANY</h4>
                        <ul>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/blogs">Blogs</Link></li>
                            <li><Link href="/contact">Contact Support</Link></li>
                            <li><Link href="/careers">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className={styles.linkCol}>
                        <h4>SUPPORT</h4>
                        <ul>
                            <li><Link href="/faqs">FAQs</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms of Service</Link></li>
                        </ul>
                        <div className={styles.socials}>
                            <Link href="https://twitter.com" aria-label="Twitter">
                                <div className={styles.socialIcon}><Twitter size={18} /></div>
                            </Link>
                            <Link href="https://instagram.com" aria-label="Instagram">
                                <div className={styles.socialIcon}><Instagram size={18} /></div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>© 2024 NIMANTRANSTUDIO.COM — ALL RIGHTS RESERVED</p>
                    <p className={styles.attribution}>
                        MADE WITH <Heart size={14} className={styles.heartIcon} /> FOR INDIAN WEDDINGS
                    </p>
                </div>
            </div>
        </footer>
    );
}
