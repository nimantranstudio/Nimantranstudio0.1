'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { WebsiteTemplateProps } from '../types';
import { WebsiteTemplateFonts } from '../shared/fonts';
import { useWeddingTemplateData } from '../shared/useWeddingTemplateData';
import { TemplateAudioToggle, type ChromeThemeVars } from '../shared/TemplateChrome';
import { parseWeddingDate } from '@/lib/format-date';
import './royale.css';

const ASSET_BASE = '/website-templates/garden-of-love/royale';

const ROYALE_CHROME_THEME: ChromeThemeVars = {
    bg: '#fde5c9',
    surface: '#fdf2e1',
    ink: '#560f31',
    muted: '#8c5a2c',
    accent: '#800033',
    border: 'rgba(254, 182, 105, 0.55)',
    fontDisplay: '"Fraunces", Georgia, serif',
    fontSans: '"Sora", system-ui, sans-serif',
};

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS_LIST = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTHS_LONG = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const CONFETTI_BEADS = [
    `${ASSET_BASE}/confetti1.svg`,
    `${ASSET_BASE}/confetti2.svg`,
    `${ASSET_BASE}/confetti3.svg`,
];

interface GalleryItemConfig {
    id: string;
    kind: 'photo' | 'story';
    orient?: 'portrait' | 'landscape';
    hang: number;
    caption?: string;
    photoUrl?: string;
    storyText?: string;
}

function getCeremonyIllustration(title: string, eventType?: string, index = 0): string {
    const t = `${title} ${eventType || ''}`.toLowerCase();
    if (t.includes('ring') || t.includes('engagement') || t.includes('roka') || t.includes('sagai')) {
        return `${ASSET_BASE}/ring_ceremony.webp`;
    }
    if (t.includes('mehendi') || t.includes('mehndi') || t.includes('henna')) {
        return `${ASSET_BASE}/mehendi.webp`;
    }
    if (t.includes('haldi') || t.includes('turmeric') || t.includes('pithi') || t.includes('tel')) {
        return `${ASSET_BASE}/haldi.webp`;
    }
    if (t.includes('sangeet') || t.includes('music') || t.includes('cocktail') || t.includes('garba') || t.includes('dandiya')) {
        return `${ASSET_BASE}/sangeet.webp`;
    }
    if (t.includes('reception') || t.includes('dinner') || t.includes('party') || t.includes('banquet')) {
        return `${ASSET_BASE}/reception.webp`;
    }
    if (t.includes('vivaah') || t.includes('vivah') || t.includes('wedding') || t.includes('shaadi') || t.includes('phera') || t.includes('muhurtham') || t.includes('lagna')) {
        return `${ASSET_BASE}/vivaah.webp`;
    }
    const fallbacks = [
        `${ASSET_BASE}/ring_ceremony.webp`,
        `${ASSET_BASE}/mehendi.webp`,
        `${ASSET_BASE}/haldi.webp`,
        `${ASSET_BASE}/sangeet.webp`,
        `${ASSET_BASE}/vivaah.webp`,
        `${ASSET_BASE}/reception.webp`,
    ];
    return fallbacks[index % fallbacks.length];
}

function splitParentsPair(raw?: string | null, fallbackA?: string, fallbackB?: string): { a: string; b?: string } {
    const cleaned = cleanTextLocal(raw);
    if (!cleaned) {
        return { a: fallbackA || '', b: fallbackB };
    }
    const parts = cleaned
        .split(/\s+(?:&|and)\s+/i)
        .map((p) => p.trim())
        .filter(Boolean);
    if (parts.length >= 2) {
        const firstHasHonorific = /\b(mr|mrs|smt|shri|sri|dr|late)\b/i.test(parts[0]);
        const secondHasHonorific = /\b(mr|mrs|smt|shri|sri|dr|late)\b/i.test(parts[1]);
        if (!firstHasHonorific && !secondHasHonorific) {
            return { a: `Shri ${parts[0]}`, b: `Smt. ${parts[1]}` };
        }
        return { a: parts[0], b: parts.slice(1).join(' & ') };
    }
    return { a: cleaned };
}

function joinNamesList(arr: string[]): string {
    if (arr.length <= 1) return arr[0] || '';
    return `${arr.slice(0, -1).join(', ')} & ${arr[arr.length - 1]}`;
}

function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

function icsEscape(s: string): string {
    return String(s || '').replace(/([,;\\])/g, '\\$1');
}

