import { STORAGE_KEYS } from '../constants/storageKeys';

/**
 * Set an item in local storage with optional expiry
 */
export const setStorageItem = (key: string, value: any, expiryMinutes?: number): void => {
  try {
    const item = {
      value,
      expiry: expiryMinutes ? new Date().getTime() + (expiryMinutes * 60 * 1000) : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting storage item:', error);
  }
};

/**
 * Get an item from local storage, checking for expiry
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return defaultValue;
    }
    
    const item = JSON.parse(itemStr);
    
    // Check if the item has expired
    if (item.expiry && new Date().getTime() > item.expiry) {
      localStorage.removeItem(key);
      return defaultValue;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return defaultValue;
  }
};

/**
 * Remove an item from local storage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing storage item:', error);
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