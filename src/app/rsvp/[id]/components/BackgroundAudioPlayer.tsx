'use client';

import React, { useEffect, useRef, useState } from 'react';
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
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [userManuallyMuted, setUserManuallyMuted] = useState<boolean>(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.55;
        audio.loop = true;

        const attemptPlay = () => {
            if (!audioRef.current || userManuallyMuted) return;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(() => {
                        // If browser blocks unmuted audio on landing, keep ready for first touch/click
                        setIsPlaying(false);
                    });
            }
        };

        // 1. Attempt immediate playback on landing
        attemptPlay();

        // 2. Attach listeners for any early gesture (touch, click, scroll, key) to satisfy browser autoplay policy
        const handleAnyInteraction = () => {
            if (!userManuallyMuted && audioRef.current && audioRef.current.paused) {
                attemptPlay();
            }
        };

        const events = ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'];
        events.forEach((evt) => {
            window.addEventListener(evt, handleAnyInteraction, { capture: true, passive: true });
        });
        window.addEventListener('nimantran:play-music', handleAnyInteraction);

        return () => {
            events.forEach((evt) => {
                window.removeEventListener(evt, handleAnyInteraction, { capture: true });
            });
            window.removeEventListener('nimantran:play-music', handleAnyInteraction);
            if (audio) {
                audio.pause();
            }
        };
    }, [userManuallyMuted]);

    // When autoPlayTrigger changes (e.g. user opens cover card)
    useEffect(() => {
        if (autoPlayTrigger && !userManuallyMuted && audioRef.current && audioRef.current.paused) {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((err) => {
                    console.log('Audio autoplay error:', err);
                });
        }
    }, [autoPlayTrigger, userManuallyMuted]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            setUserManuallyMuted(true);
        } else {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                    setUserManuallyMuted(false);
                })
                .catch((err) => {
                    console.log('Audio playback error:', err);
                });
        }
    };

    return (
        <div className={styles.audioPlayerContainer}>
            <audio ref={audioRef} loop preload="auto" autoPlay>
                <source src={audioUrl} type="audio/mp4" />
                <source src="/music/shubha-aagaman.mp4" type="video/mp4" />
                <source src="/music/with-tanpura-drone.m4a" type="audio/mp4" />
                Your browser does not support the audio element.
            </audio>
            <button
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
