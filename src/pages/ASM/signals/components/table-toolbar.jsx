import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '@/pages/ASM/exposures/store';
import FilterButton from "@/components/custom/filter-toolbar/filter-button";
import useHandleFilterChange from "@/hooks/use-handle-filter-change";

function TableToolbar({ supportedFilters }) {
  const setFilters = useStore((state) => state.setFilters);
  const filters = useStore((state) => state.filters);

  const assetTypeFilters = supportedFilters?.asset_types?.map((asst) => ({
    id: asst,
    label: asst,
    value: asst,
  })) || [];

  const assetSeverityFilters = supportedFilters?.severity?.map((asst) => ({
    id: asst,
    label: asst,
    value: asst,
  })) || [];

  const assetStatesFilters = supportedFilters?.states?.map((asst) => ({
    id: asst,
    label: asst,
    value: asst,
  })) || [];

  const { handleFilterChange } = useHandleFilterChange(setFilters);

  return (
    <div className="flex gap-2 items-center">
      {assetTypeFilters.length > 0 && (
        <CustomTooltip text="Filter by Asset Type">
          <FilterButton
            title="Assets"
            filters={assetTypeFilters}
            defaultValue={filters['associatedAsset.type']}
            onChange={handleFilterChange('associatedAsset.type')}
            multiple={true}
          />
        </CustomTooltip>
      )}

      {assetSeverityFilters.length > 0 && (
        <CustomTooltip text="Filter by Severity">
          <FilterButton
            title="Severity"
            filters={assetSeverityFilters}
            defaultValue={filters?.severity}
            onChange={handleFilterChange('severity')}
          />
        </CustomTooltip>
      )}

      {assetStatesFilters.length > 0 && (
        <CustomTooltip text="Filter by State">
          <FilterButton
            title="State"
            filters={assetStatesFilters}
            defaultValue={filters?.state}
            onChange={handleFilterChange('state')}
          />
        </CustomTooltip>
      )}

      <CustomTooltip text="Reset all filters">
        <Button variant="outline" size="sm" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </CustomTooltip>
    </div>
  );
}

export default TableToolbar;
