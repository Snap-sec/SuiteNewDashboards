import React from 'react';
import { RotateCw, SlidersHorizontal, Download } from 'lucide-react';
import { SearchInput } from '@/components/custom/search';
import { Button } from '@/components/ui/button';
import { CardHeader, CardToolbar } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ASSET_TYPES = [
  { value: 'all', label: 'All Asset Types' },
  { value: 'subdomain', label: 'Subdomains' },
  { value: 'api', label: 'APIs' },
  { value: 'ip', label: 'IP Addresses' },
  { value: 'dns', label: 'DNS Records' },
  { value: 'repo', label: 'Repositories' },
  { value: 'certificate', label: 'Certificates' },
  { value: 'employee', label: 'Employees' },
  { value: 'application', label: 'Applications' },
  { value: 'workstation', label: 'Workstations' },
  { value: 'server', label: 'Servers' },
  { value: 'registry', label: 'Registries' },
  { value: 'object-storage-bucket', label: 'Object Storage' },
  { value: 'compartments', label: 'Compartments' },
  { value: 'vendor', label: 'Vendors' },
];

export function EditAssetHeader({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  onRefresh,
  isFetching = false,
  availableColumns = [],
  visibleColumnKeys = [],
  onToggleColumn,
  onExportView,
  isExporting = false,
}) {
  return (
    <CardHeader className="py-3 px-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card">
      {/* Search Asset Input placed on LEFT */}
      <SearchInput
        placeholder="Search assets by name or value..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-72"
        inputClass="h-9 text-xs pl-9 pr-9"
      />

      {/* Asset Type Filter, Column Toggle, Export View & Refresh Controls placed on RIGHT */}
      <CardToolbar className="flex flex-wrap items-center gap-3">
        <Select
          value={selectedType || 'all'}
          onValueChange={(val) => onTypeChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="h-9 w-full sm:w-[190px] text-xs">
            <SelectValue placeholder="All Asset Types" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {ASSET_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-xs">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {availableColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-9 text-xs px-3"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto z-50">
              <DropdownMenuLabel className="text-xs font-semibold">Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableColumns.map((col) => {
                const isChecked = visibleColumnKeys.includes(col.key);
                return (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={isChecked}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => onToggleColumn && onToggleColumn(col.key)}
                    className="text-xs capitalize"
                  >
                    {col.title || col.label || col.key}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onExportView}
          disabled={isExporting}
          className="gap-1.5 h-9 text-xs px-3"
          title="Export view"
        >
          <Download className={`h-3.5 w-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Exporting...' : 'Export View'}</span>
        </Button>

        {/* {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="gap-1.5 h-9 text-xs px-3"
            title="Refresh assets data"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )} */}
      </CardToolbar>
    </CardHeader>
  );
}

export default EditAssetHeader;
