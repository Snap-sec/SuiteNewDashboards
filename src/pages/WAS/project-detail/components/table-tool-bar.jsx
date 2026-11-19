import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../store';
// import FilterButton from './filter-button';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';

function EndpointsTableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const severityFilters =
    supportedFilters?.severity?.map((severity) => ({
      id: severity,
      label: severity,
      value: severity,
    })) || [];

  const methodFilters =
    supportedFilters?.method?.map((filter) => ({
      id: filter,
      label: filter,
      value: filter,
    })) || [];

  const hasVulnsFilters =
    supportedFilters?.has_vulns?.map((owner) => ({
      id: owner,
      label: owner,
      value: owner,
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

      <CustomTooltip text="Filter results by severity level">
        <FilterButton
          title="Severity"
          defaultValue={filters.severity?.split(',')}
          filters={severityFilters}
          onChange={handleFilterChange('severity')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by Method">
        <FilterButton
          enableSearch={false}
          title="Method"
          defaultValue={filters.method?.split(',')}
          filters={methodFilters}
          onChange={handleFilterChange('method')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by hasVulns">
        <FilterButton
          title="Has Vulns"
          defaultValue={filters.hasVulns?.split(',')}
          filters={hasVulnsFilters}
          onChange={handleFilterChange('hasVulns')}
        />
      </CustomTooltip>

      {/* <CustomTooltip text="Filter results by workspace">
        <FilterButton
          title="Workspace"
          defaultValue={filters.workspace?.split(',')}
          filters={workspaceFilters}
          onChange={handleFilterChange('workspace')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by source">
        <FilterButton
          title="Source"
          defaultValue={filters.source?.split(',')}
          filters={sourceFilters}
          onChange={handleFilterChange('source')}
        />
      </CustomTooltip> */}

      <Button variant="outline" onClick={() => setFilters(() => ({}))}>
        <RefreshCcw />
        Reset
      </Button>
    </div>
  );
}

export default EndpointsTableToolbar;
