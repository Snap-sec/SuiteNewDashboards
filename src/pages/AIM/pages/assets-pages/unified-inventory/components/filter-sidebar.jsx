import { useMemo } from 'react';
import {
  Briefcase,
  Filter,
  Layers,
  RotateCcw,
  Search,
  ShieldAlert,
  Tag,
  User,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MultiSelect from '@/components/custom/multi-select';
import {
  ASSET_TYPES,
  CONNECTIVITY_OPTIONS,
  ENVIRONMENTS,
  LIFECYCLE_STATES,
  SEVERITY_OPTIONS,
} from '../constants';

export function FilterSidebar({
  selectedTypes = [],
  onSelectTypes,
  selectedStatuses = [],
  onSelectStatuses,
  selectedEnvironment = 'all',
  onSelectEnvironment,
  selectedConnectivity = 'all',
  onSelectConnectivity,
  selectedSeverity = 'all',
  onSelectSeverity,
  searchQuery = '',
  onSearchChange,
  ownerQuery = '',
  onOwnerQueryChange,
  typeCounts = {},
  onResetAll,
  activeFiltersCount = 0,
}) {
  // Asset types dropdown options (excluding 'all', representing individual types)
  const assetTypeOptions = useMemo(() => {
    return ASSET_TYPES.filter((t) => t.id !== 'all').map((t) => {
      const count = typeCounts[t.id] ?? t.defaultCount;
      return {
        id: t.id,
        value: t.id,
        label: `${t.label} (${count.toLocaleString()})`,
      };
    });
  }, [typeCounts]);

  // Lifecycle status dropdown options
  const statusOptions = useMemo(() => {
    return LIFECYCLE_STATES.map((st) => ({
      id: st.id,
      value: st.id,
      label: st.label,
    }));
  }, []);

  return (
    <aside
      className="w-72 xl:w-80 shrink-0 border-r border-border bg-card/60 flex flex-col h-[calc(100vh-64px)] sticky top-16"
      aria-label="Asset inventory filters"
    >
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between gap-2 shrink-0 bg-card">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground tracking-tight">
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" className="h-5 px-1.5 text-[10px] font-mono">
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetAll}
            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </Button>
        )}
      </div>

      {/* Clean, continuous stack of filters — no artificial sections or dividers */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* 1. Search Assets */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            Search Assets
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              size="sm"
              type="text"
              placeholder="Asset name, IP, domain, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-8 pr-7 text-xs bg-background h-8.5"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Accountable Owner */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            Accountable Owner
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              size="sm"
              type="text"
              placeholder="Filter by owner or team..."
              value={ownerQuery}
              onChange={(e) => onOwnerQueryChange?.(e.target.value)}
              className="pl-8 pr-7 text-xs bg-background h-8.5"
            />
            {ownerQuery && (
              <button
                type="button"
                onClick={() => onOwnerQueryChange?.('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Asset Types Multiselect */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
              Asset Types
            </label>
            {selectedTypes.length > 0 && (
              <button
                type="button"
                onClick={() => onSelectTypes?.([])}
                className="text-primary hover:underline text-[10px]"
              >
                Clear ({selectedTypes.length})
              </button>
            )}
          </div>

          <MultiSelect
            options={assetTypeOptions}
            values={selectedTypes}
            onChange={(items) => {
              const ids = items.map((i) => (typeof i === 'string' ? i : (i.value || i.id)));
              onSelectTypes?.(ids);
            }}
            placeholder="All Asset Types"
            searchPlaceholder="Search asset types..."
            noSearchMatch="No asset types match."
            maxShownItems={2}
            className="w-full bg-background text-xs min-h-[34px]"
          />
        </div>

        {/* 4. Lifecycle Status Multiselect */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              Lifecycle Status
            </label>
            {selectedStatuses.length > 0 && (
              <button
                type="button"
                onClick={() => onSelectStatuses?.([])}
                className="text-primary hover:underline text-[10px]"
              >
                Clear ({selectedStatuses.length})
              </button>
            )}
          </div>

          <MultiSelect
            options={statusOptions}
            values={selectedStatuses}
            onChange={(items) => {
              const ids = items.map((i) => (typeof i === 'string' ? i : (i.value || i.id)));
              onSelectStatuses?.(ids);
            }}
            placeholder="All Lifecycle States"
            searchPlaceholder="Search statuses..."
            noSearchMatch="No statuses match."
            maxShownItems={2}
            className="w-full bg-background text-xs min-h-[34px]"
          />
        </div>

        {/* 5. Environment Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
            Environment
          </label>
          <Select
            value={selectedEnvironment}
            onValueChange={onSelectEnvironment}
          >
            <SelectTrigger size="sm" className="w-full bg-background text-xs">
              <SelectValue placeholder="All Environments" />
            </SelectTrigger>
            <SelectContent>
              {ENVIRONMENTS.map((env) => (
                <SelectItem key={env.id} value={env.id} className="text-xs">
                  {env.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 6. Reachability Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            Reachability
          </label>
          <Select
            value={selectedConnectivity}
            onValueChange={onSelectConnectivity}
          >
            <SelectTrigger size="sm" className="w-full bg-background text-xs">
              <SelectValue placeholder="All Reachability" />
            </SelectTrigger>
            <SelectContent>
              {CONNECTIVITY_OPTIONS.map((conn) => (
                <SelectItem key={conn.id} value={conn.id} className="text-xs">
                  {conn.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 7. Vulnerabilities Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground" />
            Vulnerabilities
          </label>
          <Select
            value={selectedSeverity}
            onValueChange={onSelectSeverity}
          >
            <SelectTrigger size="sm" className="w-full bg-background text-xs">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_OPTIONS.map((sev) => (
                <SelectItem key={sev.id} value={sev.id} className="text-xs">
                  {sev.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
