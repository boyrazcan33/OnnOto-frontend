// src/store/stationsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Station, StationStatus } from '../types/station';
import stationsApi from '../api/stationsApi';

/**
 * Manages charging station data and real-time updates
 */

interface StationsState {
  items: { [key: string]: Station };
  selectedId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdate: number | null;
  filters: {
    city?: string;
    network?: string;
    connectorTypes?: string[];
    minReliability?: number;
  };
}

const initialState: StationsState = {
  items: {},
  selectedId: null,
  status: 'idle',
  error: null,
  lastUpdate: null,
  filters: {}
};

export const fetchStations = createAsyncThunk(
  'stations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stationsApi.getAllStations();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch stations');
    }
  }
);

export const fetchStationById = createAsyncThunk(
  'stations/fetchById',
  async (stationId: string, { rejectWithValue }) => {
    try {
      const response = await stationsApi.getStationById(stationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch station');
    }
  }
);

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    /**
     * Updates a station's status (like if it's working or not)
     * We use this when we get new information about a station
     */
    updateStationStatus(state, action: PayloadAction<{
      stationId: string;
      status: StationStatus;
    }>) {
      const { stationId, status } = action.payload;
      if (state.items[stationId]) {
        state.items[stationId] = {
          ...state.items[stationId],
          status,
          lastStatusUpdate: new Date().toISOString()
        };
        state.lastUpdate = Date.now();
      }
    },

    /**
     * Remembers which station the user clicked on
     * We use this when user clicks a station on the map or list
     */
    setSelectedStation(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },

    /**
     * Updates what stations we show based on user's choices
     * We use this when user changes their filter settings
     */
    updateFilters(state, action: PayloadAction<Partial<StationsState['filters']>>) {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },

    // Removes all filters
    clearFilters(state) {
      state.filters = {};
    },

    // Resets everything back to how it was when the app started
    resetStations(state) {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      // Shows we're getting new station data
      .addCase(fetchStations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // We got the station data successfully
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Convert array to map for O(1) station lookups
        state.items = action.payload.reduce((acc: { [key: string]: Station }, station: Station) => {
          acc[station.id] = station;
          return acc;
        }, {});
        state.lastUpdate = Date.now();
      })
      // Something went wrong while getting station data
      .addCase(fetchStations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // We got data for just one station
      .addCase(fetchStationById.fulfilled, (state, action) => {
        const station = action.payload;
        state.items[station.id] = station;
      });
  }
});

export const {
  updateStationStatus,
  setSelectedStation,
  updateFilters,
  clearFilters,
  resetStations
} = stationsSlice.actions;

export default stationsSlice.reducer;