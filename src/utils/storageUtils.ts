import { STORAGE_KEYS } from '../constants/storageKeys';

export const getDeviceId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  } catch (error) {
    console.error('Error getting device ID:', error);
    return null;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify({
      value,
      timestamp: Date.now()
    });
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting storage item:', error);
  }
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const { value, timestamp } = JSON.parse(item);
    
    // Check if item is expired (24 hours)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return defaultValue;
    }

    return value as T;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return defaultValue;
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing storage item:', error);
  }
};

export const clearStorageItems = (pattern?: RegExp): void => {
  try {
    if (pattern) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && pattern.test(key)) {
          localStorage.removeItem(key);
        }
      }
    } else {
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

export const getStorageSize = (): number => {
  try {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        size += localStorage.getItem(key)?.length || 0;
      }
    }
    return size;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

// Storage event listener for cross-tab synchronization
window.addEventListener('storage', (e) => {
  if (e.key?.startsWith('onnoto-')) {
    // Handle storage changes from other tabs
    console.log('Storage changed in another tab:', e.key);
  }
});