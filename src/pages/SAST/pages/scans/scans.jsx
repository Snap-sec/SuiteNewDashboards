import React from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import PageHeading from '@/components/custom/page-heading';
import { useGetSastScansQuery, useCreateSastScanMutation, useDeleteSastScanMutation } from '@/services/sast/scansApi';
import useStore from './store';

import { ScansKpiCards } from './components/scans-kpi-cards';
import { ScansTable } from './components/scans-table';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import { CreateScaScanModal } from './components/create-sca-scan-modal';

export default function SASTScansPage() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const { data: apiRes, isLoading, refetch, isError, error } = useGetSastScansQuery(
    {
      search: searchQuery || undefined,
      status: filters.status ? decodeURIComponent(filters.status) : undefined,
    },
    {
      pollingInterval: 15000,
    },
  );

  const [createSastScan] = useCreateSastScanMutation();
  const [deleteSastScan] = useDeleteSastScanMutation();

  const rawData = apiRes;
  const scansList = Array.isArray(rawData?.data?.scans)
    ? rawData.data.scans
    : Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData?.scans)
    ? rawData.scans
    : [];

  const stats = rawData?.data?.stats || rawData?.stats || {
    totalScans: scansList.length,
    completedScans: scansList.filter((s) => s.status?.toLowerCase() === 'completed').length,
    failedScans: scansList.filter((s) => s.status?.toLowerCase() === 'failed').length,
    inProgressScans: scansList.filter((s) => s.status?.toLowerCase() === 'in progress' || s.status?.toLowerCase() === 'active').length,
    totalPackagesInspected: 0,
  };

  const handleRescan = async (projectName, targetId) => {
    try {
      await createSastScan({
        targetType: targetId ? 'repo' : 'all',
        targetIds: targetId ? [targetId] : [],
      }).unwrap();
      toast.success(`Triggered fresh SAST scan for '${projectName}'`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || `Failed to initiate SAST scan for '${projectName}'`);
    }
  };

  const handleDeleteScan = async (scanId) => {
    try {
      await deleteSastScan(scanId).unwrap();
      toast.success('Scan log removed from history.');
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || 'Failed to remove scan log.');
    }
  };

  if (isError) return <ApiErrorHandler error={error} />;

  if (!isError && !isLoading && scansList.length === 0)
    return <EmptyScreen engage={<CreateScaScanModal onScanTriggered={refetch} />} />;

  return (
    <div className="p-4 flex flex-col gap-5 w-full">
      <Helmet>
        <title>SAST | Scan History</title>
      </Helmet>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Scan History & Audit Logs"
          description="Execution records for automated SAST code scans and static analysis."
        />

        <div className="flex items-center gap-2.5">
          <CreateScaScanModal onScanTriggered={refetch} />
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
