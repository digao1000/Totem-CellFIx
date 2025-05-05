import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get stored value from localStorage
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update localStorage when the state changes
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  // Initialize on mount with the stored value
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key]);

  return [storedValue, setValue];
}