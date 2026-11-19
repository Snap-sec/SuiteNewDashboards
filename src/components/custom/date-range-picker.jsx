'use client';

import { useState } from 'react';
import { addDays, format, startOfMonth, subMonths } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function DateRangePicker({ onDateChange, trigger }) {
  const today = new Date();
  // const defaultDate = {
  //   from: today,
  //   to: addDays(today, -2),
  // };

  const defaultDate = {
    from: startOfMonth(subMonths(today, 1)),
    to: today,
  };

  const [date, setDate] = useState(defaultDate);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleApply = () => {
    if (date) {
      onDateChange && onDateChange(date);
    }
    setIsPopoverOpen(false);
  };

  const handleReset = () => {
    setDate(defaultDate);
    onDateChange && onDateChange(defaultDate);
    setIsPopoverOpen(false);
  };

  const handleSelect = (selected) => {
    setDate({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
  };

  // default trigger button if none passed
  const defaultTrigger = (
    <Button type="button" variant="outline" mode="input" className="w-fit">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date?.from ? (
        date.to ? (
          <>
            {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
          </>
        ) : (
          format(date.from, 'LLL dd, y')
        )
      ) : (
        <span>Pick a date range</span>
      )}
    </Button>
  );

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={subMonths(new Date(), 1)} // start from previous month
          showOutsideDays={false}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={3}
          disabled={{ after: new Date() }} // disables all future dates
          toMonth={new Date()} // restricts month navigation to current month
        />
        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
