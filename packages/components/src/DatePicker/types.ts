/**
 * DatePicker Types
 * Shared interfaces and types for DatePicker components
 */

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size' | 'defaultValue'> {
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
  
  /** Default open state */
  defaultOpen?: boolean;
  
  /** Portal container for calendar popup */
  portalContainer?: HTMLElement;
  
  /** Whether calendar should close on date selection */
  closeOnSelect?: boolean;
  
  /** Locale for date formatting */
  locale?: string;
  
  /** Whether to show time selection */
  showTime?: boolean;
  
  /** Time format when showTime is enabled */
  timeFormat?: string;
  
  /** Whether to take full width */
  fullWidth?: boolean;
  
  /** Loading state indicator */
  loading?: boolean;
  
  /** Callback when calendar open state changes */
  onOpenChange?: (open: boolean) => void;
  
  /** Custom input component */
  renderInput?: (props: any) => React.ReactNode;
  
  /** Custom calendar component */
  renderCalendar?: (props: any) => React.ReactNode;
  
  /** Additional CSS class */
  className?: string;
}

export interface DateRangePickerProps extends Omit<DatePickerProps, 'value' | 'defaultValue' | 'onChange'> {
  /** Current selected date range */
  value?: [Date | null, Date | null];
  
  /** Default date range value */
  defaultValue?: [Date | null, Date | null];
  
  /** Callback when date range changes */
  onChange?: (range: [Date | null, Date | null]) => void;
  
  /** Placeholder for start date input */
  startPlaceholder?: string;
  
  /** Placeholder for end date input */
  endPlaceholder?: string;
}

export interface CalendarProps {
  /** Current month being displayed */
  currentMonth: Date;
  
  /** Selected date(s) */
  selectedDate?: Date | null;
  selectedRange?: [Date | null, Date | null];
  
  /** Date selection handler */
  onDateSelect: (date: Date) => void;
  
  /** Month navigation handler */
  onMonthChange: (month: Date) => void;
  
  /** Date disability checker */
  isDateDisabled: (date: Date) => boolean;
  
  /** Whether to show week numbers */
  showWeekNumbers?: boolean;
  
  /** First day of week */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  
  /** Selection mode */
  selectionMode?: 'single' | 'range';
  
  /** Additional CSS class */
  className?: string;
}

export interface DatePickerDisplayConfig {
  /** Custom labels for accessibility and internationalization */
  labels?: {
    previousMonth?: string;
    nextMonth?: string;
    previousYear?: string;
    nextYear?: string;
    selectMonth?: string;
    selectYear?: string;
    selectDate?: string;
    today?: string;
    clear?: string;
  };
}