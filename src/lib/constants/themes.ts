export interface Theme {
    id: string;
    name: string;
    description: string;
    colors: string[];
    thumbnail: string; // URL to an image
}

export const THEMES: Theme[] = [
    {
        id: 'royal-gold',
        name: 'Royal Heritage',
        description: 'A classic combination of deep reds and gold, inspired by royal forts.',
        colors: ['#800000', '#D4AF37'],
        thumbnail: 'https://placehold.co/600x800/800000/D4AF37?text=Royal+Heritage',
    },
    {
        id: 'floral-blush',
        name: 'Floral Blush',
        description: 'Soft pastels and watercolor floral patterns for a modern touch.',
        colors: ['#FFC0CB', '#FFFFFF'],
        thumbnail: 'https://placehold.co/600x800/FFE4E1/DB7093?text=Floral+Blush',
    },
    {
        id: 'marigold-yellow',
        name: 'Marigold Joy',
        description: 'Vibrant yellows and oranges representing the Haldi ceremony.',
        colors: ['#FFD700', '#FFA500'],
        thumbnail: 'https://placehold.co/600x800/FFD700/8B4513?text=Marigold+Joy',
    },
    {
        id: 'midnight-star',
        name: 'Midnight Star',
        description: 'Elegant navy blue with silver accents for evening receptions.',
        colors: ['#191970', '#C0C0C0'],
        thumbnail: 'https://placehold.co/600x800/191970/C0C0C0?text=Midnight+Star',
    },
];
