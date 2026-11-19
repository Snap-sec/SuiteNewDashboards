import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeading from '@/components/custom/page-heading';
import {
  useGetSastVulnerabilitiesQuery,
  useRunVulnerabilityScanMutation,
} from '@/services/sast/vulnerabilitiesApi';
import useStore from './store';

import { VulnerabilitiesKpiCards } from './components/vulnerabilities-kpi-cards';
import { VulnerabilitiesTable } from './components/vulnerabilities-table';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';

export default function SASTVulnerabilitiesPage() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);

  const { data: apiRes, isLoading, isFetching, refetch, isError, error } = useGetSastVulnerabilitiesQuery({
    search: searchQuery || undefined,
    severity: filters.severity ? decodeURIComponent(filters.severity) : undefined,
    projectName: filters.projectName ? decodeURIComponent(filters.projectName) : undefined,
    status: filters.status ? decodeURIComponent(filters.status) : undefined,
    ecosystem: filters.ecosystem ? decodeURIComponent(filters.ecosystem) : undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const [runVulnerabilityScan, { isLoading: isScanning }] = useRunVulnerabilityScanMutation();

  const vulnsList = apiRes?.data?.vulnerabilities || [];
  const availableProjects = apiRes?.data?.availableProjects || ['docs', 'updater', 'notify', 'internalNetworkScan'];
  const availableEcosystems = apiRes?.data?.availableEcosystems || ['npm', 'go', 'pypi', 'maven', 'cargo'];
  const paginationMeta = apiRes?.data?.pagination || {};
  const totalCount = paginationMeta.total ?? vulnsList.length;
  const totalPages = paginationMeta.totalPages ?? 1;
  const stats = apiRes?.data?.stats || {
    totalVulnerabilities: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const handleRunScan = async () => {
    try {
      const res = await runVulnerabilityScan('all').unwrap();
      toast.success(
        `Security scan engine completed! Scanned ${res.data?.scannedProjectsCount || 0} repos (${res.data?.totalVulnerabilitiesFound || 0} CVEs found).`,
      );
      refetch();
    } catch (err) {
      toast.error(`Security scan execution failed: ${err.message}`);
    }
  };

  if (isError) return <ApiErrorHandler error={error} />

  if (!isError && !isLoading && !apiRes?.data?.stats?.totalVulnerabilities)
    return <EmptyScreen />

  const disableSync =
    apiRes?.metadata?.vm_configuration_exists === false ||
    apiRes?.data?.metadata?.vm_configuration_exists === false;

  return (
    <div className="p-4 flex flex-col gap-5 w-full">
      <Helmet>
        <title>SAST | Vulnerabilities</title>
      </Helmet>

      {/* Page Heading & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Vulnerabilities (CVE Findings)"
          description="Real-time open-source vulnerability scanner findings across project manifest files."
        />

        {/* <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md" className="gap-2" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            className="gap-2"
            disabled={isScanning}
            onClick={handleRunScan}
          >
            {isScanning ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            <span>Run Security Scan</span>
          </Button>
        </div> */}
      </div>

      {/* Metrics Card Row */}
      <VulnerabilitiesKpiCards
        stats={stats}
        isLoading={isLoading || isFetching}
      />

      {/* Main Data Table */}
      <VulnerabilitiesTable
        vulnsList={vulnsList}
        advancedFilters={apiRes?.data?.advanced_filters}
        isLoading={isLoading || isFetching}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        availableProjects={availableProjects}
        availableEcosystems={availableEcosystems}
        totalCount={totalCount}
        totalPages={totalPages}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        handleRunScan={handleRunScan}
        isScanning={isScanning}
        disableSync={disableSync}
      />
    </div>
  );
}
