/**
 * DatePickerInput Component
 * Handles input display and interaction for DatePicker
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-datepicker-input`;

export interface DatePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void | undefined;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void | undefined;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'error' | 'success';
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
}

const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder = 'MM/DD/YYYY',
  disabled = false,
  readOnly = false,
  error,
  size = 'md',
  variant = 'default',
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  id,
  ...props
}, ref) => {
  const inputClasses = cn(
    l_prx,
    `${l_prx}--${variant}`,
    `${l_prx}--${size}`,
    disabled && `${l_prx}--disabled`,
    readOnly && `${l_prx}--readonly`,
    error && `${l_prx}--error`,
    className
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!readOnly && !disabled) {
      onChange(event.target.value);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!disabled) {
      onFocus?.(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!disabled) {
      onBlur?.(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disabled) {
      onKeyDown(event);
    }
  };

  return (
    <div className={`${lib}-datepicker-input-container`}>
      <input
        ref={ref}
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={inputClasses}
        aria-label={ariaLabel || 'Select date'}
        aria-describedby={ariaDescribedBy}
        autoComplete="off"
        {...props}
      />
      
      <div className={`${lib}-datepicker-input-icon`}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      
      {error && (
        <div className={`${lib}-datepicker-input-error`}>
          {error}
        </div>
      )}
    </div>
  );
});

DatePickerInput.displayName = 'DatePickerInput';

export { DatePickerInput };