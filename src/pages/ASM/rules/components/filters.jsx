import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterGroupWithShowMore } from '@/components/common/group-filters-wrapper';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import useStore from '../store';

function FiltersToolbar({
  supportedFilters = { risk: ['All', 'Critical', 'High', 'Medium', 'Low', 'Info', 'None'] },
}) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const riskFilters =
    supportedFilters?.risk?.map((risk) => ({
      id: risk,
      label: risk.charAt(0).toUpperCase() + risk.slice(1),
      value: risk,
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
      <FilterGroupWithShowMore visibleCount={4}>
        <FilterButton
          title="Risk"
          defaultValue={filters.risk?.split(',')}
          filters={riskFilters}
          onChange={handleFilterChange('risk')}
        />
      </FilterGroupWithShowMore>

      <Button variant="outline" onClick={() => setFilters(() => ({}))}>
        <RefreshCcw />
        Reset
      </Button>
    </div>
  );
}

export default FiltersToolbar;
