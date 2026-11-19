import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../store';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import { FilterGroupWithShowMore } from '../../../../../components/common/group-filters-wrapper';
// import FilterButton from './filter-button';


function TableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const severityFilters =
    supportedFilters?.severity?.map((severity) => ({
      id: severity,
      label: severity,
      value: severity,
    })) || [];

  const assessmentFilters =
    supportedFilters?.assessments?.map((filter) => ({
      id: filter.id,
      label: filter.title,
      value: filter.title,
    })) || [];

  const ownerFilters =
    supportedFilters?.assignee?.map((owner) => ({
      id: owner,
      label: owner,
      value: owner,
    })) || [];

  const stateFilters =
    supportedFilters?.state?.map((owner) => ({
      id: owner,
      label: owner,
      value: owner,
    })) || [];

  const teamFilters =
    supportedFilters?.teams?.map((team) => ({
      id: team,
      label: team,
      value: team,
    })) || [];

  const departmentFilters =
    supportedFilters?.departments?.map((d) => ({
      id: d.id,
      label: d.name,
      value: d.id,
    })) || [];

  const slaFilters =
    supportedFilters?.sla?.map((sla) => ({
      id: sla,
      label: sla,
      value: sla,
    })) || [];

  const hasBlockers =
    supportedFilters?.hasBlocker?.map((v) => ({
      id: v,
      label: v,
      value: v,
    })) || [];


  const businessUnit =
    supportedFilters?.businessUnits?.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
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
      <FilterGroupWithShowMore visibleCount={5}>
        <FilterButton
          title="Severity"
          defaultValue={filters.severity?.split(',')}
          filters={severityFilters}
          onChange={handleFilterChange('severity')}
        />


        <FilterButton
          enableSearch={true}
          title="Assessments"
          defaultValue={filters.assessmentTitle?.split(',')}
          filters={assessmentFilters}
          onChange={handleFilterChange('assessmentTitle')}
        />

        <FilterButton
          title="Owners"
          defaultValue={filters.assignee?.split(',')}
          filters={ownerFilters}
          onChange={handleFilterChange('assignee')}
        />

        <FilterButton
          title="State"
          defaultValue={filters.state?.split(',')}
          filters={stateFilters}
          onChange={handleFilterChange('state')}
        />

        {/* <FilterButton
          title="Teams"
          defaultValue={filters.teams?.split(',')}
          filters={teamFilters}
          onChange={handleFilterChange('teams')}
        /> */}

        <FilterButton
          title="Business Unit"
          defaultValue={filters.businessUnits?.split(',')}
          filters={[
            {
              id: 'Unassigned',
              label: 'Unassigned',
              value: 'Unassigned',
            },
            ...businessUnit,
          ]}
          onChange={handleFilterChange('businessUnits')}
        />


        <FilterButton
          title="Departments"
          defaultValue={filters.departmentId?.split(',')}
          filters={departmentFilters}
          onChange={handleFilterChange('departmentId')}
        />

        <FilterButton
          title="SLA"
          defaultValue={filters.sla?.split(',')}
          filters={slaFilters}
          onChange={handleFilterChange('sla')}
        />

        <FilterButton
          title="Blocked"
          defaultValue={filters.hasBlocker}
          filters={hasBlockers}
          onChange={handleFilterChange('hasBlocker')}
        />
      </FilterGroupWithShowMore>

      <Button variant="outline" onClick={() => setFilters(() => ({}))}>
        <RefreshCcw />
        Reset
      </Button>
    </div>
  );
}

export default TableToolbar;
