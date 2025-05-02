import { STORAGE_KEYS } from '../constants/storageKeys';

/**
 * Get an item from local storage
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Set an item in local storage
 */
export const setStorageItem = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting to localStorage:', error);
  }
};

/**
 * Remove an item from local storage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Get device ID from storage or create a new one
 */
export const getDeviceId = (): string => {
  const deviceId = getStorageItem<string>(STORAGE_KEYS.DEVICE_ID, '');
  
  if (deviceId) {
    return deviceId;
  }
  
  // Generate a new device ID if not found
  const newDeviceId = generateDeviceId();
  setStorageItem(STORAGE_KEYS.DEVICE_ID, newDeviceId);
  return newDeviceId;
};

/**
 * Generate a device ID (UUID v4)
 */
export const generateDeviceId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get favorites from storage
 */
export const getFavorites = (): string[] => {
  return getStorageItem<string[]>(STORAGE_KEYS.FAVORITES, []);
};

/**
 * Save favorites to storage
 */
export const saveFavorites = (favorites: string[]): void => {
  setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
};

/**
 * Check if a station is a favorite
 */
export const isFavorite = (stationId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(stationId);
};