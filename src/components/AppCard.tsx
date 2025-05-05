import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { AppItem } from '../types';

// Define a type for the icon components map
type IconComponentsMap = { [key: string]: React.FC<LucideProps> };

// Cast LucideIcons to the defined type, filtering out non-component exports if necessary
// This assumes all relevant icon exports are React.FC<LucideProps>
const LucideIconComponents = LucideIcons as unknown as IconComponentsMap;

interface AppCardProps {
  app: AppItem;
  onClick: (app: AppItem) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  // Dynamically get the icon component from Lucide
  const IconName = app.icon.charAt(0).toUpperCase() + app.icon.slice(1);
  const IconComponent = LucideIconComponents[IconName] || LucideIcons.AppWindow;

  // Define card styles based on whether a background image exists
  const cardStyle: React.CSSProperties = app.backgroundImageUrl
    ? {
        backgroundImage: `url(${app.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        backgroundColor: app.color || '#475569', // Fallback color if none set
      };

  // Determine text color based on background for better contrast (simple example)
  // You might want a more sophisticated contrast checker
  const textColorClass = app.backgroundImageUrl ? "text-white" : "text-white"; // Defaulting to white, adjust as needed
  // Maybe add a subtle overlay when image is present for text readability
  const overlayClass = app.backgroundImageUrl ? "bg-black bg-opacity-30" : "";

  return (
    <div 
      className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 
                transform hover:scale-105 hover:shadow-xl cursor-pointer h-full"
      style={cardStyle}
      onClick={() => onClick(app)}
    >
      {/* Optional overlay for text contrast on image backgrounds */}
      <div className={`absolute inset-0 ${overlayClass} rounded-xl`}></div>

      {/* Content positioned relative to allow overlay */}
      <div className={`relative z-10 p-6 flex flex-col items-center justify-center h-full ${textColorClass}`}>
        {/* Conditionally render the icon only if no background image is set */}
        {!app.backgroundImageUrl && IconComponent && (
          <div className={`rounded-full p-3 mb-3 bg-white bg-opacity-20`}>
            <IconComponent className={`h-10 w-10 ${textColorClass}`} />
          </div>
        )}

        {/* Always render the text if showTextOnly is false */}
        {!app.showTextOnly && (
          <h3 className={`text-lg font-bold mt-2 text-center ${textColorClass}`}>{app.name}</h3>
        )}
      </div>
      
      {/* Subtle shimmer effect on hover - might be less visible on image background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10
                     -translate-x-full hover:translate-x-full transition-all duration-1500 ease-in-out rounded-xl" /> 
    </div>
  );
};

export default AppCard;