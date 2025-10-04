/**
 * Modal Component
 * Accessible modal dialog with focus management
 */

import React, { useEffect, useRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useSSRSafeId, usePortal, encodeSizeMode as enc } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-modal`;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscapeKey?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
  'aria-describedby'?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  initialFocus,
  finalFocus,
  'aria-describedby': ariaDescribedBy,
}, ref) => {
  const modalId = useSSRSafeId('modal');
  const titleId = title ? `${modalId}-title` : undefined;
  const container = usePortal();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus management and body scroll
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.classList.add(`${lib}-modal-open`);
      
      // Focus initial element
      setTimeout(() => {
        const focusElement = initialFocus?.current || modalRef.current;
        focusElement?.focus();
      }, 0);
    }

    return () => {
      if (isOpen) {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.classList.remove(`${lib}-modal-open`);
        
        // Restore focus
        const elementToFocus = finalFocus?.current || previousActiveElement.current;
        elementToFocus?.focus();
      }
    };
  }, [isOpen, initialFocus, finalFocus]);

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscapeKey) {
        onClose();
      }

      // Focus trap
      if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscapeKey, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  };

  const sizeClasses = {
    [enc('sm')]: 'max-w-sm',
    [enc('md')]: 'max-w-md',
    [enc('lg')]: 'max-w-lg',
    [enc('xl')]: 'max-w-xl'
  };

  if (!isOpen || !container) {
    return null;
  }

  return createPortal(
    <div
      ref={overlayRef}
      className={`anukit-modal ${isOpen ? `}${lib}-modal-open` : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={ariaDescribedBy}
    >
      <div
        ref={ref || modalRef}
        className={`anukit-modal-content ${sizeClasses[enc(size)]}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {title && (
          <div className={`${lib}-modal-header`}>
            <h2 id={titleId} className={`${lib}-modal-title`}>
              {title}
            </h2>
            <button
              type="button"
              className={`${lib}-modal-close`}
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className={`${lib}-modal-body`}>
          {children}
        </div>
      </div>
    </div>,
    container
  );
});

Modal.displayName = 'Modal';

export { Modal };
