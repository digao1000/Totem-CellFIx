export interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string; // Lucide icon name
  color?: string; // Optional background color
  showTextOnly?: boolean; // Optional: if true, only show icon
  backgroundImageUrl?: string; // Optional: URL for custom background image
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}