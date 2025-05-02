import React from 'react';
import { useTranslation } from 'react-i18next';
import { Connector, ConnectorStatus } from '../../types/connector';
import { formatPower } from '../../utils/formatters';
import ConnectorStatusBadge from './ConnectorStatusBadge';
import Loader from '../common/Loader';

interface ConnectorsListProps {
  connectors: Connector[];
  loading?: boolean;
  error?: Error | null;
}

const ConnectorsList: React.FC<ConnectorsListProps> = ({
  connectors,
  loading = false,
  error = null
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="connectors-list__loading">
        <Loader text={t('connectors.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="connectors-list__error">
        <p>{t('connectors.errorLoading')}</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (connectors.length === 0) {
    return (
      <div className="connectors-list__empty">
        <p>{t('connectors.noConnectorsFound')}</p>
      </div>
    );
  }

  return (
    <div className="connectors-list">
      <div className="connectors-list__header">
        <div className="connectors-list__header-item connectors-list__header-type">
          {t('connectors.type')}
        </div>
        <div className="connectors-list__header-item connectors-list__header-power">
          {t('connectors.power')}
        </div>
        <div className="connectors-list__header-item connectors-list__header-current">
          {t('connectors.currentType')}
        </div>
        <div className="connectors-list__header-item connectors-list__header-status">
          {t('connectors.status')}
        </div>
      </div>

      {connectors.map(connector => (
        <div key={connector.id} className="connectors-list__item">
          <div className="connectors-list__type">
            {connector.connectorType}
          </div>
          <div className="connectors-list__power">
            {formatPower(connector.powerKw)}
          </div>
          <div className="connectors-list__current">
            {connector.currentType}
          </div>
          <div className="connectors-list__status">
            <ConnectorStatusBadge status={connector.status as ConnectorStatus} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectorsList;