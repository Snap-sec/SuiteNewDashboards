import { FilterButton } from "@/components/custom/filter-toolbar"
import useStore from "../store";
import { CustomTooltip } from '@/components/custom/tooltip';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function TableToolbar({ supportedFilters }) {
    const filters = useStore((state) => state.filters);
    const setFilters = useStore((state) => state.setFilters);

    const hasVulns = supportedFilters?.hasVulns?.map(v => ({ id: v, label: v, value: v })) || [];
    const type = supportedFilters?.type?.map(v => ({ id: v, label: v, value: v })) || [];
    
    // Handle null values for owner - show "Unassigned" for null
    const owner = supportedFilters?.owner?.filter(v => !!v)?.map(v => ({ 
        // id: v === null ? 'unassigned' : v, 
        // label: v === null ? 'Unassigned' : v, // Show "Unassigned" for null
        // value: v === null ? 'unassigned' : v // Keep original null value
        id: v, 
        label: v,
        value: v
    })) || [];

    const handleFilterChange = (key) => (checked, value) => {
        if (checked) {
            setFilters(prev => ({ ...prev, [key]: value.join(",") }));
        } else {
            setFilters(prev => Object.keys(prev).filter(k => k !== key).reduce((f, k) => ({ ...f, [k]: prev[k] }), {}));
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <CustomTooltip text="Filter by Has Vulns">
                <FilterButton 
                    title="Has Vulns" 
                    defaultValue={filters.hasVulns?.split(",")} 
                    filters={hasVulns} 
                    onChange={handleFilterChange("hasVulns")} 
                />
            </CustomTooltip>
            <CustomTooltip text="Filter by Asset Type">
                <FilterButton 
                    title="Type" 
                    defaultValue={filters.type?.split(",")} 
                    filters={type} 
                    onChange={handleFilterChange("type")} 
                />
            </CustomTooltip>
            <CustomTooltip text="Filter by Owner">
                <FilterButton 
                    title="Owner" 
                    defaultValue={filters["owner.email"]?.split(",")} 
                    filters={owner} 
                    onChange={handleFilterChange("owner.email")} 
                />
            </CustomTooltip>
            <CustomTooltip text="Clear all filters">
                <Button 
                    variant="outline" 
                    onClick={() => setFilters(() => ({}))}
                >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
            </CustomTooltip>
        </div>
    )
}

export default TableToolbar;
