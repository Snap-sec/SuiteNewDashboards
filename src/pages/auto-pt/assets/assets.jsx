import { useEffect, useState } from 'react';
import { ArrowBigRight, Plug } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/use-debounce';
import { useGetAimGlobalAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import { ErrorScreen } from '@/components/common/error-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import RefreshVmAdapter from './components/actions/refresh-vm-adapter';
import AssetGroupList from './components/asset-group-list';
import AssetList from './components/asset-list';
import AssetsDistributionColumnGraph from './components/assets-distribution-column-graph';
import AssetSeverityDistribution from './components/graph/asset-severity-distribution';
import RiskDistributionColumnGraph from './components/risk-distribution-column-graph';
import StatsCards from './components/stats-cards';
import VulnerabilitiesAssetsPiechart from './components/vulnerabilities-assets-piechart';
import useStore from './store';


function Assets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab')?.toLowerCase();
  const tabFromUrl =
    rawTab === 'asset-catalog' || rawTab === 'catalog'
      ? 'asset-catalog'
      : 'asset-groups';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const search = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [search, JSON.stringify(filters)]);

  const {
    data: assetsData,
    isLoading: assetsLoading,
    error: assetsError,
    isFetching,
    isError,
    error,
  } = useGetAimGlobalAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length
      ? {
        sortBy:
          sorting[0]?.id == 'TotalVulns'
            ? 'security.open_vulns'
            : sorting[0]?.id,
        sort: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : {}),
    search: debouncedSearch,
    ...filters,
  }, { skip: activeTab !== 'asset-catalog' });

  const isCatalogEmpty =
    !isError &&
    !assetsLoading &&
    !assetsData?.data?.pagination?.total &&
    !debouncedSearch &&
    !Object.keys(filters)?.length;

  return (
    <div className="p-4">
      <Helmet>
        <title>Strike | Assets</title>
      </Helmet>

      <div className="flex items-center gap-2 justify-between">
        <PageHeading
          title={
            activeTab === 'asset-groups' ? 'Asset Groups' : 'Asset Catalog'
          }
          description={
            activeTab === 'asset-groups'
              ? 'View and organize assets into groups for streamlined vulnerability management.'
              : 'Maintain a centralized inventory of all organizational assets and their security posture.'
          }
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList variant="line" size="md" className="border-b">
          <TabsTrigger value="asset-groups">Asset Groups</TabsTrigger>
          <TabsTrigger value="asset-catalog">Asset Catalog</TabsTrigger>
        </TabsList>

        <TabsContent value="asset-groups">
          <div className="mt-4">
            <AssetGroupList />
          </div>
        </TabsContent>

        <TabsContent value="asset-catalog">
          <div className="mt-4">
            {isError ? (
              <ApiErrorHandler error={error} />
            ) : isCatalogEmpty ? (
              <EmptyScreen
                title="No Assets Available"
                subTitle="Your asset list is currently empty. Please try installing a relevant integration to begin."
                engage={
                  <AuthorityGuard forbidRoles={['Auditor']}>
                    <Button mode="link" underlined="dashed" asChild>
                      <Link to="/assetinventory/adapters">
                        <Plug /> Browse Integrations
                      </Link>
                    </Button>
                  </AuthorityGuard>
                }
              />
            ) : (
              <AssetList
                data={assetsData?.data || []}
                isLoading={assetsLoading}
                isFetching={isFetching}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Assets;