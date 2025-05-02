import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, className = '', ...props }) => {
  return (
    <div className={`checkbox ${className}`}>
      <input
        type="checkbox"
        id={id}
        className="checkbox__input"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="checkbox__label">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;