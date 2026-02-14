'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
            <Image
                src={images[currentIndex]}
                alt={`${name} - ${currentIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover', transition: 'opacity 0.3s ease' }}
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
                                <div style={{ height: '240px', width: '100%', background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
                                    {(() => {
                                        let images: string[] = [];
                                        try {
                                            const itemImgs = JSON.parse(bundle.itemImages || '{}');
                                            images = Object.values(itemImgs) as string[];
                                        } catch (e) { }

                                        if (bundle.thumbnailUrl && !images.includes(bundle.thumbnailUrl)) {
                                            images = [bundle.thumbnailUrl, ...images];
                                        }

                                        return <ImageSlider images={images} name={bundle.name} />;
                                    })()}

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

                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>{bundle.name}</h3>
                                            <span style={{
                                                fontSize: '0.6rem',
                                                padding: '1px 6px',
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
                                        <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '600', marginBottom: '0.25rem' }}>
                                            Theme: {bundle.themeRef?.name || 'Multiple'}
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', minHeight: 'auto', lineHeight: '1.3' }}>{bundle.description}</p>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tiered Pricing</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: '600' }}>WhatsApp</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827' }}>₹{bundle.whatsappPrice}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: '600' }}>Printable</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827' }}>₹{bundle.printablePrice}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: '600' }}>Complete</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827' }}>₹{bundle.completePrice}</span>
                                            </div>
                                        </div>
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
