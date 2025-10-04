/**
 * DatePicker Component - Optimized Architecture
 * Orchestrates DatePickerInput and DatePickerCalendar via useDatePicker
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import { cn, usePortal } from '@optimui/utils';
import { useDatePicker } from './hooks/useDatePicker';
import { DatePickerInput } from './DatePickerInput';
import { DatePickerCalendar } from './DatePickerCalendar';
import type { DatePickerProps } from './types';

const lib = 'optimui';
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

  const handleDateSelect = (date: Date) => {
    datePicker.handleDateSelect(date);
    if (closeOnSelect) {
      datePicker.setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    datePicker.setIsFocused(true);
    if (!readOnly && !disabled) {
      datePicker.setIsOpen(true);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    datePicker.handleKeyDown(event);

    if (datePicker.isOpen && calendarRef.current) {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          const firstButton = calendarRef.current.querySelector(
            '.optimui-datepicker-day:not(:disabled)'
          ) as HTMLButtonElement;
          firstButton?.focus();
          break;
      }
    }
  };

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

  const calendarClasses = cn(
    `${lib}-datepicker-popup`,
    `optimui-datepicker-popup--${size}`
  );

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
      onFocus={() => handleInputFocus()}
      onBlur={() => datePicker.handleInputBlur()}
      onKeyDown={(e) => handleInputKeyDown(e as unknown as React.KeyboardEvent<HTMLInputElement>)}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      error={error}
      size={size}
      variant={(variant === 'outlined' || variant === 'filled') ? variant : 'default'}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    />
  );

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
      {label && (
        <label htmlFor={id} className={`${lib}-datepicker-label`}>
          {label}
        </label>
      )}

      {inputElement}

      {datePicker.isOpen && (
        <div ref={calendarRef} className={calendarClasses}>
          {calendarElement}
        </div>
      )}

      {helperText && !error && (
        <div className={`${lib}-datepicker-helper-text`}>
          {helperText}
        </div>
      )}

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
export { DatePickerInput } from './DatePickerInput';
export { DatePickerCalendar } from './DatePickerCalendar';
export { useDatePicker } from './hooks/useDatePicker';
export type * from './types';