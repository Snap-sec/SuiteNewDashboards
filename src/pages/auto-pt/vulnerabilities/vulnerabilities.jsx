import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/use-debounce';
import { useGetAutoPtVulnsQuery } from '@/services/auto-pt/autoPtVulnerabilityApi';
import { Button } from '@/components/ui/button';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import MetricsCard from './components/metrics-card';
import VulnList from './components/VulnList';
import useStore from './store';


// Utility to parse filters param (e.g., "listId:abc,severity:high")
function parseFiltersParam(filtersParam) {
  if (!filtersParam) return {};

  const separator = filtersParam.includes(';') ? ';' : ',';
  return filtersParam.split(separator).reduce((acc, pair) => {
    const [key, value] = pair.split(':');
    if (key && value) acc[key] = value;
    return acc;
  }, {});
}


function Vulnerabilities() {
  const navigate = useNavigate();

  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  // const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const sorting = useStore((state) => state.sorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const rawSearchQuery = useStore((state) => state.searchQuery);
  const debouncedSearch = useDebounce(rawSearchQuery, 400);

  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState(rawSearchQuery);
  const filtersRef = useRef([]);

  const [params] = useSearchParams();

  const rawType = params.get('type')?.toLowerCase()?.trim();
  const rawProjectTypes = params.get('project_types')?.toLowerCase()?.trim();
  const rawVulnType = params.get('vuln_type')?.toLowerCase()?.trim();
  const rawScanType = (
    params.get('scan_type') ||
    params.get('pentest_type')
  )?.toLowerCase()?.trim();

  const { resolvedFilterType, resolvedProjectTypes, resolvedVulnType, resolvedScanType } = useMemo(() => {
    let filterType = '';
    let projectTypes = rawProjectTypes || '';
    let vulnType = rawVulnType || '';
    let scanType = '';

    if (rawScanType === 'cloud' || rawVulnType === 'cloud' || rawType === 'cloud') {
      scanType = 'cloud';
    } else if (rawType === 'pentest' || rawType === 'vulnerability-scan' || rawType === 'code-security') {
      filterType = rawType;
      projectTypes = rawType;
      if (rawType === 'code-security') {
        vulnType = 'code-sca,code-sast';
      }
    } else if (!projectTypes && !vulnType && rawScanType) {
      if (rawScanType === 'web' || rawScanType === 'pentest') {
        projectTypes = 'pentest';
        filterType = 'pentest';
      } else if (rawScanType === 'network' || rawScanType === 'vulnerability-scan') {
        projectTypes = 'vulnerability-scan';
        filterType = 'vulnerability-scan';
      } else if (
        rawScanType === 'code-sca,code-sast' ||
        rawScanType === 'code' ||
        rawScanType === 'code-sca' ||
        rawScanType === 'code-sast'
      ) {
        vulnType = 'code-sca,code-sast';
        filterType = 'code-security';
      }
    }

    return {
      resolvedFilterType: filterType,
      resolvedProjectTypes: projectTypes,
      resolvedVulnType: vulnType,
      resolvedScanType: scanType,
    };
  }, [rawType, rawProjectTypes, rawVulnType, rawScanType]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, filters, setPagination, resolvedFilterType, resolvedProjectTypes, resolvedVulnType, resolvedScanType]);

  const { data, isLoading, isFetching, error, isError } = useGetAutoPtVulnsQuery({
    search: debouncedSearch,
    filters: params.get('filters'),
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(resolvedFilterType ? { type: resolvedFilterType } : {}),
    ...(resolvedScanType ? { scan_type: resolvedScanType } : {}),
    ...(resolvedProjectTypes && !resolvedFilterType ? { project_types: resolvedProjectTypes } : {}),
    ...(resolvedVulnType ? { vuln_type: resolvedVulnType } : {}),
    ...filters,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, sortOrder: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  const rawAdvancedFilters = data?.data?.advanced_filters || data?.advanced_filters;
  if (rawAdvancedFilters && rawAdvancedFilters.length > 0) {
    filtersRef.current = rawAdvancedFilters;
  }
  const supportedFilters = rawAdvancedFilters?.length ? rawAdvancedFilters : filtersRef.current;

  if (isError) return <ApiErrorHandler error={error} />;

  const vulnerabilitiesList =
    data?.data?.vulnerabilities ||
    (Array.isArray(data?.data) ? data?.data : []) ||
    [];

  const metrics =
    data?.data?.metrics ||
    data?.summary ||
    {};

  const totalCount =
    data?.data?.meta?.total ??
    data?.meta?.total ??
    data?.data?.totalItems ??
    data?.pagination?.total ??
    vulnerabilitiesList.length;

  const totalPages =
    (data?.data?.meta?.totalPages ??
      data?.meta?.totalPages ??
      data?.data?.totalPages ??
      data?.pagination?.pages) ||
    Math.ceil(totalCount / (pagination.pageSize || 25)) ||
    1;

  const metadata =
    data?.metadata ||
    data?.data?.metadata ||
    data?.meta?.metadata ||
    {};

  const hasActiveFilters = Boolean(
    params.get('filters') ||
    (filters &&
      Object.keys(filters).some((key) => {
        if (key === 'supressed') return false;
        const val = filters[key];
        return val !== undefined && val !== '' && val !== null;
      }))
  );

  const hasSearch = Boolean(rawSearchQuery?.trim() || debouncedSearch?.trim());

  if (
    !isLoading &&
    !isFetching &&
    !hasSearch &&
    !hasActiveFilters &&
    (!data || !totalCount || vulnerabilitiesList.length === 0)
  )
    return (
      <>
        <Helmet>
          <title>Strike | Vulnerabilities</title>
        </Helmet>
        <EmptyScreen
          title="No Vulnerabilities Found"
          subTitle="When new vulnerabilities are found, they will show here."
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button mode="link" underlined="dashed" asChild>
                <Link to="/apt/pentests/create">
                  <Plus /> Create New Project
                </Link>
              </Button>
            </AuthorityGuard>
          }
        />
      </>
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>Strike | Vulnerabilities</title>
      </Helmet>

      <PageHeading
        title="Vulnerabilities"
        description="Identify, assess, track, and manage security risks across your source code through penetration testing, vulnerability scanning, cloud security assessments, and code security analysis."
      />

      <div>
        <MetricsCard metrics={metrics} isLoading={isLoading} />
      </div>

      <div className="mt-4">
        <VulnList
          data={{
            metadata,
            totalPages,
            totalItems: totalCount,
            userVulns: vulnerabilitiesList,
          }}
          supported_filters={supportedFilters}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

export default Vulnerabilities;