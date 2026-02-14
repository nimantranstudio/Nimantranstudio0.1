'use client';

import { useState, useEffect } from 'react';
import { Plus, Palette, Loader2, Edit, Trash2 } from 'lucide-react';
import { ThemeModal } from '@/components/admin/ThemeModal';
import Image from 'next/image';

interface Theme {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    description?: string;
    isActive: boolean;
    isBestSeller: boolean;
    isPopular: boolean;
    previewImages?: string;
}

export default function ThemesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchThemes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/themes');
            if (res.ok) {
                const data = await res.json();
                setThemes(data.themes || []);
            }
        } catch (error) {
            console.error("Failed to fetch themes", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, []);

    const handleSuccess = () => {
        fetchThemes(); // Refresh list
    };

    const handleEdit = (theme: Theme) => {
        setSelectedTheme(theme);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this theme? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/themes/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchThemes();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to delete theme", error);
            alert("Failed to delete theme");
        }
    };

    const handleAddNew = () => {
        setSelectedTheme(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Themes</h1>
                    <p style={{ color: '#6b7280' }}>Manage your wedding invitation visual templates.</p>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6366f1', borderColor: '#6366f1' }}
                    onClick={handleAddNew}
                >
                    <Plus size={18} /> Add New Theme
                </button>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} color="#6366f1" />
                </div>
            ) : themes.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#9ca3af' }}>
                        <Palette size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No themes found</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '300px' }}>Start by creating your first design theme for Nimantran Studio.</p>
                    <button
                        style={{ background: 'none', color: '#6366f1', border: 'none', padding: 0, fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}
                        onClick={handleAddNew}
                    >
                        Create First Theme
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {themes.map((theme) => (
                        <div key={theme.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {theme.thumbnailUrl ? (
                                    <Image
                                        src={theme.thumbnailUrl}
                                        alt={theme.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <Palette size={48} color="#9ca3af" />
                                )}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleEdit(theme)}
                                        style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4f46e5' }}
                                        title="Edit Theme"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(theme.id)}
                                        style={{ background: 'white', border: '1px solid #fee2e2', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#dc2626' }}
                                        title="Delete Theme"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{theme.name}</h3>
                                {theme.description && (
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.75rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '32px' }}>
                                        {theme.description}
                                    </p>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>ID: {theme.id.substring(0, 8)}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        background: theme.isActive ? '#ecfdf5' : '#fef2f2',
                                        color: theme.isActive ? '#047857' : '#991b1b',
                                        fontWeight: '500'
                                    }}>
                                        {theme.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ThemeModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTheme(null);
                }}
                onSuccess={handleSuccess}
                initialData={selectedTheme}
            />
        </div>
    );
}
