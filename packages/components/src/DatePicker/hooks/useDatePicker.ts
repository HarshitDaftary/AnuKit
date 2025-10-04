/**
 * DatePicker Hook
 * Manages state and business logic for DatePicker component
 */

import { useState, useCallback, useMemo } from 'react';
import { formatDate, parseDate, isSameDay } from '@anukit/utils';

export interface UseDatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  defaultOpen?: boolean;
}

export interface UseDatePickerReturn {
  // State
  internalValue: Date | null;
  inputValue: string;
  isOpen: boolean;
  currentMonth: Date;
  isFocused: boolean;
  
  // Actions
  setInputValue: (value: string) => void;
  setIsOpen: (open: boolean) => void;
  setCurrentMonth: (month: Date) => void;
  setIsFocused: (focused: boolean) => void;
  
  // Handlers
  handleDateSelect: (date: Date) => void;
  handleInputChange: (value: string) => void;
  handleInputBlur: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  
  // Utilities
  isDateDisabled: (date: Date) => boolean;
  formatDisplayDate: (date: Date | null) => string;
  parseInputDate: (value: string) => Date | null;
}

const isDateDisabled = (
  date: Date, 
  minDate?: Date, 
  maxDate?: Date, 
  disabledDates?: Date[]
): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates?.some(disabled => isSameDay(date, disabled))) return true;
  return false;
};

export const useDatePicker = ({
  value,
  defaultValue,
  onChange,
  format = 'MM/dd/yyyy',
  minDate,
  maxDate,
  disabledDates,
  defaultOpen = false,
}: UseDatePickerProps): UseDatePickerReturn => {
  const [internalValue, setInternalValue] = useState<Date | null>(
    value || defaultValue || null
  );
  const [inputValue, setInputValue] = useState(
    formatDate(value || defaultValue, format)
  );
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentMonth, setCurrentMonth] = useState(
    value || defaultValue || new Date()
  );
  const [isFocused, setIsFocused] = useState(false);

  const handleDateSelect = useCallback((date: Date) => {
    if (isDateDisabled(date, minDate, maxDate, disabledDates)) return;
    
    setInternalValue(date);
    setInputValue(formatDate(date, format));
    setIsOpen(false);
    onChange?.(date);
  }, [onChange, format, minDate, maxDate, disabledDates]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    
    const parsedDate = parseDate(value, format);
    if (parsedDate && !isDateDisabled(parsedDate, minDate, maxDate, disabledDates)) {
      setInternalValue(parsedDate);
      setCurrentMonth(parsedDate);
      onChange?.(parsedDate);
    }
  }, [onChange, format, minDate, maxDate, disabledDates]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    
    // Validate and format input on blur
    const parsedDate = parseDate(inputValue, format);
    if (parsedDate && !isDateDisabled(parsedDate, minDate, maxDate, disabledDates)) {
      setInputValue(formatDate(parsedDate, format));
    } else {
      // Reset to last valid value
      setInputValue(formatDate(internalValue, format));
    }
  }, [inputValue, internalValue, format, minDate, maxDate, disabledDates]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen]);

  const dateDisabilityChecker = useCallback((date: Date) => {
    return isDateDisabled(date, minDate, maxDate, disabledDates);
  }, [minDate, maxDate, disabledDates]);

  const formatDisplayDate = useCallback((date: Date | null) => {
    return formatDate(date, format);
  }, [format]);

  const parseInputDate = useCallback((value: string) => {
    return parseDate(value, format);
  }, [format]);

  return {
    // State
    internalValue,
    inputValue,
    isOpen,
    currentMonth,
    isFocused,
    
    // Actions
    setInputValue,
    setIsOpen,
    setCurrentMonth,
    setIsFocused,
    
    // Handlers
    handleDateSelect,
    handleInputChange,
    handleInputBlur,
    handleKeyDown,
    
    // Utilities
    isDateDisabled: dateDisabilityChecker,
    formatDisplayDate,
    parseInputDate,
  };
};