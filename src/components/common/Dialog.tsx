import React, { useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  // Handle dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);
  
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
  
  // Prevent body scroll when dialog is open
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
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnOverlayClick && e.target === dialogRef.current) {
      onClose();
    }
  };
  
  return (
    <dialog
      ref={dialogRef}
      className={`dialog dialog--${size} ${className}`}
      onClick={handleOverlayClick}
    >
      <div className="dialog__container">
        <header className="dialog__header">
          {title && <h2 className="dialog__title">{title}</h2>}
          <button 
            className="dialog__close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>
        
        <div className="dialog__content">
          {children}
        </div>
        
        {footer && (
          <footer className="dialog__footer">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  );
};

export default Dialog;