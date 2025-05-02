import React from 'react';
import { useTranslation } from 'react-i18next';

interface FavoriteButtonProps {
  stationId: string;
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  stationId,
  isFavorite,
  onToggle,
  size = 'medium',
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <button
      className={`favorite-button favorite-button--${size} ${isFavorite ? 'favorite-button--active' : ''} ${className}`}
      onClick={onToggle}
      aria-label={isFavorite ? t('stations.removeFromFavorites') : t('stations.addToFavorites')}
      title={isFavorite ? t('stations.removeFromFavorites') : t('stations.addToFavorites')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
      </svg>
    </button>
  );
};

export default FavoriteButton;