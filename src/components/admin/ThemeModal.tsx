'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import styles from './ThemeModal.module.css';
import { auth } from '@/lib/firebase';

interface ThemeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: {
        id: string;
        name: string;
        description?: string;
        isActive: boolean;
        isBestSeller: boolean;
        isPopular: boolean;
        thumbnailUrl: string;
        previewImages?: string;
    } | null;
}

export function ThemeModal({ isOpen, onClose, onSuccess, initialData }: ThemeModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isBestSeller, setIsBestSeller] = useState(false);
    const [isPopular, setIsPopular] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
            setIsActive(initialData.isActive);
            setIsBestSeller(initialData.isBestSeller);
            setIsPopular(initialData.isPopular);
            setFiles([]);
            const existingImages = initialData.previewImages ? JSON.parse(initialData.previewImages) : [initialData.thumbnailUrl];
            setPreviews(existingImages);
            const thumbIdx = existingImages.indexOf(initialData.thumbnailUrl);
            setThumbnailIndex(thumbIdx >= 0 ? thumbIdx : 0);
        } else {
            setName('');
            setDescription('');
            setIsActive(true);
            setIsBestSeller(false);
            setIsPopular(false);
            setFiles([]);
            setPreviews([]);
            setThumbnailIndex(0);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        if (thumbnailIndex === index) {
            setThumbnailIndex(0);
        } else if (thumbnailIndex > index) {
            setThumbnailIndex(thumbnailIndex - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('isActive', String(isActive));
            formData.append('isBestSeller', String(isBestSeller));
            formData.append('isPopular', String(isPopular));
            formData.append('thumbnailIndex', String(thumbnailIndex));

            files.forEach(file => {
                formData.append('images', file);
            });

            const url = initialData
                ? `/api/admin/themes/${initialData.id}`
                : '/api/admin/themes';

            const method = initialData ? 'PUT' : 'POST';

            await auth.authStateReady();
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || `Failed to ${initialData ? 'update' : 'create'} theme`);
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error saving theme:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{initialData ? 'Edit Theme' : 'Create New Theme'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.body}>
                        <div className={styles.row}>
                            <div className={clsx(styles.formGroup, styles.col)}>
                                <label className={styles.label}>Theme Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. Royal Gold Traditional"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Status</label>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        className={styles.toggleInput}
                                        checked={isActive}
                                        onChange={e => setIsActive(e.target.checked)}
                                    />
                                    <span className={styles.toggleSwitch}></span>
                                    <span className={styles.toggleLabel}>{isActive ? 'Active' : 'Inactive'}</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tags</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            className={styles.toggleInput}
                                            checked={isBestSeller}
                                            onChange={e => setIsBestSeller(e.target.checked)}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span className={styles.toggleLabel}>Best Seller</span>
                                    </label>

                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            className={styles.toggleInput}
                                            checked={isPopular}
                                            onChange={e => setIsPopular(e.target.checked)}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span className={styles.toggleLabel}>Popular</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={clsx(styles.input, styles.textarea)}
                                placeholder="Describe the aesthetic and target audience..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Theme Images</label>
                            <div
                                className={styles.fileUploadArea}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className={styles.uploadIcon}>
                                    <Upload size={32} />
                                </div>
                                <div className={styles.uploadText}>
                                    <span style={{ fontWeight: 600, color: '#E1A639' }}>Click to upload</span> or drag and drop
                                </div>
                                <div className={styles.uploadHint}>SVG, PNG, JPG or GIF (max. 800x400px)</div>
                            </div>

                            {previews.length > 0 && (
                                <div className={styles.previewGrid}>
                                    {previews.map((src, index) => (
                                        <div 
                                            key={index} 
                                            className={clsx(styles.previewItem, thumbnailIndex === index && styles.previewItemThumbnail)}
                                            onClick={() => setThumbnailIndex(index)}
                                            style={{ cursor: 'pointer', border: thumbnailIndex === index ? '2px solid #E1A639' : '1px solid #e5e7eb' }}
                                        >
                                            <img src={src} alt="Preview" className={styles.previewImg} />
                                            {thumbnailIndex === index && (
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(225, 166, 57, 0.9)', color: '#1A1A1A', fontSize: '10px', fontWeight: 'bold', padding: '2px 0', textAlign: 'center' }}>
                                                    THUMBNAIL
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={clsx(styles.btn, styles.btnCancel)} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={clsx(styles.btn, styles.btnSubmit)}
                            disabled={isLoading}
                        >
                            {isLoading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Theme' : 'Create Theme')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Utility to handle conditional classes since clsx isn't imported yet in some environments
function clsx(...args: any[]) {
    return args.filter(Boolean).join(' ');
}
