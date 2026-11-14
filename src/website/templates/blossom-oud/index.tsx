'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { WebsiteTemplateProps } from '../types';
import { useWeddingTemplateData } from '../shared/useWeddingTemplateData';
import './blossom-oud.css';

const ASSET_BASE = '/website-templates/blossom-oud/assets';

interface TimelineItem {
  time: string;
  title: string;
}

const DEFAULT_TIMELINE: TimelineItem[] = [
  { time: '16:00', title: 'Welcome Reception' },
  { time: '17:00', title: 'Nikah Ceremony' },
  { time: '19:00', title: 'Dinner' },
  { time: '20:00', title: 'Party' },
];

export default function BlossomOudTemplate({
  wedding,
  isPreview = false,
}: WebsiteTemplateProps) {
  const {
    brideName,
    groomName,
    primaryDateStr,
    venueLocation,
    venueCity,
    events,
    step,
    status,
    setStatus,
    guestName,
    setGuestName,
    handleSubmit,
  } = useWeddingTemplateData(wedding, isPreview);

  // Determine whether we are showing sample/default preview data
  const isDefaultSample = useMemo(() => {
    const pair = `${brideName} ${groomName}`.toLowerCase();
    return (
      !wedding ||
      pair.includes('anjali') ||
      pair.includes('rahul') ||
      pair.includes('aarav') ||
      pair.includes('meera') ||
      pair.includes('priya')
    );
  }, [wedding, brideName, groomName]);

  const displayBride = isDefaultSample
    ? 'Amira'
    : brideName.split(' ')[0] || 'Amira';
  const displayGroom = isDefaultSample
    ? 'Yusuf'
    : groomName.split(' ')[0] || 'Yusuf';

  const displayDateLabel = useMemo(() => {
    if (isDefaultSample || !primaryDateStr) return '20 Mai 2027';
    try {
      const d = new Date(primaryDateStr);
      if (Number.isNaN(d.getTime())) return '20 Mai 2027';
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '20 Mai 2027';
    }
  }, [isDefaultSample, primaryDateStr]);

  const displayTimeLabel = 'à partir de 16h';
  const displayVenueName = isDefaultSample
    ? 'Beldi Country Club'
    : venueLocation || 'Beldi Country Club';
  const displayVenueCity = isDefaultSample
    ? 'Marrakech, Morocco'
    : venueCity || 'Marrakech, Morocco';

  const timelineItems: TimelineItem[] = useMemo(() => {
    if (isDefaultSample || !events || events.length === 0) {
      return DEFAULT_TIMELINE;
    }
    const mapped = events.slice(0, 4).map((ev, idx) => ({
      time: ev.formattedTime || ev.time || DEFAULT_TIMELINE[idx]?.time || '16:00',
      title: ev.displayTitle || ev.name || DEFAULT_TIMELINE[idx]?.title || 'Ceremony',
    }));
    while (mapped.length < 4) {
      mapped.push(DEFAULT_TIMELINE[mapped.length]);
    }
    return mapped;
  }, [isDefaultSample, events]);

  // Envelope state
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [envelopeDone, setEnvelopeDone] = useState(false);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showAudioControl, setShowAudioControl] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Hero canvas video ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Timeline scroll-scrubbing flower state
  const timelineRecRef = useRef<HTMLDivElement | null>(null);
  const [flowerOffset, setFlowerOffset] = useState({ y: 0, rot: 0 });

  // Countdown state
  const [countdown, setCountdown] = useState({
    days: 370,
    hours: 12,
    minutes: 25,
    seconds: 15,
  });

  // RSVP form local fields
  const [guestCount, setGuestCount] = useState('');
  const [localSubmitted, setLocalSubmitted] = useState(false);

  const handleOpenEnvelope = () => {
    if (envelopeOpening) return;
    setEnvelopeOpening(true);
    setShowAudioControl(true);

    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }

    window.setTimeout(() => {
      setEnvelopeDone(true);
    }, 4100);
  };

  const handleToggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlayingAudio(false);
    }
  };

  // Hero Canvas Video with Bottom 20% Alpha Fade (Exact replica of inline-scripts.js)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = document.createElement('video');
    video.src = `${ASSET_BASE}/hero-video.mp4`;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    let animId = 0;
    const drawFrame = () => {
      if (video.readyState >= 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const fadeHeight = canvas.height * 0.2;
        const fadeStart = canvas.height - fadeHeight;
        const gradient = ctx.createLinearGradient(0, fadeStart, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, fadeStart, canvas.width, fadeHeight);
        ctx.globalCompositeOperation = 'source-over';
      }
      animId = window.requestAnimationFrame(drawFrame);
    };

    video.play().catch(() => {});
    animId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(animId);
      video.pause();
      video.src = '';
    };
  }, []);

  // Countdown Timer (Target: 2027-05-20T00:00:00 or custom wedding date)
  useEffect(() => {
    const targetIso =
      !isDefaultSample && primaryDateStr
        ? primaryDateStr
        : '2027-05-20T00:00:00';
    const targetTime = new Date(targetIso).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;
      if (Number.isNaN(diff) || diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timer);
  }, [isDefaultSample, primaryDateStr]);

  // Scroll-scrubbing flower along Timeline (#rec2443433773)
  useEffect(() => {
    const handleScroll = () => {
      const el = timelineRecRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Start scrubbing when timeline top enters lower half of viewport
      const startY = vh * 0.68;
      const endY = vh * 0.18;
      const rawProgress = (startY - rect.top) / (startY - endY + 180);
      const progress = Math.max(0, Math.min(1, rawProgress));
      // Keyframes from Tilda SBS: my: 0 -> 80 -> 169 -> 247px, ro: 0 -> 44 -> 88 -> 134deg
      setFlowerOffset({
        y: progress * 247,
        rot: progress * 134,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scroll-reveal elements
  useEffect(() => {
    const nodes = document.querySelectorAll(
      '.bo-reveal, .bo-reveal-zoom, .bo-reveal-left, .bo-reveal-right'
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('bo-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [envelopeOpening]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setLocalSubmitted(true);
    try {
      await handleSubmit(e);
    } catch {
      // Fallback handled by localSubmitted state
    }
  };

  return (
    <div className={`blossom-oud-root ${!envelopeOpening ? 'bo-locked' : ''}`}>
      {/* Background Audio Track */}
      <audio
        ref={audioRef}
        id="invitation-audio"
        src={`${ASSET_BASE}/moghram-audio.mp3`}
        loop
        preload="auto"
      />

      {/* Floating Olive-Sage Audio Play/Pause Control (#rec2443433703) */}
      {showAudioControl && (
        <button
          type="button"
          className="bo-audio-control"
          onClick={handleToggleAudio}
          aria-label={isPlayingAudio ? 'Pause music' : 'Play music'}
        >
          {isPlayingAudio ? (
            <svg viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* ====================================================================
          RECORD 1 (#rec2443433693) — 4-Flap Envelope & Wax Seal Overlay
          ==================================================================== */}
      <div
        id="rec2443433693"
        className={`r t-rec ${envelopeOpening ? 'bo-envelope-opening' : ''} ${
          envelopeDone ? 'bo-envelope-done' : ''
        }`}
      >
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            {/* Right Flap */}
            <div className="t396__elem tn-elem" data-elem-id="1773848137949">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/envelope-flap.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Left Flap */}
            <div className="t396__elem tn-elem" data-elem-id="1780755508216000001">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/envelope-flap.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Bottom Flap */}
            <div className="t396__elem tn-elem" data-elem-id="1773847988093">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/envelope-flap.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Top Flap */}
            <div className="t396__elem tn-elem" data-elem-id="1773847892509">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/envelope-top.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Floral Line Under Prompt */}
            <div className="t396__elem tn-elem" data-elem-id="1779615926470000001">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-flower.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Wax Seal Button (.popup-enter) */}
            <div
              className="t396__elem tn-elem popup-enter"
              data-elem-id="1773847037346"
              onClick={handleOpenEnvelope}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
              }}
              aria-label="Appuyez pour ouvrir"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/wax-seal.png`}
                  alt="Open Invitation Seal"
                />
              </div>
            </div>

            {/* Prompt Text: Appuyez pour ouvrir */}
            <div
              className="t396__elem tn-elem"
              data-elem-id="1777183175514000001"
              onClick={handleOpenEnvelope}
            >
              <div className="tn-atom">Appuyez pour ouvrir</div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 3 (#rec2443433723) — Animated Video Hero with Canvas Fade
          ==================================================================== */}
      <div id="rec2443433723" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            {/* Canvas Video Container */}
            <div className="t396__elem tn-elem" data-elem-id="1776948113983">
              <div className="tn-atom">
                <canvas
                  ref={canvasRef}
                  id="fadeCanvas"
                  width={440}
                  height={782}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Couple Names */}
            <div
              className={`t396__elem tn-elem bo-reveal ${
                envelopeOpening ? 'bo-visible' : ''
              }`}
              data-elem-id="1779566247730000001"
              style={{ transitionDelay: envelopeOpening ? '2.4s' : '0s' }}
            >
              <div className="tn-atom">
                {displayBride}
                <br />
                <br />
                <br />
                {displayGroom}
              </div>
            </div>

            {/* Ampersand */}
            <div
              className={`t396__elem tn-elem bo-reveal ${
                envelopeOpening ? 'bo-visible' : ''
              }`}
              data-elem-id="1779566247730000004"
              style={{ transitionDelay: envelopeOpening ? '2.5s' : '0s' }}
            >
              <div className="tn-atom">&amp;</div>
            </div>

            {/* Wedding Date */}
            <div
              className={`t396__elem tn-elem bo-reveal ${
                envelopeOpening ? 'bo-visible' : ''
              }`}
              data-elem-id="1779566247730000003"
              style={{ transitionDelay: envelopeOpening ? '2.6s' : '0s' }}
            >
              <div className="tn-atom">{displayDateLabel}</div>
            </div>

            {/* Wedding Start Time */}
            <div
              className={`t396__elem tn-elem bo-reveal ${
                envelopeOpening ? 'bo-visible' : ''
              }`}
              data-elem-id="1779626065755000001"
              style={{ transitionDelay: envelopeOpening ? '2.7s' : '0s' }}
            >
              <div className="tn-atom">{displayTimeLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 4 (#rec2443433743) — Ornate Botanical Arch Invitation Card
          ==================================================================== */}
      <div id="rec2443433743" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            {/* Botanical Arch Frame */}
            <div className="t396__elem tn-elem" data-elem-id="1779613840466">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/frame-arch.png`}
                  alt=""
                />
              </div>
            </div>

            {/* TopBismillah Calligraphy */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779471640878"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/bismillah-calligraphy.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Pulsing Vector Emblem */}
            <div className="t396__elem tn-elem" data-elem-id="1779542665396">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/emblem-vector.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Arabic Invitation Verse & Message */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779624381838000001"
              style={{ transitionDelay: '0.15s' }}
            >
              <div className="tn-atom">
                بارك الله لكما وبارك عليكما وجمع بينكما في خير
                <br />
                <br />
                أميـرة و يوسـف
                <br />
                <br />
                يسرّهما دعوتكم لحضور حفل زفافهما ومشاركتهما فرحة هذا اليوم المبارك
                <br />
                <br />
                يوم 20 مايو 2027
                <br />
                ابتداءً من الساعة الرابعة مساءً
                <br />
                في
              </div>
            </div>

            {/* Venue Script Name */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779472210551000005"
              style={{ transitionDelay: '0.25s' }}
            >
              <div className="tn-atom">{displayVenueName}</div>
            </div>

            {/* Bottom Floral Line */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779471050704"
              style={{ transitionDelay: '0.35s' }}
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-flower.png`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 5 (#rec2443433753) — Countdown ("La Célébration Commence")
          ==================================================================== */}
      <div id="rec2443433753" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1771277026942000001"
            >
              <div className="tn-atom">La Célébration Commence</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal-zoom"
              data-elem-id="1779543504626"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-divider2.png`}
                  alt=""
                />
              </div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1771277551711000001"
              style={{ transitionDelay: '0.2s' }}
            >
              <div className="tn-atom">
                <div id="countdownContainer">
                  <div className="time-block">
                    <div className="number">{countdown.days}</div>
                    <div className="label">Days</div>
                  </div>
                  <div className="separator">:</div>
                  <div className="time-block">
                    <div className="number">{countdown.hours}</div>
                    <div className="label">Hours</div>
                  </div>
                  <div className="separator">:</div>
                  <div className="time-block">
                    <div className="number">{countdown.minutes}</div>
                    <div className="label">Minutes</div>
                  </div>
                  <div className="separator">:</div>
                  <div className="time-block">
                    <div className="number">{countdown.seconds}</div>
                    <div className="label">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 6 (#rec2443433773) — Event Timeline ("Chronologie de l'événement")
          ==================================================================== */}
      <div id="rec2443433773" className="r t-rec" ref={timelineRecRef}>
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1771277026942000001"
            >
              <div className="tn-atom">Chronologie de l&apos;événement</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal-zoom"
              data-elem-id="1779543504626"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-divider2.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Vertical Gold Spine */}
            <div
              className="t396__elem tn-elem"
              data-elem-id="1780760554668000010"
            >
              <div className="tn-atom">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2"
                  height="258"
                  viewBox="0 0 2 258"
                  fill="none"
                >
                  <path d="M1 0V258" stroke="#af9b6a" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* 4 Diamond Node Markers */}
            <div
              className="t396__elem tn-elem"
              data-elem-id="1780760766910000019"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/timeline-diamond.png`}
                  alt=""
                />
              </div>
            </div>
            <div className="t396__elem tn-elem" data-elem-id="1780760688963">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/timeline-diamond.png`}
                  alt=""
                />
              </div>
            </div>
            <div
              className="t396__elem tn-elem"
              data-elem-id="1780760716135000016"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/timeline-diamond.png`}
                  alt=""
                />
              </div>
            </div>
            <div
              className="t396__elem tn-elem"
              data-elem-id="1780760740624000017"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/timeline-diamond.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Scroll-Driven Rotating Flower */}
            <div
              className="t396__elem tn-elem"
              data-elem-id="1780760554668000015"
              style={{
                transform: `translate3d(0, ${flowerOffset.y.toFixed(
                  1
                )}px, 0) rotate(${flowerOffset.rot.toFixed(1)}deg)`,
              }}
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/flower-decor.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Row 1 (16:00 — Welcome Reception) */}
            <div
              className="t396__elem tn-elem bo-timeline-time bo-reveal-left"
              style={{ top: '182px' }}
            >
              <div className="tn-atom">{timelineItems[0].time}</div>
            </div>
            <div
              className="t396__elem tn-elem bo-timeline-label bo-reveal-right"
              style={{ top: '184px' }}
            >
              <div className="tn-atom">{timelineItems[0].title}</div>
            </div>

            {/* Row 2 (17:00 — Nikah Ceremony) */}
            <div
              className="t396__elem tn-elem bo-timeline-time bo-reveal-left"
              style={{ top: '264px', transitionDelay: '0.12s' }}
            >
              <div className="tn-atom">{timelineItems[1].time}</div>
            </div>
            <div
              className="t396__elem tn-elem bo-timeline-label bo-reveal-right"
              style={{ top: '266px', transitionDelay: '0.12s' }}
            >
              <div className="tn-atom">{timelineItems[1].title}</div>
            </div>

            {/* Row 3 (19:00 — Dinner) */}
            <div
              className="t396__elem tn-elem bo-timeline-time bo-reveal-left"
              style={{ top: '352px', transitionDelay: '0.24s' }}
            >
              <div className="tn-atom">{timelineItems[2].time}</div>
            </div>
            <div
              className="t396__elem tn-elem bo-timeline-label bo-reveal-right"
              style={{ top: '365px', transitionDelay: '0.24s' }}
            >
              <div className="tn-atom">{timelineItems[2].title}</div>
            </div>

            {/* Row 4 (20:00 — Party) */}
            <div
              className="t396__elem tn-elem bo-timeline-time bo-reveal-left"
              style={{ top: '429px', transitionDelay: '0.36s' }}
            >
              <div className="tn-atom">{timelineItems[3].time}</div>
            </div>
            <div
              className="t396__elem tn-elem bo-timeline-label bo-reveal-right"
              style={{ top: '442px', transitionDelay: '0.36s' }}
            >
              <div className="tn-atom">{timelineItems[3].title}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 7 (#rec2443433783) — Venue ("Lieu")
          ==================================================================== */}
      <div id="rec2443433783" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1771277026942000001"
            >
              <div className="tn-atom">Lieu</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal-zoom"
              data-elem-id="1779543504626"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-divider2.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Floating Map Pin */}
            <div className="t396__elem tn-elem" data-elem-id="1779544675299">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/map-pin.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Venue Title */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779544773135"
            >
              <div className="tn-atom">{displayVenueName}</div>
            </div>

            {/* Venue City */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779545032699000001"
              style={{ transitionDelay: '0.15s' }}
            >
              <div className="tn-atom">{displayVenueCity}</div>
            </div>

            {/* Illustrated Venue Sketch */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1780761005554"
              style={{ transitionDelay: '0.25s' }}
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/venue-sketch.png`}
                  alt={displayVenueName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 8 (#rec2443433793) — Dress Code & Color Palette
          ==================================================================== */}
      <div id="rec2443433793" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1771277026942000001"
            >
              <div className="tn-atom">Dress Code</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal-zoom"
              data-elem-id="1779543504626"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-divider2.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Illustrated Couple */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1780772300356"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/dress-code-couple.png`}
                  alt="Dress Code"
                />
              </div>
            </div>

            {/* Dress Code Description */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779544773135"
              style={{ transitionDelay: '0.15s' }}
            >
              <div className="tn-atom">
                We kindly invite you to dress in elegant attire that reflects the
                style and spirit of our special day.
              </div>
            </div>

            {/* Color Palette Subheading */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1780768374065000001"
              style={{ transitionDelay: '0.25s' }}
            >
              <div className="tn-atom">Color palette</div>
            </div>

            {/* 4 Color Swatches: #60603b, #360c1a, #40312c, #efdfcd */}
            {[
              { color: '#60603b', offset: -132, delay: '0.15s' },
              { color: '#360c1a', offset: -63, delay: '0.3s' },
              { color: '#40312c', offset: 6, delay: '0.45s' },
              { color: '#efdfcd', offset: 75, delay: '0.6s' },
            ].map((swatch) => (
              <React.Fragment key={swatch.color}>
                <div
                  className="t396__elem tn-elem bo-swatch-ring bo-reveal"
                  style={{
                    left: `calc(50% + ${swatch.offset}px)`,
                    transitionDelay: swatch.delay,
                  }}
                >
                  <div className="tn-atom" />
                </div>
                <div
                  className="t396__elem tn-elem bo-swatch-fill bo-reveal"
                  style={{
                    left: `calc(50% + ${swatch.offset + 1}px)`,
                    transitionDelay: swatch.delay,
                  }}
                >
                  <div
                    className="tn-atom"
                    style={{ backgroundColor: swatch.color }}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 9 (#rec2443433803) — Ladies & Gentlemen Attire Notes
          ==================================================================== */}
      <div id="rec2443433803" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1780767478919000003"
            >
              <div className="tn-atom">Ladies</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1780767449362000001"
              style={{ transitionDelay: '0.12s' }}
            >
              <div className="tn-atom">
                Formal dresses in elegant, polished styles are encouraged.
              </div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1780767518772000004"
              style={{ transitionDelay: '0.24s' }}
            >
              <div className="tn-atom">Gentlemen</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1780767518772000005"
              style={{ transitionDelay: '0.36s' }}
            >
              <div className="tn-atom">
                Well-tailored suits with classic dress shoes are preferred.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 10 (#rec2443433813) — RSVP ("Confirmez Votre Présence")
          ==================================================================== */}
      <div id="rec2443433813" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1771277026942000001"
            >
              <div className="tn-atom">Confirmez Votre Présence</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal-zoom"
              data-elem-id="1779543504626"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-divider2.png`}
                  alt=""
                />
              </div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779545532876"
              style={{ transitionDelay: '0.18s' }}
            >
              <div className="tn-atom">
                <form className="bo-rsvp-form" onSubmit={handleRsvpSubmit}>
                  <input
                    type="text"
                    className="bo-rsvp-input"
                    placeholder="Nom"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className="bo-rsvp-input"
                    placeholder="Nombre de personnes"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    required
                  />

                  <div>
                    <div className="bo-rsvp-question">Serez-vous présent?</div>
                    <div className="bo-rsvp-radios">
                      <label className="bo-rsvp-radio-label">
                        <input
                          type="radio"
                          name="bo-attending"
                          checked={status === 'attending'}
                          onChange={() => setStatus('attending')}
                        />
                        <span>Oui, je serai présent(e)</span>
                      </label>
                      <label className="bo-rsvp-radio-label">
                        <input
                          type="radio"
                          name="bo-attending"
                          checked={status === 'declined'}
                          onChange={() => setStatus('declined')}
                        />
                        <span>Désolé(e), je ne pourrai pas être présent(e)</span>
                      </label>
                    </div>
                  </div>

                  <div className="bo-rsvp-submit-wrap">
                    <button type="submit" className="bo-rsvp-submit">
                      SOUMETTRE
                    </button>
                  </div>

                  {(localSubmitted || step === 'SUCCESS') && (
                    <div className="bo-rsvp-success">
                      Merci ! Votre réponse a bien été enregistrée.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 11 (#rec2443433823 & #rec2443433843) — Google Maps Itinerary
          ==================================================================== */}
      <div id="rec2443433823" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1771277026942000001"
            >
              <div className="tn-atom">Itinéraire Google Maps</div>
            </div>

            <div
              className="t396__elem tn-elem bo-reveal-zoom"
              data-elem-id="1779543504626"
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/line-divider2.png`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="rec2443433843" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            <div className="bo-map-embed-wrap">
              <iframe
                title={`Google Maps - ${displayVenueName}`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.972115987615!2d-8.027354924591644!3d31.579814374186812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee4fad60222f%3A0x6a9a653912b8c80!2sBeldi%20Country%20Club!5e0!3m2!1sen!2sus!4v1773673322346!5m2!1sen!2sus"
                width="335"
                height="335"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="t396__elem tn-elem" data-elem-id="1773673546575">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/map-frame.svg`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 12 (#rec2443433853) — Closing Chandelier & Farewell
          ==================================================================== */}
      <div id="rec2443433853" className="r t-rec">
        <div className="t396">
          <div className="t396__artboard">
            <div className="t396__carrier" />
            <div className="t396__filter" />

            {/* Swinging Crystal Chandelier */}
            <div className="t396__elem tn-elem" data-elem-id="1779550300881">
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/chandelier.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Farewell Text */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1763405219328"
            >
              <div className="tn-atom">Au plaisir de vous accueillir</div>
            </div>

            {/* Decorative Flourish Line */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779625933115000002"
              style={{ transitionDelay: '0.15s' }}
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/decor-line.png`}
                  alt=""
                />
              </div>
            </div>

            {/* Fine-Line Monogram Flower */}
            <div
              className="t396__elem tn-elem bo-reveal"
              data-elem-id="1779625933115000001"
              style={{ transitionDelay: '0.25s' }}
            >
              <div className="tn-atom">
                <img
                  className="tn-atom__img"
                  src={`${ASSET_BASE}/monogram-flower.png`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECORD 13 (#rec2443433863) — Fixed Ambient Overlay Video (#bgVideo)
          ==================================================================== */}
      <div className="bo-ambient-video-overlay" aria-hidden="true">
        <video
          id="bgVideo"
          src={`${ASSET_BASE}/bg-video.mp4`}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}
