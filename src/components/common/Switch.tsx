import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={`switch ${disabled ? 'switch--disabled' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="switch__input"
        disabled={disabled}
      />
      <span className="switch__slider"></span>
      {label && <span className="switch__label">{label}</span>}
    </label>
  );
};

export default Switch;