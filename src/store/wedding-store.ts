import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeddingFormData, DEFAULT_EVENTS } from '@/lib/schemas/wedding-form';

interface BundleItemInfo {
    id: string;
    eventId: string;
    eventType?: string; // Kept for legacy support
    event?: { eventName: string };
    templateName: string;
    templatePath: string;
    kind?: 'html' | 'structured'; // structured = designed (CardDocument) template
    layout?: any; // CardDocument, present only for structured items
}

interface WeddingState {
    selectedThemeId: string | null;
    selectedPlan: string | null;
    bundleImages: string[];
    bundleItems: BundleItemInfo[];
    formData: WeddingFormData;
    /**
     * Field keys the user has ever set, even to an empty string — distinct from
     * a field simply being '' (which is also the untouched-default value).
     * Lets the preview show a sample value only for genuinely untouched fields,
     * while an intentionally cleared field stays cleared. Top-level formData
     * keys are tracked as-is (e.g. 'brideName'); per-event fields as
     * `event:<eventId>:<field>` (e.g. 'event:abc123:venue').
     */
    touchedFields: string[];
    lastSavedWeddingId: string | null;
    lastSavedWeddingSlug: string | null;

    isAuthenticated: boolean;
    isAdmin: boolean;
    userPhone: string | null;

    setThemeId: (id: string) => void;
    setBundleData: (plan: string, images: string[], items?: BundleItemInfo[]) => void;
    updateFormData: (data: Partial<WeddingFormData>) => void;
    addEvent: (event?: Partial<WeddingFormData['events'][0]>) => void;
    removeEvent: (id: string) => void;
    updateEvent: (id: string, eventData: Partial<WeddingFormData['events'][0]>) => void;
    /** Marks preview-default field keys as touched without changing their value — used when loading real saved data so defaults never show over it. */
    markFieldsTouched: (keys: string[]) => void;
    saveWedding: () => Promise<{ success: boolean; wedding?: any; error?: string }>;
    login: (phone: string, isAdmin?: boolean) => void;
    logout: () => void;
    resetForm: () => void;
    /** Called after a successful payment: marks the user in and records the provisioned wedding. */
    setCheckoutComplete: (weddingId?: string | null, phone?: string | null, slug?: string | null) => void;
}

const INITIAL_FORM_DATA: WeddingFormData = {
    groomName: '',
    brideName: '',
    groomParents: '',
    brideParents: '',
    primaryDate: '',
    primaryTime: '',
    timezone: 'Asia/Kolkata',
    defaultVenueName: '',
    defaultVenueAddress: '',
    primaryMapLink: '',
    globalTagline: '',
    events: DEFAULT_EVENTS,
    rsvpContact: '',
    rsvpDeadline: '',
    eventType: 'Wedding',
    invitationMessage: '',
};

