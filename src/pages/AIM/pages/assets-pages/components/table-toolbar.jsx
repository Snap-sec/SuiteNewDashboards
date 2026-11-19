import { format } from 'date-fns';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import { CustomTooltip } from '@/components/custom/tooltip';
import DateRangePicker from '../../../../../components/custom/date-range-picker';
import useStore from '../store';


// --- Shared Filter Components ---

const CommonFilters = ({ filters, options, onChange, hideExposure = false }) => (
    <>
        <CustomTooltip text="Filter results by Owner">
            <FilterButton
                title="Owners"
                defaultValue={filters.owner?.split(',')}
                filters={options.owners}
                onChange={onChange('owner')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Risk">
            <FilterButton
                title="Risk"
                defaultValue={filters.risk?.split(',')}
                filters={options.risk}
                onChange={onChange('risk.exposure')}
            />
        </CustomTooltip>

        {!hideExposure && (
            <CustomTooltip text="Filter results by exposures">
                <FilterButton
                    title="Exposure"
                    defaultValue={filters.exposure?.split?.(',')}
                    filters={options.exposure}
                    onChange={onChange('exposure')}
                />
            </CustomTooltip>
        )}

        <CustomTooltip text="Filter results by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                onChange={onChange('adapters')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter if has hasVulns">
            <FilterButton
                title="hasVulns"
                defaultValue={filters.hasVulns?.split(',')}
                filters={options.hasVulns}
                onChange={onChange('hasVulns')}
            />
        </CustomTooltip>
    </>
);

// --- Asset Specific Filter Sections ---

const SubdomainFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Network Scope">
            <FilterButton
                title="Network Scope"
                defaultValue={filters.is_internal?.split(',')}
                filters={options.is_internal}
                onChange={onChange('is_internal')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="Is New"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const ApiFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Network Scope">
            <FilterButton
                title="Network Scope"
                defaultValue={filters.is_internal?.split(',')}
                filters={options.is_internal}
                onChange={onChange('is_internal')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="Is New"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const DnsRecordFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Network Scope">
            <FilterButton
                title="Network Scope"
                defaultValue={filters.is_internal?.split(',')}
                filters={options.is_internal}
                onChange={onChange('is_internal')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="Is New"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const IpFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Network Scope">
            <FilterButton
                title="Network Scope"
                defaultValue={filters.is_internal?.split(',')}
                filters={options.is_internal}
                onChange={onChange('is_internal')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="Is New"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const RepositoryFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Network Scope">
            <FilterButton
                title="Network Scope"
                defaultValue={filters.is_internal?.split(',')}
                filters={options.is_internal}
                onChange={onChange('is_internal')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="Is New"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const CertificateFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Network Scope">
            <FilterButton
                title="Network Scope"
                defaultValue={filters.is_internal?.split(',')}
                filters={options.is_internal}
                onChange={onChange('is_internal')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="Is New"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const ApplicationFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Network Scope">
            <FilterButton
                title="Network Scope"
                defaultValue={filters.is_internal?.split(',')}
                filters={options.is_internal}
                onChange={onChange('is_internal')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="Is New"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);



const EmployeeFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter results by Employee Type">
            <FilterButton
                title="Type"
                defaultValue={filters.employeeType?.split(',')}
                filters={options.employeeType}
                onChange={onChange('employeeType')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Last Seen">
            <FilterButton
                title="Last Seen"
                defaultValue={filters.lastSeen?.split(',')}
                filters={options.lastSeen}
                onChange={onChange('lastSeen')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Risk">
            <FilterButton
                title="Risk"
                defaultValue={filters.risk?.split(',')}
                filters={options.risk}
                onChange={onChange('risk')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter results by domain">
            <FilterButton
                title="Domain"
                defaultValue={filters.domain?.split(',')}
                filters={options.domain}
                onChange={onChange('domain')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter results by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                onChange={onChange('adapters')}
            />
        </CustomTooltip>
    </>
);

const DecommissionedStagedFilters = ({ filters, options, onChange, assetType }) => (
    <>
        <CommonFilters filters={filters} options={options} onChange={onChange} />
        {assetType === 'decomissioned' && (
            <>
                <CustomTooltip text="Filter results by Decommissioned By">
                    <FilterButton
                        title="Decommissioned By"
                        defaultValue={filters.decommissionedBy?.split(',')}
                        filters={options.decommissionedBy}
                        onChange={onChange('decommissionedBy')}
                    />
                </CustomTooltip>

                <CustomTooltip text="Filter results by Sources">
                    <FilterButton
                        title="Sources"
                        defaultValue={filters.source?.split(',')}
                        filters={options.sources}
                        onChange={onChange('source')}
                    />
                </CustomTooltip>
            </>
        )}
    </>
);

const WorkstationFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="New/Existing"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const ObjectStorageFilters = ({ filters, options, onChange }) => (
    <>
        <CustomTooltip text="Filter by Adapters">
            <FilterButton
                title="Adapters"
                defaultValue={filters.adapters?.split(',')}
                filters={options.adapters}
                enableSearch={true}
                onChange={onChange('adapters.type')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Environment">
            <FilterButton
                title="Environment"
                defaultValue={filters.environment?.split(',')}
                filters={options.environment}
                onChange={onChange('environment')}
            />
        </CustomTooltip>

        <CustomTooltip text="Filter by Status">
            <FilterButton
                title="New/Existing"
                defaultValue={filters.is_new?.split(',')}
                filters={options.is_new}
                onChange={onChange('is_new')}
            />
        </CustomTooltip>
    </>
);

const RegistriesFilters = ({ filters, options, onChange }) => (
  <>
    <CustomTooltip text="Filter by Adapters">
      <FilterButton
        title="Adapters"
        defaultValue={filters.adapters?.split(',')}
        filters={options.adapters}
        enableSearch={true}
        onChange={onChange('adapters.type')}
      />
    </CustomTooltip>

    <CustomTooltip text="Filter by Environment">
      <FilterButton
        title="Environment"
        defaultValue={filters.environment?.split(',')}
        filters={options.environment}
        onChange={onChange('environment')}
      />
    </CustomTooltip>

    <CustomTooltip text="Filter by Status">
      <FilterButton
        title="New/Existing"
        defaultValue={filters.is_new?.split(',')}
        filters={options.is_new}
        onChange={onChange('is_new')}
      />
    </CustomTooltip>
  </>
);


const GenericAssetFilters = ({ filters, options, onChange, assetType }) => (
    <CommonFilters
        filters={filters}
        options={options}
        onChange={onChange}
        hideExposure={['certificates', 'dns-records'].includes(assetType)}
    />
);

// --- Main TableToolbar Component ---

function TableToolbar({ supportedFilters }) {
    const filters = useStore((state) => state.filters);
    const setFilters = useStore((state) => state.setFilters);
    const pathname = window.location.pathname;
    const assetType = pathname?.split('/')?.at(-1);

    const handleFilterChange = (key) => (checked, value) => {
        setFilters((prev) => {
            if (checked || value?.length > 0) {
                const separator = (key === 'properties.organization' || key === 'organization') ? ';' : ',';
                const mappedKey = key === 'risk.exposure' ? 'risk' : key;
                return {
                    ...prev,
                    [mappedKey]: value?.join(separator),
                };
            } else {
                const { [key]: _, ...rest } = prev;
                return rest;
            }
        });
    };

    // Prepare Filter Options
    const options = {
        tags: supportedFilters?.tags?.map(t => ({ id: t, label: t, value: t })) || [],
        decommissionedBy: supportedFilters?.decommissionedBy?.map(u => ({ id: u, label: u, value: u })) || [],
        sources: supportedFilters?.source?.map(s => ({ id: s, label: s, value: s })) || [],
        adapters: supportedFilters?.adapters?.map(a => ({
            id: a?.value || a?._id || a?.name,
            label: a?.label || a?.name,
            value: a?.value || a?.name
        })) || [],
        organizations: supportedFilters?.organizations?.map(o => ({ id: o, label: o, value: o })) || [],
        hasVulns: supportedFilters?.hasVulns?.map(b => ({ id: b, label: b, value: b })) || [],
        owners: supportedFilters?.owners?.map(o => ({ id: o, label: o, value: o })) || [],
        employeeType: supportedFilters?.employeeType?.map(e => ({ id: e, label: e, value: e })) || [],
        lastSeen: supportedFilters?.lastSeen?.map(l => ({ id: l, label: l, value: l })) || [],
        exposure: supportedFilters?.exposure?.map(e => ({ id: e, label: e, value: e })) || [],
        risk: supportedFilters?.risk?.map(r => ({ id: r, label: r, value: r })) || [],
        domain: supportedFilters?.domain?.map(d => ({ id: d, label: d, value: d })) || [],
        // New filters from subdomain JSON
        is_internal: supportedFilters?.is_internal?.map(i => ({ id: String(i.value), label: i.label, value: String(i.value) })) || [],
        environment: supportedFilters?.environment?.map(e => ({ id: String(e.value), label: e.label, value: String(e.value) })) || [],
        is_new: supportedFilters?.is_new?.map(n => ({ id: String(n.value), label: n.label, value: String(n.value) })) || [],
    };

    if (assetType === 'assets' || pathname.includes('/advance-search')) {
        return null;
    }

    const renderAssetFilters = () => {
        const props = { filters, options, onChange: handleFilterChange, setFilters, assetType };

        switch (assetType) {
            case 'subdomains':
                return <SubdomainFilters {...props} />;
            case 'ips':
                return <IpFilters {...props} />;
            case 'apis':
                return <ApiFilters {...props} />;
            case 'dns-records':
                return <DnsRecordFilters {...props} />;
            case 'repositories':
                return <RepositoryFilters {...props} />;
            case 'certificates':
                return <CertificateFilters {...props} />;
            case 'employees':
                return <EmployeeFilters {...props} />;
            case 'decomissioned':
            case 'staged':
                return <DecommissionedStagedFilters {...props} />;
            case 'applications':
                return <ApplicationFilters {...props} />;
            case 'workstation':
                return <WorkstationFilters {...props} />
            case 'object-storage':
                return <ObjectStorageFilters {...props} />
            case 'registries':
                return <RegistriesFilters {...props} />
            case 'certificates':
                return <GenericAssetFilters {...props} />;
            default:
                return <GenericAssetFilters {...props} />;
        }
    };

    return (
        <div className="flex gap-2 items-center flex-wrap">
            {renderAssetFilters()}
            <Button variant="outline" onClick={() => setFilters(() => ({}))}>
                <RefreshCcw />
                Reset
            </Button>
        </div>
    );
}

export default TableToolbar;