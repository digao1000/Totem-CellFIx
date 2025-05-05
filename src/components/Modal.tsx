import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { AppItem } from '../types';

interface ModalProps {
  app: AppItem | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ app, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle clicks outside the modal content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isFullscreen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isFullscreen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose, isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    if (app?.url) {
      window.open(app.url, '_blank');
      onClose();
    }
  };

  if (!app) return null;

  // Base classes for the modal container
  const baseModalContainerClasses = "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out";
  // Classes added when not fullscreen
  const normalModalContainerClasses = "bg-black bg-opacity-75 p-4";
  // Classes added when fullscreen
  const fullscreenModalContainerClasses = "bg-white p-0";

  // Base classes for the modal content itself
  const baseModalContentClasses = "bg-white rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out";
  // Classes added when not fullscreen
  const normalModalContentClasses = "w-full max-w-5xl h-[80vh]";
  // Classes added when fullscreen
  const fullscreenModalContentClasses = "w-screen h-screen rounded-none";

  return (
    <div className={`${baseModalContainerClasses} ${isFullscreen ? fullscreenModalContainerClasses : normalModalContainerClasses}`}>
      <div 
        ref={modalRef}
        className={`${baseModalContentClasses} ${isFullscreen ? fullscreenModalContentClasses : normalModalContentClasses}`}
      >
        <div 
          className={`p-4 border-b flex justify-between items-center ${isFullscreen ? 'rounded-none' : 'rounded-t-lg'}`}
          style={{ backgroundColor: app.color }}
        >
          <h2 className="text-xl font-bold text-white">{app.name}</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={openInNewTab}
              className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="h-5 w-5 text-white" />
            </button>
            <button 
              onClick={toggleFullscreen}
              className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? 
                <Minimize2 className="h-5 w-5 text-white" /> : 
                <Maximize2 className="h-5 w-5 text-white" />
              }
            </button>
            <button 
              onClick={onClose}
              className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <iframe 
            ref={iframeRef}
            src={app.url} 
            title={app.name}
            className="w-full h-full border-none block"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;