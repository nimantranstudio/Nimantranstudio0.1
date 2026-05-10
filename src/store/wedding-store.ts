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
        }),
        {
            name: 'nimantran-wedding-storage',
            version: 2,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // if we had no version or version 0, reset or migrate
                    // For now, just return the persisted state as is, or reset if needed
                    return persistedState as WeddingState;
                }
                return persistedState as WeddingState;
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
            onRehydrateStorage: () => (state) => {
                console.log('Hydration finished for version 2');
            },
        }
    )
);
