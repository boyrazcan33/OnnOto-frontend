import { getCurrentLocation, DEFAULT_LOCATION } from '../utils/locationUtils';

interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

class LocationService {
  private watchId: number | null = null;
  private lastLocation: LocationResult | null = null;
  private listeners: Set<(location: LocationResult) => void> = new Set();

  async getCurrentLocation(): Promise<LocationResult> {
    try {
      const coords = await getCurrentLocation();
      const location = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        timestamp: Date.now()
      };
      this.lastLocation = location;
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return {
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
        timestamp: Date.now()
      };
    }
  }

  startWatching(): void {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported');
      return;
    }

    if (this.watchId !== null) {
      this.stopWatching();
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        this.lastLocation = location;
        this.notifyListeners(location);
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getLastLocation(): LocationResult | null {
    return this.lastLocation;
  }

  addListener(listener: (location: LocationResult) => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: (location: LocationResult) => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(location: LocationResult): void {
    this.listeners.forEach(listener => listener(location));
  }
}

export const locationService = new LocationService();