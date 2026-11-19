import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { decodeFilters } from '@/lib/utils';
import useDebounce from '@/hooks/use-debounce';
import {
  useDeleteSastProjectMutation,
  useGetSastProjectsQuery,
} from '@/services/sast/projectsApi';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import { ProjectsKpiCards } from './components/projects-kpi-cards';
import { ProjectsTable } from './components/projects-table';
import useStore from './store';

export default function SASTProjectsPage() {
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

  // Backend API Hook
  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetSastProjectsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    ...decodeFilters(filters),
  });

  const [deleteSastProject] = useDeleteSastProjectMutation();

  const rawProjects = apiData?.data?.projects || apiData?.data?.data || apiData?.data || apiData?.projects || [];
  const projectsList = useMemo(() => (Array.isArray(rawProjects) ? rawProjects : []), [rawProjects]);

  const paginationMeta = apiData?.data?.pagination || apiData?.pagination || {};
  const stats = apiData?.data?.stats || apiData?.stats || {
    totalRepos: projectsList.length,
    dependenciesScanned: 0,
    policyViolations: 0,
    compliantRepos: projectsList.length,
    passingRate: '100.0%',
  };

  const handleDelete = async (id, name) => {
    toast.promise(deleteSastProject(id).unwrap(), {
      loading: `Removing project '${name}'...`,
      success: () => {
        if (projectsList.length === 1 && pagination?.pageIndex > 0) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex - 1,
          }));
        }
        return `Project '${name}' removed successfully.`;
      },
      error: `Failed to remove project '${name}'.`,
    });
  };

  const hasFilters = Object.keys(filters || {}).length > 0;

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isError &&
    !isLoading &&
    projectsList.length === 0 &&
    !searchQuery &&
    !hasFilters
  )
    return (
      <div className="p-4 flex flex-col gap-5 w-full">
        <Helmet>
          <title>SAST | Projects</title>
        </Helmet>
        <EmptyScreen title="No Projects Found" subTitle="There are currently no SAST projects available." />
      </div>
    );

  return (
    <div className="p-4 flex flex-col gap-5 w-full">
      <Helmet>
        <title>SAST | Projects</title>
      </Helmet>

      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Projects"
          description="Monitored code repositories and target projects."
        />
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
        meta={apiData?.meta}
        pagination={pagination}
        setPagination={setPagination}
        navigate={navigate}
        handleDelete={handleDelete}
      />
    </div>
  );
}
