'use client';

import React, { useEffect, useState } from 'react';
import { Player } from '@remotion/player';
import { MainComposition } from '../../../remotion-templates/compositions/MainComposition';
import { Download, Film, Loader2, Play } from 'lucide-react';
import styles from './VideoInviteCard.module.css';

interface VideoInviteCardProps {
  orderId: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  eventType?: string;
  themeColor?: string;
  slide1Bg?: string;
  slide2Bg?: string;
  slide3Bg?: string;
  slide4Bg?: string;
  slide5Bg?: string;
}

export const VideoInviteCard: React.FC<VideoInviteCardProps> = ({
  orderId,
  groomName,
  brideName,
  eventDate,
  eventTime,
  venue,
  eventType = 'Wedding',
  themeColor = '#b38b40',
  slide1Bg,
  slide2Bg,
  slide3Bg,
  slide4Bg,
  slide5Bg,
}) => {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<'PENDING' | 'RENDERING' | 'DONE' | 'FAILED' | 'IDLE'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isPollerActive, setIsPollerActive] = useState(false);

  // Trigger video render when component mounts
  useEffect(() => {
    async function triggerRender() {
      try {
        const res = await fetch('/api/videos/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            slide1Bg,
            slide2Bg,
            slide3Bg,
            slide4Bg,
            slide5Bg,
          }),
        });
        const data = await res.json();
        if (data.success && data.jobId) {
          setJobId(data.jobId);
          setStatus('PENDING');
          setIsPollerActive(true);
        }
      } catch (err) {
        console.error('Error triggering video render:', err);
      }
    }
    triggerRender();
  }, [orderId]);

  // Poll status while job is rendering
  useEffect(() => {
    if (!jobId || !isPollerActive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/videos/status/${jobId}`);
        const data = await res.json();
        
        if (data.status) {
          setStatus(data.status);
          setProgress(data.progress || 0);
          if (data.outputUrl) {
            setOutputUrl(data.outputUrl);
          }

          if (data.status === 'DONE' || data.status === 'FAILED') {
            setIsPollerActive(false);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Error polling render status:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [jobId, isPollerActive]);

  const inputProps = {
    groomName,
    brideName,
    eventDate,
    eventTime,
    venue,
    eventType,
    themeColor,
    slide1Bg,
    slide2Bg,
    slide3Bg,
    slide4Bg,
    slide5Bg,
  };

  return (
    <div className={styles.videoInviteCard}>
      <h2 className={styles.cardTitle}>
        <Film size={20} />
        <span>Video Invitation</span>
        {status === 'PENDING' && <span className={`${styles.badge} ${styles.badgePending}`}>Queued</span>}
        {status === 'RENDERING' && (
          <span className={`${styles.badge} ${styles.badgeRendering}`}>Rendering {progress}%</span>
        )}
        {status === 'DONE' && <span className={`${styles.badge} ${styles.badgeDone}`}>Ready</span>}
      </h2>

      <div className={styles.playerWrapper}>
        <Player
          component={MainComposition}
          inputProps={inputProps}
          durationInFrames={30 * 30} // 30 seconds (900 frames)
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
        />

        {(status === 'PENDING' || status === 'RENDERING') && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {status === 'PENDING' ? 'Waiting in Queue...' : `Rendering MP4... ${progress}%`}
            </span>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnDownload}
          disabled={status !== 'DONE' || !outputUrl}
          onClick={() => {
            if (outputUrl) {
              const link = document.createElement('a');
              link.href = outputUrl;
              link.download = `wedding_invite_${brideName}_and_${groomName}.mp4`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          {status !== 'DONE' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Preparing MP4 Download...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download MP4 Video</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
