'use client';

import { useState, useEffect } from 'react';
import { Package, TrendingUp, Palette, Users, Loader2 } from "lucide-react";
import { auth } from '@/lib/firebase';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        themesCount: 0,
        bundlesCount: 0,
        weddingsCount: 0,
        rsvpsCount: 0,
        revenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                await auth.authStateReady();
                const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
                const res = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loader2 className="animate-spin" size={32} color="#E1A639" />
            </div>
        );
    }

    return (
        <div style={{ padding: '0.5rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: '#1A1A1A', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Here is what's happening at Nimantran Studio.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {/* Themes count */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E0D8', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4A373' }}>
                        <Palette size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Themes</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1A1A1A' }}>{stats.themesCount}</div>
                    </div>
                </div>

                {/* Stat Card 1 - Bundles */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E0D8', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F9F3EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5A2B' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Bundles</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1A1A1A' }}>{stats.bundlesCount}</div>
                    </div>
                </div>

                {/* Weddings/Users */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E0D8', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E8F0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F634A' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Active Weddings</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1A1A1A' }}>{stats.weddingsCount}</div>
                    </div>
                </div>

                {/* Stat Card 2 - Revenue */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E0D8', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F3EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#756353' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Revenue</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1A1A1A' }}>₹{stats.revenue}</div>
                    </div>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div style={{ marginTop: '2rem', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #E5E0D8', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                Chart Visualization Placeholder
            </div>
        </div>
    );
}
