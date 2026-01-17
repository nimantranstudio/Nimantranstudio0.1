import { z } from 'zod';

export const EventSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Event name is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    venue: z.string().min(1, "Venue is required"),
    mapLink: z.string().optional(), // Google Maps link
    description: z.string().optional(),
});

export const WeddingFormSchema = z.object({
    // Couple Details
    groomName: z.string().min(1, "Groom's name is required"),
    brideName: z.string().min(1, "Bride's name is required"),
    groomParents: z.string().optional(),
    brideParents: z.string().optional(),

    // Events
    events: z.array(EventSchema).min(1, "At least one event is required"),

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
