import React, { forwardRef } from 'react';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-form-control`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label for the form control */
  label?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Required field indicator */
  required?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Take full width of container */
  fullWidth?: boolean;
  
  /** Form control size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Unique ID for the form control */
  htmlFor?: string;
}

// Size-based CSS classes
const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return `${l_prx}-sm`;
    case 'lg':
      return `${l_prx}-lg`;
    default:
      return `${l_prx}-md`;
  }
};

const FormControl = forwardRef<HTMLDivElement, FormControlProps>(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  htmlFor,
  children,
  className = '',
  ...props
}, ref) => {
  // Generate unique IDs for accessibility
  const controlId = htmlFor || `form-control-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${controlId}-error` : undefined;
  const helperTextId = helperText ? `${controlId}-helper` : undefined;
  
  const hasError = Boolean(error);
  
  // Build CSS classes
  const controlClasses = cn(
    `${lib}-form-control`,
    getSizeClasses(size),
    hasError && `${lib}-form-control-error`,
    disabled && `${lib}-form-control-disabled`,
    fullWidth && `${lib}-form-control-full-width`,
    className
  );

  return (
    <div 
      ref={ref}
      className={controlClasses}
      {...props}
    >
      {label && (
        <label
          htmlFor={controlId}
          className={cn(
            `${lib}-form-label`,
            required && `${lib}-form-label-required`,
            disabled && `${lib}-form-label-disabled`
          )}
        >
          {label}
          {required && (
            <span className={`${lib}-form-required-indicator`} aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <div className={`${lib}-form-control-content`}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Pass accessibility props to child components
            return React.cloneElement(child, {
              id: controlId,
              'aria-invalid': hasError,
              'aria-describedby': cn(errorId, helperTextId),
              disabled: disabled || child.props.disabled,
              ...child.props,
            });
          }
          return child;
        })}
      </div>
      
      {error && (
        <div
          id={errorId}
          className={`${lib}-form-error`}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div
          id={helperTextId}
          className={`${lib}-form-helper`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

FormControl.displayName = 'FormControl';

export { FormControl };