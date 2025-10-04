/**
 * DatePicker Component
 * Accessible date picker with calendar popup, keyboard navigation, and date range selection
 */

import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@optimui/utils';

const lib = "optimui";

const l_prx = `${lib}-datepicker`;

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size' | 'defaultValue'> {
  /** Visual variant of the date picker */
  variant?: 'default' | 'outlined' | 'filled' | 'error' | 'success';
  
  /** Size of the date picker */
  size?: 'sm' | 'md' | 'lg';
  
  /** Error message to display */
  error?: string;
  
  /** Helper text to display */
  helperText?: string;
  
  /** Label for the date picker */
  label?: string;
  
  /** Current selected date */
  value?: Date | null;
  
  /** Default date value */
  defaultValue?: Date | null;
  
  /** Callback when date changes */
  onChange?: (date: Date | null) => void;
  
  /** Date format for display (default: MM/dd/yyyy) */
  format?: string;
  
  /** Minimum selectable date */
  minDate?: Date;
  
  /** Maximum selectable date */
  maxDate?: Date;
  
  /** Array of disabled dates */
  disabledDates?: Date[];
  
  /** Whether to show week numbers */
  showWeekNumbers?: boolean;
  
  /** First day of week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  
  /** Locale for date formatting */
  locale?: string;
  
  /** Whether to show time picker */
  showTime?: boolean;
  
  /** Time format (default: HH:mm) */
  timeFormat?: string;
  
  /** Whether the field takes full width of its container */
  fullWidth?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Whether calendar is open by default */
  defaultOpen?: boolean;
  
  /** Callback when calendar opens/closes */
  onOpenChange?: (open: boolean) => void;
  
  /** Custom placeholder text */
  placeholder?: string;
  
  /** Additional CSS class */
  className?: string;
}

// Date utility functions
const formatDate = (date: Date | null, format: string = 'MM/dd/yyyy'): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
};

