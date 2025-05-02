import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Report, ReportRequest } from '../types/report';
import reportsApi from '../api/reportsApi';

interface ReportsState {
  reports: { [stationId: string]: Report[] };
  counts: { [stationId: string]: number };
  submitting: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: {},
  counts: {},
  submitting: false,
  loading: false,
  error: null
};

export const submitReport = createAsyncThunk(
  'reports/submit',
  async (report: ReportRequest) => {
    const response = await reportsApi.createReport(report);
    return { stationId: report.stationId, reportId: response };
  }
);

export const fetchReportCount = createAsyncThunk(
  'reports/fetchCount',
  async (stationId: string) => {
    const count = await reportsApi.getReportCountForStation(stationId);
    return { stationId, count };
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReports: (state) => {
      state.reports = {};
      state.counts = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.submitting = false;
        const { stationId } = action.payload;
        if (state.counts[stationId]) {
          state.counts[stationId]++;
        }
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Failed to submit report';
      })
      .addCase(fetchReportCount.fulfilled, (state, action) => {
        const { stationId, count } = action.payload;
        state.counts[stationId] = count;
      });
  }
});

export const { clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;