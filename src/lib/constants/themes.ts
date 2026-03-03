export interface BundleData {
    id: string;
    name: string;
    whatsappPrice: number;
    printablePrice: number;
    completePrice: number;
    description?: string;
    itemImages?: string; // JSON string
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    previewImages: string[];
    bundleName?: string;
    bundles?: BundleData[];
    tag?: string;
    isPopular?: boolean;
    isBestSeller?: boolean;
}

// THEMES constant removed to enforce dynamic fetching from API
export const THEMES: Theme[] = [];