const parseDate = (dateString: string, format: string = 'MM/dd/yyyy'): Date | null => {
  if (!dateString) return null;
  
  try {
    // Simple MM/dd/yyyy parsing
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      const date = new Date(year, month, day);
      if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
      }
    }
    return null;
  } catch {
    return null;
  }
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date, disabledDates?: Date[]): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates?.some(disabledDate => isSameDay(date, disabledDate))) return true;
  return false;
};

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
  variant = 'default',
  size = 'md',
  error,
  helperText,
  label,
  value,
  defaultValue,
  onChange,
  format = 'MM/dd/yyyy',
  minDate,
  maxDate,
  disabledDates = [],
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  locale = 'en-US',
  showTime = false,
  timeFormat = 'HH:mm',
  fullWidth = false,
  loading = false,
  defaultOpen = false,
  onOpenChange,
  placeholder,
  className,
  disabled,
  readOnly,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState<Date | null>(value || defaultValue || null);
  const [inputValue, setInputValue] = useState(formatDate((value ?? defaultValue) ?? null, format));
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Use external ref if provided, otherwise use internal ref
  const inputElement = ref ? (ref as React.RefObject<HTMLInputElement>) : inputRef;
  
  const hasError = Boolean(error);
  const currentValue = value !== undefined ? value : internalValue;
  
  // Sync internal value with external value
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
      setInputValue(formatDate(value, format));
    }
  }, [value, format]);
  
  // Update current month when value changes
  useEffect(() => {
    if (currentValue) {
      setCurrentMonth(new Date(currentValue));
    }
  }, [currentValue]);
  
  const fieldId = props.id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const helperTextId = `${fieldId}-helper`;
  const calendarId = `${fieldId}-calendar`;
  
  const getSizeClass = (): string => {
    switch (size) {
      case 'sm':
        return `${l_prx}-sm`;
      case 'lg':
        return `${l_prx}-lg`;
      default:
        return `${l_prx}-md`;
    }
  };
  
  const getVariantClass = (): string => {
    if (hasError) return `${l_prx}-error`;
    
    switch (variant) {
      case 'outlined':
        return `${l_prx}-outlined`;
      case 'filled':
        return `${l_prx}-filled`;
      case 'success':
        return `${l_prx}-success`;
      default:
        return `${l_prx}-default`;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsedDate = parseDate(newValue, format);
    if (parsedDate && !isDateDisabled(parsedDate, minDate, maxDate, disabledDates)) {
      setInternalValue(parsedDate);
      onChange?.(parsedDate);
    } else if (!newValue) {
      setInternalValue(null);
      onChange?.(null);
    }
  };
  
  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date, minDate, maxDate, disabledDates)) return;
    
    setInternalValue(date);
    setInputValue(formatDate(date, format));
    onChange?.(date);
    
    if (!showTime) {
      setIsOpen(false);
    }
  };
  
  const toggleCalendar = () => {
    if (disabled || readOnly) return;
    
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        onOpenChange?.(true);
      }
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      onOpenChange?.(false);
    }
    
    props.onKeyDown?.(e);
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startOfCalendar = new Date(startOfMonth);
    const endOfCalendar = new Date(endOfMonth);
    
    // Adjust to show full weeks
    startOfCalendar.setDate(startOfCalendar.getDate() - ((startOfCalendar.getDay() - firstDayOfWeek + 7) % 7));
    endOfCalendar.setDate(endOfCalendar.getDate() + (6 - ((endOfCalendar.getDay() - firstDayOfWeek + 7) % 7)));
    
    const days = [];
    const currentDate = new Date(startOfCalendar);
    
    while (currentDate <= endOfCalendar) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };
  
  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Adjust day names based on first day of week
  const adjustedDayNames = [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];
  
  const wrapperClasses = cn(
    l_prx,
    getSizeClass(),
    getVariantClass(),
    isFocused && `${l_prx}--focused`,
    disabled && `${l_prx}--disabled`,
    readOnly && `${l_prx}--readonly`,
    loading && `${l_prx}--loading`,
    isOpen && `${l_prx}--open`,
    fullWidth && `${l_prx}--fullwidth`,
    className
  );
  
  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={fieldId}
          className={`${l_prx}-label`}
        >
          {label}
        </label>
      )}
      
      <div className={`${l_prx}-container`}>
        <input
          ref={inputElement}
          id={fieldId}
          type="text"
          value={inputValue}
          placeholder={placeholder || format.toLowerCase()}
          className={`${l_prx}-input`}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={hasError}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-describedby={cn(
            error && errorId,
            helperText && !error && helperTextId
          )}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...props}
        />
        
        <button
          ref={buttonRef}
          type="button"
          className={`${l_prx}-trigger`}
          onClick={toggleCalendar}
          disabled={disabled || readOnly}
          aria-label="Open calendar"
          aria-expanded={isOpen}
          aria-controls={calendarId}
          tabIndex={-1}
        >
          {loading ? (
            <div className={`${l_prx}-spinner`}>
              <svg
                className={`${lib}-spinner`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="32"
                  strokeDashoffset="32"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    dur="2s"
                    values="0 32;16 16;0 32;0 32"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="2s"
                    values="0;-16;-32;-32"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
      </div>
      
      {isOpen && (
        <div
          ref={calendarRef}
          id={calendarId}
          className={`${l_prx}-calendar`}
          role="dialog"
          aria-label="Choose date"
          aria-modal="true"
        >
          <div className={`${l_prx}-header`}>
            <button
              type="button"
              className={`${l_prx}-nav-button`}
              onClick={() => navigateMonth('prev')}
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <div className={`${l_prx}-month-year`}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            
            <button
              type="button"
              className={`${l_prx}-nav-button`}
              onClick={() => navigateMonth('next')}
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          
          <div className={`${l_prx}-grid`}>
            <div className={`${l_prx}-weekdays`}>
              {adjustedDayNames.map((day) => (
                <div key={day} className={`${l_prx}-weekday`}>
                  {day}
                </div>
              ))}
            </div>
            
            <div className={`${l_prx}-days`}>
              {calendarDays.map((day) => {
                const isSelected = isSameDay(day, currentValue);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isDisabled = isDateDisabled(day, minDate, maxDate, disabledDates);
                
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={cn(
                      `${l_prx}-day`,
                      isSelected && `${l_prx}-day--selected`,
                      isToday && `${l_prx}-day--today`,
                      isCurrentMonth && `${l_prx}-day--current-month`,
                      isDisabled && `${l_prx}-day--disabled`,
                    )}
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled}
                    aria-label={formatDate(day, 'MMMM d, yyyy')}
                    aria-selected={isSelected}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className={`${l_prx}-footer`}>
        {error && (
          <div
            id={errorId}
            className={`${l_prx}-error`}
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div
            id={helperTextId}
            className={`${l_prx}-helper`}
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
export type { DatePickerProps };