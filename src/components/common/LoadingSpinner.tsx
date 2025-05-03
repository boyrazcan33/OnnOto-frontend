// src/components/common/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#2a9d8f',
  className = ''
}) => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };
  
  const spinnerSize = sizeMap[size];
  
  return (
    <div className={`loading-spinner ${className}`}>
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" opacity="0.25" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          className="loading-spinner__path"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;