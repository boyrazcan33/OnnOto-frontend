import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  // Calculate percentage for background fill
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`slider ${disabled ? 'slider--disabled' : ''} ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider__input"
        disabled={disabled}
        style={{
          background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, #e9ecef ${percentage}%, #e9ecef 100%)`
        }}
      />
      
      <div className="slider__markers">
        <span className="slider__marker slider__marker--min">{min}</span>
        <span className="slider__marker slider__marker--max">{max}</span>
      </div>
    </div>
  );
};

export default Slider;