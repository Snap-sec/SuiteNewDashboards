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
import ApiErrorHandler from '@/components/common/api-error-handler';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import RePieChart from '@/components/custom/charts/reui/pie-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import PageHeading from '@/components/custom/page-heading';
import useDebounce from '../../../../../hooks/use-debounce';
import EmptyScreen from '../assets-empty-screen';
import BulkUpdate from '../assets/components/bulk-update';
import AssetsList from '../components/assets-list';
import useGeneralStore from '../store';
import StatsCards from './components/server-stats-card';
import useStore from './store';

// --- helpers ---
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

// --- color palettes ---
const OS_COLORS = ['#008FFB', '#775DD0', '#FEB019', '#00E396', '#FF4560'];
const REGION_COLORS = [
  '#00E396',
  '#008FFB',
  '#775DD0',
  '#FEB019',
  '#FF4560',
  '#26a69a',
];
const ROLE_COLORS = ['#FF4560', '#00E396', '#008FFB', '#FEB019', '#775DD0'];
const ARCH_COLORS = ['#008FFB', '#FF4560', '#FEB019', '#00E396'];
const VULN_COLORS = ['#FF4560', '#FF8C00', '#FEB019', '#00E396', '#008FFB'];
const STATUS_COLORS = ['#00E396', '#FF4560', '#FEB019'];

// --- info popover ---
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
    title: 'Server Inventory',
    description:
      'Monitor server distribution, operating system breakdowns, and infrastructure health metrics.',
  },
  inventory: {
    title: 'Server Inventory',
    description:
      'Discover, view, and manage all physical and cloud servers across your infrastructure.',
  },
};

function Servers() {
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

  const [searchParams, setSearchParams] = useSearchParams();
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

  // --- data fetching ---
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
      type: 'server',
      ...filters,
    },
    { skip: tabFromUrl !== 'inventory' },
  );

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: isStatsError,
    error: statsError,
  } = useGetAimAssetStatsQuery('server', {
    skip: tabFromUrl !== 'analytics',
  });

  // --- chart data ---
  const osDistribution = useMemo(
    () => toChartData(statsData?.platform_distribution),
    [statsData],
  );
  const regionDistribution = useMemo(
    () => toChartData(statsData?.region_distribution),
    [statsData],
  );
  const envDistribution = useMemo(
    () => toChartData(statsData?.environment_distribution),
    [statsData],
  );
  const archDistribution = useMemo(
    () => toChartData(statsData?.architecture_distribution),
    [statsData],
  );
  const vulnSeverity = useMemo(() => {
    const v = statsData?.vuln_distribution || {};
    return [
      { name: 'Critical', count: v.critical || 0 },
      { name: 'High', count: v.high || 0 },
      { name: 'Medium', count: v.medium || 0 },
      { name: 'Low', count: v.low || 0 },
      { name: 'Info', count: v.info || 0 },
    ];
  }, [statsData]);
  const statusDistribution = useMemo(
    () => toChartData(statsData?.status_distribution),
    [statsData],
  );

  // --- empty state ---
  if (
    !statsError &&
    !isAssetsError &&
    tabFromUrl === 'analytics' &&
    !statsData?.metrics?.total &&
    !statsLoading
  )
    return (
      <EmptyScreen
        showButton
        title="No servers have been detected so far."
        subTitle="Please connect the adapter to begin populating your inventory."
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
            {tabFromUrl === 'inventory' ? <PackageOpen /> : <Package />}
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* ── DASHBOARD TAB ─────────────────────────────────── */}
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
                {/* OS / Platform */}
                <RePieChart
                  title="OS Distribution"
                  titleBadge={
                    <ChartInfoHover text="Distribution of operating system platforms across servers." />
                  }
                  data={osDistribution}
                  colors={OS_COLORS}
                  height={260}
                  isLoading={statsLoading}
                />

                {/* Region */}
                <RePieChart
                  title="Region Distribution"
                  titleBadge={
                    <ChartInfoHover text="Geographical distribution of servers across regions and data-centres." />
                  }
                  data={regionDistribution}
                  colors={REGION_COLORS}
                  height={260}
                  isLoading={statsLoading}
                />

                {/* Environment */}
                <DonutChart
                  title="Environment Distribution"
                  titleBadge={
                    <ChartInfoHover text="Breakdown of servers by their environment (production, staging, dev, etc.)." />
                  }
                  data={envDistribution}
                  colors={ROLE_COLORS}
                  centerLabel="Total"
                  centerValue={envDistribution.reduce((s, d) => s + d.value, 0)}
                  height={260}
                  isLoading={statsLoading}
                />

                {/* Architecture */}
                <ReBarChart
                  title="Architecture Distribution"
                  titleBadge={
                    <ChartInfoHover text="Processor architecture breakdown (x86_64, ARM, etc.) across servers." />
                  }
                  data={toBarData(archDistribution)}
                  xKey="name"
                  keys={countKey}
                  colors={ARCH_COLORS}
                  distributed
                  height={260}
                  xTickFormatter={(v) => v}
                  isLoading={statsLoading}
                />

                {/* Vulnerability severity */}
                <ReBarChart
                  title="Vulnerability Severity"
                  titleBadge={
                    <ChartInfoHover text="Count of servers categorised by the highest-severity vulnerability they carry." />
                  }
                  data={vulnSeverity}
                  xKey="name"
                  keys={countKey}
                  colors={VULN_COLORS}
                  distributed
                  height={260}
                  xTickFormatter={(v) => v}
                  isLoading={statsLoading}
                />

                {/* Status */}
                <DonutChart
                  title="Status Distribution"
                  titleBadge={
                    <ChartInfoHover text="Operational status breakdown of servers (active, inactive, unknown)." />
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

        {/* ── INVENTORY TAB ─────────────────────────────────── */}
        <TabsContent value="inventory">
          {isAssetsError ? (
            <ApiErrorHandler error={assetsError} />
          ) : (
            <div className="mt-4">
              <AssetsList
                assetsData={assetsData || []}
                assetsLoading={assetsLoading}
                assetsFetching={assetsFetching}
                tableDetails={tableDetails}
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

export default Servers;
