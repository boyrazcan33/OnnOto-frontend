// src/components/reliability/AnomalyDetector.tsx
import React, { useEffect, useState } from 'react';
import { useRealtimeService } from '../../hooks/useRealtimeService';
import { Anomaly, StationStatus } from '../../types/station';

interface AnomalyAlertProps {
  anomaly: Anomaly;
  onDismiss: () => void;
}

const AnomalyAlert: React.FC<AnomalyAlertProps> = ({ anomaly, onDismiss }) => (
  <div className={`anomaly-alert anomaly-alert--${anomaly.severity.toLowerCase()}`}>
    <div className="anomaly-alert__header">
      <span className="anomaly-alert__type">{anomaly.type}</span>
      <button className="anomaly-alert__close" onClick={onDismiss}>×</button>
    </div>
    <p className="anomaly-alert__description">{anomaly.description}</p>
    <div className="anomaly-alert__timestamp">
      {new Date(anomaly.timestamp).toLocaleString()}
    </div>
  </div>
);

interface AnomalyDetectorProps {
  stationId: string;
  onAnomalyDetected?: (anomaly: Anomaly) => void;
}

export const AnomalyDetector: React.FC<AnomalyDetectorProps> = ({
  stationId,
  onAnomalyDetected
}) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const { subscribe } = useRealtimeService();

  useEffect(() => {
    const unsubscribe = subscribe(stationId, (data: {
      type: string;
      anomaly: Anomaly;
      stationId: string;
    }) => {
      if (data.type === 'ANOMALY_DETECTED' && data.stationId === stationId) {
        setAnomalies(prev => [...prev, data.anomaly]);
        onAnomalyDetected?.(data.anomaly);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [stationId, onAnomalyDetected]);

  const handleDismiss = (anomalyId: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
  };

  return (
    <div className="anomaly-detector">
      <div className="anomaly-detector__list">
        {anomalies.map(anomaly => (
          <AnomalyAlert
            key={anomaly.id}
            anomaly={anomaly}
            onDismiss={() => handleDismiss(anomaly.id)}
          />
        ))}
      </div>
      {anomalies.length === 0 && (
        <div className="anomaly-detector__empty">
          No anomalies detected
        </div>
      )}
    </div>
  );
};

export default AnomalyDetector;