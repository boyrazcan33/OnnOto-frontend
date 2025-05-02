import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && isOpen && event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) {
    return null;
  }
  
  const baseClass = 'modal';
  const sizeClass = `${baseClass}--${size}`;
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className={`${baseClass}__overlay`} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={`${baseClass}__container ${sizeClass} ${className}`} ref={modalRef}>
        <div className={`${baseClass}__header`}>
          {title && <h2 className={`${baseClass}__title`}>{title}</h2>}
          <button 
            className={`${baseClass}__close-button`} 
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className={`${baseClass}__content`}>
          {children}
        </div>
        {footer && (
          <div className={`${baseClass}__footer`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;