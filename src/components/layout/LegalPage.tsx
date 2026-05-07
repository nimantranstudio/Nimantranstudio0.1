'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowLeft } from 'lucide-react';

interface LegalSection {
    title: string;
    content: string | string[];
    type?: 'list' | 'text' | 'checklist' | 'crosslist';
}

interface LegalPageProps {
    title: string;
    subtitle?: string;
    lastUpdated: string;
    introduction: string;
    sections: LegalSection[];
    showContact?: boolean;
}

export function LegalPage({
    title,
    subtitle = 'LEGAL',
    lastUpdated,
    introduction,
    sections,
    showContact = true
}: LegalPageProps) {
    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Elegant Header */}
            <section className="bg-[#0A0A0A] text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#C8A95115,transparent_50%)]" />
                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 text-[#C8A951] hover:text-[#E0C888] transition-colors mb-8 text-xs font-semibold tracking-[0.2em] uppercase"
                        >
                            <ArrowLeft size={14} /> Back to Studio
                        </Link>
                        <p className="text-[#C8A951] font-semibold tracking-[0.3em] text-[10px] uppercase mb-4">
                            {subtitle}
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Last updated: {lastUpdated}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Body */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-slate-600 text-lg leading-relaxed mb-16 font-medium border-l-4 border-[#C8A951] pl-8 py-2"
                    >
                        {introduction}
                    </motion.p>

                    <div className="space-y-16">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="group"
                            >
                                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6 flex items-baseline gap-4">
                                    <span className="text-xs font-sans font-bold text-[#C8A951] tracking-widest uppercase opacity-50">
                                        0{idx + 1}
                                    </span>
                                    {section.title}
                                </h2>
                                
                                {section.type === 'text' || typeof section.content === 'string' ? (
                                    <p className="text-slate-600 leading-8 text-[0.95rem]">
                                        {section.content}
                                    </p>
                                ) : (
                                    <ul className="space-y-4">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex gap-4 text-slate-600 leading-7 text-[0.95rem] group/item">
                                                <span className={`flex-shrink-0 mt-1 font-bold ${
                                                    section.type === 'checklist' ? 'text-emerald-500' : 
                                                    section.type === 'crosslist' ? 'text-rose-500' : 'text-[#C8A951]'
                                                }`}>
                                                    {section.type === 'checklist' ? '✓' : 
                                                     section.type === 'crosslist' ? '✕' : '—'}
                                                </span>
                                                <span className="group-hover/item:text-slate-900 transition-colors">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="h-px bg-slate-100 w-full mt-12 group-last:hidden" />
                            </motion.div>
                        ))}
                    </div>

                    {showContact && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-24 p-12 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none font-serif text-8xl">?</div>
                            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">Still have questions?</h3>
                            <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                                Our concierge team typically replies within a few hours on weekdays.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a
                                    href="mailto:hello@nimantranstudio.com"
                                    className="inline-flex items-center gap-2 bg-[#000] text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-[#1a1a1a] transition-all hover:translate-y-[-2px] active:translate-y-0"
                                >
                                    <Mail size={18} /> Email Us
                                </a>
                                <a
                                    href="tel:+918010581916"
                                    className="inline-flex items-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-8 py-4 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all hover:translate-y-[-2px] active:translate-y-0"
                                >
                                    <Phone size={18} /> Call Support
                                </a>
                            </div>
                        </motion.div>
                    )}

                    <footer className="mt-20 pt-10 border-t border-slate-100 text-center space-x-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        <Link href="/terms" className="hover:text-[#C8A951]">Terms</Link>
                        <span className="opacity-30">•</span>
                        <Link href="/privacy" className="hover:text-[#C8A951]">Privacy</Link>
                        <span className="opacity-30">•</span>
                        <Link href="/refund-policy" className="hover:text-[#C8A951]">Refunds</Link>
                    </footer>
                </div>
            </section>
        </main>
    );
}
