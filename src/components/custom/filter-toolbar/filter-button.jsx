import { useEffect, useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FilterButton({
  title,
  defaultValue,
  filters = [],
  onChange,
  icon,
  enableSearch = false,
  multiple = true,
  searchPlaceholder = 'Search Filters...',
}) {
  const [selectedFilters, setSelectedFilters] = useState(
    defaultValue
      ? Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue?.split(',')
      : [],
  );

  useEffect(() => {
    setSelectedFilters(
      defaultValue
        ? Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue?.split(',')
        : [],
    );
  }, [defaultValue]);

  const [search, setSearch] = useState('');

  const handleFilterChange = (checked, value) => {
    let newList = [];

    if (!checked) {
      newList = selectedFilters.filter(
        (p) => String(p).toLowerCase() !== String(value.value).toLowerCase(),
      );
    } else {
      if (multiple) newList = [...selectedFilters, value.value];
      else newList = [value.value];
    }

    setSelectedFilters(newList);

    onChange(checked, newList);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          appearance="light"
          className={`
                ${
                  selectedFilters.length > 0
                    ? 'light:bg-blue-50 dark:border-primary text-primary border-blue-300'
                    : ''
                }`}
        >
          {icon ? (
            icon
          ) : (
            <Filter className={selectedFilters.length > 0 && 'text-primary'} />
          )}
          {title || 'Filter'}
          {/* <Badge appearance="stroke"> */}
          <Badge
            variant={selectedFilters.length > 0 ? 'primary' : 'secondary'}
            shape="circle"
            size="xs"
          >
            {selectedFilters?.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-75 w-75 p-3" align="start">
        <div className="text-xs mb-2 font-medium text-muted-foreground flex items-center justify-between">
          <p>Filters</p>
          <PopoverClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
              onClick={() => {
                // setSelectedFilters([]);
                // setSearch('');
                // onChange(false, []);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>
        </div>
        {enableSearch && (
          <div className="mb-3">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        <ScrollArea className="space-y-3 h-[200px]">
          <div className="space-y-3">
            {(() => {
              const filteredList = filters?.filter((v) => {
                if (!search) return true;
                const searchTerms = search
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (searchTerms.length === 0) return true;
                return searchTerms.some((term) =>
                  String(v.label || '')
                    .toLowerCase()
                    .includes(term.toLowerCase()),
                );
              });

              if (!filteredList?.length) {
                return (
                  <div className="text-sm text-muted-foreground text-center py-4 select-none">
                    No options available
                  </div>
                );
              }

              return filteredList.map((filter) => (
                <div key={filter.value} className="flex items-center gap-2.5">
                  <Checkbox
                    className="cursor-pointer"
                    id={filter.value}
                    checked={selectedFilters.some(
                      (s) =>
                        String(s).toLowerCase() ===
                        String(filter.value).toLowerCase(),
                    )}
                    onCheckedChange={(checked) =>
                      handleFilterChange(checked === true, filter)
                    }
                  />

                  <Label
                    htmlFor={filter.value}
                    className="grow flex flex-col items-start text-[12px] justify-center font-normal cursor-pointer select-none"
                  >
                    {filter?.label !== undefined && filter?.label !== null
                      ? String(filter.label).split('\n').map((line, idx) => (
                        <span
                          key={idx}
                          className={idx > 0 ? "text-muted-foreground text-[10px]" : "font-medium"}
                        >
                          {idx === 0
                            ? line.charAt(0).toUpperCase() + line.slice(1)
                            : line}
                        </span>
                      ))
                      : ''}
                  </Label>
                </div>
              ));
            })()}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
