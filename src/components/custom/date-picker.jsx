'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export default function DatePicker({ value, onChange }) {
  const [date, setDate] = React.useState(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleReset = (e) => {
    setDate(undefined);
    onChange(undefined);
    e.preventDefault();
  };

  const handleChange = (date) => {
    setDate(date);
    onChange(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button type="button" variant="outline" mode="input" placeholder={!date} className="w-full">
            <CalendarIcon />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
          {date && (
            <Button
              type="button"
              variant="dim"
              size="sm"
              className="absolute top-1/2 -end-0 -translate-y-1/2"
              onClick={handleReset}
            >
              <X />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleChange} autoFocus />
      </PopoverContent>
    </Popover>
  );
}

