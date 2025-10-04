/**
 * DatePicker Component - Optimized
 * Accessible date picker with calendar popup, keyboard navigation, and date range selection
 * Optimized architecture using hooks and component composition
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { cn, usePortal } from '@anukit/utils';
import { useDatePicker } from './hooks/useDatePicker';
import { DatePickerInput } from './DatePickerInput';
import { DatePickerCalendar } from './DatePickerCalendar';
import type { DatePickerProps } from './types';

const cNam = "anukit-datepicker";

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
  value,
  defaultValue,
  onChange,
  format = 'MM/dd/yyyy',
  minDate,
  maxDate,
  disabledDates,
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  locale = 'en-US',
  showTime = false,
  timeFormat = 'HH:mm',
  fullWidth = false,
  loading = false,
  defaultOpen = false,
  closeOnSelect = true,
  onOpenChange,
  portalContainer,
  renderInput,
  renderCalendar,
  variant = 'default',
  size = 'md',
  error,
  helperText,
  label,
  placeholder,
  disabled = false,
  readOnly = false,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const portalElement = usePortal(portalContainer?.id);
  
  // Use our custom hook for state management
  const datePicker = useDatePicker({
    value,
    defaultValue,
    onChange,
    format,
    minDate,
    maxDate,
    disabledDates,
    defaultOpen,
    onOpenChange,
  });

  // Handle clicks outside calendar to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePicker.isOpen &&
        calendarRef.current &&
        inputRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        datePicker.setIsOpen(false);
      }
    };

    if (datePicker.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [datePicker.isOpen]);

  // Enhanced date selection handler
  const handleDateSelect = (date: Date) => {
    datePicker.handleDateSelect(date);
    if (closeOnSelect && !showTime) {
      datePicker.setIsOpen(false);
    }
  };

  // Enhanced input handlers
  const handleInputFocus = () => {
    datePicker.setIsFocused(true);
    if (!readOnly && !disabled) {
      datePicker.setIsOpen(true);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    datePicker.handleKeyDown(event);
    
    // Additional keyboard navigation
    if (datePicker.isOpen && calendarRef.current) {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          // Focus management for calendar navigation
          const firstButton = calendarRef.current.querySelector(
            `.${cNam}-day:not(:disabled)`
          ) as HTMLButtonElement;
          firstButton?.focus();
          break;
      }
    }
  };

  // Optimized wrapper classes using Table patterns
  const wrapperClasses = cn(
    cNam,
    `${cNam}--${size}`,
    variant !== 'default' && `${cNam}--${variant}`,
    datePicker.isOpen && `${cNam}--open`,
    disabled && `${cNam}--disabled`,
    readOnly && `${cNam}--readonly`,
    loading && `${cNam}--loading`,
    error && `${cNam}--error`,
    datePicker.isFocused && `${cNam}--focused`,
    fullWidth && `${cNam}--fullwidth`,
    className
  );

  // Calendar positioning classes
  const calendarClasses = cn(
    `${cNam}-popup`,
    `${cNam}-popup--${size}`
  );

  // Generate field ID
  const fieldId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const helperTextId = `${fieldId}-helper`;
  const calendarId = `${fieldId}-calendar`;

  // Render custom input if provided
  const inputElement = renderInput ? renderInput({
    ref: ref || inputRef,
    value: datePicker.inputValue,
    onChange: datePicker.handleInputChange,
    onFocus: handleInputFocus,
    onBlur: datePicker.handleInputBlur,
    onKeyDown: handleInputKeyDown,
    placeholder: placeholder || format.toLowerCase(),
    disabled,
    readOnly,
    error,
    size,
    variant,
    id: fieldId,
    'aria-label': ariaLabel,
    'aria-describedby': cn(
      error && errorId,
      helperText && !error && helperTextId
    ),
    'aria-invalid': Boolean(error),
    'aria-expanded': datePicker.isOpen,
    'aria-haspopup': 'dialog',
    'aria-controls': calendarId,
    ...props,
  }) : (
    <DatePickerInput
      ref={ref || inputRef}
      value={datePicker.inputValue}
      onChange={datePicker.handleInputChange}
      onFocus={handleInputFocus}
      onBlur={datePicker.handleInputBlur}
      onKeyDown={handleInputKeyDown}
      placeholder={placeholder || format.toLowerCase()}
      disabled={disabled}
      readOnly={readOnly}
      error={error}
      size={size}
      variant={variant}
      id={fieldId}
      aria-label={ariaLabel}
      aria-describedby={cn(
        error && errorId,
        helperText && !error && helperTextId
      )}
      aria-invalid={Boolean(error)}
      aria-expanded={datePicker.isOpen}
      aria-haspopup="dialog"
      aria-controls={calendarId}
      {...props}
    />
  );

  // Render custom calendar if provided
  const calendarElement = renderCalendar ? renderCalendar({
    currentMonth: datePicker.currentMonth,
    selectedDate: datePicker.internalValue,
    onDateSelect: handleDateSelect,
    onMonthChange: datePicker.setCurrentMonth,
    isDateDisabled: datePicker.isDateDisabled,
    showWeekNumbers,
    firstDayOfWeek,
    showTime,
    timeFormat,
    locale,
  }) : (
    <DatePickerCalendar
      currentMonth={datePicker.currentMonth}
      selectedDate={datePicker.internalValue}
      onDateSelect={handleDateSelect}
      onMonthChange={datePicker.setCurrentMonth}
      isDateDisabled={datePicker.isDateDisabled}
      showWeekNumbers={showWeekNumbers}
      firstDayOfWeek={firstDayOfWeek}
      showTime={showTime}
      timeFormat={timeFormat}
      locale={locale}
    />
  );

  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={fieldId} className={`${cNam}-label`}>
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className={`${cNam}-container`}>
        {inputElement}
      </div>

      {/* Calendar Popup */}
      {datePicker.isOpen && (
        <div 
          ref={calendarRef} 
          id={calendarId}
          className={calendarClasses}
          role="dialog"
          aria-label="Choose date"
          aria-modal="true"
        >
          {calendarElement}
        </div>
      )}

      {/* Footer with helper text and errors */}
      <div className={`${cNam}-footer`}>
        {error && (
          <div
            id={errorId}
            className={`${cNam}-error`}
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div
            id={helperTextId}
            className={`${cNam}-helper`}
          >
            {helperText}
          </div>
        )}
      </div>
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export { DatePicker };

// Re-export sub-components for advanced usage
export { DatePickerInput } from './DatePickerInput';
export { DatePickerCalendar } from './DatePickerCalendar';
export { useDatePicker } from './hooks/useDatePicker';
export type * from './types';