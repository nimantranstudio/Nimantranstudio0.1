'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Loader2, Check, Star, RefreshCw } from 'lucide-react';

interface Bundle {
    id: string;
    name: string;
    subtitle: string;
    price: string;
    features: string; // JSON
    isPopular: boolean;
    theme: string;
}

export default function BundlesPage() {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    const fetchBundles = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/bundles');
            if (res.ok) {
                const data = await res.json();
                setBundles(data.bundles || []);
            }
        } catch (error) {
            console.error("Failed to fetch bundles", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBundles();
    }, []);

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const res = await fetch('/api/admin/bundles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seed: true })
            });
            if (res.ok) {
                fetchBundles();
            }
        } catch (error) {
            console.error("Failed to seed bundles", error);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Bundles</h1>
                    <p style={{ color: '#6b7280' }}>Manage pricing plans and feature packages.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {bundles.length === 0 && (
                        <button
                            className="btn btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={handleSeed}
                            disabled={isSeeding}
                        >
                            <RefreshCw size={18} className={isSeeding ? "animate-spin" : ""} />
                            {isSeeding ? 'Seeding...' : 'Seed Defaults'}
                        </button>
                    )}
                    <button
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6366f1', borderColor: '#6366f1' }}
                    >
                        <Plus size={18} /> Add New Bundle
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} color="#6366f1" />
                </div>
            ) : bundles.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#d97706' }}>
                        <Package size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No bundles found</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '300px' }}>Pricing plans haven't been initialized yet.</p>
                    <button
                        className="btn btn-primary"
                        style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}
                        onClick={handleSeed}
                        disabled={isSeeding}
                    >
                        {isSeeding ? 'Initializing...' : 'Initialize Default Bundles'}
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {bundles.map((bundle) => {
                        const features = JSON.parse(bundle.features || '[]');
                        return (
                            <div
                                key={bundle.id}
                                style={{
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    position: 'relative',
                                    boxShadow: bundle.isPopular ? '0 10px 15px -3px rgba(99, 102, 241, 0.1)' : 'none',
                                    borderColor: bundle.isPopular ? '#6366f1' : '#e5e7eb'
                                }}
                            >
                                {bundle.isPopular && (
                                    <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={12} fill="white" /> POPULAR
                                    </div>
                                )}

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>{bundle.name}</h3>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', minHeight: '40px' }}>{bundle.subtitle}</p>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '1.875rem', fontWeight: '800', color: '#111827' }}>{bundle.price}</span>
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                                    {features.map((feature: string, idx: number) => (
                                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
                                            <div style={{ marginTop: '2px', color: bundle.theme === 'gold' ? '#d97706' : '#10b981' }}>
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1 }}>Edit</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
