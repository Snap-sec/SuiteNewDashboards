import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Button, ButtonArrow } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetAimAssetsQuery } from '../../../../../../../services/asset-inventory/assets/assetsApi';

// ─── Config ──────────────────────────────────────────────────────────────────
export const ASSET_TYPE_SECTIONS = [
    { type: 'subdomain', label: 'Subdomain', description: 'Browser-facing assets served over HTTP/S' },
    { type: 'api', label: 'API', description: 'Endpoints this unit exposes' },
    { type: 'repository', label: 'Repository', description: 'Codebase that builds and deploys this app' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function AssetTypeSection({ section, selectedAssets, onToggle, onDeselect }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { type, label, description } = section;

    // Reset search when popover closes
    useEffect(() => {
        if (!open) {
            setSearch('');
            setDebouncedSearch('');
        }
    }, [open]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Call backend query specific to this type and debounced search term
    const { data: assetsData, isLoading, isFetching } = useGetAimAssetsQuery(
        { search: debouncedSearch, page: 1, limit: 10, type, unified_view: true },
        { skip: !open },
    );

    const typeAssets = assetsData?.assets || [];

    const selectedOfType = useMemo(
        () => selectedAssets.filter((a) => a.type === type),
        [selectedAssets, type],
    );

    return (
        <div className="space-y-2.5">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{label}</span>
                {description && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                        — {description}
                    </span>
                )}
                {selectedOfType.length > 0 && (
                    <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
                        {selectedOfType.length} selected
                    </span>
                )}
            </div>

            {/* Selected chips */}
            {selectedOfType.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedOfType.map((asset) => (
                        <span
                            key={asset.id}
                            className="inline-flex items-center gap-1 bg-accent text-accent-foreground border border-border rounded-md px-2 py-0.5 text-[11px] font-medium"
                        >
                            <span className="max-w-[160px] truncate">{asset.value}</span>
                            <button
                                type="button"
                                onClick={() => onDeselect(asset.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Multi-select combobox */}
            {isLoading ? (
                <Skeleton className="h-9 w-full rounded" />
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            mode="input"
                            placeholder={true}
                            className="w-full"
                        >
                            <span className="truncate text-muted-foreground font-normal">
                                Add {label.toLowerCase()}…
                            </span>
                            <ButtonArrow />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                        <Command>
                            <CommandInput
                                placeholder={`Search ${label.toLowerCase()}…`}
                                value={search}
                                onValueChange={setSearch}
                            />
                            <CommandList className="max-h-52">
                                <CommandEmpty>
                                    {isFetching ? 'Loading…' : `No ${label.toLowerCase()} found.`}
                                </CommandEmpty>
                                <CommandGroup>
                                    {typeAssets.map((asset) => {
                                        const isSelected = selectedAssets.some((a) => a.id === asset._id);
                                        return (
                                            <CommandItem
                                                key={asset._id}
                                                value={asset.value}
                                                onSelect={() => onToggle(asset)}
                                                className="gap-2"
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    className="pointer-events-none rounded-md size-5"
                                                />
                                                <span className="truncate text-xs">{asset.value}</span>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}

            <hr className="border-border" />
        </div>
    );
}
