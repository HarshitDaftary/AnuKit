import React, { forwardRef } from 'react';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-select`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Visual variant of the select */
  variant?: 'default' | 'error' | 'success';
  
  /** Size of the select */
  size?: 'sm' | 'md' | 'lg';
  
  /** Label text */
  label?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Icon to display on the left */
  leftIcon?: React.ReactNode;
  
  /** Take full width of container */
  fullWidth?: boolean;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Options for the select */
  options?: SelectOption[];
  
  /** Loading state */
  loading?: boolean;
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

// Variant-based CSS classes
const getVariantClasses = (variant: 'default' | 'error' | 'success', hasError: boolean) => {
  if (hasError || encodeSizeMode(variant) === encodeSizeMode('error')) {
    return `${l_prx}-error`;
  }
  if (encodeSizeMode(variant) === encodeSizeMode('success')) {
    return `${l_prx}-success`;
  }
  return `${l_prx}-default`;
};

/* @__PURE__ */
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  leftIcon,
  fullWidth = false,
  placeholder,
  options = [],
  loading = false,
  children,
  className = '',
  id,
  ...props
}, ref) => {
  // Generate unique IDs for accessibility
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperTextId = helperText ? `${selectId}-helper` : undefined;
  
  const hasError = encodeSizeMode(variant) === encodeSizeMode('error') || Boolean(error);
  
  // Build CSS classes
  const selectClasses = cn(
    l_prx,
    getSizeClasses(size),
    getVariantClasses(variant, hasError),
    leftIcon !== undefined && leftIcon !== null && `${l_prx}-with-icon`,
    fullWidth && `${l_prx}-full-width`,
    loading && `${l_prx}-loading`,
    className
  );
  
  const wrapperClasses = cn(
    `${l_prx}-wrapper`,
    fullWidth && `${l_prx}-wrapper-full-width`
  );

  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={selectId}
          className={`${lib}-label`}
        >
          {label}
        </label>
      )}
      
      <div className={`${l_prx}-container`}>
        {leftIcon && (
          <div className={`${l_prx}-icon anukit-select-icon-left`}>
            {leftIcon}
          </div>
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          aria-invalid={hasError}
          aria-describedby={cn(errorId, helperTextId)}
          disabled={loading || props.disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          
          {options.length > 0 ? (
            options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
          
          {loading && (
            <option disabled>Loading...</option>
          )}
        </select>
        
        <div className={`${l_prx}-icon anukit-select-icon-chevron`}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
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

Select.displayName = 'Select';

export { Select };