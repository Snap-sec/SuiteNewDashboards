import { useEffect, useMemo } from 'react';
import { ChartColumn, CircleAlert, Package, PackageOpen } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import {
  useGetAimAssetsQuery,
  useGetAimAssetStatsQuery,
} from '@/services/asset-inventory/assets/assetsApi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import RePieChart from '@/components/custom/charts/reui/pie-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import PageHeading from '../../../../../components/custom/page-heading';
import useDebounce from '../../../../../hooks/use-debounce';
import EmptyScreen from '../assets-empty-screen';
import BulkUpdate from '../assets/components/bulk-update';
import AssetsList from '../components/assets-list';
import useGeneralStore from '../store';
import StatsCards from './components/workstation-stats-card';
import useStore from './store';

const toChartData = (obj) =>
  obj
    ? Object.entries(obj).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
        value,
      }))
    : [];

const toBarData = (items) =>
  items.map((d) => ({ name: d.name, count: d.value }));
const countKey = [{ key: 'count', label: 'Count' }];

const PLATFORM_COLORS = ['#008FFB', '#775DD0', '#FEB019', '#00E396', '#FF4560'];
const REGION_COLORS = [
  '#00E396',
  '#008FFB',
  '#775DD0',
  '#FEB019',
  '#FF4560',
  '#26a69a',
];
const RAM_COLORS = [
  '#FF4560',
  '#00E396',
  '#008FFB',
  '#FEB019',
  '#775DD0',
  '#546E7A',
];
const ARCH_COLORS = ['#008FFB', '#FF4560', '#FEB019', '#00E396'];
const VULN_COLORS = ['#FF4560', '#FF8C00', '#FEB019', '#00E396', '#008FFB'];
const STATUS_COLORS = ['#00E396', '#FF4560', '#FEB019'];

const ChartInfoHover = ({ text }) => (
  <DetailedHoverPopover
    buttonText={
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      >
        <CircleAlert className="h-4 w-4" />
      </Button>
    }
    showBadge={false}
    popoverTitle="About this Graph"
    popoverContent={<p className="text-muted-foreground">{text}</p>}
  />
);

const TAB_HEADINGS = {
  analytics: {
    title: 'Workstation Inventory',
    description:
      'Analyze workstation endpoint metrics, OS distributions, and device compliance status.',
  },
  inventory: {
    title: 'Workstation Inventory',
    description:
      'Monitor, view, and manage all organization workstations, laptops, and endpoint devices.',
  },
};

function Workstations() {
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
      type: 'workstation',
      ...filters,
    },
    { skip: tabFromUrl !== 'inventory' },
  );

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    isError: isStatsError,
  } = useGetAimAssetStatsQuery('workstation', {
    skip: tabFromUrl !== 'analytics',
  });

  // Chart data
  const platformDistribution = useMemo(
    () => toChartData(statsData?.platform_distribution),
    [statsData],
  );
  const regionDistribution = useMemo(
    () => toChartData(statsData?.region_distribution),
    [statsData],
  );
  const ramDistribution = useMemo(
    () => toChartData(statsData?.ram_distribution),
    [statsData],
  );
  const architectureDistribution = useMemo(
    () => toChartData(statsData?.architecture_distribution),
    [statsData],
  );
  const vulnDistribution = useMemo(() => {
    const v = statsData?.vulnerability_distribution || {};
    return {
      name: 'Critical',
      count: v.critical || 0,
      name: 'High',
      count: v.high || 0,
      name: 'Medium',
      count: v.medium || 0,
      name: 'Low',
      count: v.low || 0,
      name: 'Info',
      count: v.info || 0,
    };
  }, [statsData]);
  const statusDistribution = useMemo(
    () => toChartData(statsData?.status_distribution),
    [statsData],
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Platform Distribution - PieChart */}
                <RePieChart
                  title="Platform Distribution"
                  titleBadge={
                    <ChartInfoHover text="This graph displays the distribution of operating system platforms running on the workstations." />
                  }
                  data={platformDistribution}
                  colors={PLATFORM_COLORS}
                  height={260}
                  isLoading={statsLoading}
                />

                {/* Region Distribution - PieChart */}
                <RePieChart
                  title="Region Distribution"
                  titleBadge={
                    <ChartInfoHover text="This graph shows the geographical region distribution of the workstations." />
                  }
                  data={regionDistribution}
                  colors={REGION_COLORS}
                  height={260}
                  isLoading={statsLoading}
                />

                {/* RAM Distribution - DonutChart */}
                <DonutChart
                  title="RAM Distribution"
                  titleBadge={
                    <ChartInfoHover text="This graph illustrates the distribution of installed RAM capacity across the workstations." />
                  }
                  data={ramDistribution}
                  colors={RAM_COLORS}
                  centerLabel="Total"
                  centerValue={ramDistribution.reduce((s, d) => s + d.value, 0)}
                  height={260}
                  isLoading={statsLoading}
                />

                {/* Architecture Distribution - BarChart */}
                <ReBarChart
                  title="Architecture Distribution"
                  titleBadge={
                    <ChartInfoHover text="This graph breaks down the workstations by their processor architecture." />
                  }
                  data={toBarData(architectureDistribution)}
                  xKey="name"
                  keys={countKey}
                  colors={ARCH_COLORS}
                  distributed
                  height={260}
                  xTickFormatter={(v) => v}
                  isLoading={statsLoading}
                />

                {/* Vulnerability Distribution - BarChart */}
                <ReBarChart
                  title="Vulnerability Distribution"
                  titleBadge={
                    <ChartInfoHover text="This graph provides a count of workstations categorized by vulnerability severity." />
                  }
                  data={vulnDistribution}
                  xKey="name"
                  keys={countKey}
                  colors={VULN_COLORS}
                  distributed
                  height={260}
                  xTickFormatter={(v) => v}
                  isLoading={statsLoading}
                />

                {/* Status Distribution - DonutChart */}
                <DonutChart
                  title="Status Distribution"
                  titleBadge={
                    <ChartInfoHover text="This graph shows the current operational status of the workstations." />
                  }
                  data={statusDistribution}
                  colors={STATUS_COLORS}
                  centerLabel="Total"
                  centerValue={statusDistribution.reduce(
                    (s, d) => s + d.value,
                    0,
                  )}
                  height={260}
                  isLoading={statsLoading}
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

export default Workstations;
