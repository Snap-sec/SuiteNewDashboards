import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetAimAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import PageHeading from '../../../../../components/custom/page-heading';
import {EmptyScreen} from "@/components/common/empty-screen";
import BulkUpdate from '../assets/components/bulk-update';
import AssetsList from '../components/assets-list';
import useGeneralStore from '../store';
import useStagedStore from './store';

function Staged({ hideHeading = false }) {
  const pagination = useStagedStore((state) => state.pagination);
  const sorting = useStagedStore((state) => state.sorting);
  const filters = useStagedStore((state) => state.filters);
  const searchQuery = useStagedStore((state) => state.searchQuery);
  const setPagination = useStagedStore((state) => state.setPagination);
  const setSearchQuery = useStagedStore((state) => state.setSearchQuery);
  const setSorting = useStagedStore((state) => state.setSorting);
  const setFilters = useStagedStore((state) => state.setFilters);

  const rowSelection = useGeneralStore((state) => state.rowSelection);
  const setRowSelection = useGeneralStore((state) => state.setRowSelection);

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 10 }));
  }, [searchQuery, filters, setPagination]);

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
    isError,
  } = useGetAimAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    search: searchQuery,
    state: 'staged',
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
    !searchQuery
  )
    return (
      <EmptyScreen
        title="No Staged Assets Found"
        subTitle="There are no assets currently in staging."
      />
    );

  // if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className={hideHeading ? '' : 'p-4'}>
      {!hideHeading && (
        <>
          <Helmet>
            <title>AssetIQ | Staged</title>
          </Helmet>

          <PageHeading
            title="Staged Inventory"
            description="Review and manage assets currently staged for inventory processing."
          />
        </>
      )}

      <div className={hideHeading ? '' : 'mt-4'}>
        {/* {Object.keys(rowSelection || {}).length > 1 && <BulkUpdate />} */}
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

export default Staged;
