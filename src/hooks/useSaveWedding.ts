import { useState } from 'react';
import { useWeddingStore } from '@/store/wedding-store';

export function useSaveWedding() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveWedding = async () => {
        setIsSaving(true);
        setError(null);

        const store = useWeddingStore.getState();
        const { formData, selectedThemeId } = store;
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

            const result = await response.json();

            if (!response.ok || !result.success) {
                const errorMessage = result.error?.message || `Server error (${response.status})`;
                setError(errorMessage);
                return { success: false, error: errorMessage, details: result.error?.details };
            }

            if (result.success && result.data) {
                const backendWedding = result.data;
                // Update the store with the saved wedding ID and synced events
                useWeddingStore.setState({ lastSavedWeddingId: backendWedding.id });

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
                        guests: []
                    }));

                    useWeddingStore.setState((state) => ({
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
            let errorMessage = 'Network error';
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            console.error('Failed to save wedding:', error);
            return { success: false, error: errorMessage };
        } finally {
            setIsSaving(false);
        }
    };

    return { saveWedding, isSaving, error };
}
