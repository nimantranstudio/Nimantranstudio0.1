'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Loader2, Check, Star, Edit, Trash2, Globe, Lock, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { BundleModal } from '@/components/admin/BundleModal';

interface Bundle {
    id: string;
    name: string;
    description: string;
    whatsappPrice: number;
    printablePrice: number;
    completePrice: number;
    isActive: boolean;
    isPopular: boolean;
    thumbnailUrl?: string;
    itemImages?: string;
    bundleInvoices?: any[];
    themeRef?: {
        name: string;
    };
}

function ImageSlider({ images, name }: { images: string[], name: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db' }}>
                <ImageIcon size={48} />
            </div>
        );
    }

    const nextSlide = (e: any) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = (e: any) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
                src={images[currentIndex]}
                alt={`${name} - ${currentIndex + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5, color: '#4b5563' }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={nextSlide}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5, color: '#4b5563' }}
                    >
                        <ChevronRight size={18} />
                    </button>
                    <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', zIndex: 5 }}>
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
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
                    <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: '#1A1A1A' }}>Bundles</h1>
                    <p style={{ color: '#6b7280' }}>Package themes into purchasable offerings.</p>
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} color="#E1A639" />
                </div>
            ) : bundles.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#9ca3af' }}>
                        <Package size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No themes created yet</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '300px' }}>To create a bundle, please create a Theme first in the Themes section.</p>
                </div>
            ) : (
                <div style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {bundles.map((bundle) => {
                        let images: string[] = [];
                        try {
                            const itemImgs = JSON.parse(bundle.itemImages || '{}');
                            images = Object.values(itemImgs) as string[];
                        } catch (e) { }

                        if (bundle.thumbnailUrl && !images.includes(bundle.thumbnailUrl)) {
                            images = [bundle.thumbnailUrl, ...images];
                        }

                        return (
                            <div
                                key={bundle.id}
                                style={{
                                    background: 'white',
                                    border: '1px solid #E5E0D8',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    boxShadow: bundle.isPopular ? '0 8px 16px rgba(225, 166, 57, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                                    borderColor: bundle.isPopular ? '#E1A639' : '#E5E0D8',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = bundle.isPopular ? '0 12px 20px rgba(225, 166, 57, 0.2)' : '0 8px 16px rgba(0,0,0,0.06)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = bundle.isPopular ? '0 8px 16px rgba(225, 166, 57, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)';
                                }}
                            >
                                <div 
                                    style={{ flex: 1, display: 'flex', padding: '1rem', cursor: 'pointer' }}
                                    onClick={() => handleEdit(bundle)}
                                >
                                    <div style={{ width: '80px', height: '100px', background: '#FDFBF7', borderRadius: '8px', overflow: 'hidden', marginRight: '1.5rem', flexShrink: 0, position: 'relative' }}>
                                        {images.length > 0 ? (
                                            <img
                                                src={images[0]}
                                                alt={bundle.BundleName || bundle.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db' }}>
                                                <Package size={24} />
                                            </div>
                                        )}
                                        {bundle.isPopular && (
                                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: '#E1A639', color: '#111827', fontSize: '0.6rem', fontWeight: '800', textAlign: 'center', padding: '2px 0' }}>
                                                POPULAR
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: '#1C1917', margin: 0 }}>{bundle.BundleName || bundle.name}</h3>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                background: bundle.isActive ? '#ecfdf5' : '#fef2f2',
                                                color: bundle.isActive ? '#047857' : '#991b1b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }}>
                                                {bundle.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {bundle.description && (
                                            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.75rem 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {bundle.description}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap' }}>
                                            {bundle.bundleInvoices && bundle.bundleInvoices.length > 0 ? (
                                                bundle.bundleInvoices
                                                    .filter((inv: any) => inv.isDisplay)
                                                    .map((inv: any) => (
                                                        <div key={inv.id} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' }}>
                                                                {inv.package?.name || 'Package'}:
                                                            </span>
                                                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>
                                                                ₹{inv.finalSellingPrice}
                                                            </span>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>
                                                    No packages configured yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEdit(bundle); }}
                                        style={{ background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#4b5563' }}
                                        title="Edit Bundle"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(bundle.id); }}
                                        style={{ background: '#fef2f2', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626' }}
                                        title="Delete Bundle"
                                    >
                                        <Trash2 size={18} />
                                    </button>
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
