import useStore from "../../rules/store";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { CustomTooltip } from '@/components/custom/tooltip';
import FilterButton from "@/components/custom/filter-toolbar/filter-button";
import useHandleFilterChange from "@/hooks/use-handle-filter-change";

function TableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const clearFilters = () => setFilters(() => ({}));

  const stateFilters = supportedFilters?.states?.map(state => ({
    id: state,
    label: state.charAt(0).toUpperCase() + state.slice(1),
    value: state
  })) || [];

  const { handleFilterChange } = useHandleFilterChange(setFilters);

  console.log(filters);

  return (
    <div className="flex gap-2 items-center">
      <CustomTooltip text="Filter results by Status">
        <FilterButton
          title="Status"
          defaultValue={filters.status}
          filters={stateFilters}
          onChange={handleFilterChange("status")}
        // multiple={false}
        />
      </CustomTooltip>
      <Button
        variant="outline"
        onClick={clearFilters}
        className="flex items-center gap-2"
      >
        <RefreshCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  )
}

export default TableToolbar;
