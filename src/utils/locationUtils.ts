import { STORAGE_KEYS } from '../constants/storageKeys';

/**
 * Get current location from browser geolocation API
 */
export const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        // Save location to storage for offline use
        saveLastLocation(position.coords.latitude, position.coords.longitude);
        console.log('Location retrieved:', position.coords.latitude, position.coords.longitude);
        resolve(position.coords);
      },
      error => {
        console.error('Geolocation error:', error.message);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 30000 // 30 seconds
      }
    );
  });
};

/**
 * Save last known location to local storage
 */
export const saveLastLocation = (latitude: number, longitude: number): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.LAST_LOCATION,
      JSON.stringify({ latitude, longitude, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Failed to save location to localStorage:', error);
  }
};

/**
 * Get last known location from local storage
 */
export const getLastLocation = (): { latitude: number; longitude: number } | null => {
  try {
    const locationStr = localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
    if (!locationStr) return null;

    const location = JSON.parse(locationStr);
    
    // Check if the saved location is too old (more than 24 hours)
    const now = Date.now();
    if (location.timestamp && now - location.timestamp > 24 * 60 * 60 * 1000) {
      // If too old, remove it and return null
      localStorage.removeItem(STORAGE_KEYS.LAST_LOCATION);
      return null;
    }

    return { latitude: location.latitude, longitude: location.longitude };
  } catch (error) {
    console.error('Failed to get location from localStorage:', error);
    return null;
  }
};

/**
 * Default location (Estonia's center) to use if no location is available
 */
export const DEFAULT_LOCATION = {
  latitude: 58.5953,
  longitude: 25.0136
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (
  latitude: number,
  longitude: number
): string => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};