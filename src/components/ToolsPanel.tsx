import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Edit, Trash2, Check, X, Settings, Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { AppItem } from '../types';

// Define a type for the icon components map
type IconComponentsMap = { [key: string]: React.FC<LucideProps> };
// Cast LucideIcons to the defined type
const LucideIconComponents = LucideIcons as unknown as IconComponentsMap;

interface ToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  onAppsChange: (apps: AppItem[]) => void;
  currentTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

interface FormData {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  showTextOnly: boolean;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({ 
  isOpen, 
  onClose, 
  apps, 
  onAppsChange, 
  currentTimezone, 
  onTimezoneChange 
}) => {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    url: '',
    icon: 'app-window',
    color: '#475569',
    showTextOnly: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [searchIcon, setSearchIcon] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Get timezone list
  const timezones = useMemo(() => {
    try {
      // Use type assertion if TS doesn't recognize the API
      return (Intl as any).supportedValuesOf('timeZone') as string[];
    } catch (e) {
      console.error("Error getting timezones: ", e);
      return [currentTimezone];
    }
  }, [currentTimezone]);

  // Get icon names (lowercase first letter)
  const iconNames = useMemo(() => 
    Object.keys(LucideIconComponents)
      .filter(name => name !== 'createLucideIcon' && name.match(/^[A-Z]/))
      .map(name => name.charAt(0).toLowerCase() + name.slice(1)), 
  []); // Empty dependency array, list doesn't change

  // Filter icons based on search
  const filteredIcons = searchIcon 
    ? iconNames.filter(name => name.toLowerCase().includes(searchIcon.toLowerCase()))
    : iconNames;

  // Helper to get an Icon Component safely
  const getIconComponent = (iconName: string): React.FC<LucideProps> | undefined => {
    if (!iconName) return undefined;
    const capitalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    return LucideIconComponents[capitalizedName];
  };

  // Reset form to add new app
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      url: '',
      icon: 'app-window',
      color: '#475569',
      showTextOnly: false
    });
    setIsEditing(false);
    setSelectedAppId(null);
  };

  // Load app data for editing
  const editApp = (app: AppItem) => {
    setFormData({
      id: app.id,
      name: app.name,
      url: app.url,
      icon: app.icon,
      color: app.color || '#475569',
      showTextOnly: app.showTextOnly || false
    });
    setIsEditing(true);
    setSelectedAppId(app.id);
  };

  // Delete an app
  const deleteApp = (id: string) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      onAppsChange(apps.filter(app => app.id !== id));
      resetForm();
    }
  };

  // Save current form data
  const saveApp = () => {
    if (!formData.name || !formData.url || !formData.icon) {
      alert('Please fill in Name, URL, and choose an Icon.');
      return;
    }

    const newApp: AppItem = {
      id: isEditing && formData.id ? formData.id : Date.now().toString(),
      name: formData.name,
      url: formData.url,
      icon: formData.icon,
      color: formData.color,
      showTextOnly: formData.showTextOnly
    };

    let updatedApps;
    if (isEditing) {
      updatedApps = apps.map(app => app.id === newApp.id ? newApp : app);
    } else {
      updatedApps = [...apps, newApp];
    }
    
    onAppsChange(updatedApps);
    resetForm();
  };

  // Handle clicking outside the panel to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Get Icon components needed in the return statement
  const FormDataIcon = getIconComponent(formData.icon);

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-end">
      <div 
        ref={panelRef}
        className="bg-white h-full w-full max-w-md overflow-y-auto shadow-xl animate-slide-in"
      >
        <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <Settings className="mr-2" /> 
            Tools & Settings
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Settings Section */}
        <div className="p-4 border-b">
           <h3 className="text-lg font-semibold mb-4 flex items-center">
             <Clock className="mr-2 h-5 w-5 text-slate-600" /> General Settings
           </h3>
           <div className="space-y-4">
             <div>
               <label htmlFor="timezone-select" className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
               <select 
                 id="timezone-select"
                 value={currentTimezone}
                 onChange={(e) => onTimezoneChange(e.target.value)}
                 className="w-full p-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
               >
                 {timezones.map((tz: string) => (
                   <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                 ))}
               </select>
             </div>
           </div>
        </div>

        {/* App Form */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Plus className="mr-2 h-5 w-5 text-slate-600" /> {isEditing ? 'Edit App' : 'Add New App'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. YouTube"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <div className="flex items-center">
                <div 
                  className="h-10 w-10 flex items-center justify-center border rounded mr-2"
                  style={{ backgroundColor: formData.color }}
                >
                  {FormDataIcon && <FormDataIcon className="h-6 w-6 text-white" />}
                </div>
                <button
                  type="button"
                  className="p-2 border rounded"
                  onClick={() => setShowIcons(!showIcons)}
                >
                  {showIcons ? 'Close Icons' : 'Choose Icon'}
                </button>
              </div>
              
              {showIcons && (
                <div className="mt-2 border p-2 rounded bg-gray-50">
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Search icons..."
                    value={searchIcon}
                    onChange={(e) => setSearchIcon(e.target.value)}
                  />
                  <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
                    {filteredIcons.slice(0, 60).map((iconName) => {
                      // Get component for grid item
                      const GridItemIcon = getIconComponent(iconName);
                      return (
                        <div
                          key={iconName}
                          className={`p-2 border rounded cursor-pointer hover:bg-gray-200 
                                    ${formData.icon === iconName ? 'bg-blue-100 border-blue-500' : ''}`}
                          onClick={() => {
                            setFormData({ ...formData, icon: iconName });
                            setShowIcons(false);
                            setSearchIcon('');
                          }}
                          title={iconName}
                        >
                          {GridItemIcon && <GridItemIcon className="h-6 w-6" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                className="p-1 border rounded h-10 w-full"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                  checked={formData.showTextOnly}
                  onChange={(e) => setFormData({ ...formData, showTextOnly: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-700">Show Icon Only (Hide Text)</span>
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                className="flex-1 bg-slate-800 text-white p-2 rounded flex items-center justify-center"
                onClick={saveApp}
              >
                <Check className="mr-1 h-4 w-4" />
                {isEditing ? 'Update' : 'Add'}
              </button>
              
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-800 p-2 rounded flex items-center justify-center"
                onClick={resetForm}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* App List */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
             <Edit className="mr-2 h-5 w-5 text-slate-600" /> Manage Apps
           </h3>
          
          <div className="space-y-2">
            {apps.map((app) => {
              // Get component for list item
              const ListItemIcon = getIconComponent(app.icon);
              return (
                <div 
                  key={app.id}
                  className={`p-3 border rounded flex items-center ${selectedAppId === app.id ? 'bg-blue-50 border-blue-500' : ''}`}
                >
                  <div 
                    className="h-10 w-10 flex items-center justify-center rounded mr-3"
                    style={{ backgroundColor: app.color || '#475569' }}
                  >
                    {ListItemIcon && <ListItemIcon className="h-6 w-6 text-white" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{app.name}</div>
                    <div className="text-xs text-gray-500 truncate">{app.url}</div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => editApp(app)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      type="button"
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => deleteApp(app.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            
            {apps.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No apps added yet. Add your first app using the form above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;