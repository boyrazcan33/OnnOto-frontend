import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';

interface StatusHistoryGraphProps {
  stationId: string;
  days?: number;
  className?: string;
}

// For simplicity, we're using a placeholder graph implementation
// In a real implementation, you would fetch actual status data and use a charting library
const StatusHistoryGraph: React.FC<StatusHistoryGraphProps> = ({
  stationId,
  days = 7,
  className = '',
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [stationId, days]);

  if (loading) {
    return (
      <div className={`status-history-graph ${className}`}>
        <Loader size="small" text={t('reliability.loadingHistory')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`status-history-graph status-history-graph--error ${className}`}>
        <p>{t('reliability.errorLoadingHistory')}</p>
      </div>
    );
  }

  // Placeholder graph - in a real implementation, use a charting library like Chart.js, D3, etc.
  return (
    <div className={`status-history-graph ${className}`}>
      <div className="status-history-graph__header">
        <h3 className="status-history-graph__title">
          {t('reliability.statusHistoryTitle', { days })}
        </h3>
        <div className="status-history-graph__legend">
          <div className="status-history-graph__legend-item">
            <span className="status-history-graph__legend-color" style={{ backgroundColor: '#2ecc71' }}></span>
            <span className="status-history-graph__legend-label">{t('common.available')}</span>
          </div>
          <div className="status-history-graph__legend-item">
            <span className="status-history-graph__legend-color" style={{ backgroundColor: '#f39c12' }}></span>
            <span className="status-history-graph__legend-label">{t('common.occupied')}</span>
          </div>
          <div className="status-history-graph__legend-item">
            <span className="status-history-graph__legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
            <span className="status-history-graph__legend-label">{t('common.offline')}</span>
          </div>
        </div>
      </div>
      
      <div className="status-history-graph__placeholder">
        <svg width="100%" height="200" viewBox="0 0 700 200" preserveAspectRatio="none">
          {/* Available line (green) */}
          <path d="M0,150 C50,120 100,100 150,110 C200,120 250,130 300,120 C350,110 400,100 450,90 C500,80 550,70 600,50 C650,30 700,40 700,60" 
            stroke="#2ecc71" strokeWidth="3" fill="none" />
          
          {/* Occupied line (orange) */}
          <path d="M0,170 C50,150 100,140 150,150 C200,160 250,150 300,140 C350,130 400,120 450,130 C500,140 550,130 600,120 C650,110 700,100 700,90" 
            stroke="#f39c12" strokeWidth="3" fill="none" />
          
          {/* Offline line (red) */}
          <path d="M0,190 C50,180 100,170 150,180 C200,190 250,180 300,170 C350,160 400,150 450,160 C500,170 550,180 600,170 C650,160 700,150 700,140" 
            stroke="#e74c3c" strokeWidth="3" fill="none" />
            
          {/* X-axis */}
          <line x1="0" y1="200" x2="700" y2="200" stroke="#adb5bd" strokeWidth="1" />
          
          {/* Y-axis */}
          <line x1="0" y1="0" x2="0" y2="200" stroke="#adb5bd" strokeWidth="1" />
        </svg>
        
        {/* X-axis labels (days) */}
        <div className="status-history-graph__x-labels">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="status-history-graph__x-label">
              {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { weekday: 'short' })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryGraph;