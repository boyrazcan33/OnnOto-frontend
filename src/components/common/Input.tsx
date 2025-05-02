import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
  // Add these properties
  as?: string;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconClick,
  fullWidth = false,
  className = '',
  as,
  rows = 3,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  
  const baseClass = 'input';
  const containerClass = 'input-container';
  
  const errorClass = error ? `${baseClass}--error` : '';
  const focusedClass = focused ? `${baseClass}--focused` : '';
  const disabledClass = props.disabled ? `${baseClass}--disabled` : '';
  const fullWidthClass = fullWidth ? `${containerClass}--full-width` : '';
  
  const containerClassName = `${containerClass} ${fullWidthClass} ${className}`;
  const inputClassName = `${baseClass} ${errorClass} ${focusedClass} ${disabledClass}`;
  
  const renderInput = () => {
    if (as === 'textarea') {
      return (
        <textarea
          className={inputClassName}
          rows={rows}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e as any);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e as any);
          }}
          {...props as any}
        />
      );
    }
    
    return (
      <input
        className={inputClassName}
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
    );
  };

  return (
    <div className={containerClassName}>
      {label && <label className="input__label">{label}</label>}
      <div className="input__wrapper">
        {leftIcon && (
          <div className="input__icon input__icon--left">
            {leftIcon}
          </div>
        )}
        {renderInput()}
        {rightIcon && (
          <div 
            className="input__icon input__icon--right"
            onClick={onRightIconClick}
            role={onRightIconClick ? 'button' : undefined}
            tabIndex={onRightIconClick ? 0 : undefined}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {error && <div className="input__error">{error}</div>}
      {hint && !error && <div className="input__hint">{hint}</div>}
    </div>
  );
};

export default Input;