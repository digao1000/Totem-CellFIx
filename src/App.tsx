import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import Header from './components/Header';
import AppGrid from './components/AppGrid';
import Modal from './components/Modal';
import ToolsPanel from './components/ToolsPanel';
import { AppItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultApps } from './data/defaultApps';

// Function to get the system's default timezone
const getDefaultTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    console.warn("Could not detect system timezone, defaulting to UTC.");
    return 'UTC'; // Fallback timezone
  }
};

function App() {
  // State for apps - initialized from localStorage or defaults
  const [apps, setApps] = useLocalStorage<AppItem[]>('totem-apps', defaultApps);
  
  // State for the currently selected app (for modal)
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  
  // State for tools panel visibility
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);

  // State for timezone
  const [timezone, setTimezone] = useLocalStorage<string>(
    'totem-timezone', 
    getDefaultTimezone() // Initialize with system timezone or fallback
  );

  // Handle app click
  const handleAppClick = (app: AppItem) => {
    setSelectedApp(app);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  // Handle tools button click
  const handleToolsClick = () => {
    setIsToolsPanelOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header with clock and weather */}
      <Header timezone={timezone} />
      
      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <AppGrid 
          apps={apps} 
          onAppClick={handleAppClick} 
        />
      </main>
      
      {/* Footer with tools button */}
      <footer className="bg-slate-800 text-white p-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm text-slate-300">© 2025 Digital Totem</div>
          
          <button
            onClick={handleToolsClick}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg 
                      flex items-center transition-colors duration-200"
          >
            <Settings className="mr-2 h-5 w-5" />
            Tools
          </button>
        </div>
      </footer>
      
      {/* Modal for displaying app content */}
      <Modal 
        app={selectedApp} 
        onClose={handleCloseModal} 
      />
      
      {/* Tools panel for managing apps */}
      <ToolsPanel 
        isOpen={isToolsPanelOpen}
        onClose={() => setIsToolsPanelOpen(false)}
        apps={apps}
        onAppsChange={setApps}
        currentTimezone={timezone}
        onTimezoneChange={setTimezone}
      />
    </div>
  );
}

export default App;