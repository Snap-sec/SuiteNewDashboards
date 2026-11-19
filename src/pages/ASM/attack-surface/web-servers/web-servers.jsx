import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import PaginationView from '@/components/custom/pagination';
import { SearchInput } from '@/components/custom/search';
import { ContentLoader } from '../../../../components/common/content-loader';
import PageHeading from '../../../../components/custom/page-heading';
import { WebserverCard } from './components/card';
import Metrics from './components/metrics';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Helmet } from 'react-helmet';
import useDebounce from '../../../../hooks/use-debounce';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';

function WebServers() {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState([]);

  const debouncedSearch = useDebounce(searchValue, 400)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 25 }));
  }, [searchValue]);

  const {
    data: webServersData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAsmAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    // unified_view: true,
    type: 'web_server',
    ...filters,
  });

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    console.log('Search query:', e.target.value);
  };

  if (
    !isLoading &&
    !isFetching &&
    !webServersData?.total &&
    !debouncedSearch &&
    Object.keys(filters || {}).length === 0
  )
    return (
      <>
        <Helmet><title>Xpose | Web Servers</title></Helmet>
        <EmptyScreen
          title="No Webservers Found"
          subTitle="Your webserver list is empty. Add webservers to populate it."
        />
      </>
    );

  return (
    <div className="p-4">
      <Helmet><title>Xpose | Web Servers</title></Helmet>
      <div className="flex justify-between items-center">
        <PageHeading
          title="Web Servers"
          description="View and manage all webservers across your organization’s attack surface."
        />

        <div className='flex items-center gap-4'>
          <TableToolbarFilters
            supportedFilters={webServersData?.advanced_filters}
            isLoadingFilters={isLoading}
            filters={filters}
            setFilters={setFilters}
          />

          <SearchInput
            placeholder="Search here..."
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="mb-4 mt-1">
        <Metrics
          metrics={webServersData?.stats}
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-col gap-4">
        {(isLoading || isFetching) ? (
          [...Array(5)].map((_, index) => (
            <WebserverCard key={index} isLoading={true} />
          ))
        ) : webServersData?.data?.length > 0 ? (
          webServersData?.data?.map((webserver) => (
            <WebserverCard
              key={webserver._id}
              data={webserver}
            />
          ))
        ) : (
          <NoSearchResultsFound
            title="No Webservers"
            subTitle="No Webservers matched your criteria"
          />
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground border border-1 rounded-lg p-2 w-28">
          {webServersData?.total > 0
            ? `${pagination.pageIndex * pagination.pageSize + 1} - ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, webServersData?.total)} of ${webServersData?.total}`
            : '0 results'}
        </p>
        <PaginationView
          currentPage={pagination.pageIndex + 1}
          totalPages={Math.ceil(webServersData?.total / pagination.pageSize)}
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
}

export default WebServers;
