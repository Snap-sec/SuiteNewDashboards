import * as React from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomTooltip } from '@/components/custom/tooltip';
import { ButtonArrow } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

function getValue(a) {
  if (!a) return a;
  if (typeof a === 'object') return a.id || a._id || a.value;
  return a;
}

export default function Select({
  value: controlledValue,
  defaultValue,
  options = [],
  placeholder,
  searchPlaceholder,
  emptyMessage = 'Nothing Found.',
  className,
  enableAddNew,
  onChange,
  onSearchChange,
  searchField = 'label',
  searchFields = [],
  enableSearch = true,
  areOptionsNavigating = false,
  isSearching = false,
  isFetching = false,
  onReachBottom,
  onScroll,
  disabled = false,
  renderCustomLabelInTrigger = false,
  allowCustomValue = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  // ----------------------------------------------------------
  // CONTROLLED + UNCONTROLLED LOGIC
  // ----------------------------------------------------------

  const isControlled = controlledValue !== undefined;

  const [_uncontrolledValue, _setUncontrolledValue] = React.useState(
    defaultValue || ''
  );

  const value = isControlled ? controlledValue : _uncontrolledValue;

  const setValue = (v) => {
    if (!isControlled) _setUncontrolledValue(v);
  };

  // If defaultValue changes → update internal state
  React.useEffect(() => {
    if (!isControlled && defaultValue !== undefined) {
      _setUncontrolledValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  // ----------------------------------------------------------
  // SEARCH FILTERING
  // ----------------------------------------------------------

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;

    return options.filter((option) => {
      if (searchFields.length > 0) {
        return searchFields.some((field) =>
          option[field]?.toString().toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      const fieldValue = option[searchField]?.toString().toLowerCase() || '';
      return fieldValue.includes(searchValue.toLowerCase());
    });
  }, [options, searchValue, searchField, searchFields]);

  // ----------------------------------------------------------
  // SELECT HANDLER
  // ----------------------------------------------------------

  const handleSelect = (currentValue) => {
    const selectedOption =
      options.find((option) => getValue(option.value) === currentValue) ||
      options.find(
        (option) =>
          String(getValue(option.value)).toLowerCase() ===
          String(currentValue).toLowerCase()
      );

    const finalValue = selectedOption ? getValue(selectedOption.value) : currentValue;
    setValue(finalValue);
    setOpen(false);

    if (onChange) onChange(selectedOption || { value: finalValue, label: finalValue });
  };

  // ----------------------------------------------------------
  // SEARCH HANDLER
  // ----------------------------------------------------------

  const handleSearchChange = (search) => {
    setSearchValue(search);
    if (onSearchChange) onSearchChange(search);
  };

  const handleScroll = (e) => {
    if (onScroll) onScroll(e);
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= 40) {
      if (onReachBottom) onReachBottom();
    }
  };

  const isInitialLoading = isSearching || (isFetching && filteredOptions.length === 0);
  const isFetchingMore = isFetching && !isSearching && filteredOptions.length > 0;

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          mode="input"
          placeholder={!value}
          className={cn("w-full", className)}
          disabled={disabled}
        >
          {(() => {
            if (!value) {
              return <span className="truncate">{placeholder || "Select ..."}</span>;
            }

            const selectedOption = options.find((option) => getValue(option.value) === getValue(value));

            if (!selectedOption) {
              if (allowCustomValue && value) return <span className="truncate">{value}</span>;
              return <span className="truncate">{placeholder || "Select ..."}</span>;
            }

            if (renderCustomLabelInTrigger && selectedOption.customLabel) {
              return <div className="flex-1 overflow-hidden flex items-center pr-2">{selectedOption.customLabel}</div>;
            }

            const rawSelectedLabel = selectedOption.label;
            const displaySelectedLabel =
              React.isValidElement(rawSelectedLabel)
                ? rawSelectedLabel
                : typeof rawSelectedLabel === 'object' && rawSelectedLabel !== null
                  ? rawSelectedLabel.label || rawSelectedLabel.name || rawSelectedLabel.title || String(rawSelectedLabel.value || '')
                  : rawSelectedLabel;

            return (
              <span className="truncate" title={typeof displaySelectedLabel === 'string' ? displaySelectedLabel : undefined}>
                {displaySelectedLabel}
              </span>
            );
          })()}
          <ButtonArrow />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-(--radix-popper-anchor-width) w-auto p-0">
        <Command shouldFilter={false} className="overflow-visible">
          {enableSearch && (
            <CommandInput
              placeholder={searchPlaceholder || `Search...`}
              value={searchValue}
              onValueChange={handleSearchChange}
            />
          )}

          <CommandList
            className="max-h-52"
            onWheel={(e) => e.stopPropagation()}
            onScroll={handleScroll}
          >
            {!isInitialLoading && !isFetching && !allowCustomValue && filteredOptions.length === 0 && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}

            <CommandGroup>
              {isInitialLoading &&
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-full h-8 my-2.5" />
                ))}

              {!isInitialLoading &&
                filteredOptions.map((option) => {
                  const rawLabel = option.label;
                  const displayLabel =
                    React.isValidElement(rawLabel)
                      ? rawLabel
                      : typeof rawLabel === 'object' && rawLabel !== null
                        ? rawLabel.label || rawLabel.name || rawLabel.title || String(rawLabel.value || '')
                        : rawLabel;

                  return (
                    <CommandItem
                      key={String(getValue(option.value))}
                      value={String(getValue(option.value))}
                      onSelect={() => handleSelect(getValue(option.value))}
                      title={typeof displayLabel === 'string' ? displayLabel : undefined}
                      disabled={option.disabled}
                      className="cursor-pointer"
                    >
                      {option.customLabel ? (
                        option.customLabel
                      ) : (
                        <span className={cn('truncate', option.className)} title={typeof displayLabel === 'string' ? displayLabel : undefined}>
                          {displayLabel}
                        </span>
                      )}

                      {areOptionsNavigating && !option.noNavigate && (
                        <CustomTooltip text="View full assessment details">
                          <Link
                            to={`/vm/assessment-edit?assessmentId=${option?.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-500"
                          >
                            <ArrowUpRight />
                          </Link>
                        </CustomTooltip>
                      )}
                    </CommandItem>
                  );
                })}

              {isFetchingMore &&
                [1, 2, 3].map((i) => (
                  <Skeleton key={`more-skel-${i}`} className="w-full h-8 my-2.5" />
                ))}
            </CommandGroup>

            {allowCustomValue && searchValue && !filteredOptions.find(o => String(getValue(o.value)).toLowerCase() === searchValue.toLowerCase()) && (
              <CommandGroup>
                <CommandItem
                  value={`custom-${searchValue}`}
                  onSelect={() => {
                    setValue(searchValue);
                    setOpen(false);
                    if (onChange) onChange({ value: searchValue, label: searchValue });
                  }}
                  className="cursor-pointer text-primary"
                >
                  Use "{searchValue}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>



          {enableAddNew && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal px-1.5"
                >
                  <Plus className="size-4" /> Add new item
                </Button>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