export default function GardenOfLoveTemplate({ wedding, isPreview = false }: WebsiteTemplateProps) {
    const data = useWeddingTemplateData(wedding, isPreview);
    const rawWedding = wedding as any;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const gateRef = useRef<HTMLDivElement | null>(null);
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);
    const coupleHeadingRef = useRef<HTMLHeadingElement | null>(null);

    const dateSectionRef = useRef<HTMLElement | null>(null);
    const dateStageRef = useRef<HTMLDivElement | null>(null);
    const dayStripRef = useRef<HTMLDivElement | null>(null);
    const monthStripRef = useRef<HTMLDivElement | null>(null);
    const yearStripRef = useRef<HTMLDivElement | null>(null);
    const dayPlaqueRef = useRef<HTMLDivElement | null>(null);
    const monthPlaqueRef = useRef<HTMLDivElement | null>(null);
    const yearPlaqueRef = useRef<HTMLDivElement | null>(null);
    const lotusCrownRef = useRef<HTMLImageElement | null>(null);

    const pavilionImgRef = useRef<HTMLImageElement | null>(null);
    const galleryScrollRef = useRef<HTMLDivElement | null>(null);
    const galleryHintRef = useRef<HTMLDivElement | null>(null);

    const outroSectionRef = useRef<HTMLElement | null>(null);
    const outroImgRef = useRef<HTMLImageElement | null>(null);

    // 1. Gate Opening State (Exact royale-app.js choreography)
    const [isGateOpen, setIsGateOpen] = useState(false);
    const [isGateHidden, setIsGateHidden] = useState(false);
    const [guestGreeting, setGuestGreeting] = useState('Dear Guest');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const toParam = (params.get('to') || params.get('guest') || '').trim();
        if (toParam) {
            setGuestGreeting(toParam);
        }
        if (params.get('opened') === 'true') {
            setIsGateOpen(true);
            setIsGateHidden(true);
        }

        // Preload confetti SVGs so first burst is never blank
        CONFETTI_BEADS.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        // Arm hero video only on mobile (< 700px), matching royale-app.js
        const vid = heroVideoRef.current;
        if (vid && window.matchMedia('(max-width: 699px)').matches) {
            vid.poster = `${ASSET_BASE}/garden_palace_poster.webp`;
            vid.src = `${ASSET_BASE}/garden_palace.mp4`;
        }
    }, []);

    // Lock document scroll while the gate cover is closed
    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (!isGateOpen && !isGateHidden) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prevOverflow;
            };
        } else {
            document.body.style.overflow = '';
        }
    }, [isGateOpen, isGateHidden]);

    const handleOpenGate = useCallback(() => {
        if (isGateOpen) return;
        setIsGateOpen(true);
        data.setIsCoverOpen(true);

        const vid = heroVideoRef.current;
        if (
            vid &&
            vid.src &&
            typeof window !== 'undefined' &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            vid.currentTime = 0;
            vid.play().catch(() => {});
        }

        const reduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hideDelay = reduced ? 30 : 2900;
        window.setTimeout(() => {
            setIsGateHidden(true);
            coupleHeadingRef.current?.focus({ preventScroll: true });
        }, hideDelay);
    }, [isGateOpen, data]);

    const handleGateKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenGate();
            }
        },
        [handleOpenGate]
    );

    // 2. Dynamic Couple & Lineage Values
    const brideDisplay = data.brideName || 'Anjali';
    const groomDisplay = data.groomName || 'Rahul';

    const groomParentsSplit = useMemo(
        () =>
            splitParentsPair(
                data.rawGroomParents || data.groomParentsFormatted,
                `Shri Ramesh & Smt. Sunita (${groomDisplay}'s Parents)`
            ),
        [data.rawGroomParents, data.groomParentsFormatted, groomDisplay]
    );

    const brideParentsSplit = useMemo(
        () =>
            splitParentsPair(
                data.rawBrideParents || data.brideParentsFormatted,
                `Shri Rajesh & Smt. Meera (${brideDisplay}'s Parents)`
            ),
        [data.rawBrideParents, data.brideParentsFormatted, brideDisplay]
    );

    // 3. Unrolling Scrolls (Exact royale-app.js IntersectionObserver threshold: 0.35)
    const scrollRefs = useRef<Record<string, HTMLElement | null>>({});
    const [armedScrolls, setArmedScrolls] = useState(false);
    const [unrolledScrolls, setUnrolledScrolls] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        setArmedScrolls(true);
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const key = (entry.target as HTMLElement).dataset.scrollKey;
                    if (key) {
                        setUnrolledScrolls((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.35 }
        );

        Object.values(scrollRefs.current).forEach((el) => {
            if (el) io.observe(el);
        });

        return () => io.disconnect();
    }, []);

    // 4. Date Reveal (Exact royale-date-reveal.js slot dials + knock + 52 howdah confetti beads)
    const targetWeddingDate = useMemo(() => {
        const parsed = parseWeddingDate(data.primaryDateStr);
        if (parsed) {
            return {
                year: parsed.getFullYear(),
                month: parsed.getMonth() + 1,
                day: parsed.getDate(),
            };
        }
        const fallback = new Date();
        fallback.setDate(fallback.getDate() + 15);
        return {
            year: fallback.getFullYear(),
            month: fallback.getMonth() + 1,
            day: fallback.getDate(),
        };
    }, [data.primaryDateStr]);

    const [datePhase, setDatePhase] = useState<'idle' | 'revealing' | 'revealed'>('idle');
    const [btnPressed, setBtnPressed] = useState(false);
    const [saidDateText, setSaidDateText] = useState('');
    const dateSpentRef = useRef(false);

    const spawnHowdahConfetti = useCallback(() => {
        const stage = dateStageRef.current;
        if (!stage || typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const elephants = stage.querySelectorAll<HTMLElement>('.royale-date__elephant');
        if (!elephants.length) return;

        const layer = document.createElement('div');
        layer.className = 'royale-date__confetti';
        layer.setAttribute('aria-hidden', 'true');
        stage.appendChild(layer);

        const box = stage.getBoundingClientRect();
        const unit = box.width / 100;
        const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

        elephants.forEach((el) => {
            const r = el.getBoundingClientRect();
            const isLeft = el.classList.contains('royale-date__elephant--left');
            const x = r.left - box.left + r.width * (isLeft ? 0.42 : 0.58);
            const y = r.top - box.top + r.height * 0.08;
            const dir = isLeft ? 1 : -1;

            for (let i = 0; i < 26; i++) {
                const flakeEl = document.createElement('i');
                const arcEl = document.createElement('i');
                const beadEl = document.createElement('img');
                const w = rand(1.6, 3.1) * unit;

                flakeEl.className = 'ryd-flake';
                arcEl.className = 'ryd-flake__arc';
                beadEl.className = 'ryd-flake__bead';
                beadEl.src = CONFETTI_BEADS[(Math.random() * CONFETTI_BEADS.length) | 0];
                beadEl.alt = '';

                flakeEl.style.left = `${x.toFixed(1)}px`;
                flakeEl.style.top = `${y.toFixed(1)}px`;
                flakeEl.style.setProperty('--w', `${w.toFixed(1)}px`);
                flakeEl.style.setProperty(
                    '--dx',
                    `${((rand(6, 30) * dir + rand(-6, 6)) * unit).toFixed(1)}px`
                );
                flakeEl.style.setProperty('--rise', `${(-rand(12, 30) * unit).toFixed(1)}px`);
                flakeEl.style.setProperty('--fall', `${(rand(10, 30) * unit).toFixed(1)}px`);
                flakeEl.style.setProperty('--rot', `${(rand(-540, 540) | 0)}deg`);
                flakeEl.style.setProperty('--dur', `${rand(2200, 3400).toFixed(0)}ms`);
                flakeEl.style.setProperty('--delay', `${rand(0, 420).toFixed(0)}ms`);

                arcEl.appendChild(beadEl);
                flakeEl.appendChild(arcEl);
                layer.appendChild(flakeEl);
            }
        });

        window.setTimeout(() => {
            if (layer.parentNode) layer.parentNode.removeChild(layer);
        }, 4200);
    }, []);

    const handleRevealDate = useCallback(() => {
        if (dateSpentRef.current) return;
        dateSpentRef.current = true;

        setDatePhase('revealing');
        setBtnPressed(true);
        window.setTimeout(() => setBtnPressed(false), 180);

        const dayCells = { all: DAYS_LIST, index: Math.max(0, targetWeddingDate.day - 1) };
        const monthCells = { all: MONTHS_LIST, index: Math.max(0, targetWeddingDate.month - 1) };
        const yearsAll: string[] = [];
        for (let y = targetWeddingDate.year - 4; y <= targetWeddingDate.year + 3; y++) {
            yearsAll.push(String(y));
        }
        const yearCells = {
            all: yearsAll,
            index: Math.max(0, yearsAll.indexOf(String(targetWeddingDate.year))),
        };

        const reduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const announceText = `${targetWeddingDate.day} ${
            MONTHS_LONG[targetWeddingDate.month - 1] || ''
        } ${targetWeddingDate.year}`;

        if (reduced) {
            const pairs: Array<[HTMLDivElement | null, HTMLDivElement | null, { all: string[]; index: number }]> = [
                [dayPlaqueRef.current, dayStripRef.current, dayCells],
                [monthPlaqueRef.current, monthStripRef.current, monthCells],
                [yearPlaqueRef.current, yearStripRef.current, yearCells],
            ];
            pairs.forEach(([plaque, strip, cells], i) => {
                if (!plaque || !strip) return;
                strip.innerHTML = `<span class="royale-date__cell">${cells.all[cells.index]}</span>`;
                plaque.classList.add('is-fading');
                window.setTimeout(() => plaque.classList.add('is-shown'), 90 + i * 260);
            });
            setSaidDateText(announceText);
            window.setTimeout(() => {
                setDatePhase('revealed');
            }, 90 + 2 * 260 + 420);
            return;
        }

        const rollStrip = (
            strip: HTMLDivElement | null,
            cells: { all: string[]; index: number },
            loops: number,
            duration: number
        ) => {
            if (!strip) return;
            let seq: string[] = [''];
            for (let l = 0; l < loops; l++) seq = seq.concat(cells.all);
            seq = seq.concat(cells.all.slice(0, cells.index + 1));

            strip.innerHTML = seq
                .map((v) => `<span class="royale-date__cell">${v}</span>`)
                .join('');
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            void strip.offsetHeight;
            strip.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
            strip.style.transform = `translateY(calc(${-(seq.length - 1)} * var(--cell-h)))`;
        };

        rollStrip(dayStripRef.current, dayCells, 2, 1750);
        rollStrip(monthStripRef.current, monthCells, 2, 2250);
        rollStrip(yearStripRef.current, yearCells, 2, 2750);

        window.setTimeout(() => {
            spawnHowdahConfetti();
            [dayPlaqueRef.current, monthPlaqueRef.current, yearPlaqueRef.current].forEach(
                (plaque, i) => {
                    if (!plaque) return;
                    window.setTimeout(() => {
                        plaque.classList.add('is-set');
                        window.setTimeout(() => plaque.classList.remove('is-set'), 420);
                    }, 90 + i * 90);
                }
            );
        }, 2750);

        window.setTimeout(() => {
            setDatePhase('revealed');
            setSaidDateText(announceText);
        }, 2750 + 420);
    }, [targetWeddingDate, spawnHowdahConfetti]);

    // 5. Parallax Drifts for Lotus Crown & Pavilion (royale-scroll.js)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let rafId = 0;
        const updateDrifts = () => {
            rafId = 0;
            const vh = window.innerHeight || 1;
            if (lotusCrownRef.current) {
                const r = lotusCrownRef.current.getBoundingClientRect();
                const p = Math.min(1, Math.max(0, 1 - (r.top + r.height * 0.5) / (vh + r.height)));
                const yPct = 6 - p * 12;
                lotusCrownRef.current.style.transform = `translate3d(0, ${yPct.toFixed(2)}%, 0)`;
            }
            if (pavilionImgRef.current) {
                const r = pavilionImgRef.current.getBoundingClientRect();
                const p = Math.min(1, Math.max(0, 1 - (r.top + r.height * 0.5) / (vh + r.height)));
                const yPct = 3 - p * 6;
                pavilionImgRef.current.style.transform = `translate3d(0, ${yPct.toFixed(2)}%, 0)`;
            }
        };

        const onScroll = () => {
            if (!rafId) rafId = window.requestAnimationFrame(updateDrifts);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        updateDrifts();
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    // 6. Hanging 3D Picture Frame Gallery Items & Physics (Exact royale-gallery.js)
    const galleryFrames: GalleryItemConfig[] = useMemo(() => {
        const imgs = data.customGalleryImages || [];
        const rawStory = cleanTextLocal(rawWedding?.story) || '';
        const storyChunks = rawStory
            ? rawStory.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
            : [];

        return [
            {
                id: 'gf-1',
                kind: 'photo',
                orient: 'portrait',
                hang: 118,
                caption: '#howitstarted',
                photoUrl: imgs[0],
            },
            {
                id: 'gf-2',
                kind: 'photo',
                orient: 'landscape',
                hang: 150,
                caption: '#adventures',
                photoUrl: imgs[1],
            },
            {
                id: 'gf-3',
                kind: 'story',
                hang: 86,
                storyText:
                    storyChunks[0] ||
                    'Some stories begin with grand gestures. Ours started with a simple conversation.',
            },
            {
                id: 'gf-4',
                kind: 'photo',
                orient: 'portrait',
                hang: 132,
                caption: '#thelittlethings',
                photoUrl: imgs[2],
            },
            {
                id: 'gf-5',
                kind: 'photo',
                orient: 'landscape',
                hang: 100,
                caption: '#everyday',
                photoUrl: imgs[3],
            },
            {
                id: 'gf-6',
                kind: 'story',
                hang: 120,
                storyText:
                    storyChunks[1] ||
                    "Friendship grew into something more, and we realized life's best moments were the ones we shared together.",
            },
            {
                id: 'gf-7',
                kind: 'photo',
                orient: 'portrait',
                hang: 150,
                caption: '#foreverbegins',
                photoUrl: imgs[4],
            },
            {
                id: 'gf-8',
                kind: 'photo',
                orient: 'landscape',
                hang: 92,
                caption: '#usforever',
                photoUrl: imgs[5],
            },
        ];
    }, [data.customGalleryImages, rawWedding?.story]);

    useEffect(() => {
        const viewport = galleryScrollRef.current;
        const hint = galleryHintRef.current;
        if (!viewport || typeof window === 'undefined') return;

        const frames = Array.from(viewport.querySelectorAll<HTMLElement>('.gframe'));
        if (!frames.length) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const items = frames.map((el, i) => {
            const hang = parseFloat(el.style.getPropertyValue('--hang')) || 110;
            const scale = Math.sqrt(110 / hang);
            return {
                el,
                body: el.querySelector<HTMLElement>('.gframe__body'),
                angle: 0,
                vel: 0,
                yaw: 0,
                yawVel: 0,
                stiffness: 0.055 * scale * (0.92 + ((i * 7) % 5) * 0.04),
                damping: 0.885,
                phase: i * 1.3,
                freq: 0.0014 * scale,
            };
        });

        let lastScroll = viewport.scrollLeft;
        let lastT = performance.now();
        let vSmooth = 0;
        let rafId = 0;
        let inView = false;

        const MAX_ANGLE = 20;
        const MAX_YAW = 26;
        const IMPULSE = 0.22;
        const YAW_IMPULSE = 0.28;
        const IDLE_AMP = 0.9;
        const IDLE_YAW = 2.2;

        const tick = (now: number) => {
            const dt = Math.min(40, Math.max(4, now - lastT));
            lastT = now;

            const s = viewport.scrollLeft;
            const vInstant = ((s - lastScroll) / dt) * 16.67;
            lastScroll = s;
            vSmooth += (vInstant - vSmooth) * 0.35;

            for (const it of items) {
                it.vel += -vSmooth * IMPULSE * it.stiffness;
                it.vel += -it.stiffness * it.angle;
                it.vel *= it.damping;
                it.angle += it.vel;
                if (it.angle > MAX_ANGLE) {
                    it.angle = MAX_ANGLE;
                    it.vel *= 0.4;
                }
                if (it.angle < -MAX_ANGLE) {
                    it.angle = -MAX_ANGLE;
                    it.vel *= 0.4;
                }

                it.yawVel += -vSmooth * YAW_IMPULSE * it.stiffness;
                it.yawVel += -it.stiffness * 0.85 * it.yaw;
                it.yawVel *= it.damping;
                it.yaw += it.yawVel;
                if (it.yaw > MAX_YAW) {
                    it.yaw = MAX_YAW;
                    it.yawVel *= 0.4;
                }
                if (it.yaw < -MAX_YAW) {
                    it.yaw = -MAX_YAW;
                    it.yawVel *= 0.4;
                }

                const idle = Math.sin(now * it.freq + it.phase) * IDLE_AMP;
                const idleYaw = Math.cos(now * it.freq * 0.85 + it.phase) * IDLE_YAW;

                it.el.style.transform = `rotate(${(it.angle + idle).toFixed(2)}deg)`;
                if (it.body) {
                    it.body.style.transform = `rotateY(${(it.yaw + idleYaw).toFixed(2)}deg)`;
                }
            }

            if (inView) {
                rafId = window.requestAnimationFrame(tick);
            } else {
                rafId = 0;
            }
        };

        const start = () => {
            if (!reduced && !rafId) {
                lastT = performance.now();
                lastScroll = viewport.scrollLeft;
                rafId = window.requestAnimationFrame(tick);
            }
        };

        const io = new IntersectionObserver(
            (entries) => {
                inView = entries[0]?.isIntersecting ?? false;
                if (inView) start();
            },
            { threshold: 0.05 }
        );
        io.observe(viewport);

        let hintHidden = false;
        const onScroll = () => {
            if (!hintHidden && hint && viewport.scrollLeft > 8) {
                hintHidden = true;
                hint.classList.add('is-hidden');
            }
            if (inView) start();
        };
        viewport.addEventListener('scroll', onScroll, { passive: true });

        // Drag-to-scroll on desktop
        let dragging = false;
        let startX = 0;
        let scrollStart = 0;

        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            dragging = true;
            startX = e.pageX;
            scrollStart = viewport.scrollLeft;
            viewport.classList.add('is-dragging');
            e.preventDefault();
        };
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            viewport.scrollLeft = scrollStart - (e.pageX - startX);
        };
        const onMouseUp = () => {
            if (!dragging) return;
            dragging = false;
            viewport.classList.remove('is-dragging');
        };

        viewport.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            io.disconnect();
            viewport.removeEventListener('scroll', onScroll);
            viewport.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    // 7. Ceremonies Cards IntersectionObserver Rise (royale-app.js threshold: 0.25)
    const ceremonyCardRefs = useRef<Record<string, HTMLElement | null>>({});
    const [armedCeremonies, setArmedCeremonies] = useState(false);
    const [visibleCeremonies, setVisibleCeremonies] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        setArmedCeremonies(true);
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = (entry.target as HTMLElement).dataset.ceremonyId;
                    if (id) {
                        setVisibleCeremonies((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.25 }
        );

        Object.values(ceremonyCardRefs.current).forEach((el) => {
            if (el) io.observe(el);
        });

        return () => io.disconnect();
    }, [data.events.length]);

    // 8. Outro Closing Scene Mouse-Follow Pan (Exact royale-outro.js)
    useEffect(() => {
        const section = outroSectionRef.current;
        const bg = outroImgRef.current;
        if (!section || !bg || typeof window === 'undefined') return;

        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!canHover.matches || reduceMotion.matches) return;

        const MAX_SHIFT = 12;
        const EASE = 0.08;
        const target = { x: 0, y: 0 };
        const pos = { x: 0, y: 0 };
        let rafId = 0;

        const tick = () => {
            pos.x += (target.x - pos.x) * EASE;
            pos.y += (target.y - pos.y) * EASE;

            const tx = (-pos.x * MAX_SHIFT).toFixed(2);
            const ty = (-pos.y * MAX_SHIFT).toFixed(2);
            bg.style.transform = `scale(1.06) translate3d(${tx}px, ${ty}px, 0)`;

            if (Math.abs(target.x - pos.x) > 0.001 || Math.abs(target.y - pos.y) > 0.001) {
                rafId = window.requestAnimationFrame(tick);
            } else {
                rafId = 0;
            }
        };

        const startLoop = () => {
            if (!rafId) rafId = window.requestAnimationFrame(tick);
        };

        const onPointerMove = (e: PointerEvent) => {
            const rect = section.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            target.x = Math.max(-1, Math.min(1, nx));
            target.y = Math.max(-1, Math.min(1, ny));
            startLoop();
        };

        const onPointerLeave = () => {
            target.x = 0;
            target.y = 0;
            startLoop();
        };

        section.addEventListener('pointermove', onPointerMove);
        section.addEventListener('pointerleave', onPointerLeave);
        return () => {
            section.removeEventListener('pointermove', onPointerMove);
            section.removeEventListener('pointerleave', onPointerLeave);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    // 9. Social Modal State (Exact royale-social.js markup & classes)
    const [activeModal, setActiveModal] = useState<'none' | 'instagram' | 'location' | 'calendar'>('none');
    const [selectedCalendarDayIdx, setSelectedCalendarDayIdx] = useState<number | null>(null);

    const openSocialModal = useCallback((kind: 'instagram' | 'location' | 'calendar') => {
        setSelectedCalendarDayIdx(null);
        setActiveModal(kind);
    }, []);

    const closeSocialModal = useCallback(() => {
        setActiveModal('none');
        setSelectedCalendarDayIdx(null);
    }, []);

    useEffect(() => {
        if (activeModal === 'none' || typeof document === 'undefined') return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSocialModal();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [activeModal, closeSocialModal]);

    // Grouped locations (matching royale-social.js `locations()`)
    const groupedLocations = useMemo(() => {
        const out: Array<{
            names: string[];
            ceremonies: string;
            venue: string;
            rest: string;
            address: string;
            mapLink?: string;
        }> = [];

        data.events.forEach((evt) => {
            const addr = (evt.venueText || '').trim();
            if (!addr) return;
            let entry = out.find((x) => x.address.toLowerCase() === addr.toLowerCase());
            if (!entry) {
                const parts = addr.split(',').map((s) => s.trim()).filter(Boolean);
                entry = {
                    names: [],
                    ceremonies: '',
                    venue: parts[0] || addr,
                    rest: parts.slice(1).join(', '),
                    address: addr,
                    mapLink: evt.mapLink,
                };
                out.push(entry);
            }
            if (!entry.names.includes(evt.displayTitle)) {
                entry.names.push(evt.displayTitle);
            }
        });

        out.forEach((l) => {
            l.ceremonies = joinNamesList(l.names);
        });
        return out;
    }, [data.events]);

    // Grouped calendar days (matching royale-social.js `days()`)
    const groupedCalendarDays = useMemo(() => {
        const out: Array<{
            ymd: string;
            nextYmd: string;
            dateIso: string;
            dateLabel: string;
            namesJoined: string;
            desc: string;
            venue: string;
        }> = [];

        const map = new Map<
            string,
            {
                parsed: Date;
                dateLabel: string;
                items: Array<{ name: string; timeLabel: string; venue: string }>;
            }
        >();

        data.events.forEach((evt) => {
            const parsed =
                parseWeddingDate(evt.date, evt.time || '10:00') ||
                new Date(targetWeddingDate.year, targetWeddingDate.month - 1, targetWeddingDate.day, 10, 0);
            const key = `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
            if (!map.has(key)) {
                map.set(key, {
                    parsed,
                    dateLabel: evt.shortDateLabel || evt.formattedDate,
                    items: [],
                });
            }
            map.get(key)!.items.push({
                name: evt.displayTitle,
                timeLabel: evt.formattedTime.replace(/\s*onwards$/i, ''),
                venue: evt.venueText,
            });
        });

        map.forEach((val, dateIso) => {
            const nextD = new Date(val.parsed.getTime());
            nextD.setDate(nextD.getDate() + 1);
            const ymd = dateIso.replace(/-/g, '');
            const nextYmd = `${nextD.getFullYear()}${pad2(nextD.getMonth() + 1)}${pad2(nextD.getDate())}`;
            const namesJoined = joinNamesList(val.items.map((c) => c.name));
            const desc = val.items
                .map(
                    (c) =>
                        `${c.name}${c.timeLabel ? ` - ${c.timeLabel}` : ''}${
                            c.venue ? ` · ${c.venue}` : ''
                        }`
                )
                .join('\n');
            out.push({
                ymd,
                nextYmd,
                dateIso,
                dateLabel: val.dateLabel,
                namesJoined,
                desc,
                venue: val.items[0]?.venue || '',
            });
        });

        return out;
    }, [data.events, targetWeddingDate]);

    const downloadCalendarIcs = useCallback(
        (daysList: typeof groupedCalendarDays, filename: string) => {
            const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const vevents: string[] = [];
            daysList.forEach((d) => {
                vevents.push(
                    'BEGIN:VEVENT',
                    `UID:ry-day-${d.ymd}@invitation`,
                    `DTSTAMP:${stamp}`,
                    `DTSTART;VALUE=DATE:${d.ymd}`,
                    `DTEND;VALUE=DATE:${d.nextYmd}`,
                    `SUMMARY:${icsEscape(d.namesJoined)}`,
                    `DESCRIPTION:${icsEscape(d.desc).replace(/\n/g, '\\n')}`,
                    `LOCATION:${icsEscape(d.venue)}`,
                    'BEGIN:VALARM',
                    'TRIGGER:-P1D',
                    'ACTION:DISPLAY',
                    `DESCRIPTION:${icsEscape(d.namesJoined)}`,
                    'END:VALARM',
                    'END:VEVENT'
                );
            });
            const ics = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Balcony Shahi Patra//EN',
                'CALSCALE:GREGORIAN',
                ...vevents,
                'END:VCALENDAR',
            ].join('\r\n');

            const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1500);
        },
        []
    );

    // 10. Per-Ceremony RSVP Attendance Pills State (synced with overall RSVP status)
    const [eventChoices, setEventChoices] = useState<Record<string, 'yes' | 'maybe' | 'no'>>({});

    useEffect(() => {
        const initial: Record<string, 'yes' | 'maybe' | 'no'> = {};
        data.events.forEach((evt) => {
            initial[evt.id] = 'yes';
        });
        setEventChoices(initial);
    }, [data.events]);

    const handleEventChoiceChange = useCallback(
        (eventId: string, val: 'yes' | 'maybe' | 'no') => {
            setEventChoices((prev) => {
                const next = { ...prev, [eventId]: val };
                const vals = Object.values(next);
                if (vals.some((v) => v === 'yes')) {
                    data.setStatus('attending');
                } else if (vals.some((v) => v === 'maybe')) {
                    data.setStatus('maybe');
                } else {
                    data.setStatus('declined');
                }
                return next;
            });
        },
        [data]
    );

    const instagramHref =
        cleanTextLocal(rawWedding?.instagramUrl || rawWedding?.instagram) ||
        'https://www.instagram.com/';

    return (
        <div ref={rootRef} className={`royale-root${isGateOpen ? ' is-open' : ''}`}>
            <WebsiteTemplateFonts />

            {/* Floating background music controller */}
            <TemplateAudioToggle
                audioUrl={data.audioUrl}
                autoPlayTrigger={isGateOpen}
                disabled={isPreview}
                theme={ROYALE_CHROME_THEME}
            />

            {/* ===================================================================
                1. THE GATE: Fixed 3D Cover Over Hero (Exact royale-index.html)
               =================================================================== */}
            {!isGateHidden && (
                <div
                    ref={gateRef}
                    className="royale-gate"
                    id="ryGate"
                    role="button"
                    tabIndex={0}
                    aria-label="Open the invitation"
                    onClick={handleOpenGate}
                    onKeyDown={handleGateKeyDown}
                >
                    <div className="royale-gate__flap royale-gate__flap--start" aria-hidden="true">
                        <span className="royale-gate__flap-pattern" />
                    </div>
                    <div className="royale-gate__flap royale-gate__flap--end" aria-hidden="true">
                        <span className="royale-gate__flap-pattern" />
                    </div>

                    <div className="royale-gate__door royale-gate__door--start" aria-hidden="true" />
                    <div className="royale-gate__door royale-gate__door--end" aria-hidden="true" />

                    <div
                        className="royale-gate__decor royale-gate__decor--sprig-left"
                        aria-hidden="true"
                    >
                        <img
                            className="royale-gate__floral"
                            src={`${ASSET_BASE}/floral1.png`}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div
                        className="royale-gate__decor royale-gate__decor--sprig-right"
                        aria-hidden="true"
                    >
                        <img
                            className="royale-gate__floral"
                            src={`${ASSET_BASE}/floral1.png`}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div
                        className="royale-gate__decor royale-gate__decor--elephant-left"
                        aria-hidden="true"
                    >
                        <img
                            className="royale-gate__elephant"
                            src={`${ASSET_BASE}/elephant.png`}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div
                        className="royale-gate__decor royale-gate__decor--elephant-right"
                        aria-hidden="true"
                    >
                        <img
                            className="royale-gate__elephant"
                            src={`${ASSET_BASE}/elephant.png`}
                            alt=""
                            draggable={false}
                        />
                    </div>

                    <div className="royale-card">
                        <span className="royale-card__motif" aria-hidden="true" />
                        <span className="royale-card__symbol" aria-hidden="true" />
                        <p className="royale-card__mantra" id="ryInvocation" lang="sa">
                            श्री गणेशाय नमः
                        </p>
                        <p className="royale-card__guest" id="ryGuestGreeting">
                            {guestGreeting}
                        </p>
                        <p className="royale-card__note" id="ryIntroNote">
                            we cordially invite you to grace the auspicious occasion of the marriage
                            of&hellip;
                        </p>

                        <span className="royale-card__cue ry-plaque" aria-hidden="true">
                            <svg
                                className="ry-plaque__frame"
                                viewBox="0 0 300 78"
                                fill="none"
                                focusable="false"
                            >
                                <g filter="url(#ryCueInset)">
                                    <path
                                        className="ry-plaque__fill"
                                        d="M8 34C6.5 36.5 6 38.5 4 39C6 39.5 6.5 41.5 8 44C9.5 46.5 10 49 12.5 49C12.6667 53.3333 15.8 62 27 62C26.8333 66 28.6 74 37 74H263C271.4 74 273.167 66 273 62C284.2 62 287.333 53.3333 287.5 49C290 49 290.5 46.5 292 44C293.5 41.5 294 39.5 296 39C294 38.5 293.5 36.5 292 34C290.5 31.5 290 29 287.5 29C287.333 24.6667 284.2 16 273 16C273.167 12 271.4 4 263 4H37C28.6 4 26.8333 12 27 16C15.8 16 12.6667 24.6667 12.5 29C10 29 9.5 31.5 8 34Z"
                                    />
                                    <path
                                        d="M263 2C267.981 2 271.145 4.44 272.937 7.4854C274.202 9.6369 274.772 12.0548 274.947 14.085C280.075 14.5379 283.629 16.7741 285.938 19.6123C287.975 22.1148 288.979 24.9996 289.342 27.3438C289.618 27.4542 289.883 27.588 290.135 27.751C290.87 28.2274 291.393 28.8593 291.789 29.4531C292.178 30.0368 292.511 30.6895 292.8 31.2598C293.105 31.8629 293.384 32.4193 293.715 32.9707C294.122 33.6496 294.46 34.2913 294.745 34.8311C295.042 35.3931 295.268 35.8159 295.495 36.1689C295.917 36.8249 296.177 36.9825 296.485 37.0596C297.376 37.2822 298 38.0823 298 39C298 39.9177 297.376 40.7178 296.485 40.9404C296.177 41.0175 295.917 41.1751 295.495 41.8311C295.268 42.1841 295.042 42.6069 294.745 43.1689C294.46 43.7087 294.122 44.3504 293.715 45.0293C293.384 45.5807 293.105 46.1371 292.8 46.7402C292.511 47.3105 292.178 47.9632 291.789 48.5469C291.393 49.1407 290.87 49.7726 290.135 50.249C289.883 50.4119 289.618 50.5449 289.342 50.6553C288.979 52.9996 287.975 55.8849 285.938 58.3877C283.629 61.2258 280.075 63.4611 274.947 63.9141C274.772 65.9444 274.203 68.3627 272.937 70.5146C271.145 73.56 267.981 76 263 76H37C32.0188 76 28.8553 73.56 27.0635 70.5146C25.7974 68.3627 25.2269 65.9445 25.0518 63.9141C19.925 63.4609 16.3713 61.2257 14.0615 58.3877C12.0246 55.8848 11.0201 52.9997 10.6572 50.6553C10.3815 50.5449 10.1163 50.4118 9.8652 50.249C9.1302 49.7726 8.6068 49.1407 8.2109 48.5469C7.8218 47.9632 7.4891 47.3105 7.2002 46.7402C6.8946 46.1371 6.616 45.5807 6.2852 45.0293C5.8778 44.3504 5.5402 43.7087 5.2549 43.1689C4.9578 42.6069 4.7319 42.1841 4.5049 41.8311C4.0831 41.1751 3.8229 41.0175 3.5146 40.9404C2.6244 40.7178 2 39.9177 2 39C2 38.0823 2.6244 37.2822 3.5146 37.0596C3.8229 36.9825 4.0831 36.8249 4.5049 36.1689C4.7319 35.8159 4.9578 35.3931 5.2549 34.8311C5.5402 34.2913 5.8778 33.6496 6.2852 32.9707C6.616 32.4193 6.8946 31.8629 7.2002 31.2598C7.4891 30.6895 7.8218 30.0368 8.2109 29.4531C8.6068 28.8593 9.1302 28.2274 9.8652 27.751C10.1164 27.5882 10.3814 27.4541 10.6572 27.3438C11.0202 24.9995 12.0248 22.1148 14.0615 19.6123C16.3713 16.7743 19.9249 14.5381 25.0518 14.085C25.227 12.0548 25.7976 9.6369 27.0635 7.4854C28.8553 4.44 32.0188 2 37 2H263Z"
                                        stroke="url(#ryCueEdge)"
                                        strokeWidth="4"
                                        strokeLinejoin="round"
                                    />
                                </g>
                                <defs>
                                    <filter
                                        id="ryCueInset"
                                        x="0"
                                        y="0"
                                        width="300"
                                        height="86"
                                        filterUnits="userSpaceOnUse"
                                        colorInterpolationFilters="sRGB"
                                    >
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="BackgroundImageFix"
                                            result="shape"
                                        />
                                        <feColorMatrix
                                            in="SourceAlpha"
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            result="hardAlpha"
                                        />
                                        <feOffset dy="8" />
                                        <feGaussianBlur stdDeviation="6" />
                                        <feComposite
                                            in2="hardAlpha"
                                            operator="arithmetic"
                                            k2="-1"
                                            k3="1"
                                        />
                                        <feColorMatrix
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in2="shape"
                                            result="effect1_innerShadow"
                                        />
                                    </filter>
                                    <linearGradient
                                        id="ryCueEdge"
                                        x1="315"
                                        y1="39"
                                        x2="-9"
                                        y2="38.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop className="ry-plaque__edge" />
                                        <stop className="ry-plaque__shine" offset="0.183134" />
                                        <stop className="ry-plaque__edge" offset="0.525864" />
                                        <stop className="ry-plaque__shine" offset="0.790922" />
                                        <stop className="ry-plaque__edge" offset="1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="ry-plaque__label">Tap to open</span>
                        </span>
                    </div>
                </div>
            )}

            {/* ===================================================================
                2. THE HERO: Dusk Palace Garden Scene + Couple Names
               =================================================================== */}
            <section className="royale-hero" aria-label="The couple">
                <div className="royale-hero__frame">
                    <video
                        ref={heroVideoRef}
                        className="royale-hero__image royale-hero__video"
                        id="ryHeroVideo"
                        muted
                        loop
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        aria-hidden="true"
                        tabIndex={-1}
                    />

                    <picture className="royale-hero__still">
                        <source
                            media="(max-width: 699px)"
                            srcSet={`${ASSET_BASE}/garden_palace_poster.webp`}
                        />
                        <img
                            className="royale-hero__image"
                            src={`${ASSET_BASE}/mandap_dusk.webp`}
                            width={2322}
                            height={1224}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                        />
                    </picture>

                    <h1
                        ref={coupleHeadingRef}
                        className="royale-couple"
                        id="ryCouple"
                        tabIndex={-1}
                    >
                        <span className="royale-couple__name" id="ryBrideName">
                            {brideDisplay}
                        </span>
                        <span className="royale-couple__amp">&amp;</span>
                        <span className="royale-couple__name" id="ryGroomName">
                            {groomDisplay}
                        </span>
                    </h1>
                </div>

                <img
                    className="ry-tear ry-tear--bottom"
                    src={`${ASSET_BASE}/section_divider.svg`}
                    alt=""
                    aria-hidden="true"
                />
            </section>

            {/* ===================================================================
                3. THE FAMILIES: Unrolling Maroon & Gold Scrolls
               =================================================================== */}
            <section className="royale-scrolls royale-families" aria-label="The families">
                {/* Groom Family Scroll */}
                <article
                    ref={(el) => {
                        scrollRefs.current['groom'] = el;
                    }}
                    data-scroll-key="groom"
                    className={`royale-scroll${armedScrolls ? ' is-armed' : ''}${
                        unrolledScrolls['groom'] ? ' is-unrolled' : ''
                    }`}
                    id="ryGroomCard"
                    data-card="groomFamily"
                >
                    <img
                        className="royale-scroll__bloom"
                        src={`${ASSET_BASE}/floral2.webp`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="royale-scroll__window">
                        <div className="royale-scroll__sheet">
                            <h2 className="royale-scroll__name" id="ryGroomCardName">
                                {groomDisplay}
                            </h2>

                            <p className="royale-scroll__block">
                                <span className="royale-scroll__rel" id="ryGroomRelLabel">
                                    Son of
                                </span>
                                <span className="royale-scroll__elder" id="ryGroomParentA">
                                    {groomParentsSplit.a}
                                </span>
                                {groomParentsSplit.b && (
                                    <>
                                        <span className="royale-scroll__amp">&amp;</span>
                                        <span className="royale-scroll__elder" id="ryGroomParentB">
                                            {groomParentsSplit.b}
                                        </span>
                                    </>
                                )}
                            </p>

                            <p className="royale-scroll__block">
                                <span className="royale-scroll__rel" id="ryGroomGrandLabel">
                                    With the blessings of
                                </span>
                                <span className="royale-scroll__elder" id="ryGroomGrandA">
                                    All Elders &amp; Loved Ones
                                </span>
                            </p>

                            <img
                                className="royale-scroll__divider"
                                src={`${ASSET_BASE}/divider.webp`}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>

                    <div className="royale-scroll__rod royale-scroll__rod--top" aria-hidden="true">
                        <img
                            className="royale-scroll__knob royale-scroll__knob--left"
                            src={`${ASSET_BASE}/knob-left.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__roll"
                            src={`${ASSET_BASE}/roll-top1.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__knob royale-scroll__knob--right"
                            src={`${ASSET_BASE}/knob-right.svg`}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div className="royale-scroll__roller" aria-hidden="true">
                        <div className="royale-scroll__rod royale-scroll__rod--bottom">
                            <img
                                className="royale-scroll__knob royale-scroll__knob--left"
                                src={`${ASSET_BASE}/knob-left.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__roll"
                                src={`${ASSET_BASE}/roll-top1.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__knob royale-scroll__knob--right"
                                src={`${ASSET_BASE}/knob-right.svg`}
                                alt=""
                                draggable={false}
                            />
                        </div>
                    </div>
                </article>

                {/* Bride Family Scroll */}
                <article
                    ref={(el) => {
                        scrollRefs.current['bride'] = el;
                    }}
                    data-scroll-key="bride"
                    className={`royale-scroll${armedScrolls ? ' is-armed' : ''}${
                        unrolledScrolls['bride'] ? ' is-unrolled' : ''
                    }`}
                    id="ryBrideCard"
                    data-card="brideFamily"
                >
                    <img
                        className="royale-scroll__bloom"
                        src={`${ASSET_BASE}/floral2.webp`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="royale-scroll__window">
                        <div className="royale-scroll__sheet">
                            <h2 className="royale-scroll__name" id="ryBrideCardName">
                                {brideDisplay}
                            </h2>

                            <p className="royale-scroll__block">
                                <span className="royale-scroll__rel" id="ryBrideRelLabel">
                                    Daughter of
                                </span>
                                <span className="royale-scroll__elder" id="ryBrideParentA">
                                    {brideParentsSplit.a}
                                </span>
                                {brideParentsSplit.b && (
                                    <>
                                        <span className="royale-scroll__amp">&amp;</span>
                                        <span className="royale-scroll__elder" id="ryBrideParentB">
                                            {brideParentsSplit.b}
                                        </span>
                                    </>
                                )}
                            </p>

                            <p className="royale-scroll__block">
                                <span className="royale-scroll__rel" id="ryBrideGrandLabel">
                                    With the blessings of
                                </span>
                                <span className="royale-scroll__elder" id="ryBrideGrandA">
                                    All Elders &amp; Loved Ones
                                </span>
                            </p>

                            <img
                                className="royale-scroll__divider"
                                src={`${ASSET_BASE}/divider.webp`}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>

                    <div className="royale-scroll__rod royale-scroll__rod--top" aria-hidden="true">
                        <img
                            className="royale-scroll__knob royale-scroll__knob--left"
                            src={`${ASSET_BASE}/knob-left.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__roll"
                            src={`${ASSET_BASE}/roll-top1.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__knob royale-scroll__knob--right"
                            src={`${ASSET_BASE}/knob-right.svg`}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div className="royale-scroll__roller" aria-hidden="true">
                        <div className="royale-scroll__rod royale-scroll__rod--bottom">
                            <img
                                className="royale-scroll__knob royale-scroll__knob--left"
                                src={`${ASSET_BASE}/knob-left.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__roll"
                                src={`${ASSET_BASE}/roll-top1.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__knob royale-scroll__knob--right"
                                src={`${ASSET_BASE}/knob-right.svg`}
                                alt=""
                                draggable={false}
                            />
                        </div>
                    </div>
                </article>
            </section>

            {/* ===================================================================
                4. THE DATE REVEAL: Rolling Dials & Elephant Howdah Confetti
               =================================================================== */}
            <section
                ref={dateSectionRef}
                className={`royale-date${datePhase === 'revealing' ? ' is-revealing' : ''}${
                    datePhase === 'revealed' ? ' is-revealed' : ''
                }`}
                id="ryDateReveal"
                aria-label="The date"
            >
                <div ref={dateStageRef} className="royale-date__stage">
                    <img
                        ref={lotusCrownRef}
                        className="royale-date__crown"
                        src={`${ASSET_BASE}/lotus_bunch.png`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    />

                    <div className="royale-date__plaques" role="group" aria-label="Wedding date">
                        <div
                            ref={dayPlaqueRef}
                            className="royale-date__plaque"
                            data-dial="day"
                        >
                            <span className="royale-date__cap">Date</span>
                            <div className="royale-date__window">
                                <div
                                    ref={dayStripRef}
                                    className="royale-date__strip"
                                    data-strip
                                />
                            </div>
                        </div>
                        <div
                            ref={monthPlaqueRef}
                            className="royale-date__plaque"
                            data-dial="month"
                        >
                            <span className="royale-date__cap">Month</span>
                            <div className="royale-date__window">
                                <div
                                    ref={monthStripRef}
                                    className="royale-date__strip"
                                    data-strip
                                />
                            </div>
                        </div>
                        <div
                            ref={yearPlaqueRef}
                            className="royale-date__plaque"
                            data-dial="year"
                        >
                            <span className="royale-date__cap">Year</span>
                            <div className="royale-date__window">
                                <div
                                    ref={yearStripRef}
                                    className="royale-date__strip"
                                    data-strip
                                />
                            </div>
                        </div>
                    </div>

                    <img
                        className="royale-date__elephant royale-date__elephant--left"
                        src={`${ASSET_BASE}/elephant.png`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    />
                    <img
                        className="royale-date__elephant royale-date__elephant--right"
                        src={`${ASSET_BASE}/elephant.png`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    />

                    <div className="royale-date__action">
                        <button
                            className={`royale-date__btn ry-plaque${
                                btnPressed ? ' is-pressed' : ''
                            }`}
                            id="ryRevealBtn"
                            type="button"
                            disabled={datePhase !== 'idle'}
                            onClick={handleRevealDate}
                        >
                            <svg
                                className="ry-plaque__frame"
                                viewBox="0 0 300 78"
                                fill="none"
                                focusable="false"
                            >
                                <g filter="url(#ryRevealInset)">
                                    <path
                                        className="ry-plaque__fill"
                                        d="M8 34C6.5 36.5 6 38.5 4 39C6 39.5 6.5 41.5 8 44C9.5 46.5 10 49 12.5 49C12.6667 53.3333 15.8 62 27 62C26.8333 66 28.6 74 37 74H263C271.4 74 273.167 66 273 62C284.2 62 287.333 53.3333 287.5 49C290 49 290.5 46.5 292 44C293.5 41.5 294 39.5 296 39C294 38.5 293.5 36.5 292 34C290.5 31.5 290 29 287.5 29C287.333 24.6667 284.2 16 273 16C273.167 12 271.4 4 263 4H37C28.6 4 26.8333 12 27 16C15.8 16 12.6667 24.6667 12.5 29C10 29 9.5 31.5 8 34Z"
                                    />
                                    <path
                                        d="M263 2C267.981 2 271.145 4.44 272.937 7.4854C274.202 9.6369 274.772 12.0548 274.947 14.085C280.075 14.5379 283.629 16.7741 285.938 19.6123C287.975 22.1148 288.979 24.9996 289.342 27.3438C289.618 27.4542 289.883 27.588 290.135 27.751C290.87 28.2274 291.393 28.8593 291.789 29.4531C292.178 30.0368 292.511 30.6895 292.8 31.2598C293.105 31.8629 293.384 32.4193 293.715 32.9707C294.122 33.6496 294.46 34.2913 294.745 34.8311C295.042 35.3931 295.268 35.8159 295.495 36.1689C295.917 36.8249 296.177 36.9825 296.485 37.0596C297.376 37.2822 298 38.0823 298 39C298 39.9177 297.376 40.7178 296.485 40.9404C296.177 41.0175 295.917 41.1751 295.495 41.8311C295.268 42.1841 295.042 42.6069 294.745 43.1689C294.46 43.7087 294.122 44.3504 293.715 45.0293C293.384 45.5807 293.105 46.1371 292.8 46.7402C292.511 47.3105 292.178 47.9632 291.789 48.5469C291.393 49.1407 290.87 49.7726 290.135 50.249C289.883 50.4119 289.618 50.5449 289.342 50.6553C288.979 52.9996 287.975 55.8849 285.938 58.3877C283.629 61.2258 280.075 63.4611 274.947 63.9141C274.772 65.9444 274.203 68.3627 272.937 70.5146C271.145 73.56 267.981 76 263 76H37C32.0188 76 28.8553 73.56 27.0635 70.5146C25.7974 68.3627 25.2269 65.9445 25.0518 63.9141C19.925 63.4609 16.3713 61.2257 14.0615 58.3877C12.0246 55.8848 11.0201 52.9997 10.6572 50.6553C10.3815 50.5449 10.1163 50.4118 9.8652 50.249C9.1302 49.7726 8.6068 49.1407 8.2109 48.5469C7.8218 47.9632 7.4891 47.3105 7.2002 46.7402C6.8946 46.1371 6.616 45.5807 6.2852 45.0293C5.8778 44.3504 5.5402 43.7087 5.2549 43.1689C4.9578 42.6069 4.7319 42.1841 4.5049 41.8311C4.0831 41.1751 3.8229 41.0175 3.5146 40.9404C2.6244 40.7178 2 39.9177 2 39C2 38.0823 2.6244 37.2822 3.5146 37.0596C3.8229 36.9825 4.0831 36.8249 4.5049 36.1689C4.7319 35.8159 4.9578 35.3931 5.2549 34.8311C5.5402 34.2913 5.8778 33.6496 6.2852 32.9707C6.616 32.4193 6.8946 31.8629 7.2002 31.2598C7.4891 30.6895 7.8218 30.0368 8.2109 29.4531C8.6068 28.8593 9.1302 28.2274 9.8652 27.751C10.1164 27.5882 10.3814 27.4541 10.6572 27.3438C11.0202 24.9995 12.0248 22.1148 14.0615 19.6123C16.3713 16.7743 19.9249 14.5381 25.0518 14.085C25.227 12.0548 25.7976 9.6369 27.0635 7.4854C28.8553 4.44 32.0188 2 37 2H263Z"
                                        stroke="url(#ryRevealEdge)"
                                        strokeWidth="4"
                                        strokeLinejoin="round"
                                    />
                                </g>
                                <defs>
                                    <filter
                                        id="ryRevealInset"
                                        x="0"
                                        y="0"
                                        width="300"
                                        height="86"
                                        filterUnits="userSpaceOnUse"
                                        colorInterpolationFilters="sRGB"
                                    >
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="BackgroundImageFix"
                                            result="shape"
                                        />
                                        <feColorMatrix
                                            in="SourceAlpha"
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            result="hardAlpha"
                                        />
                                        <feOffset dy="8" />
                                        <feGaussianBlur stdDeviation="6" />
                                        <feComposite
                                            in2="hardAlpha"
                                            operator="arithmetic"
                                            k2="-1"
                                            k3="1"
                                        />
                                        <feColorMatrix
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in2="shape"
                                            result="effect1_innerShadow"
                                        />
                                    </filter>
                                    <linearGradient
                                        id="ryRevealEdge"
                                        x1="315"
                                        y1="39"
                                        x2="-9"
                                        y2="38.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop className="ry-plaque__edge" />
                                        <stop className="ry-plaque__shine" offset="0.183134" />
                                        <stop className="ry-plaque__edge" offset="0.525864" />
                                        <stop className="ry-plaque__shine" offset="0.790922" />
                                        <stop className="ry-plaque__edge" offset="1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="ry-plaque__label">Reveal the Date</span>
                        </button>
                        <p
                            className="royale-date__after"
                            id="ryRevealAfter"
                            hidden={datePhase !== 'revealed'}
                        >
                            Save the Date
                        </p>
                    </div>

                    <p className="royale-date__said" id="ryRevealSaid" aria-live="polite">
                        {saidDateText}
                    </p>
                </div>
            </section>

            {/* ===================================================================
                5. THE MARBLE PAVILION
               =================================================================== */}
            <div className="royale-pavilion" aria-hidden="true">
                <img
                    ref={pavilionImgRef}
                    className="royale-pavilion__image"
                    src={`${ASSET_BASE}/pavilion.webp`}
                    alt=""
                    width={1500}
                    height={927}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                />
            </div>

            {/* ===================================================================
                6. THE HANGING 3D PICTURE FRAME GALLERY
               =================================================================== */}
            <section className="royale-gallery" aria-label="Our story in pictures">
                <img
                    className="royale-gallery__divider"
                    src={`${ASSET_BASE}/divider3.png`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                />

                <div
                    ref={galleryScrollRef}
                    className="royale-gallery__scroll"
                    id="ryGalleryScroll"
                >
                    <div className="royale-gallery__track">
                        <div className="royale-gallery__rail" aria-hidden="true" />

                        {galleryFrames.map((item) => {
                            if (item.kind === 'story') {
                                return (
                                    <div
                                        key={item.id}
                                        className="gframe gframe--story"
                                        style={{ '--hang': `${item.hang}px` } as React.CSSProperties}
                                    >
                                        <span className="gframe__hook" aria-hidden="true" />
                                        <svg
                                            className="gframe__cord"
                                            viewBox="0 0 100 100"
                                            preserveAspectRatio="none"
                                            aria-hidden="true"
                                            focusable="false"
                                        >
                                            <path d="M50 0L0 100M50 0L100 100" />
                                            <path
                                                className="gframe__twist"
                                                d="M50 0L0 100M50 0L100 100"
                                            />
                                        </svg>
                                        <div className="gframe__body">
                                            <span className="gframe__side gframe__side--top" />
                                            <span className="gframe__side gframe__side--right" />
                                            <span className="gframe__side gframe__side--bottom" />
                                            <span className="gframe__side gframe__side--left" />
                                            <div className="gframe__face">
                                                <div className="gframe__lip">
                                                    <div className="gframe__mat gframe__story">
                                                        <p>{item.storyText}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={item.id}
                                    className={`gframe gframe--${item.orient || 'portrait'}`}
                                    style={{ '--hang': `${item.hang}px` } as React.CSSProperties}
                                >
                                    <span className="gframe__hook" aria-hidden="true" />
                                    <svg
                                        className="gframe__cord"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path d="M50 0L0 100M50 0L100 100" />
                                        <path
                                            className="gframe__twist"
                                            d="M50 0L0 100M50 0L100 100"
                                        />
                                    </svg>
                                    <div className="gframe__body">
                                        <span className="gframe__side gframe__side--top" />
                                        <span className="gframe__side gframe__side--right" />
                                        <span className="gframe__side gframe__side--bottom" />
                                        <span className="gframe__side gframe__side--left" />
                                        <div className="gframe__face">
                                            <div className="gframe__lip">
                                                <figure className="gframe__mat">
                                                    <div className="gframe__photo">
                                                        {item.photoUrl ? (
                                                            <img
                                                                src={item.photoUrl}
                                                                alt={item.caption || ''}
                                                                loading="lazy"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="gframe__placeholder">
                                                                Your photo here
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.caption && (
                                                        <figcaption className="gframe__caption">
                                                            {item.caption}
                                                        </figcaption>
                                                    )}
                                                </figure>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    ref={galleryHintRef}
                    className="ry-hint royale-gallery__hint"
                    id="ryGalleryHint"
                    aria-hidden="true"
                >
                    <span className="ry-hint__arrows">
                        <i />
                        <i />
                        <i />
                    </span>
                    <span className="ry-hint__arrows">
                        <i />
                        <i />
                        <i />
                    </span>
                </div>
            </section>

            {/* ===================================================================
                7. THE CEREMONIES: Scalloped Arch Cards & Gold Row Dividers
               =================================================================== */}
            <svg className="ryc-defs" aria-hidden="true" focusable="false" width="0" height="0">
                <defs>
                    <clipPath id="ryCeremonyPanel" clipPathUnits="objectBoundingBox">
                        <path d="M0.50047 0.0716 C0.5067 0.07833 0.52707 0.09459 0.55866 0.10578 C0.58899 0.11652 0.59364 0.14244 0.59213 0.15549 H0.59352 C0.65435 0.15549 0.70366 0.19235 0.70366 0.23782 C0.70366 0.24823 0.70107 0.25819 0.69635 0.26736 C0.78331 0.26859 0.85329 0.32166 0.85329 0.38695 C0.85329 0.40617 0.84722 0.42434 0.83644 0.44043 C0.87135 0.45545 0.89485 0.48361 0.89485 0.51588 V0.91356 H0.10515 V0.51588 C0.10515 0.48361 0.12865 0.45545 0.16356 0.44043 C0.15278 0.42434 0.14671 0.40617 0.14671 0.38695 C0.14671 0.32166 0.21669 0.26859 0.30364 0.26736 C0.29893 0.25819 0.29634 0.24823 0.29634 0.23782 C0.29634 0.19235 0.34565 0.15549 0.40648 0.15549 H0.40882 C0.4073 0.14244 0.41195 0.11652 0.44228 0.10578 C0.47387 0.09459 0.49423 0.07833 0.50047 0.0716 Z" />
                    </clipPath>
                </defs>
            </svg>

            <section className="royale-ceremonies" aria-label="Ceremonies">
                <h2 className="ryc-title">Ceremonies</h2>

                <div className="ryc-grid">
                    {data.events.map((evt, idx) => {
                        const artSrc = getCeremonyIllustration(evt.displayTitle, evt.eventType, idx);
                        const isRowDivider = (idx + 1) % 3 === 0;
                        const mapHref =
                            evt.mapLink && /^https?:\/\//i.test(evt.mapLink)
                                ? evt.mapLink
                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                      evt.venueText || 'Wedding Venue'
                                  )}`;

                        return (
                            <React.Fragment key={evt.id}>
                                <article
                                    ref={(el) => {
                                        ceremonyCardRefs.current[evt.id] = el;
                                    }}
                                    data-ceremony-id={evt.id}
                                    className={`ryc-card${armedCeremonies ? ' is-armed' : ''}${
                                        visibleCeremonies[evt.id] ? ' is-in' : ''
                                    }`}
                                >
                                    <div className="ryc-card__inner">
                                        <div className="ryc-card__artwell">
                                            <img
                                                className="ryc-card__art"
                                                src={artSrc}
                                                alt=""
                                                aria-hidden="true"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        <h3 className="ryc-card__name">{evt.displayTitle}</h3>
                                        <div className="ryc-card__foot">
                                            <div className="ryc-card__where">
                                                <p className="ryc-card__venue">{evt.venueText}</p>
                                                <a
                                                    className="ryc-card__map"
                                                    href={mapHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`${evt.displayTitle} venue on the map`}
                                                >
                                                    <img
                                                        src={`${ASSET_BASE}/location.svg`}
                                                        alt=""
                                                        aria-hidden="true"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                </a>
                                            </div>
                                            <p className="ryc-card__when">
                                                <span className="ryc-card__date">
                                                    {evt.shortDateLabel}
                                                </span>
                                                {evt.formattedTime && (
                                                    <span className="ryc-card__time">
                                                        {evt.formattedTime.replace(
                                                            /\s*onwards$/i,
                                                            ''
                                                        )}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </article>

                                <img
                                    className={`ryc-divider${
                                        isRowDivider ? ' ryc-divider--row' : ''
                                    }`}
                                    src={`${ASSET_BASE}/divider2.png`}
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </React.Fragment>
                        );
                    })}
                </div>

                <img
                    className="ry-tear ry-tear--bottom"
                    src={`${ASSET_BASE}/section_divider.svg`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                />
            </section>

            {/* ===================================================================
                8. CLOSING SCROLLS: With Best Compliments & A Note From Us
               =================================================================== */}
            <section
                className="royale-scrolls royale-closing"
                aria-label="Compliments and a note"
            >
                <article
                    ref={(el) => {
                        scrollRefs.current['compliments'] = el;
                    }}
                    data-scroll-key="compliments"
                    className={`royale-scroll${armedScrolls ? ' is-armed' : ''}${
                        unrolledScrolls['compliments'] ? ' is-unrolled' : ''
                    }`}
                    id="ryComplimentCard"
                    data-card="compliments"
                >
                    <img
                        className="royale-scroll__bloom"
                        src={`${ASSET_BASE}/floral2.webp`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="royale-scroll__window">
                        <div className="royale-scroll__sheet">
                            <h2 className="royale-scroll__name" id="ryComplimentLead">
                                With Best Compliments From:
                            </h2>

                            <div className="royale-scroll__lines" id="ryComplimentLines">
                                {data.groomParentsFormatted && (
                                    <p className="royale-scroll__line">
                                        {data.groomParentsFormatted} &amp; Family
                                    </p>
                                )}
                                {data.brideParentsFormatted && (
                                    <p className="royale-scroll__line">
                                        {data.brideParentsFormatted} &amp; Family
                                    </p>
                                )}
                                <p className="royale-scroll__line">
                                    All Near &amp; Dear Relatives &amp; Friends
                                </p>
                            </div>

                            <img
                                className="royale-scroll__divider"
                                src={`${ASSET_BASE}/divider.webp`}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>

                    <div className="royale-scroll__rod royale-scroll__rod--top" aria-hidden="true">
                        <img
                            className="royale-scroll__knob royale-scroll__knob--left"
                            src={`${ASSET_BASE}/knob-left.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__roll"
                            src={`${ASSET_BASE}/roll-top1.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__knob royale-scroll__knob--right"
                            src={`${ASSET_BASE}/knob-right.svg`}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div className="royale-scroll__roller" aria-hidden="true">
                        <div className="royale-scroll__rod royale-scroll__rod--bottom">
                            <img
                                className="royale-scroll__knob royale-scroll__knob--left"
                                src={`${ASSET_BASE}/knob-left.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__roll"
                                src={`${ASSET_BASE}/roll-top1.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__knob royale-scroll__knob--right"
                                src={`${ASSET_BASE}/knob-right.svg`}
                                alt=""
                                draggable={false}
                            />
                        </div>
                    </div>
                </article>

                <article
                    ref={(el) => {
                        scrollRefs.current['note'] = el;
                    }}
                    data-scroll-key="note"
                    className={`royale-scroll${armedScrolls ? ' is-armed' : ''}${
                        unrolledScrolls['note'] ? ' is-unrolled' : ''
                    }`}
                    id="ryNoteCard"
                    data-card="note"
                >
                    <img
                        className="royale-scroll__bloom"
                        src={`${ASSET_BASE}/floral2.webp`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="royale-scroll__window">
                        <div className="royale-scroll__sheet">
                            <h2 className="royale-scroll__name" id="ryNoteLead">
                                A Note From Us
                            </h2>

                            <p className="royale-scroll__note" id="ryNoteText">
                                {data.invitationMessage ||
                                    'We can’t wait to celebrate this special day with you. Thank you for being part of our journey.'}
                            </p>

                            <img
                                className="royale-scroll__divider"
                                src={`${ASSET_BASE}/divider.webp`}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>

                    <div className="royale-scroll__rod royale-scroll__rod--top" aria-hidden="true">
                        <img
                            className="royale-scroll__knob royale-scroll__knob--left"
                            src={`${ASSET_BASE}/knob-left.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__roll"
                            src={`${ASSET_BASE}/roll-top1.svg`}
                            alt=""
                            draggable={false}
                        />
                        <img
                            className="royale-scroll__knob royale-scroll__knob--right"
                            src={`${ASSET_BASE}/knob-right.svg`}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div className="royale-scroll__roller" aria-hidden="true">
                        <div className="royale-scroll__rod royale-scroll__rod--bottom">
                            <img
                                className="royale-scroll__knob royale-scroll__knob--left"
                                src={`${ASSET_BASE}/knob-left.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__roll"
                                src={`${ASSET_BASE}/roll-top1.svg`}
                                alt=""
                                draggable={false}
                            />
                            <img
                                className="royale-scroll__knob royale-scroll__knob--right"
                                src={`${ASSET_BASE}/knob-right.svg`}
                                alt=""
                                draggable={false}
                            />
                        </div>
                    </div>
                </article>
            </section>

            {/* ===================================================================
                9. THE MEDIA ROW & INTERACTIVE POPUP MODAL
               =================================================================== */}
            <section
                className="royale-social"
                aria-label="Follow the couple, the venues, and the dates"
            >
                <div className="socials">
                    <button
                        className="social"
                        id="ryIgBtn"
                        type="button"
                        aria-label="Instagram"
                        onClick={() => openSocialModal('instagram')}
                    >
                        <span
                            className="social__icon social__icon--instagram"
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        className="social"
                        id="ryLocBtn"
                        type="button"
                        aria-label="Ceremony locations"
                        onClick={() => openSocialModal('location')}
                    >
                        <span
                            className="social__icon social__icon--location"
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        className="social"
                        id="ryCalBtn"
                        type="button"
                        aria-label="Add ceremonies to calendar"
                        onClick={() => openSocialModal('calendar')}
                    >
                        <span
                            className="social__icon social__icon--calendar"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </section>

            {/* ===================================================================
                10. CLOSING GARDEN PICTURE & EASEL
               =================================================================== */}
            <section ref={outroSectionRef} className="royale-outro">
                <img
                    className="ry-tear ry-tear--top"
                    src={`${ASSET_BASE}/section_divider.svg`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
                <picture>
                    <source
                        media="(min-width: 700px)"
                        srcSet={`${ASSET_BASE}/garden_close.webp`}
                        width={1672}
                        height={941}
                    />
                    <img
                        ref={outroImgRef}
                        className="royale-outro__image"
                        src={`${ASSET_BASE}/garden_close_tall.webp`}
                        alt=""
                        width={941}
                        height={1672}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                    />
                </picture>
                <div className="royale-outro__easel">
                    <div className="royale-outro__board">
                        <p className="royale-outro__names">{guestGreeting}</p>
                        <p className="royale-outro__line">
                            Your Presence Means the World to Us
                        </p>
                    </div>
                </div>
                <img
                    className="ry-tear ry-tear--bottom"
                    src={`${ASSET_BASE}/section_divider.svg`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
            </section>

            {/* ===================================================================
                11. BALCONY-STYLE GUEST RSVP CARD (Exact ry-rsvp.js DOM & classes)
               =================================================================== */}
            <div id="balcony-rsvp">
                <div className="brsvp">
                    <div className="brsvp__head">
                        <div className="brsvp__title">
                            <svg
                                className="brsvp__title-mark"
                                viewBox="0 0 48 12"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M2 6c8-5 14 5 22 0M24 6c8-5 14 5 22 0"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                />
                                <circle cx="24" cy="6" r="1.6" fill="currentColor" />
                            </svg>
                            <span className="brsvp__title-text">Your Presence Matters</span>
                            <svg
                                className="brsvp__title-mark brsvp__title-mark--flip"
                                viewBox="0 0 48 12"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M2 6c8-5 14 5 22 0M24 6c8-5 14 5 22 0"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                />
                                <circle cx="24" cy="6" r="1.6" fill="currentColor" />
                            </svg>
                        </div>
                        <p className="brsvp__lead">
                            {data.formattedRsvpDeadline
                                ? `Kindly respond by ${data.formattedRsvpDeadline} so we can make the arrangements just right.`
                                : 'Let us know so we can make the arrangements just right.'}
                        </p>
                        <svg
                            className="brsvp__head-heart"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
                        </svg>
                    </div>

                    {data.step === 'SUCCESS' || data.step === 'ALREADY_REGISTERED' ? (
                        <div className="brsvp__result">
                            <div className="brsvp__thanks">
                                {data.step === 'SUCCESS'
                                    ? 'Thanks! Your response is saved.'
                                    : 'Your RSVP is already registered with us.'}
                                <ul className="brsvp__result-list">
                                    {data.events.map((evt) => {
                                        const c = eventChoices[evt.id] || 'yes';
                                        const label =
                                            c === 'yes' ? 'Yes' : c === 'maybe' ? 'Maybe' : 'No';
                                        const extra =
                                            c === 'yes' || c === 'maybe'
                                                ? ` (${data.adultCount})`
                                                : '';
                                        return (
                                            <li key={evt.id}>
                                                <span>{evt.displayTitle}</span>
                                                <span>
                                                    {label}
                                                    {extra}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <button
                                type="button"
                                className="brsvp__change"
                                onClick={data.handleResetAndInvite}
                            >
                                Change response
                            </button>
                        </div>
                    ) : (
                        <form className="brsvp__form" noValidate onSubmit={data.handleSubmit}>
                            <div className="brsvp-identity">
                                <div className="brsvp-field">
                                    <div className="brsvp-field__row">
                                        <span className="brsvp-ico" aria-hidden="true">
                                            <svg
                                                className="brsvp-ico__svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4.5V20h14v-1.5C19 16 16 14 12 14Z" />
                                            </svg>
                                        </span>
                                        <input
                                            id="rsvp-guest-name"
                                            type="text"
                                            className="brsvp-input brsvp-identity__name"
                                            maxLength={255}
                                            autoComplete="name"
                                            aria-label="Your name"
                                            placeholder="Your name"
                                            value={data.guestName}
                                            onChange={(e) => {
                                                data.setGuestName(e.target.value);
                                                if (data.nameError) data.setNameError(false);
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="brsvp-field">
                                    <div className="brsvp-field__row">
                                        <span className="brsvp-ico" aria-hidden="true">
                                            <svg
                                                className="brsvp-ico__svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M6.6 3h3l1.5 4-2.2 1.6a12 12 0 0 0 5.5 5.5L16 11.9l4 1.5v3A2.5 2.5 0 0 1 17.5 19 14.5 14.5 0 0 1 5 6.5 2.5 2.5 0 0 1 6.6 3Z" />
                                            </svg>
                                        </span>
                                        <input
                                            id="rsvp-guest-phone"
                                            type="tel"
                                            className="brsvp-input brsvp-identity__contact"
                                            maxLength={20}
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            aria-label="Contact number"
                                            placeholder="10-digit mobile number"
                                            value={data.phone}
                                            onChange={(e) => data.setPhone(e.target.value)}
                                        />
                                    </div>
                                    <span className="brsvp-field__hint">
                                        Reply again from this number any time to update your answer.
                                    </span>
                                </div>
                            </div>

                            <div className="brsvp-headcount">
                                <span className="brsvp-headcount__label">
                                    How many of you are coming?
                                </span>
                                <div className="brsvp-stepper">
                                    <button
                                        type="button"
                                        className="brsvp-stepper__btn"
                                        onClick={data.decrementGuests}
                                        disabled={data.adultCount <= 1}
                                        aria-label="One person fewer"
                                    >
                                        &minus;
                                    </button>
                                    <input
                                        type="number"
                                        className="brsvp-stepper__value"
                                        inputMode="numeric"
                                        min={1}
                                        max={10}
                                        value={data.adultCount}
                                        readOnly
                                        aria-label="Number of people"
                                    />
                                    <button
                                        type="button"
                                        className="brsvp-stepper__btn"
                                        onClick={data.incrementGuests}
                                        disabled={data.adultCount >= 10}
                                        aria-label="One person more"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="brsvp-headcount__hint">
                                    Counts for every event you say Yes or Maybe to, below. Up to 10
                                    people.
                                </span>
                            </div>

                            <div className="brsvp-rule">
                                <svg
                                    className="brsvp-rule__mark"
                                    viewBox="0 0 48 12"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2 6c8-5 14 5 22 0M24 6c8-5 14 5 22 0"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                    />
                                    <circle cx="24" cy="6" r="1.6" fill="currentColor" />
                                </svg>
                            </div>

                            <div className="brsvp-section">
                                <span className="brsvp-ico" aria-hidden="true">
                                    <svg
                                        className="brsvp-ico__svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M7 2v2M17 2v2M3.5 8h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 21H5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5 5Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                                <div>
                                    <span className="brsvp-section__title">Event Schedule</span>
                                    <span className="brsvp-section__sub">
                                        Let us know which events you’ll be joining.
                                    </span>
                                </div>
                            </div>

                            <div className="brsvp-events">
                                {data.events.map((evt) => {
                                    const currentChoice = eventChoices[evt.id] || 'yes';
                                    return (
                                        <div
                                            key={evt.id}
                                            className="brsvp-event"
                                            data-id={evt.id}
                                        >
                                            <div className="brsvp-event__head">
                                                <span className="brsvp-event__name">
                                                    {evt.displayTitle}
                                                </span>
                                                {evt.shortDateLabel && (
                                                    <span className="brsvp-event__date">
                                                        <svg
                                                            className="brsvp-event__cal"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                d="M7 2v2M17 2v2M3.5 8h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 21H5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5 5Z"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        {evt.shortDateLabel}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="brsvp-opts">
                                                {(
                                                    [
                                                        ['yes', 'attending', 'Yes'],
                                                        ['maybe', 'maybe', 'Maybe'],
                                                        ['no', 'not-attending', 'No'],
                                                    ] as const
                                                ).map(([choiceKey, radioVal, label]) => (
                                                    <label key={choiceKey} className="brsvp-opt">
                                                        <input
                                                            type="radio"
                                                            name={`s-${evt.id}`}
                                                            value={radioVal}
                                                            checked={currentChoice === choiceKey}
                                                            onChange={() =>
                                                                handleEventChoiceChange(
                                                                    evt.id,
                                                                    choiceKey
                                                                )
                                                            }
                                                        />
                                                        <span>{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="brsvp-field">
                                <div className="brsvp-field__row">
                                    <span className="brsvp-ico" aria-hidden="true">
                                        <svg
                                            className="brsvp-ico__svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M3.5 6.5h17v11h-17z"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                            />
                                            <path
                                                d="m3.5 7 8.5 6 8.5-6"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </span>
                                    <textarea
                                        className="brsvp-input brsvp-message__box"
                                        rows={3}
                                        maxLength={1000}
                                        aria-label="Message or wishes for the couple"
                                        placeholder="Leave the couple a wish (optional)"
                                        value={data.message}
                                        onChange={(e) => data.setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            {(data.nameError || data.submitError) && (
                                <p className="brsvp__error">
                                    {data.nameError
                                        ? 'Please tell us your name.'
                                        : data.submitError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="brsvp__submit"
                                disabled={data.isSubmitting}
                            >
                                <svg
                                    className="brsvp__submit-heart"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
                                </svg>
                                {data.isSubmitting ? 'Sending…' : 'Send RSVP'}
                            </button>

                            <p className="brsvp__footnote">
                                Thank you! Your response means a lot to us.
                            </p>
                        </form>
                    )}
                </div>
            </div>

            {/* ===================================================================
                12. POPUP MODAL (Instagram, Ceremony Locations, Add to Calendar)
               =================================================================== */}
            <div className="ry-modal" id="ryModal" hidden={activeModal === 'none'}>
                <div
                    className="ry-modal__overlay"
                    data-ry-close
                    onClick={closeSocialModal}
                />
                <div
                    className="ry-modal__box"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ryModalTitle"
                >
                    <button
                        className="ry-modal__close"
                        type="button"
                        data-ry-close
                        aria-label="Close"
                        onClick={closeSocialModal}
                    >
                        &times;
                    </button>
                    <div className="ry-modal__content" id="ryModalContent">
                        {activeModal === 'instagram' && (
                            <>
                                <h3 className="ry-modal__title" id="ryModalTitle">
                                    Follow the Couple
                                </h3>
                                <span className="ry-modal__divider" aria-hidden="true" />
                                <p className="ry-modal__text">
                                    Would you like to open the couple’s Instagram page?
                                </p>
                                <div className="ry-modal__actions">
                                    <a
                                        className="ry-modal__btn ry-modal__btn--primary"
                                        href={instagramHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={closeSocialModal}
                                    >
                                        Open Instagram
                                    </a>
                                    <button
                                        className="ry-modal__btn"
                                        type="button"
                                        onClick={closeSocialModal}
                                    >
                                        Not now
                                    </button>
                                </div>
                            </>
                        )}

                        {activeModal === 'location' && (
                            <>
                                <h3 className="ry-modal__title" id="ryModalTitle">
                                    Ceremony Locations
                                </h3>
                                <span className="ry-modal__divider" aria-hidden="true" />
                                {groupedLocations.length > 0 ? (
                                    <div className="ry-loc-list">
                                        {groupedLocations.map((loc, idx) => {
                                            const mapHref =
                                                loc.mapLink && /^https?:\/\//i.test(loc.mapLink)
                                                    ? loc.mapLink
                                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                          loc.address
                                                      )}`;
                                            return (
                                                <a
                                                    key={idx}
                                                    className="ry-loc"
                                                    href={mapHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <span
                                                        className="ry-loc__pin"
                                                        aria-hidden="true"
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                        >
                                                            <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" />
                                                            <circle cx="12" cy="10" r="2.4" />
                                                        </svg>
                                                    </span>
                                                    <span className="ry-loc__text">
                                                        <span className="ry-loc__ceremonies">
                                                            {loc.ceremonies}
                                                        </span>
                                                        <span className="ry-loc__venue">
                                                            {loc.venue}
                                                        </span>
                                                        {loc.rest && (
                                                            <span className="ry-loc__addr">
                                                                {loc.rest}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="ry-loc__go" aria-hidden="true">
                                                        &rsaquo;
                                                    </span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="ry-modal__empty">
                                        No venues have been added yet.
                                    </p>
                                )}
                            </>
                        )}

                        {activeModal === 'calendar' && selectedCalendarDayIdx === null && (
                            <>
                                <h3 className="ry-modal__title" id="ryModalTitle">
                                    Add to Calendar
                                </h3>
                                <span className="ry-modal__divider" aria-hidden="true" />
                                {groupedCalendarDays.length > 0 ? (
                                    <>
                                        <div className="ry-loc-list">
                                            {groupedCalendarDays.map((day, idx) => (
                                                <button
                                                    key={day.dateIso}
                                                    className="ry-loc"
                                                    type="button"
                                                    onClick={() => setSelectedCalendarDayIdx(idx)}
                                                >
                                                    <span
                                                        className="ry-loc__pin"
                                                        aria-hidden="true"
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                        >
                                                            <rect
                                                                x="3"
                                                                y="5"
                                                                width="18"
                                                                height="16"
                                                                rx="2.5"
                                                            />
                                                            <path d="M3 9h18M8 3v4M16 3v4" />
                                                        </svg>
                                                    </span>
                                                    <span className="ry-loc__text">
                                                        <span className="ry-loc__ceremonies">
                                                            {day.dateLabel}
                                                        </span>
                                                        <span className="ry-loc__venue">
                                                            {day.namesJoined}
                                                        </span>
                                                    </span>
                                                    <span className="ry-loc__go" aria-hidden="true">
                                                        +
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="ry-modal__actions">
                                            <button
                                                className="ry-modal__btn ry-modal__btn--primary"
                                                type="button"
                                                onClick={() =>
                                                    downloadCalendarIcs(
                                                        groupedCalendarDays,
                                                        'all-ceremonies.ics'
                                                    )
                                                }
                                            >
                                                Add all dates
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="ry-modal__empty">
                                        No dated ceremonies to add yet.
                                    </p>
                                )}
                            </>
                        )}

                        {activeModal === 'calendar' &&
                            selectedCalendarDayIdx !== null &&
                            groupedCalendarDays[selectedCalendarDayIdx] &&
                            (() => {
                                const day = groupedCalendarDays[selectedCalendarDayIdx];
                                const googleUrl =
                                    'https://calendar.google.com/calendar/render?' +
                                    new URLSearchParams({
                                        action: 'TEMPLATE',
                                        text: day.namesJoined,
                                        dates: `${day.ymd}/${day.nextYmd}`,
                                        details: day.desc,
                                        location: day.venue,
                                    }).toString();
                                const outlookUrl =
                                    'https://outlook.live.com/calendar/0/deeplink/compose?' +
                                    new URLSearchParams({
                                        path: '/calendar/action/compose',
                                        rru: 'addevent',
                                        allday: 'true',
                                        startdt: day.dateIso,
                                        enddt: day.dateIso,
                                        subject: day.namesJoined,
                                        body: day.desc,
                                        location: day.venue,
                                    }).toString();

                                return (
                                    <>
                                        <h3 className="ry-modal__title" id="ryModalTitle">
                                            {day.dateLabel}
                                        </h3>
                                        <span className="ry-modal__divider" aria-hidden="true" />
                                        <p className="ry-modal__text">
                                            Which calendar would you like to add this to?
                                        </p>
                                        <div className="ry-modal__actions">
                                            <a
                                                className="ry-modal__btn ry-modal__btn--primary"
                                                href={googleUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Google Calendar
                                            </a>
                                            <a
                                                className="ry-modal__btn"
                                                href={outlookUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Outlook
                                            </a>
                                            <button
                                                className="ry-modal__btn"
                                                type="button"
                                                onClick={() =>
                                                    downloadCalendarIcs(
                                                        [day],
                                                        `ceremonies-${day.dateIso}.ics`
                                                    )
                                                }
                                            >
                                                Apple Calendar &amp; others
                                            </button>
                                        </div>
                                        <p className="ry-modal__text">
                                            <button
                                                className="ry-modal__link"
                                                type="button"
                                                onClick={() => setSelectedCalendarDayIdx(null)}
                                            >
                                                &larr; Back to dates
                                            </button>
                                        </p>
                                    </>
                                );
                            })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

function cleanTextLocal(val?: unknown): string {
    if (!val || typeof val !== 'string') return '';
    return val.trim();
}
