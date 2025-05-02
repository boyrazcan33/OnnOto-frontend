import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../types/filters';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

const defaultFilters: FilterState = {
  networks: [],
  connectorTypes: [],
  statuses: [],
  minimumReliability: 0,
  showOnlyAvailable: false,
  showOnlyFavorites: false,
  searchRadius: 5
};

const initialState: FilterState = getStorageItem(STORAGE_KEYS.FILTER_SETTINGS, defaultFilters);

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setNetworkFilter: (state, action: PayloadAction<string[]>) => {
      state.networks = action.payload;
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    },
    setConnectorTypeFilter: (state, action: PayloadAction<string[]>) => {
      state.connectorTypes = action.payload;
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    },
    setStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.statuses = action.payload;
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    },
    setMinimumReliability: (state, action: PayloadAction<number>) => {
      state.minimumReliability = action.payload;
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    },
    toggleAvailableOnly: (state) => {
      state.showOnlyAvailable = !state.showOnlyAvailable;
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    },
    toggleFavoritesOnly: (state) => {
      state.showOnlyFavorites = !state.showOnlyFavorites;
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    },
    setSearchRadius: (state, action: PayloadAction<number>) => {
      state.searchRadius = action.payload;
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    },
    resetFilters: (state) => {
      Object.assign(state, defaultFilters);
      setStorageItem(STORAGE_KEYS.FILTER_SETTINGS, state);
    }
  }
});

export const {
  setNetworkFilter,
  setConnectorTypeFilter,
  setStatusFilter,
  setMinimumReliability,
  toggleAvailableOnly,
  toggleFavoritesOnly,
  setSearchRadius,
  resetFilters
} = filtersSlice.actions;

export default filtersSlice.reducer;