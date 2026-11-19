import { useState } from 'react';
import { format, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function ShadcnDatePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Pick a date',
  className,
  disablePast = true,
  minDate,
  disabledDates,
  triggerProps = {},
  ...calendarProps
}) {
  const [open, setOpen] = useState(false);

  // Parse string "YYYY-MM-DD" or Date object
  const parseDate = (val) => {
    if (!val) return undefined;
    if (val instanceof Date && isValid(val)) return val;
    if (typeof val === 'string') {
      const parsed = parse(val, 'yyyy-MM-dd', new Date());
      if (isValid(parsed)) return parsed;
      const parsedIso = new Date(val);
      if (isValid(parsedIso)) return parsedIso;
    }
    return undefined;
  };

  const selectedDate = parseDate(value);

  const isDayDisabled = (date) => {
    if (!date) return false;
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    if (disablePast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (day < today) return true;
    }

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (day < min) return true;
    }

    if (disabledDates) {
      if (typeof disabledDates === 'function') {
        if (disabledDates(date)) return true;
      } else if (Array.isArray(disabledDates)) {
        const dateStr = format(date, 'yyyy-MM-dd');
        if (
          disabledDates.some((d) =>
            typeof d === 'string' ? d === dateStr : format(d, 'yyyy-MM-dd') === dateStr,
          )
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const hasDisabledRules = disablePast || minDate || disabledDates;

  const handleSelect = (date) => {
    if (!date) {
      onChange?.('');
    } else {
      if (hasDisabledRules && isDayDisabled(date)) {
        return;
      }
      const formatted = format(date, 'yyyy-MM-dd');
      onChange?.(formatted);
    }
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.('');
  };

  const startMonth = disablePast ? new Date() : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...triggerProps}
          type="button"
          variant="outline"
          className={cn(
            'w-full h-10 px-3 justify-between text-sm font-normal text-left bg-background hover:bg-accent/40',
            !selectedDate && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <span className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate">{selectedDate ? format(selectedDate, 'PPP') : placeholder}</span>
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {selectedDate && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="p-0.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-60" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={hasDisabledRules ? isDayDisabled : undefined}
          startMonth={startMonth}
          autoFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
