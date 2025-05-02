import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectorStatus } from '../../types/connector';
import { STATUS_COLORS } from '../../constants/statusTypes';

interface ConnectorStatusBadgeProps {
  status: ConnectorStatus;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const ConnectorStatusBadge: React.FC<ConnectorStatusBadgeProps> = ({
  status,
  size = 'medium',
  showText = true,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.UNKNOWN;
  const statusText = status === ConnectorStatus.AVAILABLE
    ? t('common.available')
    : status === ConnectorStatus.OCCUPIED
      ? t('common.occupied')
      : status === ConnectorStatus.OFFLINE
        ? t('common.offline')
        : t('common.unknown');

  return (
    <div
      className={`status-badge status-badge--${status.toLowerCase()} status-badge--${size} ${className}`}
      title={statusText}
    >
      <span
        className="status-badge__indicator"
        style={{ backgroundColor: statusColor }}
      ></span>
      {showText && (
        <span className="status-badge__text">{statusText}</span>
      )}
    </div>
  );
};

export default ConnectorStatusBadge;