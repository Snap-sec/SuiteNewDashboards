import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../store';

function TableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const boolArray = [true, false];

  const teamFilters =
    supportedFilters?.teams?.map((filter) => ({
      id: filter.id,
      label: filter.name,
      value: filter.id,
    })) || [];

  // const hasSignupedUpfilters = boolArray.map((item, idx) => ({
  //   id: idx,
  //   label: String(item),
  //   value: String(item),
  //   isSelected: filters.hasSignedUp === String(item)
  // }));

  const departmentFilters =
    supportedFilters?.departments?.map((d) => ({
      id: d?.id,
      label: d.name,
      value: d.id,
    })) || [];

  const statusFilter =
    supportedFilters?.status?.map((d) => ({
      id: d,
      label: d,
      value: d,
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
      <FilterButton
        title="Teams"
        defaultValue={filters.teams?.split(',')}
        filters={teamFilters}
        onChange={handleFilterChange('teams')}
      />

      {/* <FilterButton
        title="Has Signed Up"
        defaultValue={filters.hasSignedUp?.split(',')}
        filters={hasSignupedUpfilters}
        onChange={handleFilterChange('hasSignedUp')}
      /> */}

      <CustomTooltip text="Filter results by Department">
        <FilterButton
          title="Departments"
          defaultValue={filters.departments?.split(',')}
          filters={departmentFilters}
          onChange={handleFilterChange('departments')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by Status">
        <FilterButton
          title="Status"
          defaultValue={filters.status?.split(',')}
          filters={statusFilter}
          onChange={handleFilterChange('status')}
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
