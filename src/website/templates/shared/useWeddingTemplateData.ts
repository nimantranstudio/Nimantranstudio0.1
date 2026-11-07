'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { formatDisplayTime, parseWeddingDate } from '@/lib/format-date';
import type { WebsiteEvent, WebsiteWedding } from '../types';

export type RsvpStep = 'INVITE' | 'SUCCESS' | 'ALREADY_REGISTERED';
export type AttendanceStatus = 'attending' | 'maybe' | 'declined';

export interface NormalizedEvent extends WebsiteEvent {
    displayTitle: string;
    formattedDate: string;
    shortDateLabel: string;
    dayNumber: string;
    monthShort: string;
    weekday: string;
    formattedTime: string;
    venueText: string;
    hasVenueLocation: boolean;
}

export interface CalendarEventPayload {
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
}

export interface TimeLeftState {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    hasTarget: boolean;
}

const HONORIFIC = /\b(mr|mrs|ms|miss|smt|shri|sri|dr|lt|col|capt|maj|gen|prof|late)\b/i;

export function cleanText(str?: string | null): string {
    if (!str) return '';
    return String(str)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

export function formatParentName(name?: string | null): string {
    const trimmed = cleanText(name);
    if (!trimmed) return '';
    if (HONORIFIC.test(trimmed)) return trimmed;
    return `Mr. & Mrs. ${trimmed}`;
}

export function formatLongDateSafe(dateVal?: string | Date | null): string {
    if (!dateVal) return '';
    const parsed = parseWeddingDate(dateVal);
    if (!parsed) return typeof dateVal === 'string' ? cleanText(dateVal) : '';
    return parsed.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatShortDateSafe(dateVal?: string | Date | null): string {
    if (!dateVal) return '';
    const parsed = parseWeddingDate(dateVal);
    if (!parsed) return typeof dateVal === 'string' ? cleanText(dateVal) : '';
    return parsed.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatNumericDotsDate(dateVal?: string | Date | null): string {
    if (!dateVal) return '';
    const parsed = parseWeddingDate(dateVal);
    if (!parsed) return typeof dateVal === 'string' ? cleanText(dateVal) : '';
    const dd = String(parsed.getDate()).padStart(2, '0');
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const yyyy = parsed.getFullYear();
    return `${dd} . ${mm} . ${yyyy}`;
}

export function openMapsForVenue(mapLink?: string | null, venueText?: string | null) {
    const rawLink = cleanText(mapLink);
    if (
        rawLink &&
        rawLink.toLowerCase() !== 'null' &&
        rawLink.toLowerCase() !== 'undefined' &&
        rawLink.toLowerCase() !== 'venue details to follow'
    ) {
        const href = /^https?:\/\//i.test(rawLink) ? rawLink : `https://${rawLink}`;
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
    }
    const cleanVenue = cleanText(venueText);
    if (cleanVenue && cleanVenue !== 'Venue details to follow') {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanVenue)}`,
            '_blank',
            'noopener,noreferrer'
        );
    }
}

/**
 * Preserves the exact field mapping, fallback rules, localStorage keys, query
 * parameter overrides, and `/api/rsvp/[weddingId]` submission behavior of the
 * original Royal Sanctuary (`RSVPForm.tsx`) implementation.
 */
export function useWeddingTemplateData(wedding: WebsiteWedding, isPreview = false) {
    const rawWedding = wedding as any;

    const [step, setStep] = useState<RsvpStep>('INVITE');
    const [isCoverOpen, setIsCoverOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [activeCalendarEvent, setActiveCalendarEvent] = useState<CalendarEventPayload | null>(null);

    // RSVP form fields (exact contract with POST /api/rsvp/[weddingId])
    const [status, setStatus] = useState<AttendanceStatus>('attending');
    const [guestName, setGuestName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [phone, setPhone] = useState('');
    const [adultCount, setAdultCount] = useState(1);
    const [stepperDir, setStepperDir] = useState<'up' | 'down'>('up');
    const [message, setMessage] = useState('');

    const groomName = cleanText(wedding?.groomName) || 'Groom';
    const brideName = cleanText(wedding?.brideName) || 'Bride';
    const hasBride = Boolean(cleanText(wedding?.brideName));
    const coupleNames = [cleanText(wedding?.groomName), cleanText(wedding?.brideName)]
        .filter(Boolean)
        .join(' & ') || `${groomName} & ${brideName}`;

    const groomInitial = groomName.charAt(0).toUpperCase() || 'G';
    const brideInitial = brideName.charAt(0).toUpperCase() || 'B';

    const groomParentsFormatted = formatParentName(wedding?.groomParents);
    const brideParentsFormatted = formatParentName(wedding?.brideParents);
    const invitationMessage = cleanText(wedding?.invitationMessage);
    const rsvpContact = cleanText(wedding?.rsvpContact);

    const formattedRsvpDeadline = useMemo(() => {
        if (!wedding?.rsvpDeadline) return '';
        return formatShortDateSafe(wedding.rsvpDeadline as any);
    }, [wedding?.rsvpDeadline]);

    const rawEvents: any[] = Array.isArray(wedding?.events) ? wedding.events : [];

    const mainRawEvent = useMemo(() => {
        return (
            rawEvents.find(
                (e) =>
                    e?.name?.toLowerCase().includes('wedding') ||
                    e?.eventType === 'Wedding' ||
                    e?.name?.toLowerCase().includes('shaadi') ||
                    e?.name?.toLowerCase().includes('phera') ||
                    e?.name?.toLowerCase().includes('vivah') ||
                    e?.name?.toLowerCase().includes('lagna')
            ) ||
            rawEvents.find((e) => e?.date && String(e.date).trim()) ||
            rawEvents[0] ||
            null
        );
    }, [rawEvents]);

    const primaryDateStr: string | null =
        cleanText(mainRawEvent?.date) ||
        cleanText(rawWedding?.primaryDate) ||
        cleanText(rawWedding?.weddingDate) ||
        cleanText(rawWedding?.date) ||
        null;

    const primaryTimeStr: string | null =
        cleanText(mainRawEvent?.time) ||
        cleanText(rawWedding?.primaryTime) ||
        cleanText(rawWedding?.time) ||
        null;

    const venueLocation: string | null =
        cleanText(mainRawEvent?.venue) ||
        cleanText(mainRawEvent?.venueName) ||
        cleanText(mainRawEvent?.address) ||
        cleanText(rawWedding?.venue) ||
        cleanText(rawWedding?.address) ||
        null;

    const hasVenue = Boolean(venueLocation && venueLocation !== 'Venue details to follow');

    const venueCity = useMemo(() => {
        if (!hasVenue || !venueLocation) return '';
        const parts = venueLocation.split(',').map((p) => p.trim()).filter(Boolean);
        return parts.length > 1 ? parts[parts.length - 1] : parts[0] || '';
    }, [hasVenue, venueLocation]);

    const formattedPrimaryDate = useMemo(() => formatLongDateSafe(primaryDateStr), [primaryDateStr]);
    const shortPrimaryDate = useMemo(() => formatShortDateSafe(primaryDateStr), [primaryDateStr]);
    const numericPrimaryDate = useMemo(() => formatNumericDotsDate(primaryDateStr), [primaryDateStr]);
    const formattedPrimaryTime = useMemo(
        () => (primaryTimeStr ? formatDisplayTime(primaryTimeStr) : ''),
        [primaryTimeStr]
    );

    // Normalize events list, preserving fallback single ceremony if events[] is empty
    const events: NormalizedEvent[] = useMemo(() => {
        const sourceList =
            rawEvents.length > 0
                ? rawEvents
                : primaryDateStr || venueLocation
                ? [
                      {
                          id: 'primary-event',
                          name: mainRawEvent?.name || rawWedding?.eventType || 'Wedding Ceremony',
                          date: primaryDateStr || '',
                          time: primaryTimeStr || '',
                          venue: venueLocation || '',
                          description: rawWedding?.description || '',
                          eventType: 'Wedding',
                      },
                  ]
                : [];

        return sourceList.map((evt, idx) => {
            const displayTitle = cleanText(evt.eventName || evt.name) || 'Ceremony';
            const rawVenue = cleanText(evt.venue || evt.venueName || evt.address);
            const venueText = rawVenue || 'Venue details to follow';
            const hasVenueLocation = Boolean(rawVenue && rawVenue !== 'Venue details to follow');

            const parsed = parseWeddingDate(evt.date, evt.time);
            const formattedDate = evt.date && String(evt.date).trim()
                ? formatLongDateSafe(evt.date) || cleanText(evt.date)
                : 'Date to be announced';
            const shortDateLabel = evt.date && String(evt.date).trim()
                ? formatShortDateSafe(evt.date) || cleanText(evt.date)
                : 'Date TBD';

            const dayNumber = parsed ? String(parsed.getDate()).padStart(2, '0') : String(idx + 1).padStart(2, '0');
            const monthShort = parsed
                ? parsed.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
                : '';
            const weekday = parsed
                ? parsed.toLocaleDateString('en-GB', { weekday: 'long' })
                : '';

            const rawTime = cleanText(evt.time);
            const formattedTime = rawTime ? `${formatDisplayTime(rawTime)} onwards` : '';

            return {
                id: evt.id || `event-${idx}`,
                name: displayTitle,
                date: cleanText(evt.date),
                time: rawTime,
                venue: rawVenue,
                mapLink: cleanText(evt.mapLink),
                description: cleanText(evt.description),
                eventType: cleanText(evt.eventType),
                displayTitle,
                formattedDate,
                shortDateLabel,
                dayNumber,
                monthShort,
                weekday,
                formattedTime,
                venueText,
                hasVenueLocation,
            };
        });
    }, [rawEvents, primaryDateStr, primaryTimeStr, venueLocation, mainRawEvent, rawWedding]);

    const googleMapsLink: string | null = useMemo(() => {
        const candidate =
            cleanText(mainRawEvent?.mapLink) ||
            cleanText(rawEvents.find((e) => e?.mapLink && String(e.mapLink).trim())?.mapLink) ||
            cleanText(rawWedding?.primaryMapLink) ||
            cleanText(rawWedding?.mapLink) ||
            cleanText(rawWedding?.googleMapsLink) ||
            '';

        if (
            !candidate ||
            candidate.toLowerCase() === 'null' ||
            candidate.toLowerCase() === 'undefined' ||
            candidate.toLowerCase() === 'venue details to follow'
        ) {
            if (hasVenue && venueLocation) {
                return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueLocation)}`;
            }
            return null;
        }
        return /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
    }, [mainRawEvent, rawEvents, rawWedding, hasVenue, venueLocation]);

    const buildCalendarPayload = useCallback(
        (opts?: { title?: string; dateStr?: string | null; timeStr?: string | null; venue?: string | null; description?: string | null }): CalendarEventPayload => {
            const eventTitle = opts?.title
                ? `${groomName} & ${brideName} — ${opts.title}`
                : `${groomName} & ${brideName} — Wedding Ceremony`;
            const loc = cleanText(opts?.venue) || venueLocation || 'Wedding Venue';
            const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
            const extraDesc = cleanText(opts?.description);
            const desc = [
                `Wedding celebration of ${groomName} & ${brideName}.`,
                extraDesc || null,
                currentUrl ? `View Invitation & Details: ${currentUrl}` : null,
                `Venue: ${loc}`,
            ]
                .filter(Boolean)
                .join('\n\n');

            const dStr = opts?.dateStr !== undefined ? opts.dateStr : primaryDateStr;
            const tStr = opts?.timeStr !== undefined ? opts.timeStr : primaryTimeStr;
            const parsed = parseWeddingDate(dStr, tStr || '10:00');

            let startDate: Date;
            if (parsed) {
                startDate = parsed;
            } else {
                const fallback = new Date();
                fallback.setDate(fallback.getDate() + 30);
                fallback.setHours(10, 0, 0, 0);
                startDate = fallback;
            }
            const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

            return {
                title: eventTitle,
                description: desc,
                location: loc,
                startDate,
                endDate,
            };
        },
        [groomName, brideName, venueLocation, primaryDateStr, primaryTimeStr]
    );

    const primaryCalendarEvent = useMemo(() => buildCalendarPayload(), [buildCalendarPayload]);

    const openPrimaryCalendar = useCallback(() => {
        setActiveCalendarEvent(primaryCalendarEvent);
    }, [primaryCalendarEvent]);

    const openEventCalendar = useCallback(
        (evt: NormalizedEvent) => {
            setActiveCalendarEvent(
                buildCalendarPayload({
                    title: evt.displayTitle,
                    dateStr: evt.date,
                    timeStr: evt.time,
                    venue: evt.hasVenueLocation ? evt.venueText : venueLocation,
                    description: evt.description,
                })
            );
        },
        [buildCalendarPayload, venueLocation]
    );

    const closeCalendarModal = useCallback(() => {
        setActiveCalendarEvent(null);
    }, []);

    // Live countdown timer
    const [timeLeft, setTimeLeft] = useState<TimeLeftState>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
        hasTarget: Boolean(primaryDateStr),
    });

    useEffect(() => {
        const compute = (): TimeLeftState => {
            const target = parseWeddingDate(primaryDateStr, primaryTimeStr || '00:00');
            if (!target) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, hasTarget: false };
            }
            const diff = target.getTime() - Date.now();
            if (diff <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, hasTarget: true };
            }
            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                isPast: false,
                hasTarget: true,
            };
        };

        setTimeLeft(compute());
        const id = setInterval(() => setTimeLeft(compute()), 1000);
        return () => clearInterval(id);
    }, [primaryDateStr, primaryTimeStr]);

    // Honour ?reset=true, ?preview=true, ?test=true, ?opened=true & localStorage rsvp_submitted_<eventId>
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('opened') === 'true') {
                setIsCoverOpen(true);
            }
            if (isPreview) return;

            const eventId = wedding?.events?.[0]?.id || wedding?.id;
            if (
                params.get('reset') === 'true' ||
                params.get('preview') === 'true' ||
                params.get('test') === 'true' ||
                params.get('test') === '1'
            ) {
                if (params.get('reset') === 'true' && eventId) {
                    try {
                        localStorage.removeItem(`rsvp_submitted_${eventId}`);
                    } catch {
                        /* storage blocked */
                    }
                }
                setStep('INVITE');
                return;
            }

            if (eventId) {
                try {
                    const hasSubmitted = localStorage.getItem(`rsvp_submitted_${eventId}`);
                    if (hasSubmitted) {
                        setStep('ALREADY_REGISTERED');
                        setIsCoverOpen(true);
                    }
                } catch {
                    /* storage blocked */
                }
            }
        }
    }, [wedding, isPreview]);

    const incrementGuests = useCallback(() => {
        setStepperDir('up');
        setAdultCount((prev) => Math.min(10, prev + 1));
    }, []);

    const decrementGuests = useCallback(() => {
        setStepperDir('down');
        setAdultCount((prev) => Math.max(1, prev - 1));
    }, []);

    const handleResetAndInvite = useCallback(() => {
        const eventId = wedding?.events?.[0]?.id || wedding?.id;
        if (eventId) {
            try {
                localStorage.removeItem(`rsvp_submitted_${eventId}`);
            } catch {
                /* ignore */
            }
        }
        setStep('INVITE');
        setIsCoverOpen(true);
    }, [wedding]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!guestName.trim()) {
                setNameError(true);
                const input = document.getElementById('rsvp-guest-name');
                if (input) input.focus();
                return;
            }
            setNameError(false);
            setIsSubmitting(true);
            setSubmitError(null);

            const payload = {
                guestName: guestName.trim(),
                status,
                adultCount: Number(adultCount) || 1,
                childCount: 0,
                phone: phone.trim(),
                message: message.trim(),
            };

            try {
                const response = await fetch(`/api/rsvp/${wedding.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const eventId = wedding?.events?.[0]?.id || wedding?.id;
                    if (eventId) {
                        try {
                            localStorage.setItem(`rsvp_submitted_${eventId}`, 'true');
                        } catch {
                            /* ignore */
                        }
                    }
                    setStep('SUCCESS');
                } else {
                    setSubmitError('Something went wrong while saving your RSVP. Please try again.');
                }
            } catch {
                setSubmitError('Could not connect to the server. Please check your network and try again.');
            } finally {
                setIsSubmitting(false);
            }
        },
        [guestName, status, adultCount, phone, message, wedding]
    );

    const audioUrl: string =
        cleanText(rawWedding?.audioUrl) ||
        cleanText(rawWedding?.musicUrl) ||
        '/music/shubha-aagaman.m4a';

    const customGalleryImages: string[] = useMemo(() => {
        if (Array.isArray(rawWedding?.galleryImages)) {
            return rawWedding.galleryImages
                .map((u: unknown) => (typeof u === 'string' ? u.trim() : ''))
                .filter(Boolean);
        }
        return [];
    }, [rawWedding?.galleryImages]);

    return {
        // Couple & Lineage
        groomName,
        brideName,
        hasBride,
        coupleNames,
        groomInitial,
        brideInitial,
        rawGroomParents: cleanText(wedding?.groomParents),
        rawBrideParents: cleanText(wedding?.brideParents),
        groomParentsFormatted,
        brideParentsFormatted,
        invitationMessage,
        rsvpContact,
        formattedRsvpDeadline,

        // Primary Ceremony & Venue
        primaryDateStr,
        primaryTimeStr,
        formattedPrimaryDate,
        shortPrimaryDate,
        numericPrimaryDate,
        formattedPrimaryTime,
        venueLocation,
        hasVenue,
        venueCity,
        googleMapsLink,

        // Events & Media
        events,
        audioUrl,
        customGalleryImages,
        timeLeft,

        // UI & Cover State
        step,
        setStep,
        isCoverOpen,
        setIsCoverOpen,

        // Calendar Modal
        activeCalendarEvent,
        openPrimaryCalendar,
        openEventCalendar,
        closeCalendarModal,

        // RSVP Form State & Handlers
        status,
        setStatus,
        guestName,
        setGuestName,
        nameError,
        setNameError,
        phone,
        setPhone,
        adultCount,
        stepperDir,
        incrementGuests,
        decrementGuests,
        message,
        setMessage,
        isSubmitting,
        submitError,
        handleSubmit,
        handleResetAndInvite,
    };
}

