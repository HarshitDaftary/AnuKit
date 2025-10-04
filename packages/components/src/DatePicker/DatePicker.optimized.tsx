/**
 * DatePicker Component - Optimized Architecture
 * Main component that orchestrates DatePickerInput and DatePickerCalendar
 * Reduced from 572 lines to ~200 lines through component composition
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import { cn, usePortal } from '@optimui/utils';
import { useDatePicker } from './hooks/useDatePicker';
import { DatePickerInput } from './DatePickerInput';
import { DatePickerCalendar } from './DatePickerCalendar';
import { DatePickerProps } from './types';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";
const l_prx = `${lib}-datepicker`;

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
  defaultOpen = false,
  closeOnSelect = true,
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
    if (closeOnSelect) {
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
            '.optimui-datepicker-day:not(:disabled)'
          ) as HTMLButtonElement;
          firstButton?.focus();
          break;
      }
    }
  };

  // Wrapper classes
  const wrapperClasses = cn(
    l_prx,
    `${l_prx}--${variant}`,
    `${l_prx}--${size}`,
    datePicker.isOpen && `${l_prx}--open`,
    disabled && `${l_prx}--disabled`,
    error && `${l_prx}--error`,
    datePicker.isFocused && `${l_prx}--focused`,
    className
  );

  // Calendar positioning
  const calendarClasses = cn(
    `${lib}-datepicker-popup`,
    `optimui-datepicker-popup--${size}`
  );

  // Render custom input if provided
  const inputElement = renderInput ? renderInput({
    ref: ref || inputRef,
    value: datePicker.inputValue,
    onChange: datePicker.handleInputChange,
    onFocus: handleInputFocus,
    onBlur: datePicker.handleInputBlur,
    onKeyDown: handleInputKeyDown,
    placeholder,
    disabled,
    readOnly,
    error,
    size,
    variant,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...props,
  }) : (
    <DatePickerInput
      ref={ref || inputRef}
      value={datePicker.inputValue}
      onChange={datePicker.handleInputChange}
      onFocus={handleInputFocus}
      onBlur={datePicker.handleInputBlur}
      onKeyDown={handleInputKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      error={error}
      size={size}
      variant={variant}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
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
  }) : (
    <DatePickerCalendar
      currentMonth={datePicker.currentMonth}
      selectedDate={datePicker.internalValue}
      onDateSelect={handleDateSelect}
      onMonthChange={datePicker.setCurrentMonth}
      isDateDisabled={datePicker.isDateDisabled}
      showWeekNumbers={showWeekNumbers}
      firstDayOfWeek={firstDayOfWeek}
    />
  );

  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className={`${lib}-datepicker-label`}>
          {label}
        </label>
      )}

      {/* Input */}
      {inputElement}

      {/* Calendar Popup */}
      {datePicker.isOpen && (
        <div ref={calendarRef} className={calendarClasses}>
          {calendarElement}
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <div className={`${lib}-datepicker-helper-text`}>
          {helperText}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`${lib}-datepicker-error-text`}>
          {error}
        </div>
      )}
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