import { RefreshCcw, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../store';
import FilterButton from "@/components/custom/filter-toolbar/filter-button";
import useHandleFilterChange from "@/hooks/use-handle-filter-change";
import { Link, useLocation } from 'react-router-dom';



function TableToolbar({ supportedFilters }) {

  const setFilters = useStore((state) => state.setFilters);
  const filters = useStore((state) => state.filters);
  const location = useLocation();

  const assetTypeFilters = supportedFilters?.asset_types?.map((asst) => ({
    id: asst,
    label: asst,
    value: asst,
  })) || [];


  const assetSeverityFilters = supportedFilters?.severity?.map((asst) => ({
    id: asst,
    label: asst,
    value: asst,
  }));


  const assetStatesFilters = supportedFilters?.states?.map((asst) => ({
    id: asst,
    label: asst,
    value: asst,
  }));



  const { handleFilterChange } = useHandleFilterChange(setFilters);

  return (
    <div className="flex gap-2 items-center">
      <CustomTooltip text="Filter by Asset Type">
        <FilterButton
          title="Assets"
          filters={assetTypeFilters}
          defaultValue={filters['associatedAsset.type']}
          onChange={handleFilterChange('associatedAsset.type')}
          multiple={true}
        />
      </CustomTooltip>


      <CustomTooltip text="Filter by Severity">
        <FilterButton
          title="Severity"
          filters={assetSeverityFilters}
          defaultValue={filters?.severity}
          onChange={handleFilterChange('severity')}
        />
      </CustomTooltip>


      <CustomTooltip text="Filter by State">
        <FilterButton
          title="State"
          filters={assetStatesFilters}
          defaultValue={filters?.state}
          onChange={handleFilterChange('state')}
        />
      </CustomTooltip>




      {/* <CustomTooltip text={location.pathname === '/casm/exposures/false-exposures' ? 'Hide False Positives' : 'Show False Positives'}>
        <Link to={location.pathname === '/casm/exposures/false-exposures' ? '/casm/exposures' : '/casm/exposures/false-exposures'}>
          <Toggle
            variant="outline"
            size="sm"
            pressed={location.pathname === '/casm/exposures/false-exposures'}
            onPressedChange={() => { }}
            className="h-8 gap-1.5 w-full whitespace-nowrap"
          >
            <Ghost />
            {location.pathname === '/casm/exposures/false-exposures' ? 'Hide False Positives' : 'Show False Positives'}
          </Toggle>
        </Link>
      </CustomTooltip> */}


      <CustomTooltip text="Reset all filters">
        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </CustomTooltip>
    </div>
  );
}

export default TableToolbar;
