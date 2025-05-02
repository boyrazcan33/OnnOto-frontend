import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReliabilityMetric } from '../types/reliability';
import reliabilityApi from '../api/reliabilityApi';

interface ReliabilityState {
  metrics: { [stationId: string]: ReliabilityMetric };
  mostReliable: ReliabilityMetric[];
  loading: boolean;
  error: string | null;
}

const initialState: ReliabilityState = {
  metrics: {},
  mostReliable: [],
  loading: false,
  error: null
};

export const fetchStationReliability = createAsyncThunk(
  'reliability/fetchByStation',
  async (stationId: string) => {
    const response = await reliabilityApi.getStationReliability(stationId);
    return { stationId, metric: response };
  }
);

export const fetchMostReliableStations = createAsyncThunk(
  'reliability/fetchMostReliable',
  async (limit: number = 10) => {
    const response = await reliabilityApi.getMostReliableStations(limit);
    return response;
  }
);

export const fetchStationsWithMinimumReliability = createAsyncThunk(
  'reliability/fetchWithMinimum',
  async (minimumReliability: number) => {
    const response = await reliabilityApi.getStationsWithMinimumReliability(minimumReliability);
    return response;
  }
);

const reliabilitySlice = createSlice({
  name: 'reliability',
  initialState,
  reducers: {
    clearReliabilityData: (state) => {
      state.metrics = {};
      state.mostReliable = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStationReliability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationReliability.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics[action.payload.stationId] = action.payload.metric;
      })
      .addCase(fetchStationReliability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reliability data';
      })
      .addCase(fetchMostReliableStations.fulfilled, (state, action) => {
        state.mostReliable = action.payload;
        action.payload.forEach(metric => {
          state.metrics[metric.stationId] = metric;
        });
      });
  }
});

export const { clearReliabilityData } = reliabilitySlice.actions;
export default reliabilitySlice.reducer;