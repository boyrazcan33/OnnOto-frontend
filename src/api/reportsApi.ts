import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { ReportRequest } from '../types/report';

/**
 * API client for report-related endpoints
 */
const reportsApi = {
  /**
   * Create a new report
   */
  createReport: (request: ReportRequest) => {
    return client.post(API_ENDPOINTS.REPORTS, request);
  },

  /**
   * Get report count for a station
   */
  getReportCountForStation: (stationId: string) => {
    return client.get<number>(API_ENDPOINTS.REPORT_COUNT(stationId));
  }
};

export default reportsApi;