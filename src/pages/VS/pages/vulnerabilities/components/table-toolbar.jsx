import { RefreshCcw } from 'lucide-react';
import useHandleFilterChange from '@/hooks/use-handle-filter-change';
import { Button } from '@/components/ui/button';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import useStore from '../store';
import { CustomTooltip } from '../../../../../components/custom/tooltip';


function TableToolbar({ supportedFilters }) {
  const setFilters = useStore((state) => state.setFilters);
  const filters = useStore((state) => state.filters);

  const severityFilters =
    supportedFilters?.severity?.map((severity) => ({
      id: severity,
      label: severity,
      value: severity,
    })) || [];
  const assetFilters =
    supportedFilters?.assets?.map((severity) => ({
      id: severity,
      label: severity,
      value: severity,
    })) || [];
  const stateFilters =
    supportedFilters?.states?.map((severity) => ({
      id: severity,
      label: severity,
      value: severity,
    })) || [];
  const scannerFilters =
    supportedFilters?.scanners?.map((scanner) => ({
      id: scanner,
      label: scanner,
      value: scanner,
    })) || [];
  const suppressedFilters =
    supportedFilters?.suppressed?.map((v) => ({ id: v, label: v, value: v })) ||
    [];

  const { handleFilterChange } = useHandleFilterChange(setFilters);

  return (
    <div className="w-full flex justify-between">
      <div className="flex gap-2 items-center">

        <FilterButton
          title="Severity"
          defaultValue={filters.severity}
          filters={severityFilters}
          onChange={handleFilterChange('severity')}
          tooltipText="Filter by Severity"
        />


        <FilterButton
          title="Scanner"
          defaultValue={filters.scanner}
          filters={scannerFilters}
          onChange={handleFilterChange('scanner')}
          tooltipText="Filter by Scanner"
        />

        <FilterButton
          title="State"
          defaultValue={filters.state}
          filters={stateFilters}
          onChange={handleFilterChange('state')}
          tooltipText="Filter by State"
        />

        <FilterButton
          title="Assets"
          defaultValue={filters.asset}
          filters={assetFilters}
          onChange={handleFilterChange('asset')}
          tooltipText="Filter by Assets"
          enableSearch={true}
        />

        <FilterButton
          title="Suppressed"
          defaultValue={filters.suppressed}
          filters={suppressedFilters}
          onChange={handleFilterChange('suppressed')}
          multiple={false}
          tooltipText="Filter by Suppressed"
        />

        <CustomTooltip text={"Clear all Filters"}>
          <Button variant="outline" onClick={() => setFilters(() => ({}))}>
            <RefreshCcw />
            Reset
          </Button>
        </CustomTooltip>
      </div>

    </div>
  );
}

export default TableToolbar;
