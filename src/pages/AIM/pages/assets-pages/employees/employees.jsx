import { useEffect, useState } from 'react';
import { ChartColumn, Package, PackageOpen } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import PageHeading from '../../../../../components/custom/page-heading';
import useDebounce from '../../../../../hooks/use-debounce';
import {
  useGetAimAssetsQuery,
  useGetAimAssetStatsQuery,
} from '../../../../../services/asset-inventory/assets/assetsApi';
import EmptyScreen from '../assets-empty-screen';
import BulkUpdate from '../assets/components/bulk-update';
import useGeneralStore from '../store';
import { EmployeesCards } from './components/cards/employees-cards';
import StatsCards from './components/cards/employees-stats-cards';
import ActivityDistributionChart from './components/charts/activity-distribution-chart';
import TestingStatusByEnvironment from './components/charts/testing-satus-by-environment-chart';
import VendorDistributionPiechart from './components/charts/vendor-distributon-chart';
import useStore from './store';

const TAB_HEADINGS = {
  analytics: {
    title: 'Employee Inventory',
    description:
      'Analyze employee digital identities, department distributions, and account coverage.',
  },
  inventory: {
    title: 'Employee Inventory',
    description:
      'Map, view, and manage employee-linked accounts, devices, and associated digital assets.',
  },
};

function Employees() {
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

  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Tab states
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from URL
  const tabFromUrl = searchParams.get('tab') || 'inventory';
  const heading = TAB_HEADINGS[tabFromUrl] || TAB_HEADINGS.inventory;

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 20 }));
  }, [searchQuery, filters]);

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
      type: 'employee',
      ...filters,
      adapters: filters?.adapters || undefined,
      risk: filters?.risk || undefined,
      hasVulns: filters?.hasVulns || undefined,
      owners: filters?.owners || undefined,
      employeeType: filters?.employeeType || undefined,
      lastSeen: filters?.lastSeen || undefined,
    },
    {
      skip: tabFromUrl !== 'inventory',
    },
  );

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    isError: isStatsError,
  } = useGetAimAssetStatsQuery('employee', {
    skip: tabFromUrl !== 'analytics',
  });

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchValue);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, setSearchQuery]);

  if (
    !isAssetsError &&
    !isStatsError &&
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsSearching(value.length > 0);
  };

  // Get pagination data from statsData
  const currentPage = assetsData?.page || 1;
  const totalPages = assetsData?.totalPages || 0;

  return (
    <div className="p-4">
      <Helmet>
        <title>{`AssetIQ | ${heading.title}`}</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <PageHeading
          title={heading.title}
          description={heading.description}
        />
      </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <VendorDistributionPiechart
                  statsData={statsData?.vendor_distribution}
                  statsLoading={statsLoading}
                />

                <TestingStatusByEnvironment
                  statsData={statsData?.internal_external_distribution}
                  statsLoading={statsLoading}
                />

                <ActivityDistributionChart
                  statsData={statsData?.activity_distribution}
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
              {Object.keys(rowSelection || {}).length > 1 && <BulkUpdate />}
              <EmployeesCards
                data={assetsData}
                isLoading={assetsLoading}
                isFetching={assetsFetching}
                handleSearch={handleSearch}
                searchValue={searchValue}
                debouncedSearch={debouncedSearch}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Employees;
