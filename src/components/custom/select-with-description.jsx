import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function SelectWithDescription({
  value,
  options = [],
  placeholder = 'Select option...',
  className,
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          mode="input"
          autoHeight={true}
          className={cn('w-full items-center justify-between py-2 px-3', className)}
          disabled={disabled}
        >
          <div className="flex flex-col items-start gap-0.5 text-left truncate">
            <span className="font-semibold text-sm text-foreground">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.description && (
              <span className="text-xs text-muted-foreground font-normal whitespace-normal">
                {selectedOption.description}
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange?.(option);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between py-3 px-4 cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className={cn(
                      "font-semibold text-sm",
                      value === option.value ? "text-foreground" : "text-foreground/80"
                    )}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground font-normal">
                        {option.description}
                      </span>
                    )}
                  </div>
                  <CommandCheck
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
