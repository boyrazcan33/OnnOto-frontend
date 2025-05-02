export interface UserPreference {
    deviceId: string;
    preferenceKey: string;
    preferenceValue: string;
  }
  
  export interface UserState {
    deviceId: string | null;
    language: string;
    theme: 'light' | 'dark';
    isAuthenticated: boolean;
    favorites: string[];
    filterSettings: {
      networks: string[];
      connectorTypes: string[];
      minReliability: number;
      showAvailable: boolean;
      showOccupied: boolean;
      showOffline: boolean;
    };
  }