import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Connector } from '../types/connector';
import connectorsApi from '../api/connectorsApi';

interface ConnectorsState {
  connectors: { [stationId: string]: Connector[] };
  loading: boolean;
  error: string | null;
}

const initialState: ConnectorsState = {
  connectors: {},
  loading: false,
  error: null
};

export const fetchConnectorsByStation = createAsyncThunk(
  'connectors/fetchByStation',
  async (stationId: string) => {
    const response = await connectorsApi.getConnectorsByStationId(stationId);
    return { stationId, connectors: response };
  }
);

export const fetchConnectorsByType = createAsyncThunk(
  'connectors/fetchByType',
  async (type: string) => {
    const response = await connectorsApi.getConnectorsByType(type);
    return response;
  }
);

const connectorsSlice = createSlice({
  name: 'connectors',
  initialState,
  reducers: {
    clearConnectors: (state) => {
      state.connectors = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnectorsByStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnectorsByStation.fulfilled, (state, action) => {
        state.loading = false;
        state.connectors[action.payload.stationId] = action.payload.connectors;
      })
      .addCase(fetchConnectorsByStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch connectors';
      });
  }
});

export const { clearConnectors } = connectorsSlice.actions;
export default connectorsSlice.reducer;