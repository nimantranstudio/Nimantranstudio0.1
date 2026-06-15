'use client';

import Image from "next/image";
import Link from "next/link";
import { User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useWeddingStore } from '@/store/wedding-store';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from '@/components/layout/Navbar.module.css';
import { clsx } from 'clsx';

export function AdminHeader() {
    const { logout } = useWeddingStore();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        router.push('/');
    };

    return (
        <header style={{ 
            height: '70px', 
            background: '#fff', 
            borderBottom: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 2rem',
            flexShrink: 0
        }}>
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center' }}>
                <Image 
                    src="/logo.png" 
                    alt="Nimantran Studio" 
                    width={150} 
                    height={42} 
                    style={{ objectFit: 'contain' }}
                    priority 
                />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={styles.profileDropdown} ref={dropdownRef}>
                    <button
                        className={clsx(styles.profileBtn, isProfileOpen && styles.active)}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', padding: 0 }}
                    >
                        <div style={{ 
                            width: '35px', 
                            height: '35px', 
                            borderRadius: '50%', 
                            background: '#fcf6e8', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: '#E1A639'
                        }}>
                            <User size={18} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Admin Login</span>
                        <ChevronDown size={14} className={clsx(styles.chevron, isProfileOpen && styles.rotated)} style={{ marginLeft: '2px', opacity: 0.6 }} />
                    </button>

                    {isProfileOpen && (
                        <div className={styles.dropdownMenu} style={{ top: '100%', right: 0, marginTop: '15px' }}>
                            <div className={styles.dropdownHeader}>
                                <span className={styles.userName}>Hi, NSAdmin</span>
                                <span className={styles.userRole}>Administrator</span>
                            </div>
                            <Link
                                href="/admin"
                                className={styles.dropdownItem}
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <LayoutDashboard size={16} />
                                Admin Panel
                            </Link>
                            <button onClick={handleLogout} className={clsx(styles.dropdownItem, styles.logout)}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
