import React from 'react';
import AppCard from './AppCard';
import { AppItem } from '../types';

interface AppGridProps {
  apps: AppItem[];
  onAppClick: (app: AppItem) => void;
}

const AppGrid: React.FC<AppGridProps> = ({ apps, onAppClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
      {apps.map((app) => (
        <AppCard 
          key={app.id} 
          app={app} 
          onClick={onAppClick} 
        />
      ))}
    </div>
  );
};

export default AppGrid;