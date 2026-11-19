import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import PageHeading from '@/components/custom/page-heading';
import { useGetScaActionPlanQuery } from '@/services/sca/actionPlanApi';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';

import { ActionPlanKpiCards } from './components/action-plan-kpi-cards';
import { ActionPlanTable } from './components/action-plan-table';
import RefreshPlanAction from './components/actions/refresh-plan';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';

export default function SCAActionPlanPage() {
  const navigate = useNavigate();
  const rawSearchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const [copiedId, setCopiedId] = useState(null);

  const debouncedSearch = useDebounce(rawSearchQuery, 400);

  // Reset page when filters or search query change, to avoid wrong data fetching
  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [JSON.stringify(filters), debouncedSearch, setPagination]);

  const { data: apiRes, isLoading, isFetching, refetch, isError, error } = useGetScaActionPlanQuery({
    search: debouncedSearch || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    sortBy: sorting?.[0]?.id || undefined,
    sortOrder: sorting?.[0]?.desc ? 'desc' : (sorting?.[0] ? 'asc' : undefined),
  });

  const actionPlanList = apiRes?.data?.actionPlan || [];
  const paginationMeta = apiRes?.data?.pagination || {};
  const stats = apiRes?.data?.stats || {
    totalActionableUpgrades: 0,
    maxVulnsResolvedBySingleUpgrade: 0,
    totalVulnsAddressable: 0,
    criticalVulnsRemediated: 0,
    highVulnsRemediated: 0,
  };

  const handleCopyCommand = (cmd, id) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    toast.success('Remediation command copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportPlan = () => {
    if (actionPlanList.length === 0) {
      toast.error('No action plan items available to export');
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(actionPlanList, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `sca-remediation-action-plan-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Remediation action plan exported successfully.');
  };

  if (isError) return <ApiErrorHandler error={error} />

  if (!debouncedSearch && !Object.keys(filters || {})?.length && !isError && !isLoading && !isFetching && !stats?.totalVulnsAddressable)
    return <EmptyScreen />

  return (
    <div className="p-4 flex flex-col w-full">
      <Helmet>
        <title>SCA | Remediation Action Plan</title>
      </Helmet>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <PageHeading
          title="Remediation Action Plan"
          description="Prioritize actionable package upgrades based on their potential vulnerability reduction and remediation impact."
        />

        <div className="flex items-center gap-2.5">
          <RefreshPlanAction
            refetch={refetch}
            isLoading={isLoading}
            isFetching={isFetching}
          />
          <Button
            variant="outline"
            size="md"
            className="gap-2"
            onClick={handleExportPlan}
          >
            <Download className="size-4" />
            <span>Export Action Plan</span>
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <ActionPlanKpiCards stats={stats} isLoading={isLoading} />

      {/* Action Plan Table */}
      <ActionPlanTable
        actionPlanList={actionPlanList}
        advancedFilters={apiRes?.data?.advanced_filters}
        isLoading={isLoading}
        isFetching={isFetching}
        searchQuery={rawSearchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        paginationMeta={paginationMeta}
        pagination={pagination}
        setPagination={setPagination}
        navigate={navigate}
        handleCopyCommand={handleCopyCommand}
        copiedId={copiedId}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}
