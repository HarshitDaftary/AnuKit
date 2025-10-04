/**
 * DatePickerCalendar Component
 * Calendar popup for DatePicker with navigation and date selection
 */

import React, { useMemo, useCallback } from 'react';
import { cn, isSameDay } from '@optimui/utils';

const lib = "optimui";
const l_prx = `${lib}-datepicker-calendar`;

export interface DatePickerCalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (month: Date) => void;
  isDateDisabled: (date: Date) => boolean;
  showWeekNumbers?: boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  isDateDisabled,
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  className,
}) => {
  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate starting date (including previous month days)
    const startDate = new Date(firstDay);
    const dayOffset = (firstDay.getDay() - firstDayOfWeek + 7) % 7;
    startDate.setDate(startDate.getDate() - dayOffset);
    
    // Generate 42 days (6 weeks)
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [currentMonth, firstDayOfWeek]);

  const handlePreviousMonth = useCallback(() => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onMonthChange(prevMonth);
  }, [currentMonth, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onMonthChange(nextMonth);
  }, [currentMonth, onMonthChange]);

  const handleDateClick = useCallback((date: Date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date);
    }
  }, [onDateSelect, isDateDisabled]);

  const getWeekNumber = useCallback((date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }, []);

  const reorderedDayNames = useMemo(() => {
    const days = [...DAY_NAMES];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(days.shift()!);
    }
    return days;
  }, [firstDayOfWeek]);

  return (
    <div className={cn(`${lib}-datepicker-calendar`, className)}>
      {/* Calendar Header */}
      <div className={`${lib}-datepicker-calendar-header`}>
        <button
          type="button"
          onClick={handlePreviousMonth}
          className={`${lib}-datepicker-nav-button`}
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        
        <div className={`${lib}-datepicker-month-year`}>
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        
        <button
          type="button"
          onClick={handleNextMonth}
          className={`${lib}-datepicker-nav-button`}
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>
      {/* Calendar Grid */}
      <div className={`${lib}-datepicker-calendar-grid`}>
        {/* Day headers */}
        <div className={`${lib}-datepicker-calendar-row optimui-datepicker-calendar-header-row`}>
          {showWeekNumbers && (
            <div className={`${lib}-datepicker-week-number-header`}>Wk</div>
          )}
          {reorderedDayNames.map(day => (
            <div key={day} className={`${lib}-datepicker-day-header`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar weeks */}
        {Array.from({ length: 6 }).map((_, weekIndex) => {
          const weekStart = weekIndex * 7;
          const weekDays = calendarDays.slice(weekStart, weekStart + 7);
          
          return (
            <div key={weekIndex} className={`${lib}-datepicker-calendar-row`}>
              {showWeekNumbers && (
                <div className={`${lib}-datepicker-week-number`}>
                  {getWeekNumber(weekDays[0])}
                </div>
              )}
              {weekDays.map((date, dayIndex) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isDisabled = isDateDisabled(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <button
                    key={dayIndex}
                    type="button"
                    onClick={() => handleDateClick(date)}
                    disabled={isDisabled}
                    className={cn(
                      `${lib}-datepicker-day`,
                      isCurrentMonth && `${lib}-datepicker-day--current-month`,
                      !isCurrentMonth && `${lib}-datepicker-day--other-month`,
                      isSelected && `${lib}-datepicker-day--selected`,
                      isDisabled && `${lib}-datepicker-day--disabled`,
                      isToday && `${lib}-datepicker-day--today`
                    )}
                    aria-label={`${date.toDateString()}`}
                    aria-selected={isSelected || undefined}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

DatePickerCalendar.displayName = 'DatePickerCalendar';

export { DatePickerCalendar };