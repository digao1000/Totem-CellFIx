export interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string; // Lucide icon name
  color?: string; // Optional background color
  showTextOnly?: boolean; // Optional: if true, only show icon
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}