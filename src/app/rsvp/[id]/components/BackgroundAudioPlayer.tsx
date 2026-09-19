'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from '../rsvp.module.css';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundAudioPlayerProps {
    audioUrl?: string;
    autoPlayTrigger?: boolean;
}

export const BackgroundAudioPlayer: React.FC<BackgroundAudioPlayerProps> = ({
    // Shubha Aagaman (Spring Vows) royal Indian wedding music
    audioUrl = '/music/shubha-aagaman.m4a',
    autoPlayTrigger,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const userManuallyMutedRef = useRef<boolean>(false);

    const togglePlay = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const audio = audioRef.current;
        if (!audio) return;

        if (!audio.paused && !audio.muted) {
            // Currently playing -> Mute & Pause
            userManuallyMutedRef.current = true;
            audio.pause();
            audio.muted = true;
            setIsPlaying(false);
        } else {
            // Currently paused/muted -> Unmute & Play
            userManuallyMutedRef.current = false;
            audio.muted = false;
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((err) => {
                    console.log('Audio playback error:', err);
                });
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.55;
        audio.loop = true;

        const attemptPlay = () => {
            if (!audioRef.current || userManuallyMutedRef.current) return;
            audioRef.current.muted = false;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(() => {
                        // Autoplay blocked until gesture
                        setIsPlaying(false);
                    });
            }
        };

        // 1. Attempt immediate playback on landing
        attemptPlay();

        // 2. Attach listeners for any early gesture (touch, click, scroll, key)
        const handleAnyInteraction = (e: Event) => {
            // Ignore if clicked on the music button itself so togglePlay handles it directly
            if (
                e.target &&
                buttonRef.current &&
                (buttonRef.current === e.target || buttonRef.current.contains(e.target as Node))
            ) {
                return;
            }

            if (!userManuallyMutedRef.current && audioRef.current && audioRef.current.paused) {
                attemptPlay();
            }
        };

        const events = ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'];
        events.forEach((evt) => {
            window.addEventListener(evt, handleAnyInteraction, { capture: true, passive: true });
        });
        window.addEventListener('nimantran:play-music', attemptPlay);

        return () => {
            events.forEach((evt) => {
                window.removeEventListener(evt, handleAnyInteraction, { capture: true });
            });
            window.removeEventListener('nimantran:play-music', attemptPlay);
            if (audio) {
                audio.pause();
            }
        };
    }, []);

    // When autoPlayTrigger changes (e.g. user opens cover card)
    useEffect(() => {
        if (autoPlayTrigger && !userManuallyMutedRef.current && audioRef.current && audioRef.current.paused) {
            audioRef.current.muted = false;
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((err) => {
                    console.log('Audio autoplay error:', err);
                });
        }
    }, [autoPlayTrigger]);

    return (
        <div className={styles.audioPlayerContainer}>
            <audio
                ref={audioRef}
                loop
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                <source src={audioUrl} type="audio/mp4" />
                <source src="/music/shubha-aagaman.mp4" type="video/mp4" />
                <source src="/music/with-tanpura-drone.m4a" type="audio/mp4" />
                Your browser does not support the audio element.
            </audio>
            <button
                ref={buttonRef}
                type="button"
                onClick={togglePlay}
                className={styles.audioPlayerBtn}
                title={isPlaying ? 'Mute Shubha Aagaman music' : 'Play Shubha Aagaman music'}
                aria-label={isPlaying ? 'Mute Shubha Aagaman music' : 'Play Shubha Aagaman music'}
            >
                {isPlaying ? (
                    <>
                        <div className={styles.equalizerBars}>
                            <span className={styles.bar} style={{ animationDelay: '0ms' }} />
                            <span className={styles.bar} style={{ animationDelay: '200ms' }} />
                            <span className={styles.bar} style={{ animationDelay: '400ms' }} />
                            <span className={styles.bar} style={{ animationDelay: '150ms' }} />
                        </div>
                        <Volume2 size={16} className={styles.audioIcon} />
                    </>
                ) : (
                    <>
                        <VolumeX size={16} className={styles.audioIcon} />
                        <span className={styles.audioLabel}>Music</span>
                    </>
                )}
            </button>
        </div>
    );
};
