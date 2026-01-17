import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeddingFormData, DEFAULT_EVENTS } from '@/lib/schemas/wedding-form';

interface WeddingState {
    selectedThemeId: string | null;
    formData: WeddingFormData;
    lastSavedWeddingId: string | null;

    setThemeId: (id: string) => void;
    updateFormData: (data: Partial<WeddingFormData>) => void;
    addEvent: () => void;
    removeEvent: (id: string) => void;
    updateEvent: (id: string, eventData: Partial<WeddingFormData['events'][0]>) => void;
    saveWedding: () => Promise<{ success: boolean; wedding?: any; error?: string }>;
}

const INITIAL_FORM_DATA: WeddingFormData = {
    groomName: '',
    brideName: '',
    groomParents: '',
    brideParents: '',
    events: DEFAULT_EVENTS,
    rsvpContact: '',
    rsvpDeadline: '',
    invitationMessage: '',
};

export const useWeddingStore = create<WeddingState>()(
    persist(
        (set, get) => ({
            selectedThemeId: null,
            formData: INITIAL_FORM_DATA,
            lastSavedWeddingId: null,

            setThemeId: (id) => set({ selectedThemeId: id }),

            updateFormData: (data) => set((state) => ({
                formData: { ...state.formData, ...data },
            })),

            addEvent: () => set((state) => ({
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
                    if (result.success && result.wedding?.id) {
                        set({ lastSavedWeddingId: result.wedding.id });
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
