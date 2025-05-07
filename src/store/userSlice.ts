import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/user';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

// Load initial state from local storage
const loadInitialState = (): UserState => {
  return {
    deviceId: getStorageItem<string | null>(STORAGE_KEYS.DEVICE_ID, null),
    language: getStorageItem<string>(STORAGE_KEYS.LANGUAGE, 'et'),
    theme: getStorageItem<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light'),
    isAuthenticated: !!getStorageItem<string | null>(STORAGE_KEYS.DEVICE_ID, null),
    favorites: getStorageItem<string[]>(STORAGE_KEYS.FAVORITES, []),
    filterSettings: getStorageItem<UserState['filterSettings']>(STORAGE_KEYS.FILTER_SETTINGS, {
      networks: [],
      connectorTypes: [],
      minReliability: 0,
      showAvailable: true,
      showOccupied: true,
      showOffline: true,
    }),
  };
};

const userSlice = createSlice({
  name: 'user',
  initialState: loadInitialState(),
  reducers: {
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
      state.isAuthenticated = true;
      setStorageItem(STORAGE_KEYS.DEVICE_ID, action.payload);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      setStorageItem(STORAGE_KEYS.LANGUAGE, action.payload);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      setStorageItem(STORAGE_KEYS.THEME, action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const stationId = action.payload;
      const index = state.favorites.indexOf(stationId);
      
      if (index === -1) {
        state.favorites.push(stationId);
      } else {
        state.favorites.splice(index, 1);
      }
      
      setStorageItem(STORAGE_KEYS.FAVORITES, state.favorites);
    },
    updateFilterSettings: (state, action: PayloadAction<Partial<UserState['filterSettings']>>) => {
      state.filterSettings = {
        ...state.filterSettings,
        ...action.payload,
      };
      
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state.filterSettings);
    },
    clearFavorites: (state) => {
      state.favorites = [];
      setStorageItem(STORAGE_KEYS.FAVORITES, []);
    },
  },
});

export const { 
  setDeviceId, 
  setLanguage, 
  setTheme, 
  toggleFavorite, 
  updateFilterSettings,
  clearFavorites
} = userSlice.actions;

export default userSlice.reducer;