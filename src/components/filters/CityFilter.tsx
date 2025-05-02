import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from '../common/Dropdown';
import useStations from '../../hooks/useStations';

interface CityFilterProps {
  selected?: string;
  onChange: (city: string | undefined) => void;
}

interface CityOption {
  value: string;
  label: string;
  count: number;
}

const CityFilter: React.FC<CityFilterProps> = ({ selected, onChange }) => {
  const { t } = useTranslation();
  const { stations } = useStations();
  const [cities, setCities] = useState<CityOption[]>([]);

  // Extract unique cities from stations
  useEffect(() => {
    const cityMap = new Map<string, number>();
    
    stations.forEach(station => {
      if (station.city) {
        cityMap.set(station.city, (cityMap.get(station.city) || 0) + 1);
      }
    });
    
    // Convert Map to array and sort by name
    const cityOptions: CityOption[] = Array.from(cityMap.entries())
      .map(([city, count]) => ({
        value: city,
        label: city,
        count
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    // Add "All Cities" option at the beginning
    cityOptions.unshift({
      value: '',
      label: t('filters.allCities'),
      count: stations.length
    });
    
    setCities(cityOptions);
  }, [stations, t]);

  const handleCityChange = (cityValue: string) => {
    onChange(cityValue || undefined);
  };

  return (
    <div className="filter-section">
      <h3 className="filter-section__title">{t('filters.city')}</h3>
      
      <div className="filter-section__dropdown">
        <Dropdown
          options={cities.map(city => ({
            value: city.value,
            label: `${city.label} (${city.count})`
          }))}
          value={selected || ''}
          onChange={handleCityChange}
          placeholder={t('filters.selectCity')}
        />
      </div>
    </div>
  );
};

export default CityFilter;