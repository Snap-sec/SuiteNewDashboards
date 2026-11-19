import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router';
import { useGetVsAssetsQuery } from '@/services/vs/vsApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';
import AddGroup from './components/add-group';
import AssetList from './components/asset-list';
import StatsCards from './components/stats-cards';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import { Button } from '../../../../components/ui/button';
import { ArrowRight } from 'lucide-react';

function Assets() {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const search = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const debouncedSearch = useDebounce(search, 400);

  const [params] = useSearchParams();

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 25 }));
  }, [debouncedSearch, filters]);

  // set param filters in adavance
  useEffect(() => {
    if (params.get('groupId')) {
      setFilters(() => ({
        groupId: params.get('groupId'),
      }));
    }
    // } else {
    //   setFilters(() => ({}));
    // }
  }, []);

  const {
    data: assetsData,
    isLoading: assetsLoading,
    isFetching: assetsFetching,
    error: assetsError,
    isError: isAssetsError
  } = useGetVsAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    search: debouncedSearch,
    ...filters,
  });

  if (isAssetsError) {
    return <ApiErrorHandler error={assetsError} />;
  }

  if (!assetsLoading && !isAssetsError && assetsData?.stats?.totalAssets == 0 && !debouncedSearch && !Object.keys(filters)?.length)
    return (
      <EmptyScreen
        title="No Assets Found"
        subTitle="Your asset list is currently empty. Please try installing a relevant adapter to begin."
        engage={<Button asChild><Link to="/vs/settings"><ArrowRight />Goto Settings</Link></Button>}
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>VS | Assets</title>
      </Helmet>

      <PageHeading title="Assets" description="View and monitor assets, vulnerabilities, scan activity, and security coverage." />

      <StatsCards statsData={assetsData?.stats} statsLoading={assetsLoading} />


      {/* Model will be here */}

      <div className="mt-4">
        <AssetList
          data={assetsData}
          isLoading={assetsLoading}
          isFetching={assetsFetching}
        />
      </div>

      <AddGroup />
    </div>
  );
}

export default Assets;
