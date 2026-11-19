import { Helmet } from 'react-helmet';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import ExportToCSV from '@/components/custom/export-to-csv';
import PageHeading from '@/components/custom/page-heading';
import PaginationView from '@/components/custom/pagination';
import { SearchInput } from '@/components/custom/search';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import useDebounce from '../../../../hooks/use-debounce';
import StatsCards from './components/technologies-stats-card';
import TechnologyCard, { TechnologyCardSkeleton } from './components/technology-card';
import useStore from './store';


function Technologies() {
  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const searchQuery = useStore((state) => state.searchQuery);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);

  const debouncedSearch = useDebounce(searchQuery, 400)

  const {
    data: technologiesData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAsmAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    // unified_view: true,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    search: debouncedSearch,
    ...filters,
    type: 'technology',
  });

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (
    !isLoading &&
    !isFetching &&
    !technologiesData?.total &&
    !debouncedSearch &&
    Object.keys(filters || {}).length === 0
  )
    return (
      <EmptyScreen
        title="No Technologies Found"
        subTitle="When new technologies are added, they will show here."
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Technologies</title>
      </Helmet>

      <div className="flex justify-between items-center gap-4">
        <PageHeading title="Technologies" description="View and manage all technologies across your organization’s attack surface." />

        <div className="flex items-center gap-4">
          <TableToolbarFilters
            supportedFilters={technologiesData?.advanced_filters}
            isLoadingFilters={isLoading}
            filters={filters}
            setFilters={setFilters}
          />

          <ExportToCSV
            type="technology"
            filters={filters}
            search={searchQuery}
          />

          <SearchInput
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-80"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-1 lg:grid-cols-3 gap-4">
        {isLoading || isFetching
          ? Array.from({ length: 12 }).map((_, index) => (
            <TechnologyCardSkeleton key={index} />
          ))
          : technologiesData?.data?.map((tech, index) => (
            <TechnologyCard key={index} technology={tech} />
          ))}
      </div>
      <div className="flex items-center justify-center">
        {!isLoading && !isFetching && !technologiesData?.data?.length && searchQuery && (
          <NoSearchResultsFound
            title="No Technologies found"
            subTitle="Your search criteria did not match any technologies"
          />
        )}
      </div>

      {!isLoading && !isFetching && !!technologiesData?.total && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground border border-1 rounded-lg p-2 w-28">
            {technologiesData?.total > 0
              ? `${pagination.pageIndex * pagination.pageSize + 1} - ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, technologiesData?.total)} of ${technologiesData?.total}`
              : '0 results'}
          </p>
          <PaginationView
            currentPage={pagination.pageIndex + 1}
            totalPages={Math.ceil(
              technologiesData?.total / pagination.pageSize || 1,
            )}
            className="flex justify-end"
            onPageChange={(newPage) => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: newPage - 1,
              }));
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Technologies;