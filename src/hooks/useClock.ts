import { useState, useEffect } from 'react';

interface ClockData {
  time: string;
  date: string;
}

// Accept an optional timezone string
export function useClock(timezone?: string): ClockData {
  const [clockData, setClockData] = useState<ClockData>({
    time: '',
    date: ''
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      // Define options for time and date formatting
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone // Use provided timezone
      };
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone // Use provided timezone
      };

      try {
        // Format time using options
        const time = now.toLocaleTimeString('default', timeOptions);
        
        // Format date using options
        const date = now.toLocaleDateString('default', dateOptions);

        setClockData({ time, date });

      } catch (error) {
        console.error("Error formatting date/time with timezone:", timezone, error);
        // Optionally fallback to system time if error occurs
        setClockData({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          date: now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        });
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    
    return () => clearInterval(interval);
  // Add timezone to dependency array so the clock updates if timezone changes
  }, [timezone]); 

  return clockData;
}