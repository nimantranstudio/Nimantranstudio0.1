'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import Link from 'next/link';

interface BlogFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function BlogForm({ initialData, isEdit }: BlogFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'UNCATEGORIZED',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: '5 min read',
        excerpt: '',
        image: '',
        content: '',
        metaDescription: '',
        published: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const [isUploading, setIsUploading] = useState(false);
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during upload.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isEdit ? `/api/admin/blogs/${initialData.id}` : '/api/admin/blogs';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/admin/blogs');
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'Failed to save blog'}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save blog');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/blogs" style={{ padding: '0.5rem', background: '#F3F4F6', borderRadius: '0.5rem', color: '#4B5563', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>
                        {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h1>
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#1A1A1A', color: 'white', border: 'none',
                        padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                        fontWeight: '500', cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isEdit ? 'Save Changes' : 'Publish Blog'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Blog Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter an engaging title..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', fontSize: '1.1rem' }}
                        />
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Excerpt *</label>
                        <textarea
                            name="excerpt"
                            required
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="A short summary of the blog post (shows on list pages)..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', height: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Blog Content (Markdown supported) *</label>
                        <textarea
                            name="content"
                            required
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your blog post here..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', height: '500px', resize: 'vertical', fontFamily: 'monospace' }}
                        />
                    </div>
                </div>

                {/* Sidebar Settings Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Publishing Settings</h3>
                        
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: formData.published ? '#ECFDF5' : '#F3F4F6', borderRadius: '0.5rem', border: '1px solid', borderColor: formData.published ? '#A7F3D0' : '#E5E7EB' }}>
                            <input
                                type="checkbox"
                                name="published"
                                checked={formData.published}
                                onChange={handleChange}
                                style={{ width: '1.2rem', height: '1.2rem' }}
                            />
                            <span style={{ fontWeight: '500', color: formData.published ? '#065F46' : '#4B5563' }}>
                                {formData.published ? 'Published (Live)' : 'Draft Mode'}
                            </span>
                        </label>
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Meta Information</h3>
                        
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>URL Slug</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Leave blank to auto-generate" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>Display Date</label>
                            <input type="text" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>Read Time</label>
                            <input type="text" name="readTime" value={formData.readTime} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Featured Image</h3>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>Image URL</label>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="e.g. /blog/my-image.png" style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
                            
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isUploading ? 'not-allowed' : 'pointer',
                                background: '#F3F4F6', color: '#374151', padding: '0.5rem 1rem', borderRadius: '0.5rem',
                                border: '1px solid #D1D5DB', fontWeight: '500', transition: 'background 0.2s', opacity: isUploading ? 0.7 : 1
                            }}>
                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                Upload
                                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} style={{ display: 'none' }} />
                            </label>
                        </div>
                        
                        {formData.image ? (
                            <div style={{ width: '100%', height: '150px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div style={{ width: '100%', height: '150px', background: '#F9FAFB', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', border: '1px dashed #D1D5DB' }}>
                                <ImageIcon size={32} style={{ marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '0.875rem' }}>No image set</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </form>
    );
}
