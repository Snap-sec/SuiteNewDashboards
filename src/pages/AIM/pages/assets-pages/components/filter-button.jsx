import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FilterButton({
  title,
  defaultValue,
  filters = [],
  onChange,
  icon,
  enableSearch = false,
}) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredFilters, setFilteredFilters] = useState(filters);

  // Handle initial value and updates
  useEffect(() => {
    // Explicitly handle reset case
    if (!defaultValue || (Array.isArray(defaultValue) && defaultValue.length === 0)) {
      setSelectedFilters([]);
      return;
    }
    
    // Handle normal case
    const newValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    setSelectedFilters(newValue);
  }, [defaultValue]);

  useEffect(() => {
    // Reset selected filters when defaultValue is undefined/null (during filter reset)
    if (!defaultValue) {
      setSelectedFilters([]);
      return;
    }
    
    // Otherwise set the filters based on defaultValue
    setSelectedFilters(
      Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    );
  }, [defaultValue]);

  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredFilters(filters);
  }, [filters]);

  useEffect(() => {
    setFilteredFilters(
      filters?.filter(
        (v) =>
          !search ||
          (v.label && v.label.toLowerCase()?.startsWith(search?.toLowerCase())),
      ),
    );
  }, [search]);

  const handleFilterChange = (checked, value) => {
    let newList = [];

    if (!checked) {
      newList = selectedFilters.filter((p) => p != value.value);
    } else {
      newList = [...selectedFilters, value.value];
    }

    setSelectedFilters(newList);

    onChange(checked, newList);
  };

  console.log('searhing for : ', search);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {icon ? icon : <Filter />}
          {title || 'Filter'}
          {filters?.length > 0 && (
            <Badge appearance="stroke">{selectedFilters?.length}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-60 w-60 p-3" align="start">
        <ScrollArea className="space-y-3 h-[200px]">
          <div className="text-xs mb-2 font-medium text-muted-foreground">
            Filters
          </div>
          {enableSearch && (
            <div className="mb-3">
              <Input
                placeholder="Search Filters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-3">
            {filteredFilters.map((filter) => (
              <div
                // key={filter.value}
                className="flex items-center gap-2.5"
              >
                <Checkbox
                  id={filter.value}
                  checked={selectedFilters.includes(filter.value)}
                  onCheckedChange={(checked) =>
                    handleFilterChange(checked === true, filter)
                  }
                />

                <Label
                  htmlFor={filter.value}
                  className="grow flex items-center text-[14px] justify-between font-normal gap-1.5"
                >
                  {filter.label}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
