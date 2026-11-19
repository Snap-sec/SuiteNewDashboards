import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import PageHeading from '@/components/custom/page-heading';
import { useGetScaDependenciesQuery } from '@/services/sca/dependenciesApi';
import useStore from './store';

import { DependenciesKpiCards } from './components/dependencies-kpi-cards';
import { DependenciesTable } from './components/dependencies-table';
import ReindexManifestsAction from './components/actions/reindex-manifests';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';

export default function SCADependenciesPage() {
  const navigate = useNavigate();
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);

  // Query Real Scanned SBOM Dependencies
  const { data: apiRes, isLoading, isFetching, refetch, isError, error } = useGetScaDependenciesQuery({
    search: searchQuery || undefined,
    type: filters.type ? decodeURIComponent(filters.type) : undefined,
    parentType: filters.parentType ? decodeURIComponent(filters.parentType) : undefined,
    ecosystem: filters.ecosystem ? decodeURIComponent(filters.ecosystem) : undefined,
    status: filters.status ? decodeURIComponent(filters.status) : undefined,
    outdatedStatus: filters.outdatedStatus ? decodeURIComponent(filters.outdatedStatus) : undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const dependenciesList = apiRes?.data?.dependencies || [];
  const paginationMeta = apiRes?.data?.pagination || {};
  const stats = apiRes?.data?.stats || {
    totalPackages: 0,
    directDependencies: 0,
    transitiveDependencies: 0,
    outdatedPackages: 0,
  };

  if (isError) return <ApiErrorHandler error={error} />

  if (!isError && !isLoading && !apiRes?.data?.stats?.totalPackages)
    return <EmptyScreen />

  return (
    <div className="p-4 flex flex-col w-full">
      <Helmet>
        <title>SCA | Dependencies</title>
      </Helmet>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <PageHeading
          title="Dependencies"
          description="Track direct and transitive open-source dependencies, versions, relationships, and associated security risks across your repositories."
        />

        <div className="flex items-center gap-2.5">
          <ReindexManifestsAction refetch={refetch} />
        </div>
      </div>

      {/* Top Metrics Row */}
      <DependenciesKpiCards stats={stats} isLoading={isLoading || isFetching} />

      {/* Main Dependencies Table Card */}
      <DependenciesTable
        dependenciesList={dependenciesList}
        advancedFilters={apiRes?.data?.advanced_filters}
        isLoading={isLoading || isFetching}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        paginationMeta={paginationMeta}
        pagination={pagination}
        setPagination={setPagination}
        navigate={navigate}
      />
    </div>
  );
}
