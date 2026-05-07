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
        <main className="min-h-screen bg-[#F8F7F5]">
            {/* Elegant Header */}
            <section className="bg-[#000000] text-white pt-24 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#C8A95115,transparent_50%)]" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 text-[#C8A951] hover:text-[#E0C888] transition-colors mb-10 text-[10px] font-bold tracking-[0.3em] uppercase"
                        >
                            <ArrowLeft size={12} /> Back to Studio
                        </Link>
                        <p className="text-[#C8A951] font-bold tracking-[0.4em] text-[9px] uppercase mb-5 opacity-80">
                            {subtitle}
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 tracking-tight leading-tight">
                            {title}
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-[#C8A951] opacity-30" />
                            <p className="text-slate-400 text-xs font-medium tracking-wide">
                                Last updated {lastUpdated}
                            </p>
                            <div className="h-px w-8 bg-[#C8A951] opacity-30" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Body */}
            <section className="py-24 px-6 bg-[#F8F7F5]">
                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-20"
                    >
                        <p className="text-[#334155] text-xl leading-relaxed font-serif italic border-l-2 border-[#C8A951] pl-10 py-2">
                            {introduction}
                        </p>
                    </motion.div>

                    <div className="space-y-24">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05, duration: 0.5 }}
                                className="relative"
                            >
                                <div className="flex items-start gap-6 mb-8">
                                    <span className="font-serif text-3xl text-[#C8A951] opacity-20 mt-[-4px] select-none">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className="font-serif text-2xl md:text-3xl text-[#0F172A] leading-tight pt-1">
                                        {section.title}
                                    </h2>
                                </div>
                                
                                <div className="pl-14">
                                    {section.type === 'text' || typeof section.content === 'string' ? (
                                        <p className="text-[#475569] leading-[2] text-[1.05rem]">
                                            {section.content}
                                        </p>
                                    ) : (
                                        <ul className="space-y-6">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex gap-5 text-[#475569] leading-relaxed text-[1rem]">
                                                    <span className={`flex-shrink-0 mt-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                                                        section.type === 'checklist' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                                                        section.type === 'crosslist' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-[#C8A951]'
                                                    }`}>
                                                        {section.type === 'checklist' ? '✓' : 
                                                         section.type === 'crosslist' ? '✕' : '•'}
                                                    </span>
                                                    <span className="pt-0.5">
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {showContact && (
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-32 p-12 bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] text-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none font-serif text-[12rem] leading-none select-none group-hover:scale-110 transition-transform duration-1000">?</div>
                            <h3 className="font-serif text-3xl text-[#0F172A] mb-4">Questions about our policies?</h3>
                            <p className="text-slate-500 text-base mb-10 max-w-sm mx-auto leading-relaxed">
                                Our dedicated support team is here to help you with any legal or technical queries.
                            </p>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <a
                                    href="mailto:hello@nimantranstudio.com"
                                    className="inline-flex items-center gap-3 bg-[#000] text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-[#1a1a1a] transition-all hover:shadow-xl hover:translate-y-[-2px]"
                                >
                                    <Mail size={16} /> Email Us
                                </a>
                                <a
                                    href="tel:+918010581916"
                                    className="inline-flex items-center gap-3 border-2 border-[#E2E8F0] text-[#0F172A] px-10 py-4 rounded-full text-sm font-bold hover:bg-slate-50 transition-all hover:border-[#0F172A]"
                                >
                                    <Phone size={16} /> Call Support
                                </a>
                            </div>
                        </motion.div>
                    )}

                    <footer className="mt-24 pt-12 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                            © 2026 Nimantran Studio
                        </p>
                        <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                            <Link href="/terms" className="hover:text-[#C8A951] transition-colors">Terms</Link>
                            <Link href="/privacy" className="hover:text-[#C8A951] transition-colors">Privacy</Link>
                            <Link href="/refund-policy" className="hover:text-[#C8A951] transition-colors">Refunds</Link>
                        </div>
                    </footer>
                </div>
            </section>
        </main>
    );
}

