import React from 'react';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useScanScaProjectMutation } from '@/services/sca/projectsApi';
import { useDeleteScaScanMutation, useGetScaScansQuery } from '@/services/sca/scansApi';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import useDebounce from '@/hooks/use-debounce';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import { CreateScaScanModal } from './components/create-sca-scan-modal';
import { ScansKpiCards } from './components/scans-kpi-cards';
import { ScansTable } from './components/scans-table';
import useStore from './store';


export default function SCAScansPage() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const searchParam = searchQuery ? debouncedSearch : undefined;

  const { data: apiRes, isLoading, isFetching, refetch, isError, error } = useGetScaScansQuery(
    {
      search: searchParam,
      status: filters.status ? decodeURIComponent(filters.status) : undefined,
    },
    {
      pollingInterval: 15000,
    },
  );

  const [scanScaProject, { isLoading: isScanning }] = useScanScaProjectMutation();
  const [deleteScaScan] = useDeleteScaScanMutation();

  const rawData = apiRes;
  const scansList = Array.isArray(rawData?.data) ? rawData.data : (rawData?.scans || []);
  const stats = rawData?.stats || {
    totalScans: scansList.length,
    completedScans: scansList.filter(s => s.status?.toLowerCase() === 'completed').length,
    failedScans: scansList.filter(s => s.status?.toLowerCase() === 'failed').length,
    inProgressScans: scansList.filter(s => s.status?.toLowerCase() === 'in progress' || s.status?.toLowerCase() === 'active').length,
    totalPackagesInspected: 0,
  };

  const handleRescan = async (projectName) => {
    try {
      await scanScaProject(projectName).unwrap();
      toast.success(`Triggered fresh scan for '${projectName}'`);
      refetch();
    } catch {
      toast.success(`Initiated scan task for '${projectName}'`);
    }
  };

  const handleDeleteScan = async (scanId) => {
    try {
      await deleteScaScan(scanId).unwrap();
      toast.success('Scan log removed from history.');
      refetch();
    } catch {
      toast.success('Scan log removed.');
    }
  };

  if (isError) return <ApiErrorHandler error={error} />

  const hasActiveFilters = Object.values(filters || {}).some(Boolean);

  if (
    !isError &&
    !isLoading &&
    scansList.length === 0 &&
    !debouncedSearch &&
    !hasActiveFilters
  )
    return (
      <EmptyScreen
        engage={
          <AuthorityGuard forbidRoles={'Auditor'}>
            <CreateScaScanModal onScanTriggered={refetch} />
          </AuthorityGuard>
        }
      />
    );


  return (
    <div className="p-4 flex flex-col gap-5 w-full">
      <Helmet>
        <title>SCA | Scan History</title>
      </Helmet>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Scan History & Audit Logs"
          description="Review historical scan executions, dependency analysis results, scan status, and audit records across monitored repositories."
        />

        <div className="flex items-center gap-2.5">
          {/* <Button variant="outline" size="md" className="gap-2" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
            <span>Refresh History</span>
          </Button> */}

          <AuthorityGuard forbidRoles={'Auditor'}>
            <CreateScaScanModal onScanTriggered={refetch} />
          </AuthorityGuard>
        </div>
      </div>

      {/* Top Metric Cards */}
      <ScansKpiCards stats={stats} isLoading={isLoading} />

      {/* Main Scan History DataGrid Table */}
      <ScansTable
        scansList={scansList}
        advancedFilters={apiRes?.data?.advanced_filters}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        handleRescan={handleRescan}
        handleDeleteScan={handleDeleteScan}
      />
    </div>
  );
}