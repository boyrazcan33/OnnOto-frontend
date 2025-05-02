import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Checkbox from '../common/Checkbox';
import useStations from '../../hooks/useStations';

interface NetworkFilterProps {
  selected: string[];
  onChange: (networks: string[]) => void;
}

interface NetworkOption {
  id: string;
  name: string;
  count: number;
}

const NetworkFilter: React.FC<NetworkFilterProps> = ({ selected, onChange }) => {
  const { t } = useTranslation();
  const { stations } = useStations();
  const [networks, setNetworks] = useState<NetworkOption[]>([]);

  // Extract unique networks from stations
  useEffect(() => {
    const networkMap = new Map<string, NetworkOption>();
    
    stations.forEach(station => {
      if (station.networkId) {
        if (networkMap.has(station.networkId)) {
          const network = networkMap.get(station.networkId)!;
          network.count += 1;
        } else {
          networkMap.set(station.networkId, {
            id: station.networkId,
            name: station.networkName || station.networkId,
            count: 1
          });
        }
      }
    });
    
    // Convert Map to array and sort by name
    const networkArray = Array.from(networkMap.values());
    networkArray.sort((a, b) => a.name.localeCompare(b.name));
    
    setNetworks(networkArray);
  }, [stations]);

  const handleNetworkChange = (networkId: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, networkId]);
    } else {
      onChange(selected.filter(id => id !== networkId));
    }
  };

  return (
    <div className="filter-section">
      <h3 className="filter-section__title">{t('filters.networks')}</h3>
      
      <div className="filter-section__options">
        {networks.map(network => (
          <div key={network.id} className="filter-option">
            <Checkbox
              id={`network-${network.id}`}
              checked={selected.includes(network.id)}
              onChange={e => handleNetworkChange(network.id, e.target.checked)}
              label={`${network.name} (${network.count})`}
            />
          </div>
        ))}
        
        {networks.length === 0 && (
          <div className="filter-section__empty">
            {t('filters.noNetworksAvailable')}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkFilter;