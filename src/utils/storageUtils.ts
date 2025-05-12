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

    // Handle special cases that are stored as simple strings, not JSON
    if (key === STORAGE_KEYS.LANGUAGE || 
        key === STORAGE_KEYS.THEME || 
        key === STORAGE_KEYS.DEVICE_ID) {
      return item as unknown as T;
    }

    // For other keys, try JSON parsing
    try {
      const parsed = JSON.parse(item);
      return (parsed.value !== undefined ? parsed.value : parsed) as T;
    } catch (jsonError) {
      console.error('Error parsing storage item:', jsonError);
      return defaultValue;
    }
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