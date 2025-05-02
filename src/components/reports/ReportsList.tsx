import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import { formatDateTime } from '../../utils/formatters';

interface Report {
  id: number;
  stationId: string;
  reportType: string;
  description: string;
  createdAt: string;
}

interface ReportsListProps {
  stationId: string;
  limit?: number;
  className?: string;
}

// Placeholder report data - in a real implementation, you would fetch from API
const mockReports: Report[] = [
  {
    id: 1,
    stationId: 'station-1',
    reportType: 'OFFLINE',
    description: 'The station is showing as available but actually offline',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    stationId: 'station-1',
    reportType: 'DAMAGED',
    description: 'The Type 2 connector is damaged',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const ReportsList: React.FC<ReportsListProps> = ({
  stationId,
  limit = 5,
  className = '',
}) => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Filter mockReports by stationId
      const filteredReports = mockReports
        .filter(r => r.stationId === stationId)
        .slice(0, limit);
      
      setReports(filteredReports);
      setLoading(false);
    }, 1000);
  }, [stationId, limit]);

  if (loading) {
    return (
      <div className={`reports-list ${className}`}>
        <Loader size="small" text={t('reports.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`reports-list reports-list--error ${className}`}>
        <p>{t('reports.errorLoading')}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className={`reports-list reports-list--empty ${className}`}>
        <p>{t('reports.noReports')}</p>
      </div>
    );
  }

  return (
    <div className={`reports-list ${className}`}>
      {reports.map(report => (
        <div
          key={report.id}
          className={`report-item report-item--${report.reportType.toLowerCase()}`}
        >
          <div className="report-item__header">
            <div className="report-item__type">
              {t(`reports.types.${report.reportType.toLowerCase()}`)}
            </div>
            <div className="report-item__time">
              {formatDateTime(report.createdAt)}
            </div>
          </div>
          
          <div className="report-item__description">
            {report.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportsList;