import useStore from "../../store";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { CustomTooltip } from '@/components/custom/tooltip';
import FilterButton from "../../../../../../components/custom/filter-toolbar/filter-button";


function TableToolbar({ supportedFilters, tab }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const stateFilters = supportedFilters?.status?.map(state => ({ 
    id: state, 
    label: state.charAt(0).toUpperCase() + state.slice(1), // Capitalize first letter
    value: state 
  })) || [];

  const assignedTo = supportedFilters['assignee.email']?.map(email => ({ 
    id: email, 
    label: email,
    value: email
  })) || [];

  const priority = supportedFilters['priority']?.map(p => ({ 
    id: p, 
    label: p,
    value: p 
  })) || [];

  const handleFilterChange = (key) => (checked, value) => {
    setFilters(prev => {
      if (checked || (value?.length > 0)) {
        return { ...prev, [key]: value?.join(",") };
      } else {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <CustomTooltip text="Filter results by State">
        <FilterButton 
          title="State" 
          defaultValue={filters.status?.split(",")} 
          filters={stateFilters} 
          onChange={handleFilterChange("status")} 
          multiple={false}
        />
      </CustomTooltip>
      {tab !== "my-blockers" && <CustomTooltip text="Filter results by Assignee">
        <FilterButton 
          title="Assigned To" 
          defaultValue={filters['assignee.email']?.split?.(",")} 
          filters={assignedTo} 
          onChange={handleFilterChange("assignee.email")} 
          multiple={false}
        />
      </CustomTooltip>}
      <CustomTooltip text="Filter results by Priority">
        <FilterButton 
          title="Priority" 
          defaultValue={filters['priority']?.split?.(",")} 
          filters={priority} 
          onChange={handleFilterChange("priority")} 
          multiple={false}
        />
      </CustomTooltip>
      <Button variant="outline" onClick={() => setFilters(() => ({}))}>
        <RefreshCcw />
        Reset
      </Button>
    </div>
  )
}

export default TableToolbar;
