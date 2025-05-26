import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import MapContainer from '../components/map/MapContainer';
import FilterPanel from '../components/filters/FilterPanel';
import { Station } from '../types/station';
import { FilterState } from '../types/filters';
import InfoWindow from '../components/map/InfoWindow';

const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    networks: [],
    connectorTypes: [],
    statuses: [],
    minimumReliability: 0,
    showOnlyAvailable: false,
    showOnlyFavorites: false,
    searchRadius: 5
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };

  const handleInfoClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStation(null);
  };

  const handleStationDetails = (stationId: string) => {
    navigate(`/station/${stationId}`);
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const applyFilters = (newFilters: FilterState) => {
    setFilterState(newFilters);
    setIsFilterOpen(false);
  };

  return (
    <MainLayout fullHeight={true} showFooter={false}>
      <div className="map-page">
        <div className="map-page__header">
          <h1 className="map-page__title">{t('map.title')}</h1>
          <button
            className="map-page__filter-button"
            onClick={toggleFilters}
            aria-expanded={isFilterOpen}
            aria-label={t('map.toggleFilters')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {t('map.filters')}
          </button>
        </div>

        <div className="map-page__container">
          <MapContainer
            filters={filterState}
            onMarkerClick={handleStationClick}
            showControls={true}
          />

          {isFilterOpen && (
            <FilterPanel
              currentFilters={filterState}
              onApply={applyFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MapPage;