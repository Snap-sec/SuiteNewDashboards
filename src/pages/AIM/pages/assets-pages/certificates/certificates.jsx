import { useEffect } from 'react';
import { ChartColumn, Package, PackageOpen } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { useGetAimAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import PageHeading from '../../../../../components/custom/page-heading';
import useDebounce from '../../../../../hooks/use-debounce';
import { useGetAimAssetStatsQuery } from '../../../../../services/asset-inventory/assets/assetsApi';
import EmptyCertificates from '../assets-empty-screen';
import EmptyScreen from '../assets-empty-screen';
import BulkUpdate from '../assets/components/bulk-update';
import AssetsList from '../components/assets-list';
import MonthlyTrend from '../components/monthy-trend';
import useGeneralStore from '../store';
import StatsCards from './components/certificates-stats-card';
import IssuerCountryDistributionChart from './components/issuer-country-distribution-chart';
import SelfSignedDistributionChart from './components/self-signed-distribution-chart';
import SigningAuthorityDistributionPiechart from './components/signing-authority-distribution-piechart';
import ValidVsExpiredChart from './components/valid-vs-expired-chart';
import ValidityDistributionColumnGraph from './components/validity-distribution-column-graph';
import useStore from './store';

const TAB_HEADINGS = {
  analytics: {
    title: 'SSL Certificates',
    description:
      'Monitor certificate health metrics, issuer authority breakdown, and expiry timelines.',
  },
  inventory: {
    title: 'SSL Certificates',
    description:
      'View and manage all SSL/TLS certificates, validity periods, and associated domains.',
  },
};

function Certificates() {
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

  // Tab states
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from URL
  const tabFromUrl = searchParams.get('tab') || 'inventory';
  const heading = TAB_HEADINGS[tabFromUrl] || TAB_HEADINGS.inventory;

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 12 }));
  }, [searchQuery, filters]);

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    isError: isStatsError,
  } = useGetAimAssetStatsQuery('certificate', {
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
      type: 'certificate',
      ...filters,
    },
    {
      skip: tabFromUrl !== 'inventory',
    },
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
              <StatsCards
                statsData={statsData?.metrics}
                statsLoading={statsLoading}
              />

              <div className="flex gap-4 justify-between mt-4">
                <ValidVsExpiredChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />
                <SelfSignedDistributionChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />
                <IssuerCountryDistributionChart
                  statsData={statsData}
                  statsLoading={statsLoading}
                />
              </div>

              <div className="flex gap-4 justify-between mt-4 overflow-hidden -mt-2">
                {/* Certificate Expiration Timeline */}
                <ValidityDistributionColumnGraph
                  statsData={statsData}
                  statsLoading={statsLoading}
                />

                {/* Certificate Authority Distribution */}
                <SigningAuthorityDistributionPiechart
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
            <>
              <AssetsList
                assetsData={assetsData || []}
                assetsLoading={assetsLoading}
                assetsFetching={assetsFetching}
                tableDetails={tableDetails}
                filters={filters}
                setFilters={setFilters}
              />
              {Object.keys(rowSelection || {}).length > 1 && <BulkUpdate />}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Certificates;
