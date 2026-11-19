import { useEffect } from 'react';
import { ArrowBigRight } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import { ErrorScreen } from '@/components/common/error-screen';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import useDebounce from '../../../../hooks/use-debounce';
import { useGetAimGlobalAssetsQuery } from '../../../../services/asset-inventory/assets/assetsApi';
import RefreshVmAdapter from './components/actions/refresh-vm-adapter';
import AssetList from './components/asset-list';
import AssetsDistributionColumnGraph from './components/assets-distribution-column-graph';
import AssetSeverityDistribution from './components/graph/asset-severity-distribution';
import RiskDistributionColumnGraph from './components/risk-distribution-column-graph';
import StatsCards from './components/stats-cards';
import VulnerabilitiesAssetsPiechart from './components/vulnerabilities-assets-piechart';
import useStore from './store';


function Assets() {
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
  });

  if (isError) return <ApiErrorHandler error={error} />

  if (
    !isError &&
    !assetsLoading &&
    !assetsData?.data?.pagination?.total &&
    !debouncedSearch &&
    !Object.keys(filters)?.length
  )
    return (
      <EmptyScreen
        title="No Assets Found"
        subTitle="Your asset list is currently empty. Please try installing a relevant adapter to begin."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Link to="/vm/integrations">
              <Button variant="primary">
                <ArrowBigRight /> Install Adapter
              </Button>
            </Link>
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>UniRisk | Assets</title>
      </Helmet>

      <div className="flex items-center gap-2 justify-between mb-1">
        <PageHeading
          title="Asset Catalog"
          description="Maintain a centralized inventory of all organizational assets and their security posture."
        />
        <AuthorityGuard forbidRoles={'Auditor'}>
          <RefreshVmAdapter />
        </AuthorityGuard>
      </div>

      <StatsCards
        statsData={assetsData?.data?.metrics}
        statsLoading={assetsLoading || isFetching}
      />

      <div className="flex gap-4 justify-between mt-4">
        {/* <RiskDistributionColumnGraph
          assetsData={statsData}
          assetsLoading={statsLoading || assetsLoading}
        /> */}
        <AssetsDistributionColumnGraph
          assetsData={assetsData?.data?.charts}
          assetsLoading={assetsLoading || isFetching}
        />

        <VulnerabilitiesAssetsPiechart
          statsData={assetsData?.data?.metrics}
          statsLoading={assetsLoading || isFetching}
        />

        <AssetSeverityDistribution
          statsData={assetsData?.data?.charts?.asset_severity_distribution}
          statsLoading={assetsLoading || isFetching}
        />
      </div>

      <div className="mt-4">
        <AssetList
          data={assetsData?.data || []}
          isLoading={assetsLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

export default Assets;