import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../store';
// import FilterButton from './filter-button';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';

function TableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  // structuring filters data
  const projectsFilter =
    supportedFilters?.projects?.map((fltr) => ({
      id: fltr,
      label: fltr,
      value: fltr,
    })) || [];

  const severityFilters =
    supportedFilters?.severity?.map((val) => ({
      id: val,
      label: val,
      value: val,
    })) || [];

  const collectionsFilter =
    supportedFilters?.collections?.map((fltr) => ({
      id: fltr,
      label: fltr,
      value: fltr,
    })) || [];

  const methodsFilter =
    supportedFilters?.methods?.map((fltr) => ({
      id: fltr,
      label: fltr,
      value: fltr,
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
      <CustomTooltip text="Filter results by projects">
        <FilterButton
          title="Projects"
          defaultValue={filters.projects?.split(',')}
          filters={projectsFilter}
          onChange={handleFilterChange('projects')}
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

      <CustomTooltip text="Filter results by Collections.">
        <FilterButton
          title="Collections"
          defaultValue={filters.collections?.split(',')}
          filters={collectionsFilter}
          onChange={handleFilterChange('collections')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by Methods.">
        <FilterButton
          title="Methods"
          defaultValue={filters.methods?.split(',')}
          filters={methodsFilter}
          onChange={handleFilterChange('methods')}
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
