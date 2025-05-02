import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AnomalyType } from '../types/reliability';
import anomaliesApi from '../api/anomaliesApi';

interface AnomaliesState {
  anomalies: AnomalyType[];
  stationAnomalies: { [stationId: string]: AnomalyType[] };
  loading: boolean;
  error: string | null;
}

const initialState: AnomaliesState = {
  anomalies: [],
  stationAnomalies: {},
  loading: false,
  error: null
};

export const fetchAllAnomalies = createAsyncThunk(
  'anomalies/fetchAll',
  async (params?: { unresolved?: boolean, severity?: string, type?: string }) => {
    const response = await anomaliesApi.getAllAnomalies(params);
    return response;
  }
);

export const fetchStationAnomalies = createAsyncThunk(
  'anomalies/fetchByStation',
  async ({ stationId, unresolved }: { stationId: string, unresolved?: boolean }) => {
    const response = await anomaliesApi.getAnomaliesForStation(stationId, unresolved);
    return { stationId, anomalies: response };
  }
);

const anomaliesSlice = createSlice({
  name: 'anomalies',
  initialState,
  reducers: {
    clearAnomalies: (state) => {
      state.anomalies = [];
      state.stationAnomalies = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAnomalies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAnomalies.fulfilled, (state, action) => {
        state.loading = false;
        state.anomalies = action.payload;
      })
      .addCase(fetchAllAnomalies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch anomalies';
      })
      .addCase(fetchStationAnomalies.fulfilled, (state, action) => {
        state.stationAnomalies[action.payload.stationId] = action.payload.anomalies;
      });
  }
});

export const { clearAnomalies } = anomaliesSlice.actions;
export default anomaliesSlice.reducer;