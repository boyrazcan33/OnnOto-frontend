import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
  fullScreen = false,
  text,
}) => {
  const baseClass = 'loader';
  
  const sizeClass = `${baseClass}--${size}`;
  const colorClass = `${baseClass}--${color}`;
  const fullScreenClass = fullScreen ? `${baseClass}--fullscreen` : '';
  
  const combinedClassName = `${baseClass} ${sizeClass} ${colorClass} ${fullScreenClass} ${className}`;
  
  return (
    <div className={combinedClassName}>
      <div className="loader__spinner"></div>
      {text && <div className="loader__text">{text}</div>}
    </div>
  );
};

export default Loader;