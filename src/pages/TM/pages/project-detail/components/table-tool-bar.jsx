// import FilterButton from "./filter-button";
import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import useEndpointsStore from "../store";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function EndpointsTableToolbar({ supportedFilters }) {
  const filters = useEndpointsStore(state => state.filters);
  const setFilters = useEndpointsStore(state => state.setFilters);

  const methodFilters = supportedFilters?.methods?.map(item => ({ id: item, label: item, value: item })) || [];
  const hostFilters = supportedFilters?.hosts?.map(item => ({ id: item, label: item, value: item })) || [];
  const collectionFilters = supportedFilters?.collections?.map(item => ({ id: item, label: item, value: item })) || [];
  const threatsGenerated = supportedFilters?.threats_generated?.map(item => ({ id: String(item), label: String(item), value: String(item) })) || [];

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
      <FilterButton 
        title="Method" 
        filters={methodFilters} 
        defaultValue={filters.method?.split(",")} 
        onChange={handleFilterChange("method")} 
      />
      <FilterButton 
        title="Host" 
        filters={hostFilters} 
        defaultValue={filters.host?.split(",")} 
        onChange={handleFilterChange("host")} 
      />
      <FilterButton 
        title="Threats" 
        filters={threatsGenerated} 
        defaultValue={filters.threats_generated?.split(",")} 
        onChange={handleFilterChange("threats_generated")} 
      />
      <FilterButton 
        title="Collection" 
        filters={collectionFilters} 
        defaultValue={filters['collection.name']?.split(",")} 
        onChange={handleFilterChange("collection.name")} 
      />
      <Button variant="outline" onClick={() => setFilters(() => ({}))}>
        <RefreshCcw /> Reset
      </Button>
    </div>
  );
}

