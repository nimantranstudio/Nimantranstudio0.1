import { z } from 'zod';

export const EventSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    endTime: z.string().optional(),
    venue: z.string().max(500, "Maximum 500 characters").optional(),
    isCustomVenue: z.boolean().default(false).optional(),
    mapLink: z.string().nullable().optional(),
    tagline: z.string().max(108, "Maximum 108 characters").nullable().optional(),
    heading: z.string().max(25, "Maximum 25 characters").nullable().optional(),
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
    groomName: z.string().max(25, "Maximum 25 characters").optional(),
    brideName: z.string().max(25, "Maximum 25 characters").optional(),
    groomParents: z.string().max(100, "Maximum 100 characters").optional(),
    brideParents: z.string().max(100, "Maximum 100 characters").optional(),
    nameOrder: z.enum(['groom_first', 'bride_first']).default('groom_first').optional(),
    // Step 2: Ceremony Details
    primaryDate: z.string().optional(),
    primaryTime: z.string().optional(),
    timezone: z.string().default('Asia/Kolkata').optional(),
    defaultVenueName: z.string().max(500, "Maximum 500 characters").optional(),
    defaultVenueAddress: z.string().max(500, "Maximum 500 characters").optional(),
    primaryMapLink: z.string().nullable().optional(),
    globalTagline: z.string().optional(),

    // Events
    events: z.array(EventSchema).optional(),

    // Contact / RSVP
    rsvpContact: z.string().optional(),
    rsvpDeadline: z.string().optional(),
    allowCompanions: z.boolean().default(false).optional(),
    collectDietary: z.boolean().default(false).optional(),
    eventType: z.string().optional(),

    // Custom Message
    invitationMessage: z.string().max(108, "Maximum 108 characters").optional(),
});

export type WeddingFormData = z.infer<typeof WeddingFormSchema>;

export type WeddingEvent = z.infer<typeof EventSchema>;

export const DEFAULT_EVENTS: WeddingEvent[] = [
    { id: 'haldi', name: 'Haldi', date: '', time: '', endTime: '', venue: '', description: 'Come glow with us! Smear on the golden turmeric, soak in the laughter, and shower the couple with blessings as our wedding journey begins!', tagline: 'Bless the couple with showers of yellow health and happiness', heading: 'Haldi', isCustomVenue: false },
    { id: 'mehendi', name: 'Mehendi', date: '', time: '', endTime: '', venue: '', description: 'Hands full of mehendi, hearts full of love! Join us for an afternoon of intricate art, sweet sounds, and laughter as we color the day with joy.', tagline: 'Join at the mehendi event, with the "Hands full of mehendi , hearts full of love"', heading: 'Mehendi', isCustomVenue: false },
    { id: 'sangeet', name: 'Sangeet', date: '', time: '', endTime: '', venue: '', description: 'Naach, gaana aur full-on hungama! Put on your dancing shoes and join us for a magical night of music, masti, and memories on the dance floor!', tagline: 'Join us to turn up the volume "Naach. gaana aur full-on hungama!"', heading: 'Sangeet', isCustomVenue: false },
    { id: 'reception', name: 'Reception', date: '', time: '', endTime: '', venue: '', description: 'Raise a toast with us! Join the celebration for an evening of love, laughter, delicious food, and dancing as we make memories to cherish forever.', tagline: 'We are pleased to invite you to the reception of', heading: 'Reception', isCustomVenue: false },
];
