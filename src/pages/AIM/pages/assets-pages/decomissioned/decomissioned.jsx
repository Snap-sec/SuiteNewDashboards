import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';
import { useGetAimAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import PageHeading from '../../../../../components/custom/page-heading';
import {EmptyScreen} from "@/components/common/empty-screen";
import BulkUpdate from '../assets/components/bulk-update';
import AssetsList from '../components/assets-list';
import useGeneralStore from '../store';
import useDecomissionedStore from './store';

function Decomissioned() {
  const pagination = useDecomissionedStore((state) => state.pagination);
  const sorting = useDecomissionedStore((state) => state.sorting);
  const filters = useDecomissionedStore((state) => state.filters);
  const searchQuery = useDecomissionedStore((state) => state.searchQuery);
  const setPagination = useDecomissionedStore((state) => state.setPagination);
  const setSearchQuery = useDecomissionedStore((state) => state.setSearchQuery);
  const setSorting = useDecomissionedStore((state) => state.setSorting);
  const setFilters = useDecomissionedStore((state) => state.setFilters);

  const rowSelection = useGeneralStore((state) => state.rowSelection);
  const setRowSelection = useGeneralStore((state) => state.setRowSelection);

  const debouncedSearch = useDebounce(searchQuery, 500);

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
    error,
    isError,
  } = useGetAimAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    search: debouncedSearch,
    state: 'decommissioned',
    ...filters,
  });

  if (
    !isError &&
    !assetsLoading &&
    !assetsFetching &&
    assetsData &&
    assetsData?.pagination?.total === 0 &&
    !assetsData?.assets?.length &&
    !Object.keys(filters).length > 0 &&
    !debouncedSearch
  )
    return (
      <EmptyScreen
        title="No Decommissioned Assets Found"
        subTitle="There are no decommissioned assets in your inventory yet."
      />
    );

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="p-4">
      <Helmet>
        <title>AssetIQ | Decommissioned</title>
      </Helmet>

      <PageHeading
        title="Decommissioned Inventory"
        description="Review and manage assets that have been decommissioned from your inventory."
      />

      <div className="mt-4">
        {Object.keys(rowSelection || {}).length > 1 && <BulkUpdate />}
        <AssetsList
          assetsData={assetsData || []}
          assetsLoading={assetsLoading}
          assetsFetching={assetsFetching}
          tableDetails={tableDetails}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
}

export default Decomissioned;
