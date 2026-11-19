import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";

import { Input } from '@/components/ui/input';

export default function FilterButton({ title, defaultValue, filters = [], onChange, icon, enableSearch = false, multiple = true }) {

    const normalize = (val) => {
        if (!val) return [];
        const arr = Array.isArray(val) ? val : [val];
        return arr.filter(v => v !== undefined && v !== null && String(v).trim() !== "");
    };

    const [selectedFilters, setSelectedFilters] = useState(normalize(defaultValue));

    useEffect(() => {
        setSelectedFilters(normalize(defaultValue));
    }, [defaultValue]);

    const [search, setSearch] = useState("");

    const handleFilterChange = (checked, value) => {
        let newList = [];

        if (!checked) {
            newList = selectedFilters.filter(p => p != value.value);
        }
        else {
            if (multiple) newList = [...selectedFilters, value.value];
            else newList = [value.value];
        }

        setSelectedFilters(newList);

        onChange(checked, newList);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline">
                {
                    icon ? icon : <Filter />
                }
                {title || "Filter"}
                    <Badge appearance="stroke">
                        {selectedFilters?.filter(v => v !== undefined && v !== null && String(v).trim() !== "").length}
                    </Badge>
            </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-60 w-60 p-3" align="start">
                <ScrollArea className="space-y-3 h-[200px]">
                    <div className="text-xs mb-2 font-medium text-muted-foreground">
                       Filters
                    </div>
                    {
                        enableSearch &&
                        <div className="mb-3">
                            <Input
                                placeholder="Search Filters..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                    <div className="space-y-3">
                    {filters?.filter(v => (v.label || '')?.match?.(new RegExp(search, 'i')))?.map((filter) => (
                        <div
                        key={filter.value}
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
                            className="grow flex items-center text-[12px] justify-between font-normal gap-1.5"
                        >
                            {filter.label}
                        </Label>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}