'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Icon } from '../icon';
import { cn, mergeClass } from '../lib/utils';
import { Button } from './button';

export interface CalendarProps {
  className?: string;
  value?: Date;
  defaultValue?: Date;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function Calendar({
  className,
  value: controlledValue,
  defaultValue,
  onSelect,
  month: controlledMonth,
  onMonthChange,
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    controlledValue ?? defaultValue ?? new Date()
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    controlledMonth ?? controlledValue ?? defaultValue ?? new Date()
  );

  const activeValue = controlledValue !== undefined ? controlledValue : selectedDate;
  const activeMonth = controlledMonth !== undefined ? controlledMonth : currentMonth;

  const year = activeMonth.getFullYear();
  const monthIdx = activeMonth.getMonth();

  const handlePrevMonth = () => {
    const next = new Date(year, monthIdx - 1, 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  };

  const handleNextMonth = () => {
    const next = new Date(year, monthIdx + 1, 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  };

  const handleSelectDay = (day: number) => {
    const date = new Date(year, monthIdx, day);
    setSelectedDate(date);
    onSelect?.(date);
  };

  // Days in current month
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  // First day of current month (0 = Sun, 1 = Mon, etc.)
  const firstDayWeekday = new Date(year, monthIdx, 1).getDay();
  // Days in previous month
  const prevMonthDays = new Date(year, monthIdx, 0).getDate();

  const isSameDay = (d1?: Date, d2?: Date) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const today = new Date();

  return (
    <div
      data-slot="calendar"
      className={mergeClass(
        'w-fit rounded-panel border border-line bg-surface p-3 text-fg select-none',
        className
      )}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <h4 className="text-sm font-semibold text-fg">
          {MONTH_NAMES[monthIdx]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="size-7"
          >
            <Icon icon={ChevronLeft} size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="size-7"
          >
            <Icon icon={ChevronRight} size={14} />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-[11px] font-medium text-fg-3 size-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Previous month trailing days */}
        {Array.from({ length: firstDayWeekday }).map((_, idx) => {
          const dayNum = prevMonthDays - firstDayWeekday + idx + 1;
          return (
            <div
              key={`prev-${idx}`}
              className="size-8 flex items-center justify-center text-xs text-fg-disabled cursor-not-allowed opacity-40"
            >
              {dayNum}
            </div>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const currentDayDate = new Date(year, monthIdx, dayNum);
          const isSelected = isSameDay(activeValue, currentDayDate);
          const isCurrentToday = isSameDay(today, currentDayDate);

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              onClick={() => handleSelectDay(dayNum)}
              data-slot="calendar-day"
              data-selected={isSelected || undefined}
              data-today={isCurrentToday || undefined}
              className={cn(
                'size-8 rounded-control text-xs font-medium transition-colors flex items-center justify-center',
                isSelected
                  ? 'bg-accent text-on-accent font-semibold shadow-xs'
                  : 'text-fg hover:bg-surface-2',
                isCurrentToday && !isSelected && 'border border-line-strong text-accent font-semibold'
              )}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
