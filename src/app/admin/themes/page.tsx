'use client';

import { useState, useEffect } from 'react';
import { Plus, Palette, Loader2, Edit, Trash2, GripHorizontal } from 'lucide-react';
import { ThemeModal } from '@/components/admin/ThemeModal';
import { Reorder } from 'framer-motion';
import Image from 'next/image';
import { auth } from '@/lib/firebase';

interface Theme {
    id: string;
    name: string;
    thumbnailUrl: string;
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
            await auth.authStateReady();
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
            const res = await fetch('/api/admin/themes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
            const res = await fetch(`/api/admin/themes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
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

    const handleReorder = async (newOrder: Theme[]) => {
        setThemes(newOrder); // Update local state immediately for smooth UI
        const orderedIds = newOrder.map(t => t.id);

        try {
            await auth.authStateReady();
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
            await fetch('/api/admin/themes/reorder', {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ orderedIds })
            });
            // Optionally, we could show a "Saved" toast here
        } catch (error) {
            console.error("Failed to save new theme order", error);
            // Revert on error if necessary
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: '#1A1A1A' }}>Themes</h1>
                    <p style={{ color: '#6b7280' }}>Manage your wedding invitation visual templates.</p>
                </div>
                <button
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#E1A639', color: '#111827', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                    onClick={handleAddNew}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d49b36'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E1A639'}
                >
                    <Plus size={18} /> Add New Theme
                </button>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} color="#E1A639" />
                </div>
            ) : themes.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#9ca3af' }}>
                        <Palette size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No themes found</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '300px' }}>Start by creating your first design theme for Nimantran Studio.</p>
                    <button
                        style={{ background: 'none', color: '#E1A639', border: 'none', padding: 0, fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}
                        onClick={handleAddNew}
                    >
                        Create First Theme
                    </button>
                </div>
            ) : (
                <Reorder.Group 
                    axis="y" 
                    values={themes} 
                    onReorder={handleReorder}
                    style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {themes.map((theme) => (
                        <Reorder.Item 
                            key={theme.id} 
                            value={theme}
                            style={{ 
                                background: 'white', 
                                border: '1px solid #E5E0D8', 
                                borderRadius: '12px', 
                                overflow: 'hidden', 
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)', 
                                position: 'relative', 
                                cursor: 'grab',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            whileDrag={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                        >
                            <div style={{ padding: '1rem', color: '#9ca3af', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                                <GripHorizontal size={24} />
                            </div>
                            <div 
                                style={{ flex: 1, display: 'flex', padding: '1rem', cursor: 'pointer' }}
                                onClick={() => handleEdit(theme)}
                            >
                                <div style={{ width: '80px', height: '100px', background: '#FDFBF7', borderRadius: '8px', overflow: 'hidden', marginRight: '1.5rem' }}>
                                    <img
                                        src={theme.thumbnailUrl}
                                        alt={theme.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                    />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: '#1C1917', marginBottom: '0.25rem' }}>{theme.name}</h3>
                                    {theme.description && (
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.75rem 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {theme.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                            <div style={{ padding: '1rem', display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(theme); }}
                                    style={{ background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#4b5563' }}
                                    title="Edit Theme"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(theme.id); }}
                                    style={{ background: '#fef2f2', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626' }}
                                    title="Delete Theme"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
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
