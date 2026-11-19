import { Filter, RefreshCcw } from 'lucide-react';
import DrawerModal from '../custom/drawer-modal';
import FilterButton from '../custom/filter-toolbar/filter-button';
import { CustomTooltip } from '../custom/tooltip';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import Select from '../custom/select';

import { Skeleton } from '../ui/skeleton';

function TableToolbarFilters({
  filters = {},
  setFilters,
  supportedFilters = [],
  isLoadingFilters,
  inlineFilterCount = 4,
  onReset,
  showSingleSkeleton = false,
  iconOnly = false,
}) {
  const handleFilterChange = (key) => (checked, values) => {
    setFilters((prev) => {
      if (values?.length) {
        return {
          ...prev,
          [key]: values.map(encodeURIComponent).join(','),
        };
      }

      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  // For drawer single-select
  const handleDrawerFilterChange = (key, value) => {
    setFilters((prev) => {
      if (!value) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: encodeURIComponent(value) };
    });
  };

  const isDrawerSelected = (key, value) => {
    const valueStr = String(value);
    return filters[key]?.split(',').map(decodeURIComponent).includes(valueStr);
  };

  const mapOptions = (filter) => {
    const opts = filter?.filters || filter?.options || [];
    return opts.map((f) => ({
      id: String(f.value),
      label: f.label,
      value: String(f.value),
      logo: f.logo,
    }));
  };

  // Show skeleton loader while filters are fetching
  if (isLoadingFilters) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto">
        {showSingleSkeleton && (
          <div className="flex items-center gap-2 h-9 px-3 border border-muted rounded-md shrink-0">
            <Skeleton className="h-6 w-[16px] rounded-full" />
            <Skeleton className="h-4 w-[50px]" />
          </div>
        )}

        {!showSingleSkeleton &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 h-9 px-3 border border-muted rounded-md shrink-0"
            >
              <Skeleton className="h-6 w-[16px]" />
              <Skeleton className="h-3 w-[70px]" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          ))}

        {!showSingleSkeleton && (
          <div className="flex items-center gap-2 h-9 px-3 border border-muted rounded-md shrink-0">
            <Skeleton className="h-6 w-[16px] rounded-full" />
            <Skeleton className="h-4 w-[50px]" />
          </div>
        )}
      </div>
    );
  }

  // if (!supportedFilters?.length) {
  //   return (
  //     <div className="flex items-center gap-2 h-9 px-3 border border-muted rounded-md text-muted-foreground text-sm shrink-0 select-none">
  //       No filters available
  //     </div>
  //   );
  // }

  const inlineFilters = supportedFilters.slice(0, inlineFilterCount);
  const drawerFilters = supportedFilters.slice(inlineFilterCount);

  // Count how many drawer filters are active
  const drawerActiveCount = drawerFilters.filter(
    (f) => filters[f.key] !== undefined,
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Inline filter pills (first 4) */}
      {inlineFilters.map((filter) => {
        const name = filter.name || filter.label || '';
        const optionsList = filter.filters || filter.options || [];
        return (
          <CustomTooltip
            key={filter.key}
            text={filter.description || `Filter by ${name}`}
          >
            <FilterButton
              title={name}
              filters={mapOptions(filter)}
              defaultValue={
                Array.isArray(filters[filter.key])
                  ? filters[filter.key].map(String).map(decodeURIComponent)
                  : typeof filters[filter.key] === 'string'
                    ? filters[filter.key].split(',').map(decodeURIComponent)
                    : []
              }
              enableSearch={optionsList.length > 6}
              searchPlaceholder={
                name === 'Asset Type'
                  ? 'Search by Asset Type'
                  : name === 'Adapters'
                    ? 'Search by Adapters'
                    : 'Search Filters...'
              }
              onChange={handleFilterChange(filter.key)}
            />
          </CustomTooltip>
        );
      })}

      {/* Drawer button for remaining filters */}
      {drawerFilters.length > 0 && (
        <CustomTooltip text=" Filters" isTooltipTextHidden={!iconOnly}>
          <div>
            <DrawerModal
              trigger={
                <Button
                  variant="outline"
                  appearance="light"
                  className={`
                    gap-2 relative
                    ${iconOnly ? 'w-9 h-9 p-0 justify-center' : ''}
                    ${drawerActiveCount > 0
                      ? 'light:bg-blue-50 dark:border-primary text-primary border-blue-300'
                      : ''
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  {!iconOnly && 'More Filters'}
                  {drawerActiveCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {drawerActiveCount}
                    </span>
                  )}
                </Button>
              }
              title="More Filters"
              direction="end"
              width="[400px]"
              footer={
                <div className="flex gap-4 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-lg font-bold text-foreground hover:text-foreground transition-colors"
                    onClick={() =>
                      setFilters((prev) => {
                        const next = { ...prev };
                        drawerFilters.forEach((f) => delete next[f.key]);
                        return next;
                      })
                    }
                  >
                    Reset
                  </Button>
                </div>
              }
            >
              <ScrollArea className="h-full kt-scrollable-y-auto">
                <div className="p-4 space-y-4 kt-scrollable-y-auto">
                  {drawerFilters.map((filter) => {
                    const name = filter.name || filter.label || '';
                    const optionsList = filter.filters || filter.options || [];
                    const selectOptions = optionsList.map((opt) => ({
                      value: String(opt.value),
                      label: String(opt.label ?? opt.value),
                    }));
                    const selectedOpt = optionsList.find((opt) =>
                      isDrawerSelected(filter.key, opt.value),
                    );
                    const selectedValue =
                      selectedOpt !== undefined && selectedOpt !== null
                        ? String(selectedOpt.value)
                        : '';

                    return (
                      <div
                        key={filter.key}
                        className="space-y-2 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-mono">
                            {name}
                          </h3>
                        </div>

                        <Select
                          value={selectedValue}
                          options={selectOptions}
                          placeholder={`Select ${name}`}
                          searchPlaceholder={`Search ${name}...`}
                          emptyMessage="No options available"
                          enableSearch={optionsList.length > 5}
                          onChange={(opt) => {
                            const val =
                              typeof opt === 'object' && opt !== null
                                ? opt.value
                                : opt;
                            handleDrawerFilterChange(
                              filter.key,
                              val === selectedValue ? '' : val,
                            );
                          }}
                        />
                      </div>
                    );
                  })}

                  {drawerFilters.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-sm text-muted-foreground">
                        No additional filters available.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DrawerModal>
          </div>
        </CustomTooltip>
      )}

      {/* Reset all button */}
      {supportedFilters?.length > 0 && (
        <CustomTooltip text="Reset Filters" isTooltipTextHidden={!iconOnly}>
          <Button
            variant="outline"
            onClick={() => {
              setFilters((prev) => {
                const next = { ...prev };
                supportedFilters.forEach((f) => {
                  delete next[f.key];
                });
                return next;
              });
              onReset?.();
            }}
            className={`gap-2 ${iconOnly ? 'w-9 h-9 p-0 justify-center' : ''}`}
          >
            <RefreshCcw size={16} />
            {!iconOnly && 'Reset'}
          </Button>
        </CustomTooltip>
      )}
    </div>
  );
}

export default TableToolbarFilters;
