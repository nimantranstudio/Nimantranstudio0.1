import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeddingFormData, DEFAULT_EVENTS } from '@/lib/schemas/wedding-form';
import { auth } from '@/lib/firebase';

interface BundleItemInfo {
    id: string;
    eventId: string;
    eventType?: string; // Kept for legacy support
    event?: { eventName: string };
    templateName: string;
    templatePath: string;
}

interface WeddingState {
    selectedThemeId: string | null;
    selectedPlan: string | null;
    bundleImages: string[];
    bundleItems: BundleItemInfo[];
    formData: WeddingFormData;
    lastSavedWeddingId: string | null;

    isAuthenticated: boolean;
    isAdmin: boolean;
    userPhone: string | null;

    setThemeId: (id: string) => void;
    setBundleData: (plan: string, images: string[], items?: BundleItemInfo[]) => void;
    updateFormData: (data: Partial<WeddingFormData>) => void;
    addEvent: (event?: Partial<WeddingFormData['events'][0]>) => void;
    removeEvent: (id: string) => void;
    updateEvent: (id: string, eventData: Partial<WeddingFormData['events'][0]>) => void;
    saveWedding: () => Promise<{ success: boolean; wedding?: any; error?: string }>;
    login: (phone: string, isAdmin?: boolean) => void;
    logout: () => void;
    resetForm: () => void;
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
            lastSavedWeddingId: null,
            isAuthenticated: false,
            isAdmin: false,
            userPhone: null,

            setThemeId: (id) => set({ selectedThemeId: id }),
            setBundleData: (plan, images, items = []) => set({ selectedPlan: plan, bundleImages: images, bundleItems: items }),

            login: (phone, isAdmin = false) => set({ isAuthenticated: true, userPhone: phone, isAdmin }),
            logout: () => set({ isAuthenticated: false, userPhone: null, isAdmin: false }),
            resetForm: () => set({ formData: INITIAL_FORM_DATA }),

            updateFormData: (data) => set((state) => ({
                formData: { ...state.formData, ...data },
            })),

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

            updateEvent: (id, eventData) => set((state) => ({
                formData: {
                    ...state.formData,
                    events: state.formData.events.map((e) =>
                        e.id === id ? { ...e, ...eventData } : e
                    ),
                },
            })),

            saveWedding: async () => {
                const { formData, selectedThemeId } = get();
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

                try {
                    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
                    const response = await fetch('/api/wedding', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ formData, selectedThemeId }),
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        const errorData = await response.json();
                        return { success: false, error: errorData.error || `Server error (${response.status})` };
                    }

                    const result = await response.json();
                    if (result.success && result.wedding) {
                        const backendWedding = result.wedding;
                        set({ lastSavedWeddingId: backendWedding.id });

                        // Sync backend events (with real DB IDs) back to local store
                        // ensuring the Dashboard links match the Database records
                        if (backendWedding.events && Array.isArray(backendWedding.events)) {
                            const syncedEvents = backendWedding.events.map((evt: any) => ({
                                id: evt.id, // THE CRITICAL DB ID
                                name: evt.name,
                                date: evt.date,
                                time: evt.time,
                                venue: evt.venue,
                                mapLink: evt.mapLink,
                                description: evt.description,
                                eventType: evt.eventType,
                                rsvpDeadline: evt.rsvpDeadline,
                                allowCompanions: evt.allowCompanions,
                                collectDietary: evt.collectDietary,
                                maxGuests: evt.maxGuests,
                                guests: [] // Guests are separate in DB, for now reset or keep empty as this is 'creating' phase
                            }));

                            set((state) => ({
                                formData: {
                                    ...state.formData,
                                    events: syncedEvents
                                }
                            }));
                        }
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
            version: 3,
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

                return state;
            },
            partialize: (state) => ({
                selectedThemeId: state.selectedThemeId,
                selectedPlan: state.selectedPlan,
                bundleImages: state.bundleImages,
                bundleItems: state.bundleItems,
                formData: state.formData,
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
