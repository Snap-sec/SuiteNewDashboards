import { FilterButton } from "@/components/custom/filter-toolbar"
import useStore from "../store";
import { CustomTooltip } from '@/components/custom/tooltip';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function LeaderboardTableToolbar({ supportedFilters }) {
    const filters = useStore((state) => state.filters);
    const setFilters = useStore((state) => state.setFilters);

    const sortBy = supportedFilters?.sortBy?.map(v => ({ id: v, label: v, value: v })) || [];

    const handleFilterChange = (key) => (checked, value) => {
        if (checked) {
            setFilters(prev => ({ ...prev, [key]: value.join(",") }));
        } else {
            setFilters(prev => Object.keys(prev).filter(k => k !== key).reduce((f, k) => ({ ...f, [k]: prev[k] }), {}));
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <CustomTooltip text="Filter by Sort Field">
                <FilterButton 
                    title="Sort By" 
                    defaultValue={filters.sortBy?.split(",")} 
                    filters={sortBy} 
                    onChange={handleFilterChange("sortBy")} 
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

export default LeaderboardTableToolbar;
