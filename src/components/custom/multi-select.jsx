import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
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
import { Spinner } from '@/components/ui/spinners';

const MultiSelect = ({
  onChange,
  options = [],
  values: controlledValues,
  enableSearch = true,
  searchPlaceholder = 'Search...',
  noSearchMatch = 'No results found.',
  onSearchChange,
  maxSelectable,
  maxShownItems = 3,
  className = '',
  placeholder = 'Select items...',
  showSelectedPreview = false,
  isLoading = false,
  isFetchingMore = false,
  onReachBottom,
  onScroll,
  actionOption,
}) => {
  // Internal state management
  const [internalValues, setInternalValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine if we're using controlled or uncontrolled mode
  const isControlled = controlledValues;

  const [selectedValues, setSelectedValues] = useState(
    isControlled ? controlledValues : internalValues,
  );

  useEffect(() => {
    if (JSON.stringify(controlledValues) !== JSON.stringify(selectedValues)) {
      setSelectedValues(controlledValues);
    }
  }, [controlledValues, selectedValues]);

  // Normalize values to always work with option objects
  const normalizedSelectedValues = useMemo(() => {
    if (!selectedValues || selectedValues.length === 0) return [];

    const nonActionOptions = options.filter((opt) => !opt.isAction);

    // Check if values are strings (list of ids)
    if (typeof selectedValues[0] === 'string') {
      return selectedValues.map((val) => {
        const found = nonActionOptions.find((opt) => (opt.id || opt.value) === val);
        return found || { id: val, value: val, label: val };
      });
    }

    // Otherwise, they're already option objects
    return selectedValues.filter((v) => !v?.isAction);
  }, [selectedValues, options]);

  // Handle value updates
  const updateValues = useCallback(
    (newValues) => {
      if (!isControlled) {
        setInternalValues(newValues);
      }

      if (onChange) {
        onChange(newValues);
      }
    },
    [isControlled, onChange],
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);

      if (onSearchChange) {
        onSearchChange(value);
      }
    },
    [onSearchChange],
  );

  // Toggle option selection
  const toggleOption = useCallback(
    (option) => {
      const isSelected = normalizedSelectedValues.some(
        (v) => (v.id || v.value) === (option.id || option.value),
      );

      let newValues;
      if (isSelected) {
        // Remove the option
        newValues = normalizedSelectedValues.filter((v) => (v.id || v.value) !== (option.id || option.value));
      } else {
        // Check max selectable limit
        if (maxSelectable && normalizedSelectedValues.length >= maxSelectable) {
          return;
        }
        // Add the option
        newValues = [...normalizedSelectedValues, option];
      }

      updateValues(newValues);
    },
    [normalizedSelectedValues, maxSelectable, updateValues],
  );

  // Remove a specific selected item
  const removeItem = useCallback(
    (optionId, e) => {
      e.stopPropagation();
      const newValues = normalizedSelectedValues.filter(
        (v) => (v.id || v.value) !== optionId,
      );
      updateValues(newValues);
    },
    [normalizedSelectedValues, updateValues],
  );

  // Clear all selections
  const clearAll = useCallback(
    (e) => {
      e.stopPropagation();
      updateValues([]);
    },
    [updateValues],
  );

  const handleScroll = useCallback(
    (e) => {
      if (onScroll) onScroll(e);
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight <= 40) {
        if (onReachBottom) onReachBottom();
      }
    },
    [onReachBottom, onScroll],
  );

  return (
    <div className={cn('w-full', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full h-fit py-2 justify-between"
          >
            <span className="truncate text-left flex-1">
              {/* {getDisplayText()} */}
              {normalizedSelectedValues.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-1 flex-row">
                    {normalizedSelectedValues
                      ?.slice(0, maxShownItems)
                      ?.map((item) => (
                        <Badge
                          key={item.id || item.value}
                          variant="primary" appearance="light"
                          className="gap-1"
                        >
                          {item.label}
                          <X
                            className="h-3 w-3 cursor-pointer hover:opacity-70"
                            onClick={(e) => removeItem(item.id || item.value, e)}
                          />
                        </Badge>
                      ))}

                    {/* Show +N more button if there are hidden items */}
                    {normalizedSelectedValues?.length > maxShownItems && (
                      <span
                        className="text-xs text-gray-400 hover:underline hover:cursor-pointer ml-2 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Show all items');
                        }}
                      >
                        +{normalizedSelectedValues.length - maxShownItems} more
                      </span>
                    )}
                  </div>
                  {maxSelectable && (
                    <div className="absolute py-4.5 -ml-2 text-xs text-muted-foreground">
                      {normalizedSelectedValues.length} / {maxSelectable}{' '}
                      selected
                    </div>
                  )}
                </div>
              )}
              {normalizedSelectedValues.length == 0 && <span className=" font-normal text-muted-foreground">{placeholder}</span>}
            </span>
            <div className="flex items-center gap-2 ml-2">
              {normalizedSelectedValues.length > 0 && (
                <X
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                  onClick={clearAll}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
          <Command shouldFilter={!onSearchChange}>
            {enableSearch && (
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onValueChange={handleSearchChange}
              />
            )}
            <CommandList
              className="max-h-56"
              onWheel={(e) => e.stopPropagation()}
              onScroll={handleScroll}
            >
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Spinner className="h-4 w-4 animate-spin" />
                </div>
              )}
              {!isLoading && <CommandEmpty>{noSearchMatch}</CommandEmpty>}
              <CommandGroup>
                {!isLoading && actionOption && (
                  <CommandItem
                    key="__action_option__"
                    value={typeof actionOption.label === 'string' ? actionOption.label : '+ create'}
                    forceMount={actionOption.forceMount !== undefined ? actionOption.forceMount : true}
                    onSelect={() => {
                      setIsOpen(false);
                      actionOption.onSelect?.();
                      actionOption.onClick?.();
                    }}
                    className={cn(
                      'w-full cursor-pointer text-primary font-medium hover:text-primary',
                      actionOption.className,
                    )}
                  >
                    <span className={cn('truncate', actionOption.className || 'text-primary font-medium')}>
                      {actionOption.label}
                    </span>
                  </CommandItem>
                )}
                {!isLoading &&
                  options.map((option) => {
                    if (option.isAction) {
                      return (
                        <CommandItem
                          key={option.id || option.value}
                          value={option.label}
                          forceMount={option.forceMount !== undefined ? option.forceMount : true}
                          onSelect={() => {
                            setIsOpen(false);
                            option.onSelect?.();
                          }}
                          className={cn(
                            'w-full cursor-pointer text-primary font-medium hover:text-primary',
                            option.className,
                          )}
                        >
                          <span className={cn('truncate', option.className || 'text-primary font-medium')}>
                            {option.label}
                          </span>
                        </CommandItem>
                      );
                    }

                    const isSelected = normalizedSelectedValues.some(
                      (v) => (v.id || v.value) === (option.id || option.value),
                    );
                    const isDisabled =
                      !isSelected &&
                      maxSelectable &&
                      normalizedSelectedValues.length >= maxSelectable;

                    return (
                      <CommandItem
                        key={option.id || option.value}
                        value={typeof option.label === 'string' ? option.label : String(option.value || option.id)}
                        onSelect={() => !isDisabled && toggleOption(option)}
                        disabled={isDisabled}
                        className={cn(
                          'w-full',
                          'cursor-pointer',
                          isDisabled && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {option.customLabel ? (
                          option.customLabel
                        ) : (
                          <span className="truncate">{option.label}</span>
                        )}
                      </CommandItem>
                    );
                  })}
                {isFetchingMore && (
                  <div className="flex items-center justify-center py-2 text-xs text-muted-foreground gap-1.5">
                    <Spinner className="h-3.5 w-3.5 animate-spin" />
                    <span>Loading more...</span>
                  </div>
                )}
              </CommandGroup>
            </CommandList>

            {/* Selected Items Preview */}
            {showSelectedPreview && normalizedSelectedValues.length > 0 && (
              <div className="border-t p-3">
                <div className="flex flex-wrap gap-1">
                  {normalizedSelectedValues.map((item) => (
                    <Badge key={item.id || item.value} variant="secondary" className="gap-1">
                      {item.label}
                      <X
                        className="h-3 w-3 cursor-pointer hover:opacity-70"
                        onClick={(e) => removeItem(item.id || item.value, e)}
                      />
                    </Badge>
                  ))}
                </div>
                {maxSelectable && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {normalizedSelectedValues.length} / {maxSelectable} selected
                  </div>
                )}
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Demo Component
// const Demo = () => {
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [searchValue, setSearchValue] = useState("");

//   const sampleOptions = [
//     { id: "1", label: "React", value: "react" },
//     { id: "2", label: "Vue", value: "vue" },
//     { id: "3", label: "Angular", value: "angular" },
//     { id: "4", label: "Svelte", value: "svelte" },
//     { id: "5", label: "Next.js", value: "nextjs" },
//     { id: "6", label: "Nuxt.js", value: "nuxtjs" },
//     { id: "7", label: "Gatsby", value: "gatsby" },
//     { id: "8", label: "Remix", value: "remix" },
//     { id: "9", label: "Astro", value: "astro" },
//     { id: "10", label: "SolidJS", value: "solidjs" },
//   ];

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="mx-auto max-w-4xl space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">MultiSelect Component</h1>
//           <p className="text-muted-foreground">Built with ReUI components (Popover, Command, Button, Badge)</p>
//         </div>

//         {/* Example 1: Controlled with max selections */}
//         <div className="rounded-lg border bg-card p-6 shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">Controlled Mode (Max 3 selections)</h2>
//           <MultiSelect
//             options={sampleOptions}
//             values={selectedValues}
//             onChange={setSelectedValues}
//             enableSearch={true}
//             searchPlaceholder="Search frameworks..."
//             maxSelectable={3}
//             maxShownItems={2}
//             onSearchChange={setSearchValue}
//           />
//           <div className="mt-4 p-4 bg-muted rounded text-sm">
//             <p className="font-semibold mb-2">Selected Values:</p>
//             <pre className="text-xs overflow-auto">{JSON.stringify(selectedValues, null, 2)}</pre>
//             {searchValue && <p className="mt-2 text-muted-foreground">Search: "{searchValue}"</p>}
//           </div>
//         </div>

//         {/* Example 2: Uncontrolled */}
//         <div className="rounded-lg border bg-card p-6 shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">Uncontrolled Mode (No limits)</h2>
//           <MultiSelect
//             options={sampleOptions}
//             onChange={(values) => console.log('Selection changed:', values)}
//             enableSearch={true}
//             placeholder="Select your favorite frameworks..."
//           />
//         </div>

//         {/* Example 3: Using string IDs as values */}
//         <div className="rounded-lg border bg-card p-6 shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">With String IDs</h2>
//           <MultiSelect
//             options={sampleOptions}
//             values={["1", "3", "5"]}
//             onChange={(values) => console.log('Values:', values.map(v => v.id))}
//             enableSearch={false}
//             maxShownItems={5}
//           />
//         </div>

//         {/* Example 4: Search disabled */}
//         <div className="rounded-lg border bg-card p-6 shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">Search Disabled</h2>
//           <MultiSelect
//             options={sampleOptions}
//             enableSearch={false}
//             onChange={(values) => console.log('Selected:', values)}
//             maxSelectable={5}
//           />
//         </div>

//         {/* Example 5: Many items with preview */}
//         <div className="rounded-lg border bg-card p-6 shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">Preview with maxShownItems=1</h2>
//           <MultiSelect
//             options={sampleOptions}
//             values={["1", "2", "3", "4"]}
//             onChange={(values) => console.log('Selected:', values)}
//             maxShownItems={1}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

export default MultiSelect;
