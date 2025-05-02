import React from 'react';
import { useTranslation } from 'react-i18next';
import StationCard from './StationCard';
import { Station } from '../../types/station';
import Loader from '../common/Loader';

interface StationListProps {
  stations: Station[];
  loading?: boolean;
  error?: Error | null;
  onStationClick?: (station: Station) => void;
  emptyMessage?: string;
}

const StationList: React.FC<StationListProps> = ({
  stations,
  loading = false,
  error = null,
  onStationClick,
  emptyMessage
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="station-list__loading">
        <Loader text={t('stations.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="station-list__error">
        <p>{t('stations.errorLoading')}</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="station-list__empty">
        <p>{emptyMessage || t('stations.noStationsFound')}</p>
      </div>
    );
  }

  return (
    <div className="station-list">
      {stations.map(station => (
        <StationCard
          key={station.id}
          station={station}
          onClick={onStationClick ? () => onStationClick(station) : undefined}
        />
      ))}
    </div>
  );
};

export default StationList;