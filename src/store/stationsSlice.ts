import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Station, StationDetail } from '../types/station';
import stationsApi from '../api/stationsApi';
import { StationFilterRequest } from '../types/filters';

interface StationsState {
  stations: Station[];
  selectedStation: StationDetail | null;
  loading: boolean;
  error: string | null;
  filters: StationFilterRequest;
  lastUpdated: number | null;
}

const initialState: StationsState = {
  stations: [],
  selectedStation: null,
  loading: false,
  error: null,
  filters: {},
  lastUpdated: null
};

export const fetchStations = createAsyncThunk(
  'stations/fetchAll',
  async () => {
    const response = await stationsApi.getAllStations();
    return response;
  }
);

export const fetchStationById = createAsyncThunk(
  'stations/fetchById',
  async (id: string) => {
    const response = await stationsApi.getStationById(id);
    return response;
  }
);

export const filterStations = createAsyncThunk(
  'stations/filter',
  async (filters: StationFilterRequest) => {
    const response = await stationsApi.filterStations(filters);
    return response;
  }
);

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<StationFilterRequest>) => {
      state.filters = action.payload;
    },
    clearSelectedStation: (state) => {
      state.selectedStation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stations';
      })
      .addCase(fetchStationById.fulfilled, (state, action) => {
        state.selectedStation = action.payload;
      })
      .addCase(filterStations.fulfilled, (state, action) => {
        state.stations = action.payload;
      });
  }
});

export const { setFilters, clearSelectedStation } = stationsSlice.actions;
export default stationsSlice.reducer;