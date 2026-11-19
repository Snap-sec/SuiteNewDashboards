import { useEffect } from 'react';
import { ChartColumn, Package, PackageOpen } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import {
  useGetAimAssetsQuery,
  useGetAimAssetStatsQuery,
} from '@/services/asset-inventory/assets/assetsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '../../../../../components/custom/page-heading';
import useDebounce from '../../../../../hooks/use-debounce';
import EmptyRegistries from '../assets-empty-screen';
import EmptyScreen from '../assets-empty-screen';
import BulkUpdate from '../assets/components/bulk-update';
import AssetsList from '../components/assets-list';
import useGeneralStore from '../store';
import EnvironmentDistributionChart from './components/charts/environment-distribution-chart';
import SeverityDistributionChart from './components/charts/serverity-distribution-chart';
import VulnerabiliyDistributionChart from './components/charts/vulnerability-distribution-chart';
import StatsCards from './components/registries-stats-card';
import useStore from './store';

const TAB_HEADINGS = {
  analytics: {
    title: 'Container Registries',
    description:
      'Analyze container registry metrics, image scan coverage, and repository trends.',
  },
  inventory: {
    title: 'Container Registries',
    description:
      'View and manage container registries, repositories, image tags, and security findings.',
  },
};

function Registries() {
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
    data: assetsData,
    isLoading: assetsLoading,
    isFetching: assetsFetching,
    isError: isAssetsError,
    error: assetsError,
  } = useGetAimAssetsQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(sorting?.length
        ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
        : {}),
      search: debouncedSearch,
      type: 'registry',
      ...filters,
    },
    { skip: tabFromUrl !== 'inventory' },
  );

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: isStatsError,
    error: statsError,
  } = useGetAimAssetStatsQuery('registry', {
    skip: tabFromUrl !== 'analytics',
  });

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
              <StatsCards
                statsData={statsData?.metrics}
                statsLoading={statsLoading}
              />

              <div className="flex gap-4 justify-between mt-4">
                <SeverityDistributionChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />

                <VulnerabiliyDistributionChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />

                {/* <EnvironmentDistributionChart
              statsData={statsData}
              statsLoading={statsLoading}
            /> */}
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

export default Registries;
