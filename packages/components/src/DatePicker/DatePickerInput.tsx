/**
 * DatePickerInput Component
 * Handles input display and interaction for DatePicker
 */

import React, { forwardRef } from 'react';
import { cn } from '@optimui/utils';

const lib = "optimui";

export interface DatePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
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
    `${lib}-datepicker-input`,
    `optimui-datepicker-input--${variant}`,
    `optimui-datepicker-input--${size}`,
    {
      `${[^}]*}[^`]*`: disabled,
      `${[^}]*}[^`]*`: readOnly,
      `${[^}]*}[^`]*`: error,
    },
    className
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!readOnly && !disabled) {
      onChange(event.target.value);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!disabled) {
      onFocus();
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!disabled) {
      onBlur();
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