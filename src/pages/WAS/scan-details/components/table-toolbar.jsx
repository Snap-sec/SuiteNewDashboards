import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../store';
import FilterButton from './filter-button';

function TableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  // structuring filters data
  const hasVulnsFilter =
    supportedFilters?.hasVulns?.map((fltr) => ({
      id: fltr,
      label: fltr,
      value: fltr,
    })) || [];

  const methodsFilter =
    supportedFilters?.method?.map((val) => ({
      id: val,
      label: val,
      value: val,
    })) || [];

  const statusFilters =
    supportedFilters?.workspace?.map((val) => ({
      id: val,
      label: val,
      value: val,
    })) || [];


  const severityFilters =
    supportedFilters?.severity?.map((val) => ({
      id: val,
      label: val,
      value: val,
    })) || [];

  const handleFilterChange = (key) => (checked, value) => {
    setFilters((prev) => {
      if (checked || value?.length > 0) {
        return { ...prev, [key]: value?.join(',') };
      } else {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <CustomTooltip text="Filter results by scans">
        <FilterButton
          title="hasVulns"
          defaultValue={filters.hasVulns?.split(',')}
          filters={hasVulnsFilter}
          onChange={handleFilterChange('hasVulns')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by No of Vulnerabilities.">
        <FilterButton
          enableSearch={true}
          title="Method"
          defaultValue={filters.method?.split(',')}
          filters={methodsFilter}
          onChange={handleFilterChange('method')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by Severity.">
        <FilterButton
          title="Severity"
          defaultValue={filters.severity?.split(',')}
          filters={severityFilters}
          onChange={handleFilterChange('severity')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by Status">
        <FilterButton
          title="Workspace"
          defaultValue={filters.workspace?.split(',')}
          filters={statusFilters}
          onChange={handleFilterChange('workspace')}
        />
      </CustomTooltip>

      <Button variant="outline" onClick={() => setFilters(() => ({}))}>
        <RefreshCcw />
        Reset
      </Button>
    </div>
  );
}

export default TableToolbar;
