import React, { ReactNode } from 'react';

interface ButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  size = 'medium',
  spacing = 'medium',
  className = '',
}) => {
  const baseClass = 'button-group';
  
  const orientationClass = `${baseClass}--${orientation}`;
  const sizeClass = `${baseClass}--${size}`;
  const spacingClass = `${baseClass}--spacing-${spacing}`;
  
  const combinedClassName = `${baseClass} ${orientationClass} ${sizeClass} ${spacingClass} ${className}`;
  
  return (
    <div className={combinedClassName}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={`${baseClass}__item`}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default ButtonGroup;