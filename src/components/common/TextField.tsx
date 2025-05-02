import React, { useState } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const baseClass = 'text-field';
  const containerClass = 'text-field-container';
  
  const errorClass = error ? `${baseClass}--error` : '';
  const focusedClass = focused ? `${baseClass}--focused` : '';
  const disabledClass = props.disabled ? `${baseClass}--disabled` : '';
  const fullWidthClass = fullWidth ? `${containerClass}--full-width` : '';
  
  return (
    <div className={`${containerClass} ${fullWidthClass} ${className}`}>
      {label && <label className="text-field__label">{label}</label>}
      
      <div className="text-field__wrapper">
        {leftIcon && (
          <div className="text-field__icon text-field__icon--left">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`${baseClass} ${errorClass} ${focusedClass} ${disabledClass}`}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {rightIcon && (
          <div 
            className="text-field__icon text-field__icon--right"
            onClick={onRightIconClick}
            role={onRightIconClick ? 'button' : undefined}
            tabIndex={onRightIconClick ? 0 : undefined}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && <div className="text-field__error">{error}</div>}
      {hint && !error && <div className="text-field__hint">{hint}</div>}
    </div>
  );
};

export default TextField;