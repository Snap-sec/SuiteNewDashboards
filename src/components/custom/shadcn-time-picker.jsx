import { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function ShadcnTimePicker({ value, onChange,disabled, placeholder = 'Select time', className, ...triggerProps }) {
  const [open, setOpen] = useState(false);

  // Parse "HH:mm"
  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return { hour: null, minute: null };
    const parts = timeStr.split(':');
    if (parts.length < 2) return { hour: null, minute: null };
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return {
      hour: isNaN(h) ? null : h,
      minute: isNaN(m) ? null : m,
    };
  };

  const { hour: selectedHour, minute: selectedMinute } = parseTime(value);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const hourRefs = useRef({});
  const minuteRefs = useRef({});

  // Auto-scroll selected values into view when popover opens
  useEffect(() => {
    if (open) {
      if (selectedHour !== null && hourRefs.current[selectedHour]) {
        hourRefs.current[selectedHour].scrollIntoView({ block: 'center' });
      }
      if (selectedMinute !== null && minuteRefs.current[selectedMinute]) {
        minuteRefs.current[selectedMinute].scrollIntoView({ block: 'center' });
      }
    }
  }, [open, selectedHour, selectedMinute]);

  const handleSelectHour = (h) => {
    const currentMin = selectedMinute !== null ? selectedMinute : 0;
    const formatted = `${String(h).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    onChange?.(formatted);
  };

  const handleSelectMinute = (m) => {
    const currentHr = selectedHour !== null ? selectedHour : 0;
    const formatted = `${String(currentHr).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange?.(formatted);
  };

  const displayLabel = value
    ? `${String(selectedHour ?? 0).padStart(2, '0')}:${String(selectedMinute ?? 0).padStart(2, '0')}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...triggerProps}
          type="button"
          variant="outline"
          className={cn(
            'w-full h-10 px-3 justify-between text-sm font-normal text-left bg-background hover:bg-accent/40',
            !value && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <span className="flex items-center gap-2 truncate">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate">{displayLabel}</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-60 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex divide-x divide-border">
          {/* Hour Column */}
          <div className="flex flex-col">
            <div className="text-[11px] font-semibold text-muted-foreground px-3 py-1.5 text-center bg-muted/40 border-b border-border">
              Hour
            </div>
            <ScrollArea className="h-56 w-20">
              <div className="p-1 space-y-0.5">
                {hours.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      ref={(el) => (hourRefs.current[h] = el)}
                      type="button"
                      onClick={() => handleSelectHour(h)}
                      className={cn(
                        'w-full py-1.5 text-xs text-center rounded-md font-mono transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'hover:bg-accent text-foreground',
                      )}
                    >
                      {String(h).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Minute Column */}
          <div className="flex flex-col">
            <div className="text-[11px] font-semibold text-muted-foreground px-3 py-1.5 text-center bg-muted/40 border-b border-border">
              Minute
            </div>
            <ScrollArea className="h-56 w-20">
              <div className="p-1 space-y-0.5">
                {minutes.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <button
                      key={m}
                      ref={(el) => (minuteRefs.current[m] = el)}
                      type="button"
                      onClick={() => handleSelectMinute(m)}
                      className={cn(
                        'w-full py-1.5 text-xs text-center rounded-md font-mono transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'hover:bg-accent text-foreground',
                      )}
                    >
                      {String(m).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between p-2 border-t border-border bg-muted/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => {
              const now = new Date();
              const formatted = `${String(now.getHours()).padStart(2, '0')}:${String(
                now.getMinutes(),
              ).padStart(2, '0')}`;
              onChange?.(formatted);
            }}
          >
            Now
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => onChange?.('')}
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
