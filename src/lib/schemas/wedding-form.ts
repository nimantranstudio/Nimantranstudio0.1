import { z } from 'zod';

export const EventSchema = z.object({
    id: z.string(),
    name: z.string().optional(), // Relaxed for draft saving
    date: z.string().optional(),
    time: z.string().optional(),
    venue: z.string().optional(),
    mapLink: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    eventType: z.string().nullable().optional(),
    rsvpDeadline: z.string().nullable().optional(),
    collectDietary: z.boolean().nullable().optional(),
    allowCompanions: z.boolean().nullable().optional(),
    guests: z.array(z.object({
        id: z.string(),
        name: z.string(),
        status: z.enum(['attending', 'declined', 'pending']),
        phone: z.string().nullable().optional(),
        companions: z.number().nullable().optional(),
        dietary: z.enum(['VEG', 'NON_VEG']).nullable().optional()
    })).nullable().optional(),
});

export const WeddingFormSchema = z.object({
    // Couple Details - Optional for standalone/draft usage
    groomName: z.string().optional(),
    brideName: z.string().optional(),
    groomParents: z.string().optional(),
    brideParents: z.string().optional(),

    // Events
    events: z.array(EventSchema).optional(),

    // Contact / RSVP
    rsvpContact: z.string().optional(),
    rsvpDeadline: z.string().optional(),

    // Custom Message
    invitationMessage: z.string().optional(),
});

export type WeddingFormData = z.infer<typeof WeddingFormSchema>;

export type WeddingEvent = z.infer<typeof EventSchema>;

export const DEFAULT_EVENTS: WeddingEvent[] = [
    {
        id: 'evt_1',
        name: 'Wedding Ceremony',
        date: '',
        time: '',
        venue: '',
        description: 'Join us as we tie the knot!',
    },
    {
        id: 'evt_2',
        name: 'Reception',
        date: '',
        time: '',
        venue: '',
        description: 'Celebrate with us over dinner and dancing.',
    }
];
