import { useEffect } from 'react';
import { ChartColumn, Package, PackageOpen } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { useGetAimAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import DonutChart from '../../../../../components/custom/charts/donut-chart';
import PageHeading from '../../../../../components/custom/page-heading';
import useDebounce from '../../../../../hooks/use-debounce';
import { useGetAimAssetStatsQuery } from '../../../../../services/asset-inventory/assets/assetsApi';
import EmptyRepostories from '../assets-empty-screen';
import EmptyScreen from '../assets-empty-screen';
import BulkUpdate from '../assets/components/bulk-update';
import AssetsList from '../components/assets-list';
import useGeneralStore from '../store';
import ActivityChart from './components/charts/activity-chart';
import ArchiveStatusChart from './components/charts/archive-status-chart';
import TechnologyDistributionChart from './components/charts/technology-distribution-chart';
import StatsCards from './components/repo-stats-card';
import RepoVisibilityChart from './components/repo-visibility-chart';
import ReposCreatedLastYearChart from './components/repos-created-last-year-chart';
import VulnerableVsSafeRepoChart from './components/vulnerable-vs-safe-repo-chart';
import useStore from './store';

const TAB_HEADINGS = {
  analytics: {
    title: 'Code Repositories',
    description:
      'Monitor repository activity trends, visibility distributions, and security insights.',
  },
  inventory: {
    title: 'Code Repositories',
    description:
      'View and manage code repositories, branches, permissions, and language distributions.',
  },
};

function Repositories() {
  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const setFilters = useStore((state) => state.setFilters);

  const rowSelection = useGeneralStore((state) => state.rowSelection);
  const setRowSelection = useGeneralStore((state) => state.setRowSelection);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Tab states
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from URL
  const tabFromUrl = searchParams.get('tab') || 'inventory';
  const heading = TAB_HEADINGS[tabFromUrl] || TAB_HEADINGS.inventory;

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 10 }));
  }, [searchQuery, filters]);

  const tableDetails = {
    pagination,
    sorting,
    searchQuery,
    filters,
    setPagination,
    setSearchQuery,
    setSorting,
    rowSelection,
    setRowSelection,
  };

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    isError: isStatsError,
  } = useGetAimAssetStatsQuery('repository', {
    skip: tabFromUrl !== 'analytics',
  });

  const {
    data: assetsData,
    isLoading: assetsLoading,
    isFetching: assetsFetching,
    error: assetsError,
    isError: isAssetsError,
  } = useGetAimAssetsQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(sorting?.length
        ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
        : {}),
      search: debouncedSearch,
      type: 'repository',
      ...filters,
    },
    { skip: tabFromUrl !== 'inventory' },
  );

  if (
    !isStatsError &&
    !isAssetsError &&
    tabFromUrl === 'analytics' &&
    !statsData?.metrics?.total &&
    !statsLoading
  )
    return (
      <EmptyScreen
        showButton
        title={'No assets have been detected so far.'}
        subTitle={
          'Please connect the adapter to begin populating your inventory.'
        }
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>{`AssetIQ | ${heading.title}`}</title>
      </Helmet>

      <PageHeading
        title={heading.title}
        description={heading.description}
      />

      <Tabs
        value={tabFromUrl}
        onValueChange={(value) => {
          setSearchParams((prev) => {
            prev.set('tab', value);
            return prev;
          });
        }}
      >
        <TabsList
          variant="line"
          size="md"
          className="w-full flex flex-wrap gap-1 md:gap-5"
        >
          <TabsTrigger value="analytics">
            <ChartColumn /> Analytics
          </TabsTrigger>
          <TabsTrigger value="inventory">
            {tabFromUrl == 'inventory' ? <PackageOpen /> : <Package />}
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          {isStatsError ? (
            <ApiErrorHandler error={statsError} />
          ) : (
            <>
              <div className="mb-4">
                <StatsCards
                  statsData={statsData?.metrics}
                  statsLoading={statsLoading}
                />
              </div>

              <div className="flex gap-4 justify-between mt-4">
                <VulnerableVsSafeRepoChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />
                <RepoVisibilityChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />
                <ReposCreatedLastYearChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />
              </div>

              {/* Show Charts */}
              <div className="flex gap-4 justify-between mt-4">
                <ActivityChart
                  statsData={statsData?.activity_distribution}
                  statsLoading={statsLoading}
                />

                <ArchiveStatusChart
                  statsData={statsData?.archived_distribution}
                  statsLoading={statsLoading}
                />

                <TechnologyDistributionChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          {isAssetsError ? (
            <ApiErrorHandler error={assetsError} />
          ) : (
            <div className="mt-4">
              <AssetsList
                assetsData={assetsData || []}
                assetsLoading={assetsLoading}
                tableDetails={tableDetails}
                assetsFetching={assetsFetching}
                filters={filters}
                setFilters={setFilters}
              />
              {Object.keys(rowSelection || {}).length > 1 && <BulkUpdate />}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Repositories;
