import { z } from 'zod';

export const EventSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    endTime: z.string().optional(),
    venue: z.string().optional(),
    isCustomVenue: z.boolean().default(false).optional(),
    mapLink: z.string().nullable().optional(),
    tagline: z.string().nullable().optional(),
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
    // Step 1: Couple Details
    groomName: z.string().optional(),
    brideName: z.string().optional(),
    groomParents: z.string().optional(),
    brideParents: z.string().optional(),
    primaryDate: z.string().optional(),
    timezone: z.string().default('Asia/Kolkata').optional(),
    defaultVenueName: z.string().optional(),
    defaultVenueAddress: z.string().optional(),
    globalTagline: z.string().optional(),

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
    { id: 'haldi', name: 'Haldi', date: '', time: '', endTime: '', venue: '', description: 'Yellow vibes only!', tagline: '', isCustomVenue: false },
    { id: 'mehendi', name: 'Mehendi', date: '', time: '', endTime: '', venue: '', description: 'Art on hands.', tagline: '', isCustomVenue: false },
    { id: 'sangeet', name: 'Sangeet', date: '', time: '', endTime: '', venue: '', description: 'Night of music and dance.', tagline: '', isCustomVenue: false },
    { id: 'wedding', name: 'Wedding', date: '', time: '', endTime: '', venue: '', description: 'The big day.', tagline: '', isCustomVenue: false },
    { id: 'reception', name: 'Reception', date: '', time: '', endTime: '', venue: '', description: 'Dinner and celebration.', tagline: '', isCustomVenue: false },
];
