'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, FileText, Loader2, Edit, Trash2, Globe, Lock, Eye } from 'lucide-react';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/admin/blogs');
            const data = await res.json();
            if (Array.isArray(data)) {
                setBlogs(data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            const res = await fetch(`/api/admin/blogs/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchBlogs();
            } else {
                alert('Failed to delete blog.');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={32} color="#D2995D" />
                        Blog Posts
                    </h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage your articles, guides, and tips.</p>
                </div>
                
                <Link
                    href="/admin/blogs/new"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#1A1A1A',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                    }}
                >
                    <Plus size={20} />
                    Create Blog
                </Link>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                    <Loader2 size={32} className="animate-spin" color="#D2995D" />
                </div>
            ) : blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '1rem', border: '1px dashed #E5E7EB' }}>
                    <FileText size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '0.5rem' }}>No blogs found</h3>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>Get started by creating your first blog post.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {blogs.map((blog) => (
                        <div key={blog.id} style={{
                            background: 'white',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            border: '1px solid #F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '2rem'
                        }}>
                            <div style={{ display: 'flex', gap: '1.5rem', flex: 1, alignItems: 'center' }}>
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.title} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />
                                ) : (
                                    <div style={{ width: '120px', height: '80px', background: '#F3F4F6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexShrink: 0 }}>
                                        <FileText size={32} />
                                    </div>
                                )}
                                
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#1A1A1A' }}>{blog.title}</h3>
                                        <span style={{ 
                                            display: 'flex', alignItems: 'center', gap: '0.25rem', 
                                            padding: '0.25rem 0.5rem', borderRadius: '2rem', 
                                            fontSize: '0.75rem', fontWeight: '500',
                                            background: blog.published ? '#ECFDF5' : '#F3F4F6',
                                            color: blog.published ? '#059669' : '#6B7280',
                                        }}>
                                            {blog.published ? <Globe size={12} /> : <Lock size={12} />}
                                            {blog.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {blog.excerpt || 'No excerpt provided.'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                        <span><strong>Category:</strong> {blog.category}</span>
                                        <span>•</span>
                                        <span><strong>Date:</strong> {blog.date}</span>
                                        <span>•</span>
                                        <span><strong>Reads:</strong> {blog.readTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <a 
                                    href={`/blogs/${blog.slug}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    style={{ padding: '0.5rem', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="View Live"
                                >
                                    <Eye size={18} />
                                </a>
                                <Link
                                    href={`/admin/blogs/${blog.id}`}
                                    style={{ padding: '0.5rem', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '0.5rem', color: '#D97706', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(blog.id, blog.title)}
                                    style={{ padding: '0.5rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '0.5rem', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
