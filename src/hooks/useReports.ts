import { useState, useEffect } from 'react';
import { Report, ReportRequest } from '../types/report';
import reportsApi from '../api/reportsApi';
import { getDeviceId } from '../utils/storageUtils';

interface UseReportsResult {
  reportCount: number | null;
  loading: boolean;
  error: Error | null;
  submitting: boolean;
  submitError: Error | null;
  submitReport: (report: Omit<ReportRequest, 'deviceId'>) => Promise<boolean>;
  refreshReportCount: () => Promise<void>;
}

/**
 * Hook to fetch and submit reports for a station
 */
const useReports = (stationId: string): UseReportsResult => {
  const [reportCount, setReportCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const fetchReportCount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const count = await reportsApi.getReportCountForStation(stationId);
      setReportCount(count);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching report count:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async (report: Omit<ReportRequest, 'deviceId'>): Promise<boolean> => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      const deviceId = getDeviceId();
      
      // Add device ID to report
      const fullReport: ReportRequest = {
        ...report,
        deviceId
      };
      
      await reportsApi.createReport(fullReport);
      
      // Refresh report count after submission
      await fetchReportCount();
      
      return true;
    } catch (err) {
      setSubmitError(err as Error);
      console.error('Error submitting report:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch report count on mount or when stationId changes
  useEffect(() => {
    fetchReportCount();
  }, [stationId]);

  return {
    reportCount,
    loading,
    error,
    submitting,
    submitError,
    submitReport,
    refreshReportCount: fetchReportCount
  };
};

export default useReports;