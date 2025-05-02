import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 icon: React.ReactNode;
 variant?: 'primary' | 'secondary' | 'ghost';
 size?: 'small' | 'medium' | 'large';
 active?: boolean;
 loading?: boolean;
 className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
 icon,
 variant = 'ghost',
 size = 'medium',
 active = false,
 loading = false,
 className = '',
 disabled,
 ...props
}) => {
 const baseClass = 'icon-button';
 
 const variantClass = `${baseClass}--${variant}`;
 const sizeClass = `${baseClass}--${size}`;
 const activeClass = active ? `${baseClass}--active` : '';
 const loadingClass = loading ? `${baseClass}--loading` : '';
 
 const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${activeClass} ${loadingClass} ${className}`;
 
 return (
   <button 
     className={combinedClassName}
     disabled={disabled || loading}
     {...props}
   >
     {loading ? (
       <span className="icon-button__loader" />
     ) : (
       <span className="icon-button__icon">{icon}</span>
     )}
   </button>
 );
};

export default IconButton;