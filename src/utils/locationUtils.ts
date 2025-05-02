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
        resolve(position.coords);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
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
      JSON.stringify({ latitude, longitude })
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

    return JSON.parse(locationStr);
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