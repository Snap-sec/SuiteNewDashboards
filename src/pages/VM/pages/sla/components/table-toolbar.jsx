import { FilterButton } from "@/components/custom/filter-toolbar"
import useStore from "../store";
import { CustomTooltip } from '@/components/custom/tooltip';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function TableToolbar({ supportedFilters }) {
    const filters = useStore((state) => state.filters);
    const setFilters = useStore((state) => state.setFilters);

    const severity = supportedFilters?.severity?.map(v => ({ id: v, label: v, value: v })) || [];

    const owner = supportedFilters?.owner?.map(v => ({
        id: v,
        label: v,
        value: v
    })) || [];

    // Team and department are now objects with { id, name }
    const team = supportedFilters?.team?.map(t => ({
        id: t.id,
        label: t.name,
        value: t.id
    })) || [];

    const department = supportedFilters?.department?.map(d => ({
        id: d.id,
        label: d.name,
        value: d.id
    })) || [];

    const businessUnit =
        supportedFilters?.businessUnits?.map((v) => ({
            id: v.id,
            label: v.name,
            value: v.id,
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
            <CustomTooltip text="Filter by Severity">
                <FilterButton
                    title="Severity"
                    enableSearch={true}
                    defaultValue={filters.severity?.split(",")}
                    filters={severity}
                    onChange={handleFilterChange("severity")}
                />
            </CustomTooltip>
            <CustomTooltip text="Filter by Owner">
                <FilterButton
                    enableSearch={true}
                    title="Owner"
                    defaultValue={filters.owner?.split(",")}
                    filters={owner}
                    onChange={handleFilterChange("owner")}
                />
            </CustomTooltip>
            <CustomTooltip text="Filter by Team">
                <FilterButton
                    enableSearch={true}
                    title="Team"
                    defaultValue={filters.team?.split(",")}
                    filters={team}
                    onChange={handleFilterChange("team")}
                />
            </CustomTooltip>
            <CustomTooltip text="Filter by Department">
                <FilterButton
                    enableSearch={true}
                    title="Department"
                    defaultValue={filters.department?.split(",")}
                    filters={department}
                    onChange={handleFilterChange("department")}
                />
            </CustomTooltip>
            <CustomTooltip text="Filter by Business Unit">
                <FilterButton
                    enableSearch={true}
                    title="Business Unit"
                    defaultValue={filters.businessUnits?.split(",")}
                    filters={businessUnit}
                    onChange={handleFilterChange("businessUnits")}
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