import { RefreshCcw } from 'lucide-react';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import { Button } from '../../../../../components/ui/button';
import useStore from '../store';
// import FilterButton from './buttons/filter-button';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';

function TableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const priorityFilters =
    supportedFilters?.priorities?.map((priority) => ({
      id: priority,
      label: priority,
      value: priority,
    })) || [];

  const stateFilters =
    supportedFilters?.states?.map((state) => ({
      id: state,
      label: state,
      value: state,
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
          title="Priority"
          defaultValue={filters?.['changeRequestData.priorityLevel']?.split(
            ',',
          )}
          filters={priorityFilters}
          onChange={handleFilterChange('changeRequestData.priorityLevel')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by State">
        <FilterButton
          title="State"
          defaultValue={filters.state?.split(',')}
          filters={stateFilters}
          onChange={handleFilterChange('state')}
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
