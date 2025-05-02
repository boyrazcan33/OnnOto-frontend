import React from 'react';

interface CardProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  border?: boolean;
  padding?: boolean;
  shadow?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  onClick,
  border = true,
  padding = true,
  shadow = true,
  hoverable = false,
}) => {
  const baseClass = 'card';
  
  const borderClass = border ? `${baseClass}--border` : '';
  const paddingClass = padding ? `${baseClass}--padding` : '';
  const shadowClass = shadow ? `${baseClass}--shadow` : '';
  const hoverableClass = hoverable ? `${baseClass}--hoverable` : '';
  const clickableClass = onClick ? `${baseClass}--clickable` : '';
  
  const combinedClassName = `${baseClass} ${borderClass} ${paddingClass} ${shadowClass} ${hoverableClass} ${clickableClass} ${className}`;
  
  return (
    <div className={combinedClassName} onClick={onClick}>
      {(title || subtitle) && (
        <div className="card__header">
          {title && <div className="card__title">{title}</div>}
          {subtitle && <div className="card__subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

export default Card;