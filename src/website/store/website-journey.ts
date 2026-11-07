import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Remembers which website design the customer last picked, so the selection
 * page can highlight it after they come back. The URL (/websites/[templateId],
 * ?template=) is the source of truth while moving through the journey; this
 * only covers returning to the list. Kept apart from the card flow's
 * nimantran-wedding-storage so that store is untouched.
 */
interface WebsiteJourneyState {
    selectedTemplateId: string | null;
    selectTemplate: (id: string) => void;
}

export const useWebsiteJourney = create<WebsiteJourneyState>()(
    persist(
        (set) => ({
            selectedTemplateId: null,
            selectTemplate: (id) => set({ selectedTemplateId: id }),
        }),
        { name: 'ns-website-journey', version: 1 }
    )
);
