import * as React from 'react';
import { Badge, BadgeButton } from '@/components/ui/badge';
import { Button, ButtonArrow } from '@/components/ui/button';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { X } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';


export default function MultiSelect({
  options = [],
  onChange,
  onSearchChange,
  placeholder = "Select items",
  emptyPlaceholder = "No items found.",
  searchPlaceholder = "Search ...",
  value = [],
  maxShownItems = 2,
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Convert value prop to consistent format
  const normalizedValue = useMemo(() => {
    if (!value || value.length === 0) return [];
    
    return value.map(item => {
      // If it's already an object with value and label, use it
      if (typeof item === 'object' && item.value && item.label) {
        return item;
      }
      
      // If it's a string, find the matching option or create a basic object
      if (typeof item === 'string') {
        const found = options.find(opt => opt.value === item);
        return found || { value: item, label: item };
      }
      
      // Fallback
      return { value: item, label: item };
    }).filter(Boolean);
  }, [value, options]);

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedValues(normalizedValue);
  }, [normalizedValue]);

  // Handle item selection/deselection
  const toggleSelection = useCallback((optionValue) => {
    const newSelectedValues = selectedValues.some(val => val.value === optionValue)
      ? selectedValues.filter(val => val.value !== optionValue)
      : [...selectedValues, options.find(opt => opt.value === optionValue)].filter(Boolean);
    
    setSelectedValues(prev => [...prev, optionValue]);
    
    // Call onChange with just the values
    if (onChange) {
      onChange(newSelectedValues);
    }
  }, [selectedValues, options, onChange]);

  // Remove item from selection
  const removeSelection = useCallback((itemToRemove) => {

    const newSelectedValues = selectedValues.filter(val => {
      if (typeof val.value == "string") return val.value !== itemToRemove.value;
      else if (typeof val.value == "object") return val?.value?.id !== itemToRemove?.value?.id;
    });

    setSelectedValues(newSelectedValues);
    
    if (onChange) {
      onChange(newSelectedValues);
    }
  }, [selectedValues, onChange]);

  // Filter available options (exclude already selected)
  const availableOptions = useMemo(() => {
    return options.filter(option => 
      !selectedValues.some(selected => {
        if (typeof selected.value == "object") return selected.value?.id == option.value?.id;
        else if (typeof selected.value == "string") return selected.value == option.value;
    })
    );
  }, [options, selectedValues]);

  // UI Handling
  const visibleItems = expanded
    ? selectedValues
    : selectedValues.slice(0, maxShownItems);
  const hiddenCount = selectedValues.length - visibleItems.length;

  const handleSearchChange = (search) => {
    setSearchValue(search);
    if (onSearchChange) {
      onSearchChange(search);
    }
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            autoHeight={true}
            mode="input"
            placeholder={selectedValues.length === 0}
            className="w-full px-1.5 py-1 relative justify-start"
          >
            <div className="flex flex-wrap items-center gap-1 pe-2.5 flex-1">
              {selectedValues.length > 0 ? (
                <>
                  {visibleItems.map((val, index) => (
                    <Badge key={val.value || index} appearance="stroke">
                      {String(val?.label ?? val?.value?.id).slice(0, 40)}
                      <BadgeButton
                        onClick={e => {
                          e.stopPropagation();
                          removeSelection(val);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </BadgeButton>
                    </Badge>
                  ))}
                  {hiddenCount > 0 && !expanded && (
                    <Badge
                      className="cursor-pointer px-1.5 text-muted-foreground hover:bg-accent"
                      appearance="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        setExpanded(true);
                      }}
                    >
                      +{hiddenCount} more
                    </Badge>
                  )}
                  {expanded && hiddenCount > 0 && (
                    <Badge
                      className="cursor-pointer px-1.5 text-muted-foreground hover:bg-accent"
                      appearance="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        setExpanded(false);
                      }}
                    >
                      Show Less
                    </Badge>
                  )}
                </>
              ) : (
                <span className="px-2.5 text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ButtonArrow className="absolute top-[0.7rem] end-3 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={handleSearchChange}
            />
            <CommandList>
              <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
              <CommandGroup>
                {availableOptions.map((item, idx) => (
                  <CommandItem
                    key={item.value || idx}
                    value={item.label} // This is what Command uses for filtering
                    onSelect={() => {
                      toggleSelection(item);
                      // Don't close popover to allow multiple selections
                    }}
                    className="cursor-pointer"
                  >
                    <span className="truncate">{item.label}</span>
                    {selectedValues.some(s => s.value === item.value) && (
                      <CommandCheck className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
