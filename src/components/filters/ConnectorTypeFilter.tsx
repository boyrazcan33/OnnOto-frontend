import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Checkbox from '../common/Checkbox';
import { CONNECTOR_TYPES } from '../../constants/connectorTypes';

interface ConnectorTypeFilterProps {
  selected: string[];
  onChange: (connectorTypes: string[]) => void;
}

const ConnectorTypeFilter: React.FC<ConnectorTypeFilterProps> = ({ selected, onChange }) => {
  const { t } = useTranslation();
  const connectorTypes = Object.values(CONNECTOR_TYPES);

  const handleConnectorTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, type]);
    } else {
      onChange(selected.filter(t => t !== type));
    }
  };

  return (
    <div className="filter-section">
      <h3 className="filter-section__title">{t('filters.connectorTypes')}</h3>
      
      <div className="filter-section__options">
        {connectorTypes.map(type => (
          <div key={type} className="filter-option">
            <Checkbox
              id={`connector-${type}`}
              checked={selected.includes(type)}
              onChange={e => handleConnectorTypeChange(type, e.target.checked)}
              label={t(`connectors.types.${type.toLowerCase()}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectorTypeFilter;