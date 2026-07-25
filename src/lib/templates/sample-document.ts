import { CardDocument } from './card-document';

/**
 * A hand-written sample CardDocument (Sohala-style wedding card) used to
 * exercise CardRenderer end-to-end before the editor and migration exist.
 * The background is a placeholder; real templates upload their own.
 */
export const SAMPLE_DOCUMENT: CardDocument = {
    id: 'sample',
    name: 'Sample — Wedding',
    eventType: 'wedding',
    canvas: { aspectRatio: '3:4' },
    background: {
        imageUrl: 'https://picsum.photos/seed/sohala/1080/1440',
        fit: 'cover',
    },
    layers: [
        {
            id: 'l1',
            binding: 'eventName',
            box: { x: 10, y: 20, w: 80, h: 8 },
            style: { fontFamily: 'Playfair Display', fontSize: 7, weight: 500, color: '#ffffff', align: 'center', letterSpacing: 0.15, textTransform: 'uppercase' },
            anim: { type: 'fade-up', delay: 200, duration: 700 },
        },
        {
            id: 'l2',
            binding: 'heading',
            box: { x: 12, y: 30, w: 76, h: 6 },
            style: { fontFamily: 'Cormorant Garamond', fontSize: 4.5, italic: true, color: '#f5f0e6', align: 'center' },
            anim: { type: 'fade', delay: 500, duration: 700 },
        },
        {
            id: 'l3',
            binding: 'groomName',
            box: { x: 8, y: 40, w: 84, h: 9 },
            style: { fontFamily: 'Great Vibes', fontSize: 9, color: '#ffffff', align: 'center' },
            anim: { type: 'fade-up', delay: 800, duration: 700 },
        },
        {
            id: 'l4',
            binding: 'static',
            text: '&',
            box: { x: 45, y: 50, w: 10, h: 5 },
            style: { fontFamily: 'Cormorant Garamond', fontSize: 5, italic: true, color: '#f5f0e6', align: 'center' },
            anim: { type: 'fade', delay: 1000, duration: 500 },
        },
        {
            id: 'l5',
            binding: 'brideName',
            box: { x: 8, y: 55, w: 84, h: 9 },
            style: { fontFamily: 'Great Vibes', fontSize: 9, color: '#ffffff', align: 'center' },
            anim: { type: 'fade-up', delay: 1100, duration: 700 },
        },
        {
            id: 'l6',
            binding: 'eventDate',
            box: { x: 15, y: 70, w: 70, h: 5 },
            style: { fontFamily: 'Montserrat', fontSize: 3.5, weight: 600, color: '#ffffff', align: 'center', letterSpacing: 0.2 },
            anim: { type: 'fade', delay: 1400, duration: 600 },
        },
        {
            id: 'l7',
            binding: 'venue',
            box: { x: 15, y: 78, w: 70, h: 8 },
            style: { fontFamily: 'Montserrat', fontSize: 2.6, color: '#f0ead9', align: 'center', lineHeight: 1.4 },
            anim: { type: 'fade', delay: 1600, duration: 600 },
        },
    ],
};
