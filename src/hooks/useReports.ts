import { useState } from 'react';
import { ReportRequest } from '../types/report';
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
      if (!deviceId) {
        throw new Error('Device ID not found');
      }
      
      // Create the full report with deviceId
      const fullReport: ReportRequest = {
        ...report,
        deviceId,
      };
      
      await reportsApi.createReport(fullReport);
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