export interface Theme {
    id: string;
    name: string;
    description: string;
    colors: string[];
    thumbnail: string; // URL to an image
    tag?: string;
}

export const THEMES: Theme[] = [
    {
        id: 'rajputana',
        name: 'Rajputana',
        description: 'A royal and grand aesthetic inspired by the palaces of Rajasthan.',
        colors: ['#D4AF37', '#800000', '#F5E6BE'],
        thumbnail: '/theme-rajputana.png',
        tag: 'BEST SELLER',
    },
    {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        description: 'Clean lines and elegant typography for a sophisticated look.',
        colors: ['#2C3E50', '#ECF0F1', '#BDC3C7'],
        thumbnail: '/theme-minimal.png',
        tag: 'POPULAR',
    },
    {
        id: 'floral-bliss',
        name: 'Floral Bliss',
        description: 'Soft pastels and delicate floral patterns for a touch of romance.',
        colors: ['#FFC0CB', '#FFFACD', '#98FB98'],
        thumbnail: '/theme-floral.png',
        tag: 'RECOMMENDED',
    },
    {
        id: 'sand',
        name: 'Minimal Sand',
        description: 'Serene neutral tones and contemporary minimal design.',
        colors: ['#E6DFD4', '#C2B49F', '#8C7B6E'],
        thumbnail: '/theme-sand.png',
    },
    {
        id: 'peshwahi',
        name: 'Peshwahi',
        description: 'A tribute to Maratha grandeur with saffron, gold, and royal motifs.',
        colors: ['#FF9933', '#D4AF37', '#660000'],
        thumbnail: '/theme-peshwahi.png',
        tag: 'BEST SELLER',
    },
    {
        id: 'marathas',
        name: 'Royal Marathas',
        description: 'Bold and brave aesthetic inspired by the Maratha warrior heritage.',
        colors: ['#C51E3A', '#D4AF37', '#2D2D2D'],
        thumbnail: '/theme-marathas.png',
    },
    {
        id: 'blue-lotus',
        name: 'Blue Lotus Buddha',
        description: 'Zen-inspired calm with celestial blues and sacred lotus symbols.',
        colors: ['#0047AB', '#87CEEB', '#FFFFFF'],
        thumbnail: '/theme-blue-lotus.png',
        tag: 'POPULAR',
    },
    {
        id: 'spiritual',
        name: 'Spiritual Souls',
        description: 'Ethereal and divine connection reflected in soft, sacred vibrations.',
        colors: ['#800080', '#DA70D6', '#F5F5F5'],
        thumbnail: '/theme-spiritual.png',
    },
];
