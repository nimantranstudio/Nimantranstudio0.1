import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeddingFormData, DEFAULT_EVENTS } from '@/lib/schemas/wedding-form';

interface WeddingState {
    selectedThemeId: string | null;
    selectedPlan: string | null;
    bundleImages: string[];
    formData: WeddingFormData;
    lastSavedWeddingId: string | null;

    isAuthenticated: boolean;
    isAdmin: boolean;
    userPhone: string | null;

    setThemeId: (id: string) => void;
    setBundleData: (plan: string, images: string[]) => void;
    updateFormData: (data: Partial<WeddingFormData>) => void;
    addEvent: (event?: Partial<WeddingFormData['events'][0]>) => void;
    removeEvent: (id: string) => void;
    updateEvent: (id: string, eventData: Partial<WeddingFormData['events'][0]>) => void;
    saveWedding: () => Promise<{ success: boolean; wedding?: any; error?: string }>;
    login: (phone: string, isAdmin?: boolean) => void;
    logout: () => void;
}

const INITIAL_FORM_DATA: WeddingFormData = {
    groomName: '',
    brideName: '',
    groomParents: '',
    brideParents: '',
    primaryDate: '',
    timezone: 'Asia/Kolkata',
    defaultVenueName: '',
    defaultVenueAddress: '',
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
            formData: INITIAL_FORM_DATA,
            lastSavedWeddingId: null,
            isAuthenticated: false,
            isAdmin: false,
            userPhone: null,

            setThemeId: (id) => set({ selectedThemeId: id }),
            setBundleData: (plan, images) => set({ selectedPlan: plan, bundleImages: images }),

            login: (phone, isAdmin = false) => set({ isAuthenticated: true, userPhone: phone, isAdmin }),
            logout: () => set({ isAuthenticated: false, userPhone: null, isAdmin: false }),

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
                    const response = await fetch('/api/wedding', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
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
        }
    )
);
