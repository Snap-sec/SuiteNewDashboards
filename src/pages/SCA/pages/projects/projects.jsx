import React, { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { decodeFilters } from '@/lib/utils';
import useDebounce from '@/hooks/use-debounce';
import {
  useDeleteScaProjectMutation,
  useGetScaProjectsQuery,
  useScanScaProjectMutation,
} from '@/services/sca/projectsApi';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import { ProjectsKpiCards } from './components/projects-kpi-cards';
import { ProjectsTable } from './components/projects-table';
import useStore from './store';

export default function SCAProjectsPage() {
  const navigate = useNavigate();
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [debouncedSearch, filters, setPagination]);

  // Backend API Hooks
  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetScaProjectsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    ...decodeFilters(filters),
  });

  const [scanScaProject] = useScanScaProjectMutation();
  const [deleteScaProject] = useDeleteScaProjectMutation();

  const projectsList = useMemo(() => apiData?.data?.projects || [], [apiData]);
  const paginationMeta = apiData?.data?.pagination || {};
  const stats = apiData?.data?.stats || {
    totalRepos: 0,
    dependenciesScanned: 0,
    policyViolations: 0,
    compliantRepos: 0,
    passingRate: '100.0%',
  };

  // Handlers

  const handleTriggerScan = async (id, name) => {
    try {
      await scanScaProject(id).unwrap();
      toast.success(`SCA scan completed for repository '${name}'`);
    } catch {
      toast.success(`SCA scan initiated for '${name}'`);
    }
  };

  const handleDelete = async (id, name) => {
    toast.promise(deleteScaProject(id).unwrap(), {
      loading: `Removing repository '${name}'...`,
      success: () => {
        if (projectsList.length === 1 && pagination?.pageIndex > 0) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex - 1,
          }));
        }
        return `Repository '${name}' removed successfully.`;
      },
      error: `Failed to remove repository '${name}'.`,
    });

  };

  const hasFilters = Object.keys(filters || {}).length > 0;

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isError &&
    !isLoading &&
    !apiData?.data?.stats?.totalRepos &&
    !searchQuery &&
    !hasFilters
  )
    return <EmptyScreen />;

  return (
    <div className="p-4 flex flex-col w-full">
      <Helmet>
        <title>SCA | Code Repos</title>
      </Helmet>

      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <PageHeading
          title="Code Repositories"
          description="Monitor source-code repositories, package manifests, and third-party dependencies to identify vulnerable components and track software supply-chain risk."
        />

        {/* <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            className="gap-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="size-4" />
            <span>Import Repository</span>
          </Button>
        </div> */}
      </div>

      {/* Top Metrics Row */}
      <ProjectsKpiCards stats={stats} isLoading={isLoading} />

      {/* Projects DataGrid Table */}
      <ProjectsTable
        projectsList={projectsList}
        advancedFilters={apiData?.data?.advanced_filters}
        isLoading={isLoading || isFetching}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        paginationMeta={paginationMeta}
        pagination={pagination}
        setPagination={setPagination}
        navigate={navigate}
        handleTriggerScan={handleTriggerScan}
        handleDelete={handleDelete}
      />
    </div>
  );
}
