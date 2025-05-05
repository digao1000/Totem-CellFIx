import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { CloudDrizzle } from 'lucide-react';

// Mock weather data for demonstration
// In a real app, you would fetch this from a weather API
export function useWeather(): WeatherData {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'Sunny',
    icon: 'sun'
  });

  useEffect(() => {
    // Simulate weather changes every 5 minutes
    const interval = setInterval(() => {
      const conditions = [
        { condition: 'Sunny', icon: 'sun', temp: Math.floor(Math.random() * 10) + 20 },
        { condition: 'Cloudy', icon: 'cloud', temp: Math.floor(Math.random() * 5) + 18 },
        { condition: 'Rainy', icon: 'cloud-drizzle', temp: Math.floor(Math.random() * 5) + 15 },
        { condition: 'Stormy', icon: 'cloud-lightning', temp: Math.floor(Math.random() * 5) + 12 }
      ];
      
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setWeather({
        temperature: randomCondition.temp,
        condition: randomCondition.condition,
        icon: randomCondition.icon
      });
    }, 5 * 60 * 1000); // Every 5 minutes

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return weather;
}