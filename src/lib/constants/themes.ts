export interface Theme {
    id: string;
    name: string;
    description: string;
    colors: string[];
    thumbnail: string; // URL to an image
    previewImages: string[]; // List of image URLs
    bundleName?: string; // Optional bundle name
    tag?: string;
}

// THEMES constant removed to enforce dynamic fetching from API
export const THEMES: Theme[] = [];
