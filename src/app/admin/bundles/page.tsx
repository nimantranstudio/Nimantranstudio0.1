'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Loader2, Check, Star, Edit, Trash2, Globe, Lock, Image as ImageIcon } from 'lucide-react';
import { BundleModal } from '@/components/admin/BundleModal';

interface Bundle {
    id: string;
    name: string;
    description: string;
    price: string;
    isActive: boolean;
    isPopular: boolean;
    checklist: string;
    highlights: string;
    thumbnailUrl?: string;
    themeRef?: {
        name: string;
    };
}

export default function BundlesPage() {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

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

    const handleAddNew = () => {
        setSelectedBundle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (bundle: Bundle) => {
        setSelectedBundle(bundle);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bundle?')) return;

        try {
            const res = await fetch(`/api/admin/bundles/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchBundles();
        } catch (error) {
            console.error("Failed to delete bundle", error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Bundles</h1>
                    <p style={{ color: '#6b7280' }}>Package themes into purchasable offerings.</p>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6366f1', borderColor: '#6366f1' }}
                    onClick={handleAddNew}
                >
                    <Plus size={18} /> Add New Bundle
                </button>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} color="#6366f1" />
                </div>
            ) : bundles.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#9ca3af' }}>
                        <Package size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No bundles created</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '300px' }}>Combine a theme with features and pricing to sell on your storefront.</p>
                    <button
                        style={{ color: '#6366f1', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}
                        onClick={handleAddNew}
                    >
                        Create First Bundle
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {bundles.map((bundle) => {
                        const checklist = JSON.parse(bundle.checklist || '[]');
                        return (
                            <div
                                key={bundle.id}
                                style={{
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    boxShadow: bundle.isPopular ? '0 10px 15px -3px rgba(99, 102, 241, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                                    borderColor: bundle.isPopular ? '#6366f1' : '#e5e7eb'
                                }}
                            >
                                <div style={{ height: '160px', width: '100%', background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
                                    {bundle.thumbnailUrl ? (
                                        <img
                                            src={bundle.thumbnailUrl}
                                            alt={bundle.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db' }}>
                                            <ImageIcon size={48} />
                                        </div>
                                    )}

                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '8px', zIndex: 10 }}>
                                        <button
                                            onClick={() => handleEdit(bundle)}
                                            style={{ background: 'rgba(255,255,255,0.9)', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#4f46e5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bundle.id)}
                                            style={{ background: 'rgba(255,255,255,0.9)', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {bundle.isPopular && (
                                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#6366f1', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10 }}>
                                            <Star size={10} fill="white" /> POPULAR
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#111827' }}>{bundle.name}</h3>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                padding: '2px 8px',
                                                borderRadius: '20px',
                                                background: bundle.isActive ? '#ecfdf5' : '#fff1f2',
                                                color: bundle.isActive ? '#059669' : '#e11d48',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                border: `1px solid ${bundle.isActive ? '#10b981' : '#fda4af'}33`,
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }}>
                                                {bundle.isActive ? <Globe size={10} /> : <Lock size={10} />}
                                                {bundle.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            Theme: {bundle.themeRef?.name || 'Multiple'}
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', minHeight: '40px', lineHeight: '1.4' }}>{bundle.description}</p>
                                    </div>

                                    <div style={{ marginBottom: '1.25rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Price</div>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>₹{bundle.price}</span>
                                    </div>

                                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '10px' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Includes:</div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {checklist.map((item: string, idx: number) => (
                                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#4b5563' }}>
                                                    <Check size={12} color="#10b981" strokeWidth={3} />
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <BundleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchBundles}
                initialData={selectedBundle}
            />
        </div>
    );
}
