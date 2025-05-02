import React from 'react';

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  label,
  description,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`radio-button ${error ? 'radio-button--error' : ''} ${className}`}>
      <div className="radio-button__input-container">
        <input
          type="radio"
          id={id}
          className="radio-button__input"
          {...props}
        />
        <span className="radio-button__checkmark"></span>
      </div>
      
      {(label || description) && (
        <div className="radio-button__content">
          {label && (
            <label htmlFor={id} className="radio-button__label">
              {label}
            </label>
          )}
          {description && (
            <div className="radio-button__description">
              {description}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="radio-button__error">
          {error}
        </div>
      )}
    </div>
  );
};

export default RadioButton;