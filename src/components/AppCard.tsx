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

  return (
    <div 
      className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 
                transform hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ backgroundColor: app.color || '#475569' }}
      onClick={() => onClick(app)}
    >
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="bg-white bg-opacity-20 rounded-full p-4 mb-3">
          <IconComponent className="h-12 w-12 text-white" />
        </div>
        {!app.showTextOnly && (
          <h3 className="text-xl font-bold text-white mt-2 text-center">{app.name}</h3>
        )}
      </div>
      
      {/* Subtle shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10
                     -translate-x-full hover:translate-x-full transition-all duration-1500 ease-in-out" />
    </div>
  );
};

export default AppCard;