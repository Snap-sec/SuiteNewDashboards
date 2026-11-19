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



export default function FilterButton({ title, filters = [], onChange, icon }) {

    const [selectedFilter, setSelectedFilter] = useState("");

    const handleFilterChange = (checked, value) => {
        setSelectedFilter((prev) =>
            checked ? value.id : "",
        );

        onChange(checked, value);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline">
                {
                    icon ? icon : <Filter />
                }
                {title || "Filter"}
                {/* {filters?.length > 0 && (
                    <Badge appearance="stroke">
                        {selectedFilters?.length}
                    </Badge>
                )} */}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-3" align="start">
                <ScrollArea className="space-y-3 h-[200px]">
                    <div className="text-xs font-medium text-muted-foreground">
                    Filters
                    </div>
                    <div className="space-y-3">
                    {filters?.map((filter) => (
                        <div
                        key={filter.value}
                        className="flex items-center gap-2.5"
                        >
                        <Checkbox
                            className="cursor-pointer"
                            id={filter.value}
                            checked={selectedFilter == filter.id}
                            onCheckedChange={(checked) =>
                                handleFilterChange(checked === true, filter)
                            }
                        />

                        <Label
                            htmlFor={filter.value}
                            className="grow flex items-center justify-between font-normal gap-1.5 cursor-pointer select-none"
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