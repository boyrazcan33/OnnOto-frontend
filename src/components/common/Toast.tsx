import React, { useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'bottom-center',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Wait for fade-out animation
      }
    }, duration);
    
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);
  
  const baseClass = 'toast';
  const typeClass = `${baseClass}--${type}`;
  const positionClass = `${baseClass}--${position}`;
  const visibilityClass = isVisible ? `${baseClass}--visible` : `${baseClass}--hidden`;
  
  const combinedClassName = `${baseClass} ${typeClass} ${positionClass} ${visibilityClass} ${className}`;
  
  return (
    <div className={combinedClassName} role="alert" aria-live="assertive">
      <div className="toast__content">
        <div className="toast__icon">
          {type === 'info' && <span>ℹ️</span>}
          {type === 'success' && <span>✅</span>}
          {type === 'warning' && <span>⚠️</span>}
          {type === 'error' && <span>❌</span>}
        </div>
        <div className="toast__message">{message}</div>
        <button 
          className="toast__close-button" 
          onClick={() => {
            setIsVisible(false);
            if (onClose) {
              setTimeout(onClose, 300);
            }
          }}
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;