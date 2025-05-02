import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  className = '',
  ...props
}) => {
  const baseClass = 'button';
  
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const widthClass = fullWidth ? `${baseClass}--full-width` : '';
  const loadingClass = loading ? `${baseClass}--loading` : '';
  
  const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`;
  
  return (
    <button 
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button__loader" />}
      {iconLeft && <span className="button__icon button__icon--left">{iconLeft}</span>}
      <span className="button__text">{children}</span>
      {iconRight && <span className="button__icon button__icon--right">{iconRight}</span>}
    </button>
  );
};

export default Button;