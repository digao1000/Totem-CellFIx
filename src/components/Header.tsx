import React from 'react';
import { CloudDrizzle, Sun, Cloud, CloudLightning } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { useWeather } from '../hooks/useWeather';

// Define props interface
interface HeaderProps {
  timezone?: string; // Timezone is now optional
}

// Update component signature to accept props
const Header: React.FC<HeaderProps> = ({ timezone }) => {
  // Pass timezone to useClock hook
  const { time, date } = useClock(timezone);
  const weather = useWeather();

  // Map weather icon to Lucide icon component
  const getWeatherIcon = () => {
    switch (weather.icon) {
      case 'sun':
        return <Sun className="h-6 w-6 text-yellow-400" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'cloud-drizzle':
        return <CloudDrizzle className="h-6 w-6 text-blue-400" />;
      case 'cloud-lightning':
        return <CloudLightning className="h-6 w-6 text-purple-400" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-400" />;
    }
  };

  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-2 md:mb-0">
          <h1 className="text-2xl font-bold">Digital Totem</h1>
          <p className="text-slate-300 text-sm">Touch to explore applications</p>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            {getWeatherIcon()}
            <div className="ml-2">
              <div className="font-medium">{weather.temperature}°C</div>
              <div className="text-xs text-slate-300">{weather.condition}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-bold">{time}</div>
            <div className="text-xs text-slate-300">{date}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;