'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';
import { clsx } from 'clsx';

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Themes', href: '/themes' },
    { name: 'RSVP', href: '/rsvp' },
    { name: 'Products', href: '/products' },
    { name: 'Blogs', href: '/blogs' },
];

export const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Don't show header on RSVP page to keep it focused
    if (pathname?.startsWith('/rsvp/')) return null;

    return (
        <nav className={styles.navbar}>
            <div className={clsx("container", styles.navContainer)}>
                <Link href="/" className={styles.logo}>
                    <span>Nimantran<span>Studio</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className={styles.desktopNav}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(styles.navLink, pathname === link.href && styles.active)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/login" className="btn btn-primary">
                        LOGIN
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className={styles.mobileNav}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(styles.mobileNavLink, pathname === link.href && styles.active)}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/login" className={clsx("btn btn-primary", styles.mobileBtn)} onClick={() => setIsOpen(false)}>
                        LOGIN
                    </Link>
                </div>
            )}
        </nav>
    );
};
