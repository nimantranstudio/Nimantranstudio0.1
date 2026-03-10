import Link from 'next/link';
import { Twitter, Instagram, Heart, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Branding */}
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <div className={styles.logoText}>Nimantran</div>
                            <div className={styles.logoSub}>STUDIO</div>
                        </div>
                        <p className={styles.brandDesc}>
                            Nimantran Studio is a simple platform for creating wedding invitations, sharing them instantly on WhatsApp, and tracking guest RSVPs — all in one place.
                        </p>
                        <div className={styles.socials}>
                            <Link href="https://twitter.com" aria-label="Twitter">
                                <div className={styles.socialIcon}><Twitter size={18} /></div>
                            </Link>
                            <Link href="https://instagram.com" aria-label="Instagram">
                                <div className={styles.socialIcon}><Instagram size={18} /></div>
                            </Link>
                            <Link href="https://youtube.com" aria-label="YouTube">
                                <div className={styles.socialIcon}><Youtube size={18} /></div>
                            </Link>
                            <Link href="https://pinterest.com" aria-label="Pinterest">
                                <div className={styles.socialIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M12 0C5.372 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.379-.293 1.192-.333 1.355-.053.218-.173.264-.399.159-1.486-.692-2.42-2.868-2.42-4.613 0-3.755 2.73-7.202 7.865-7.202 4.13 0 7.339 2.943 7.339 6.875 0 4.102-2.587 7.402-6.178 7.402-1.207 0-2.341-.627-2.73-1.369l-.744 2.827c-.269 1.025-1 2.308-1.492 3.12 1.125.347 2.316.535 3.551.535 6.628 0 12-5.372 12-12S18.628 0 12 0z" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Productivity Links */}
                    <div className={styles.linkCol}>
                        <h4>QUICK LINKS</h4>
                        <ul>
                            <li><Link href="/themes">Invitation Templates</Link></li>
                            <li><Link href="/rsvp">RSVP & Guest Tracking</Link></li>
                            <li><Link href="/pricing">Pricing</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className={styles.linkCol}>
                        <h4>POLICY</h4>
                        <ul>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms of Service</Link></li>
                            <li><Link href="/refund-policy">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.linkCol}>
                        <h4>CONTACT</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <span className={styles.contactIcon}><Mail size={15} /></span>
                                <a href="mailto:hello@nimantranstudio.com">hello@nimantranstudio.com</a>
                            </li>
                            <li>
                                <span className={styles.contactIcon}><Phone size={15} /></span>
                                <a href="tel:+918884678194">+91 88846 78194</a>
                            </li>
                            <li>
                                <span className={styles.contactIcon}><MapPin size={15} /></span>
                                <span>Pune, Maharashtra, India</span>
                            </li>
                        </ul>
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
