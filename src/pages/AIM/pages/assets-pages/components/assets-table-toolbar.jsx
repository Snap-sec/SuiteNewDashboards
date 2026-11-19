import { format } from 'date-fns';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/tooltip';
import DateRangePicker from '../../../../../components/custom/date-range-picker';
import useStore from '../store';
// import FilterButton from './filter-button';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';

function TableToolbar({ supportedFilters }) {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  // use current path to render different filters in the toolbar
  const pathname = window.location.pathname;

  const assetType = pathname?.split('/')?.at(-1);

  const tagFilters =
    supportedFilters?.tags?.map((tag) => ({
      id: tag,
      label: tag,
      value: tag,
    })) || [];

  const decommissionedByFilters =
    supportedFilters?.decommissionedBy?.map((user) => ({
      id: user,
      label: user,
      value: user,
    })) || [];

  const sourcesFilters =
    supportedFilters?.source?.map((source) => ({
      id: source,
      label: source,
      value: source,
    })) || [];

  const adapterFilters =
    supportedFilters?.adapters?.map((adapter) => ({
      id: adapter?._id,
      label: adapter?.name,
      value: adapter?.name,
    })) || [];

  const organisationFilters =
    supportedFilters?.organizations?.map((org) => ({
      id: org,
      label: org,
      value: org,
    })) || [];

  const hasVulnsFilters =
    supportedFilters?.hasVulns?.map((bool) => ({
      id: bool,
      label: bool,
      value: bool,
    })) || [];

  const ownerFilters =
    supportedFilters?.owners?.map((owner) => ({
      id: owner,
      label: owner,
      value: owner,
    })) || [];

  const employeeTypeFilters =
    supportedFilters?.employeeType?.map((employeeType) => ({
      id: employeeType,
      label: employeeType,
      value: employeeType,
    })) || [];

  const employeelastSeenFilters =
    supportedFilters?.lastSeen?.map((lastSeen) => ({
      id: lastSeen,
      label: lastSeen,
      value: lastSeen,
    })) || [];

  const exposureFilters =
    supportedFilters?.exposure?.map((exposure) => ({
      id: exposure,
      label: exposure,
      value: exposure,
    })) || [];

  const riskFilters =
    supportedFilters?.risk?.map((risk) => ({
      id: risk,
      label: risk,
      value: risk,
    })) || [];

  const domainFilters =
    supportedFilters?.domain?.map((dmn) => ({
      id: dmn,
      label: dmn,
      value: dmn,
    })) || [];

  const handleFilterChange = (key) => (checked, value) => {
    setFilters((prev) => {
      if (checked || value?.length > 0) {
        // Use semicolon as separator for organization filter, comma for others
        const separator =
          key === 'properties.organization' || key === 'organization'
            ? ';'
            : ',';
        // Ensure we're using the correct key mapping
        const mappedKey = key === 'risk.exposure' ? 'risk' : key;
        return {
          ...prev, // ✅ keep old filters
          [mappedKey]: value?.join(separator),
        };
      } else {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  if (assetType == 'assets') {
    return null;
  }

  if (
    [
      'subdomains',
      'applications',
      'apis',
      'workstation',
      'registeries',
      'object-storage',
      'repositories',
      'vendor',
      'ips',
      'dns-records',
      'certificates',
      'assets',
    ].includes(assetType)
  ) {
    return (
      <div className="flex gap-2 items-center flex-wrap">
        <CustomTooltip text="Filter results by Owner">
          <FilterButton
            title="Owners"
            defaultValue={filters.owner?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('owner')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Risk">
          <FilterButton
            title="Risk"
            defaultValue={filters.risk?.split(',')}
            filters={riskFilters}
            onChange={handleFilterChange('risk.exposure')}
          />
        </CustomTooltip>

        {!['certificates', 'dns-records'].includes(assetType) && (
        <CustomTooltip text="Filter results by exposures">
          <FilterButton
            title="Exposure"
            defaultValue={filters.exposure?.split?.(',')}
            filters={exposureFilters}
            onChange={handleFilterChange('exposure')}
          />
        </CustomTooltip>
        )}

        <CustomTooltip text="Filter results by Adapters">
          <FilterButton
            title="Adapters"
            defaultValue={filters.adapters?.split(',')}
            filters={adapterFilters}
            onChange={handleFilterChange('adapters')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter if has hasVulns">
          <FilterButton
            title="hasVulns"
            defaultValue={filters.hasVulns?.split(',')}
            filters={hasVulnsFilters}
            onChange={handleFilterChange('hasVulns')}
          />
        </CustomTooltip>

        {/* <CustomTooltip text="Filter if has domains">
          <FilterButton
            title="Domain"
            defaultValue={filters.domain?.split(',')}
            filters={domainFilters}
            onChange={handleFilterChange('value')}
          />
        </CustomTooltip> */}

        {['ips'].includes(assetType) && (
          <>
            <CustomTooltip text="Filter if has organizations">
              <FilterButton
                title="Organisations"
                defaultValue={filters?.["properties.organization"]?.split(';')}
                filters={organisationFilters}
                onChange={handleFilterChange('properties.organization')}
              />
            </CustomTooltip>
          </>
        )}

        {/* Tags */}

        {['subdomains'].includes(assetType) && (
          <>
            <CustomTooltip text="Filter results by Tags">
              <FilterButton
                title="Tags"
                defaultValue={filters.tags?.split(',')}
                filters={tagFilters}
                onChange={handleFilterChange('tags')}
              />
            </CustomTooltip>

            <CustomTooltip text="Filter results by Tags">
              <FilterButton
                title="Sources"
                defaultValue={filters.source?.split(',')}
                filters={sourcesFilters}
                onChange={handleFilterChange('source')}
              />
            </CustomTooltip>

            <CustomTooltip text="Filter results by Date">
              <DateRangePicker
                onDateChange={(dates) => {
                  setFilters((prev) => ({
                    ...prev,
                    fromDate: dates.from
                      ? format(dates.from, 'yyyy-MM-dd')
                      : undefined,
                    toDate: dates.to
                      ? format(dates.to, 'yyyy-MM-dd')
                      : undefined,
                  }));
                }}
              />
            </CustomTooltip>
          </>
        )}

        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </div>
    );
  }

  if (['decomissioned', 'staged'].includes(assetType)) {
    return (
      <div className="flex gap-2 items-center">
        <CustomTooltip text="Filter results by Owner">
          <FilterButton
            title="Owners"
            defaultValue={filters.owner?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('owner')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Risk">
          <FilterButton
            title="Risk"
            defaultValue={filters.risk?.split(',')}
            filters={riskFilters}
            onChange={handleFilterChange('risk.exposure')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter results by exposures">
          <FilterButton
            title="Exposure"
            defaultValue={filters.exposure?.split(',')}
            filters={exposureFilters}
            onChange={handleFilterChange('exposure')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Adapters">
          <FilterButton
            title="Adapters"
            defaultValue={filters.adapters?.split(',')}
            filters={adapterFilters}
            onChange={handleFilterChange('adapters')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter if has hasVulns">
          <FilterButton
            title="hasVulns"
            defaultValue={filters.hasVulns?.split(',')}
            filters={hasVulnsFilters}
            onChange={handleFilterChange('hasVulns')}
          />
        </CustomTooltip>

        {/* Tags */}

        {['decomissioned'].includes(assetType) && (
          <>
            <CustomTooltip text="Filter results by Tags">
              <FilterButton
                title="Decommissioned By"
                defaultValue={filters.decommissionedBy?.split(',')}
                filters={decommissionedByFilters}
                onChange={handleFilterChange('decommissionedBy')}
              />
            </CustomTooltip>

            <CustomTooltip text="Filter results by Tags">
              <FilterButton
                title="Sources"
                defaultValue={filters.source?.split(',')}
                filters={sourcesFilters}
                onChange={handleFilterChange('source')}
              />
            </CustomTooltip>
          </>
        )}

        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </div>
    );
  }

  if (['employees'].includes(assetType)) {
    return (
      <div className="flex gap-2 items-center">
        <CustomTooltip text="Filter results by Employee Type">
          <FilterButton
            title="Type"
            defaultValue={filters.employeeType?.split(',')}
            filters={employeeTypeFilters}
            onChange={handleFilterChange('employeeType')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Last Seen">
          <FilterButton
            title="Last Seen"
            defaultValue={filters.lastSeen?.split(',')}
            filters={employeelastSeenFilters}
            onChange={handleFilterChange('lastSeen')}
          />
        </CustomTooltip>

        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </div>
    );
  }

  if (
    [
      'apis',
      'workstation',
      'registeries',
      'object-storage',
      'repositories',
    ].includes(assetType)
  ) {
    return (
      <div className="flex gap-2 items-center">
        <CustomTooltip text="Filter results by Risk">
          <FilterButton
            title="Risk"
            defaultValue={filters.risk?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('risk')}
          />
        </CustomTooltip>
        <CustomTooltip text="Filter if has vulnerabilities">
          <FilterButton
            title="hasVulns"
            defaultValue={filters.hasVulns?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('hasVulns')}
          />
        </CustomTooltip>

        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </div>
    );
  }

  if (assetType == 'ips') {
    return (
      <div className="flex gap-2 items-center">
        <CustomTooltip text="Filter results by Risk">
          <FilterButton
            title="Risk"
            defaultValue={filters.risk?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('risk')}
          />
        </CustomTooltip>
        <CustomTooltip text="Filter if has vulnerabilities">
          <FilterButton
            title="hasVulns"
            defaultValue={filters.hasVulns?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('hasVulns')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter if has organizations">
          <FilterButton
            title="Organisations"
            defaultValue={filters.organizations?.split(',')}
            filters={organisationFilters}
            onChange={handleFilterChange('properties.organization')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter if has Organizations">
          <FilterButton
            title="Organization"
            defaultValue={filters.organizations?.split(';')}
            filters={ownerFilters}
            onChange={handleFilterChange('organization')}
          />
        </CustomTooltip>
        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </div>
    );
  }

  if (assetType == 'dns-records') {
    return (
      <div className="flex gap-2 items-center">
        <CustomTooltip text="Filter results by Risk">
          <FilterButton
            title="Risk"
            defaultValue={filters.risk?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('risk')}
          />
        </CustomTooltip>
        <CustomTooltip text="Filter if has exposure">
          <FilterButton
            title="Exposure"
            defaultValue={filters.exposures?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('exposure')}
          />
        </CustomTooltip>
        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </div>
    );
  }

  // if (['certificates', 'decomissioned'].includes(assetType)) {
  //   return (
  //     <div className="flex gap-2 items-center">
  //       <CustomTooltip text="Filter results by Risk">
  //         <FilterButton
  //           title="Risk"
  //           defaultValue={filters.risk?.split(',')}
  //           filters={ownerFilters}
  //           onChange={handleFilterChange('risk')}
  //         />
  //       </CustomTooltip>
  //       <Button variant="outline" onClick={() => setFilters(() => ({}))}>
  //         <RefreshCcw />
  //         Reset
  //       </Button>
  //     </div>
  //   );
  // }

  if (assetType == 'employees') {
    return (
      <div className="flex gap-2 items-center">
        <CustomTooltip text="Filter results by Risk">
          <FilterButton
            title="Risk"
            defaultValue={filters.risk?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('risk')}
          />
        </CustomTooltip>

        <CustomTooltip text="Filter results by domain">
          <FilterButton
            title="Domain"
            defaultValue={filters.domain?.split(',')}
            filters={ownerFilters}
            onChange={handleFilterChange('domain')}
          />
        </CustomTooltip>
        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <CustomTooltip text="Filter by Adapters">
        <FilterButton
          title="Adapters"
          defaultValue={filters.adapters?.split(',')}
          filters={adapterFilters}
          onChange={handleFilterChange('adapter')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by Owners">
        <FilterButton
          title="Owners"
          defaultValue={filters.assignee?.split(',')}
          filters={ownerFilters}
          onChange={handleFilterChange('owner')}
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
