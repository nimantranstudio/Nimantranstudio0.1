'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Film, Loader2, Save, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';

interface VideoTemplate {
  id: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
  videoTemplate: VideoTemplate | null;
}

interface Bundle {
  id: string;
  BundleName: string;
  themeRef: { name: string } | null;
  videoTemplate: VideoTemplate | null;
}

export default function TemplateAssignmentsPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch assignments data
      const assignRes = await fetch('/api/admin/video-templates/assignments');
      const assignData = await assignRes.json();
      
      // 2. Fetch template list
      const templateRes = await fetch('/api/admin/video-templates');
      const templateData = await templateRes.json();

      if (assignData.success) {
        setThemes(assignData.themes);
        setBundles(assignData.bundles);
      }
      if (templateData.success) {
        setTemplates(templateData.templates);
      }
    } catch (err) {
      console.error('Error loading assignments data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (targetType: 'theme' | 'bundle', targetId: string, templateId: string) => {
    setSavingId(`${targetType}-${targetId}`);
    try {
      const res = await fetch('/api/admin/video-templates/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          videoTemplateId: templateId || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessId(`${targetType}-${targetId}`);
        setTimeout(() => setSuccessId(null), 3000);
        
        // Update local state
        if (targetType === 'theme') {
          setThemes(prev => prev.map(t => t.id === targetId ? {
            ...t,
            videoTemplate: templates.find(temp => temp.id === templateId) || null
          } : t));
        } else {
          setBundles(prev => prev.map(b => b.id === targetId ? {
            ...b,
            videoTemplate: templates.find(temp => temp.id === templateId) || null
          } : b));
        }
      }
    } catch (err) {
      console.error('Failed to update assignment:', err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#b38b40' }} />
        <p style={{ color: '#4B5563', fontSize: '0.9rem' }}>Loading Assignments Manager...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/admin/video-templates" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6B7280', textDecoration: 'none', fontSize: '0.85rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Templates</span>
            </Link>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0.5rem 0 0.25rem 0' }}>Template Assignments</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Tag your uploaded video templates to specific Themes or individual Bundles.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Themes Assignments Card */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: '#b38b40' }} />
            <span>Theme Assignments</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            Tagging a template to a Theme makes it the default video for all bundles belonging to this theme.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {themes.map(theme => {
              const currentAssignKey = `theme-${theme.id}`;
              const isSaving = savingId === currentAssignKey;
              const isSuccess = successId === currentAssignKey;

              return (
                <div key={theme.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2937', margin: 0 }}>{theme.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Theme ID: {theme.id}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid #D1D5DB', borderRadius: '6px', background: 'white', outline: 'none', width: '220px' }}
                      value={theme.videoTemplate?.id || ''}
                      onChange={e => handleAssign('theme', theme.id, e.target.value)}
                      disabled={isSaving}
                    >
                      <option value="">Default Rajputana Teaser</option>
                      {templates.map(temp => (
                        <option key={temp.id} value={temp.id}>{temp.name}</option>
                      ))}
                    </select>

                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSaving && <Loader2 size={16} className="animate-spin" style={{ color: '#b38b40' }} />}
                      {isSuccess && <Check size={16} style={{ color: '#10B981' }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bundles Assignments Card */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} style={{ color: '#3B82F6' }} />
            <span>Bundle-Specific Assignments</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            Override the theme video for specific bundles (e.g. if the Gold Package gets a different template than Silver).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bundles.map(bundle => {
              const currentAssignKey = `bundle-${bundle.id}`;
              const isSaving = savingId === currentAssignKey;
              const isSuccess = successId === currentAssignKey;

              return (
                <div key={bundle.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2937', margin: 0 }}>{bundle.BundleName}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Theme: {bundle.themeRef?.name || 'None'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid #D1D5DB', borderRadius: '6px', background: 'white', outline: 'none', width: '220px' }}
                      value={bundle.videoTemplate?.id || ''}
                      onChange={e => handleAssign('bundle', bundle.id, e.target.value)}
                      disabled={isSaving}
                    >
                      <option value="">Inherit Theme Template</option>
                      {templates.map(temp => (
                        <option key={temp.id} value={temp.id}>{temp.name}</option>
                      ))}
                    </select>

                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSaving && <Loader2 size={16} className="animate-spin" style={{ color: '#b38b40' }} />}
                      {isSuccess && <Check size={16} style={{ color: '#10B981' }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
