export interface WeddingVideoInputProps {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  eventType: string; // e.g. "Wedding", "Haldi", "Reception"
  themeColor: string; // Hex color code
  musicUrl?: string;
  backgroundImageUrl?: string; // Optional custom background
}
