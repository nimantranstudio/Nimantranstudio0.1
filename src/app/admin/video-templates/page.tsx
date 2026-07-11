'use client';

import React, { useEffect, useState } from 'react';
import { Player } from '@remotion/player';
import { MainComposition } from '../../../../remotion-templates/compositions/MainComposition';
import { DynamicVideo } from '../../../../remotion-templates/compositions/DynamicVideo';
import { Eye, Film, Play, Settings2, Sliders, Upload, Tag, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminVideoTemplatesPage() {
  // Compositions and custom templates state
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('default');
  const [loading, setLoading] = useState(true);

  // Form Fields Mock Data
  const [groomName, setGroomName] = useState('Rahul');
  const [brideName, setBrideName] = useState('Anjali');
  const [eventDate, setEventDate] = useState('14th February 2026');
  const [eventTime, setEventTime] = useState('6:30 PM');
  const [venue, setVenue] = useState('Grand Palace Resort, Rajasthan, India');
  const [eventType, setEventType] = useState('Wedding');
  const [themeColor, setThemeColor] = useState('#b38b40');

  // Default composition backgrounds
  const [musicUrl, setMusicUrl] = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  const [slide1Bg, setSlide1Bg] = useState('/assets/themes/rajputana/save-the-date.png');
  const [slide2Bg, setSlide2Bg] = useState('/assets/themes/rajputana/haldi-invite.png');
  const [slide3Bg, setSlide3Bg] = useState('/assets/themes/rajputana/mehendi-invite.png');
  const [slide4Bg, setSlide4Bg] = useState('/assets/themes/rajputana/sangeet-invite.png');
  const [slide5Bg, setSlide5Bg] = useState('/assets/themes/rajputana/wedding-invite.png');
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);

  // JSON Template Upload State
  const [newTemplateName, setNewTemplateName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/admin/video-templates');
      const data = await res.json();
      if (data.success) {
        setCustomTemplates(data.templates);
      }
    } catch (err) {
      console.error('Failed to load video templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideNum: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlide(slideNum);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (slideNum === 1) setSlide1Bg(data.url);
        if (slideNum === 2) setSlide2Bg(data.url);
        if (slideNum === 3) setSlide3Bg(data.url);
        if (slideNum === 4) setSlide4Bg(data.url);
        if (slideNum === 5) setSlide5Bg(data.url);
      }
    } catch (err) {
      console.error('Failed to upload slide background:', err);
    } finally {
      setUploadingSlide(null);
    }
  };

  // Client-side schema validation for JSON configuration
  const validateJSONSchema = (config: any): string | null => {
    if (!config) return 'JSON configuration file is empty';
    if (typeof config !== 'object') return 'Configuration must be a JSON object';
    if (typeof config.width !== 'number') return 'Missing width parameter';
    if (typeof config.height !== 'number') return 'Missing height parameter';
    if (typeof config.fps !== 'number') return 'Missing fps parameter';
    if (!Array.isArray(config.scenes)) return 'Missing scenes array';
    if (config.scenes.length === 0) return 'Scenes array must contain at least one scene';
    
    for (let i = 0; i < config.scenes.length; i++) {
      const scene = config.scenes[i];
      if (typeof scene.durationInFrames !== 'number') return `Scene ${i} is missing durationInFrames`;
      if (!Array.isArray(scene.layers)) return `Scene ${i} is missing layers array`;
      for (let j = 0; j < scene.layers.length; j++) {
        const l = scene.layers[j];
        if (!l.type || !['background', 'text', 'image', 'video', 'audio'].includes(l.type)) {
          return `Layer ${j} in Scene ${i} has invalid type`;
        }
        if (typeof l.value !== 'string') return `Layer ${j} in Scene ${i} is missing value string`;
      }
    }
    return null;
  };

  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(false);

    if (!newTemplateName.trim()) {
      setUploadError('Please provide a template name first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Validate Schema
        const schemaErr = validateJSONSchema(json);
        if (schemaErr) {
          setUploadError(`Schema Error: ${schemaErr}`);
          return;
        }

        setUploadingTemplate(true);
        const res = await fetch('/api/admin/video-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newTemplateName,
            config: json,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setUploadSuccess(true);
          setNewTemplateName('');
          fetchTemplates();
        } else {
          setUploadError(data.error || 'Failed to upload template.');
        }
      } catch (err: any) {
        setUploadError('Failed to parse JSON file. Ensure file is valid JSON format.');
      } finally {
        setUploadingTemplate(false);
      }
    };
    reader.readAsText(file);
  };

  // Find active custom template config
  const activeCustomTemplate = customTemplates.find(t => t.id === selectedTemplateId);

  // Setup DynamicVideo parameters or fallback standard params
  const isDynamic = selectedTemplateId !== 'default';
  const playerComponent = isDynamic ? DynamicVideo : MainComposition;

  // Calculate dynamic duration in frames
  let durationInFrames = 30 * 30; // default 30s
  if (isDynamic && activeCustomTemplate) {
    const scenes = activeCustomTemplate.config.scenes || [];
    const totalFrames = scenes.reduce((sum: number, sc: any) => sum + (sc.durationInFrames || 0), 0);
    if (totalFrames > 0) durationInFrames = totalFrames;
  }

  const defaultInputProps = {
    groomName,
    brideName,
    eventDate,
    eventTime,
    venue,
    eventType,
    themeColor,
    musicUrl,
    slide1Bg,
    slide2Bg,
    slide3Bg,
    slide4Bg,
    slide5Bg,
  };

  const dynamicInputProps = {
    templateConfig: activeCustomTemplate?.config || {},
    userData: {
      groomName,
      brideName,
      eventDate,
      eventTime,
      venue,
      eventType,
      themeColor,
    },
  };

  const activeInputProps = isDynamic ? dynamicInputProps : defaultInputProps;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftCol}>
        
        {/* Available Compositions Selection Card */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>
              <Film size={18} />
              <span>Available Compositions</span>
            </h2>
            <Link 
              href="/admin/video-templates/assignments" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#b38b40',
                textDecoration: 'none',
                background: '#fefbeb',
                border: '1px solid #fef3c7',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <Tag size={12} />
              <span>Manage Assignments</span>
            </Link>
          </div>

          <div className={styles.templateList}>
            {/* Hardcoded Default Template Button */}
            <button 
              className={`${styles.templateBtn} ${selectedTemplateId === 'default' ? styles.active : ''}`}
              onClick={() => setSelectedTemplateId('default')}
            >
              <div className={styles.templateThumb}>
                <div style={{ backgroundColor: themeColor, width: '100%', height: '100%', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={20} style={{ color: themeColor }} />
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Rajputana Traditional Teaser</p>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0' }}>30 Seconds · 9:16 Vertical (Hardcoded)</p>
              </div>
            </button>

            {/* Dynamic Templates Uploaded by Admin */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Loader2 size={20} className="animate-spin" style={{ color: '#b38b40' }} />
              </div>
            ) : (
              customTemplates.map(temp => (
                <button
                  key={temp.id}
                  className={`${styles.templateBtn} ${selectedTemplateId === temp.id ? styles.active : ''}`}
                  onClick={() => setSelectedTemplateId(temp.id)}
                >
                  <div className={styles.templateThumb}>
                    <div style={{ backgroundColor: '#EEF2F6', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={20} style={{ color: '#3B82F6' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{temp.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0' }}>
                      {Math.round((temp.config.scenes.reduce((s: number, sc: any) => s + (sc.durationInFrames || 0), 0)) / (temp.config.fps || 30))}s · Dynamic JSON
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Upload Custom JSON Template Card */}
        <div className={styles.card} style={{ marginTop: '1.5rem' }}>
          <h2 className={styles.cardTitle}>
            <Upload size={18} />
            <span>Upload JSON Video Template</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '-0.75rem 0 1rem 0' }}>
            Upload a structured JSON configuration declaring visual scenes, layered text styles, coordinates, and transitions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className={styles.label}>Template Identifier Name</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Modern Pastel Sangeet"
                value={newTemplateName}
                onChange={e => setNewTemplateName(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                disabled={uploadingTemplate}
                style={{ fontSize: '0.8rem' }}
              />
              {uploadingTemplate && <Loader2 size={16} className="animate-spin" style={{ color: '#b38b40' }} />}
            </div>

            {uploadError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#EF4444', padding: '0.65rem', borderRadius: '6px', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ECFDF5', border: '1px solid #D1FAE5', color: '#10B981', padding: '0.65rem', borderRadius: '6px', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>Template uploaded & validated successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Controls / Live Parameters */}
        <div className={styles.card} style={{ marginTop: '1.5rem' }}>
          <h2 className={styles.cardTitle}>
            <Sliders size={18} />
            <span>Interactive Parameter Sandbox</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '-0.75rem 0 1rem 0' }}>
            Modify values below to instantly preview dynamic variable replacements inside the video player.
          </p>
          
          <div className={styles.formGrid}>
            <div>
              <label className={styles.label}>Bride Name</label>
              <input type="text" className={styles.input} value={brideName} onChange={e => setBrideName(e.target.value)} />
            </div>
            <div>
              <label className={styles.label}>Groom Name</label>
              <input type="text" className={styles.input} value={groomName} onChange={e => setGroomName(e.target.value)} />
            </div>
            <div>
              <label className={styles.label}>Event Type</label>
              <select className={styles.select} value={eventType} onChange={e => setEventType(e.target.value)}>
                <option value="Wedding">Wedding</option>
                <option value="Haldi">Haldi</option>
                <option value="Mehendi">Mehendi</option>
                <option value="Sangeet">Sangeet</option>
                <option value="Reception">Reception</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Theme Accent Color</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="color" className={styles.colorPicker} value={themeColor} onChange={e => setThemeColor(e.target.value)} />
                <input type="text" className={styles.input} style={{ flex: 1 }} value={themeColor} onChange={e => setThemeColor(e.target.value)} />
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className={styles.label}>Date Line</label>
              <input type="text" className={styles.input} value={eventDate} onChange={e => setEventDate(e.target.value)} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className={styles.label}>Time Line</label>
              <input type="text" className={styles.input} value={eventTime} onChange={e => setEventTime(e.target.value)} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className={styles.label}>Venue Address</label>
              <textarea rows={2} className={styles.textarea} value={venue} onChange={e => setVenue(e.target.value)} />
            </div>
            
            {/* Show background asset upload configurations ONLY for default composition */}
            {!isDynamic && (
              <>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '0.5rem 0' }} />
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.75rem' }}>Asset Customization</h3>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Background Audio Track URL</label>
                  <input type="text" className={styles.input} value={musicUrl} onChange={e => setMusicUrl(e.target.value)} placeholder="MP3 Link" />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Slide 1 Background (Save The Date)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={e => handleBgUpload(e, 1)} style={{ fontSize: '0.8rem' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {uploadingSlide === 1 ? 'Uploading...' : slide1Bg}
                    </span>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Slide 2 Background (Haldi)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={e => handleBgUpload(e, 2)} style={{ fontSize: '0.8rem' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {uploadingSlide === 2 ? 'Uploading...' : slide2Bg}
                    </span>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Slide 3 Background (Mehendi)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={e => handleBgUpload(e, 3)} style={{ fontSize: '0.8rem' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {uploadingSlide === 3 ? 'Uploading...' : slide3Bg}
                    </span>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Slide 4 Background (Sangeet)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={e => handleBgUpload(e, 4)} style={{ fontSize: '0.8rem' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {uploadingSlide === 4 ? 'Uploading...' : slide4Bg}
                    </span>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Slide 5 Background (Wedding Ceremony)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={e => handleBgUpload(e, 5)} style={{ fontSize: '0.8rem' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {uploadingSlide === 5 ? 'Uploading...' : slide5Bg}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.rightCol}>
        {/* Live Playback Card */}
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} style={{ color: '#4B5563' }} />
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Live Player Preview</span>
            </div>
            <span className={styles.statusBadge}>
              {isDynamic ? 'Dynamic Config Sandbox' : 'In-Browser Renderer'}
            </span>
          </div>
          
          <div className={styles.playerContainer}>
            <Player
              component={playerComponent}
              inputProps={activeInputProps}
              durationInFrames={durationInFrames}
              fps={isDynamic ? (activeCustomTemplate?.config.fps || 30) : 30}
              compositionWidth={isDynamic ? (activeCustomTemplate?.config.width || 1080) : 1080}
              compositionHeight={isDynamic ? (activeCustomTemplate?.config.height || 1920) : 1920}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
            />
          </div>
        </div>
      </div>
    </div>
  );
}