export const useWeddingStore = create<WeddingState>()(
    persist(
        (set, get) => ({
            selectedThemeId: null,
            selectedPlan: null,
            bundleImages: [],
            bundleItems: [],
            formData: INITIAL_FORM_DATA,
            touchedFields: [],
            lastSavedWeddingId: null,
            lastSavedWeddingSlug: null,
            isAuthenticated: false,
            isAdmin: false,
            userPhone: null,

            setThemeId: (id) => set({ selectedThemeId: id }),
            setBundleData: (plan, images, items = []) => set({ selectedPlan: plan, bundleImages: images, bundleItems: items }),

            login: (phone, isAdmin = false) => set({ isAuthenticated: true, userPhone: phone, isAdmin }),
            logout: () => set({ isAuthenticated: false, userPhone: null, isAdmin: false }),
            resetForm: () => set({ formData: INITIAL_FORM_DATA, touchedFields: [] }),

            setCheckoutComplete: (weddingId, phone, slug) =>
                set((state) => ({
                    isAuthenticated: true,
                    userPhone: phone ?? state.userPhone,
                    lastSavedWeddingId: weddingId ?? state.lastSavedWeddingId,
                    lastSavedWeddingSlug: slug ?? state.lastSavedWeddingSlug,
                })),

            updateFormData: (data) => set((state) => {
                const newKeys = Object.keys(data).filter((k) => !state.touchedFields.includes(k));
                return {
                    formData: { ...state.formData, ...data },
                    touchedFields: newKeys.length ? [...state.touchedFields, ...newKeys] : state.touchedFields,
                };
            }),

            markFieldsTouched: (keys) => set((state) => {
                const newKeys = keys.filter((k) => !state.touchedFields.includes(k));
                return newKeys.length ? { touchedFields: [...state.touchedFields, ...newKeys] } : state;
            }),

            addEvent: (event?: Partial<WeddingFormData['events'][0]>) => set((state) => ({
                formData: {
                    ...state.formData,
                    events: [
                        ...state.formData.events,
                        {
                            id: crypto.randomUUID(),
                            name: 'New Event',
                            date: '',
                            time: '',
                            venue: '',
                            guests: [],
                            ...event
                        },
                    ],
                },
            })),

            removeEvent: (id) => set((state) => ({
                formData: {
                    ...state.formData,
                    events: state.formData.events.filter((e) => e.id !== id),
                },
            })),

            updateEvent: (id, eventData) => set((state) => {
                const newKeys = Object.keys(eventData)
                    .map((k) => `event:${id}:${k}`)
                    .filter((k) => !state.touchedFields.includes(k));
                return {
                    formData: {
                        ...state.formData,
                        events: state.formData.events.map((e) =>
                            e.id === id ? { ...e, ...eventData } : e
                        ),
                    },
                    touchedFields: newKeys.length ? [...state.touchedFields, ...newKeys] : state.touchedFields,
                };
            }),

            saveWedding: async () => {
                const { formData, selectedThemeId } = get();
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

                try {
                    // Auth is via the HttpOnly session cookie, sent automatically
                    // on this same-origin request — no bearer token needed.
                    const response = await fetch('/api/wedding', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ formData, selectedThemeId }),
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);

                    // Before payment there is no session yet. A 401 is expected and
                    // not an error: the form is already persisted locally, and the
                    // wedding is provisioned server-side at payment. Treat as a
                    // successful local save so the UI stays calm.
                    if (response.status === 401) {
                        return { success: true };
                    }

                    if (!response.ok) {
                        const errorData = await response.json();
                        return { success: false, error: errorData.error || `Server error (${response.status})` };
                    }

                    const result = await response.json();
                    if (result.success && result.wedding) {
                        // Record the saved wedding id (used for dashboard / RSVP links).
                        // We intentionally do NOT sync the server's events back into
                        // formData: this endpoint creates fresh event rows (new ids) on
                        // every debounced auto-save, and overwriting local events mid-edit
                        // changed their ids out from under the form. That dropped the
                        // just-typed date (updateEvent no longer matched the id) and
                        // remounted the event list + preview (the flicker). Local formData
                        // stays the single source of truth while the user is editing.
                        set({
                            lastSavedWeddingId: result.wedding.id,
                            lastSavedWeddingSlug: result.wedding.slug || null,
                        });
                    }
                    return result;
                } catch (error: any) {
                    clearTimeout(timeoutId);
                    if (error.name === 'AbortError') {
                        return { success: false, error: 'Request timed out. Please try again.' };
                    }
                    console.error('Failed to save wedding:', error);
                    return { success: false, error: error.message || 'Network error' };
                }
            },
        }),
        {
            name: 'nimantran-wedding-storage',
            version: 4,
            migrate: (persistedState: any, version: number) => {
                const state = persistedState as WeddingState;

                // v3: refresh event messages that still hold an old/empty default
                // with the new celebratory copy, without clobbering user edits.
                if (version < 3 && state?.formData?.events) {
                    const STALE_DESCRIPTIONS = new Set([
                        '',
                        'Yellow vibes only!',
                        'Art on hands.',
                        'Night of music and dance.',
                        'The big day.',
                        'Dinner and celebration.',
                    ]);
                    const defaultsById = new Map(
                        DEFAULT_EVENTS.map((e) => [e.id, e.description])
                    );

                    state.formData = {
                        ...state.formData,
                        events: state.formData.events.map((e) => {
                            const fresh = defaultsById.get(e.id);
                            const current = (e.description ?? '').trim();
                            return fresh && STALE_DESCRIPTIONS.has(current)
                                ? { ...e, description: fresh }
                                : e;
                        }),
                    };
                }

                // v4: introduces touchedFields (preview-default gating). Backfill it from
                // whatever's already non-empty, so existing real data is never mistaken
                // for "untouched" and papered over with a sample preview value.
                if (version < 4 && state?.formData) {
                    const touched: string[] = Array.isArray((state as any).touchedFields) ? (state as any).touchedFields : [];
                    const TOP_LEVEL_PREVIEW_FIELDS = ['groomName', 'brideName', 'groomParents', 'brideParents', 'primaryDate', 'primaryTime', 'defaultVenueName'] as const;
                    TOP_LEVEL_PREVIEW_FIELDS.forEach((key) => {
                        if (state.formData[key] && !touched.includes(key)) touched.push(key);
                    });
                    (state.formData.events || []).forEach((e) => {
                        (['date', 'time', 'venue'] as const).forEach((field) => {
                            const touchKey = `event:${e.id}:${field}`;
                            if (e[field] && !touched.includes(touchKey)) touched.push(touchKey);
                        });
                    });
                    (state as any).touchedFields = touched;
                }

                return state;
            },
            partialize: (state) => ({
                selectedThemeId: state.selectedThemeId,
                selectedPlan: state.selectedPlan,
                bundleImages: state.bundleImages,
                bundleItems: state.bundleItems,
                formData: state.formData,
                touchedFields: state.touchedFields,
                lastSavedWeddingId: state.lastSavedWeddingId,
                isAuthenticated: state.isAuthenticated,
                isAdmin: state.isAdmin,
                userPhone: state.userPhone,
            }),
            onRehydrateStorage: () => () => {
                console.log('Hydration finished for version 3');
            },
        }
    )
);
