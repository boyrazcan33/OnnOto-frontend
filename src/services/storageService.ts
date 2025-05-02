import { STORAGE_KEYS } from '../constants/storageKeys';

/**
 * Service for handling local storage operations
 */
const storageService = {
  /**
   * Set an item in local storage with optional expiry
   */
  setItem: <T>(key: string, value: T, expiryMinutes?: number): void => {
    try {
      const item = {
        value,
        expiry: expiryMinutes ? new Date().getTime() + (expiryMinutes * 60 * 1000) : null
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  },

  /**
   * Get an item from local storage, checking for expiry
   */
  getItem: <T>(key: string, defaultValue: T): T => {
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
  },

  /**
   * Remove an item from local storage
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing storage item:', error);
    }
  },

  /**
   * Clear all app-related items from local storage
   */
  clearAppStorage: (): void => {
    try {
      // Clear only app-related keys
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing app storage:', error);
    }
  },

  /**
   * Get user preferences from storage
   */
  getUserPreferences: () => {
    return storageService.getItem<{
      language: string;
      theme: 'light' | 'dark';
      favorites: string[];
      filterSettings: {
        networks: string[];
        connectorTypes: string[];
        minReliability: number;
        showAvailable: boolean;
        showOccupied: boolean;
        showOffline: boolean;
      };
    }>(STORAGE_KEYS.FILTER_SETTINGS, {
      language: 'et',
      theme: 'light',
      favorites: [],
      filterSettings: {
        networks: [],
        connectorTypes: [],
        minReliability: 0,
        showAvailable: true,
        showOccupied: true,
        showOffline: true,
      },
    });
  },
};

export default storageService;