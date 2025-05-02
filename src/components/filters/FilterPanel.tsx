import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterState } from '../../types/filters';
import Button from '../common/Button';
import NetworkFilter from './NetworkFilter';
import ConnectorTypeFilter from './ConnectorTypeFilter';
import ReliabilityFilter from './ReliabilityFilter';
import StatusFilter from './StatusFilter';
import CityFilter from './CityFilter';
import ProximityFilter from './ProximityFilter';

interface FilterPanelProps {
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  currentFilters,
  onApply,
  onClose,
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  const handleNetworksChange = (networks: string[]) => {
    setFilters(prev => ({ ...prev, networks }));
  };

  const handleConnectorTypesChange = (connectorTypes: string[]) => {
    setFilters(prev => ({ ...prev, connectorTypes }));
  };

  const handleStatusesChange = (statuses: string[]) => {
    setFilters(prev => ({ ...prev, statuses }));
  };

  const handleReliabilityChange = (minimumReliability: number) => {
    setFilters(prev => ({ ...prev, minimumReliability }));
  };

  const handleCityChange = (city: string | undefined) => {
    setFilters(prev => ({ ...prev, city }));
  };

  const handleAvailableOnlyChange = (showOnlyAvailable: boolean) => {
    setFilters(prev => ({ ...prev, showOnlyAvailable }));
  };

  const handleFavoritesOnlyChange = (showOnlyFavorites: boolean) => {
    setFilters(prev => ({ ...prev, showOnlyFavorites }));
  };

  const handleRadiusChange = (searchRadius: number) => {
    setFilters(prev => ({ ...prev, searchRadius }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      networks: [],
      connectorTypes: [],
      statuses: [],
      minimumReliability: 0,
      showOnlyAvailable: false,
      showOnlyFavorites: false,
      searchRadius: 5,
    };
    setFilters(resetFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel__header">
        <h2 className="filter-panel__title">{t('filters.title')}</h2>
        <button
          className="filter-panel__close"
          onClick={onClose}
          aria-label={t('common.close')}
        >
          &times;
        </button>
      </div>

      <div className="filter-panel__content">
        <NetworkFilter
          selected={filters.networks}
          onChange={handleNetworksChange}
        />

        <ConnectorTypeFilter
          selected={filters.connectorTypes}
          onChange={handleConnectorTypesChange}
        />

        <StatusFilter
          showOnlyAvailable={filters.showOnlyAvailable}
          onChange={handleAvailableOnlyChange}
        />

        <ReliabilityFilter
          value={filters.minimumReliability}
          onChange={handleReliabilityChange}
        />

        <CityFilter
          selected={filters.city}
          onChange={handleCityChange}
        />

        <ProximityFilter
          value={filters.searchRadius}
          onChange={handleRadiusChange}
        />

        <div className="filter-panel__checkbox">
          <label className="filter-panel__label">
            <input
              type="checkbox"
              checked={filters.showOnlyFavorites}
              onChange={e => handleFavoritesOnlyChange(e.target.checked)}
            />
            {t('filters.showOnlyFavorites')}
          </label>
        </div>
      </div>

      <div className="filter-panel__footer">
        <Button
          variant="outline"
          onClick={handleReset}
        >
          {t('filters.reset')}
        </Button>
        <Button
          variant="primary"
          onClick={handleApply}
        >
          {t('filters.apply')}
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;