import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import PaginationView from '@/components/custom/pagination';
import { useGetAsmScansQuery } from '../../../../../services/asm/scansApi';
import ScanRowCard from '../cards/scan-row-info-card';
// import CreateNewScanModel from '../modals/create-new-scan-modal';

const ScansList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const {
    data: scans,
    isLoading,
    isFetching,
    isError,
  } = useGetAsmScansQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: searchValue,

      // ...(sorting?.length
      //   ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      //   : {}),
      // search: debouncedSearch,
      // ...filters,
    },
    { pollingInterval: 5000 },
  );

  if (isLoading) {
    return (
      <div className="grid grid-rows-1 gap-5 mt-18">
        {[1, 2, 3, 4].map((i) => {
          return <Skeleton key={i} className="w-full h-[95px] rounded-xl" />;
        })}
      </div>
    );
  }

  if (!isLoading && scans?.data?.length == 0)
    return (
      <EmptyScreen
        title="No Scans Found"
        subTitle="There are currently no scans to display."
        // engage={<CreateNewScanModel />}
      />
    );

  return (
    <div className="flex flex-col items-stretch gap-5 lg:gap-4">
      <div id="projects_list">
        <div className="flex flex-col gap-5 lg:gap-5">
          {scans?.data?.map((item, index) => {
            return (
              <ScanRowCard
                key={index}
                id={item?._id}
                assetName={item?.domain}
                progress={item?.progress}
                status={item?.state}
                newAssets={item?.totalFound}
                totalExposures={item?.totalExposures}
                executionDate={item?.createdAt}
                item={item}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <PaginationView
          currentPage={scans?.pagination?.page || 1}
          totalPages={scans?.pagination?.totalPages || 1}
          className="flex justify-end"
          onPageChange={(newPage) => {
            setPagination((prev) => ({
              ...prev,
              pageIndex: newPage - 1,
            }));
            setPage(newPage);
          }}
        />
      </div>
    </div>
  );
};

export default ScansList;
