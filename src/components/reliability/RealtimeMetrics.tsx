// src/components/reliability/RealtimeMetrics.tsx
import React, { useEffect, useState } from 'react';
import { useRealtimeService } from '../../hooks/useRealtimeService';
import { StationMetrics } from '../../types/station';
import { StationStatus } from '../../types/station';

interface ReliabilityScoreProps {
  score: number;
}

const ReliabilityScore: React.FC<ReliabilityScoreProps> = ({ score }) => (
  <div className="reliability-score">
    <span className="reliability-score__value">{score.toFixed(1)}</span>
    <span className="reliability-score__label">Reliability Score</span>
  </div>
);

interface StatusIndicatorProps {
  status: StationStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => (
  <div className={`status-indicator status-indicator--${status.toLowerCase()}`}>
    {status}
  </div>
);

interface UpdateTimeProps {
  time: string;
}

const UpdateTime: React.FC<UpdateTimeProps> = ({ time }) => (
  <div className="update-time">
    Last updated: {new Date(time).toLocaleString()}
  </div>
);

interface RealtimeMetricsProps {
  stationId: string;
  className?: string;
}

export const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({
  stationId,
  className = ''
}) => {
  const [metrics, setMetrics] = useState<StationMetrics | null>(null);
  const { subscribe } = useRealtimeService();

  useEffect(() => {
    const unsubscribe = subscribe(stationId, (data: {
      type: string;
      metrics: StationMetrics;
      stationId: string;
    }) => {
      if (data.type === 'METRICS_UPDATE' && data.stationId === stationId) {
        setMetrics(data.metrics);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [stationId]);

  if (!metrics) {
    return (
      <div className={`realtime-metrics ${className}`}>
        Loading metrics...
      </div>
    );
  }

  return (
    <div className={`realtime-metrics ${className}`}>
      <ReliabilityScore score={metrics.reliability} />
      <StatusIndicator status={metrics.status} />
      <UpdateTime time={metrics.lastUpdate} />
    </div>
  );
};

export default RealtimeMetrics;