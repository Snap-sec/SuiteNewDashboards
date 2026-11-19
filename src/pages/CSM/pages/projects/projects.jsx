import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';
import { useGetAccountsQuery } from '@/services/csm/accountsApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '@/components/common/no-search-found.jsx';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import PaginationView from '@/components/custom/pagination';
import { SearchInput } from '@/components/custom/search';
import CreateProjectModel from './components/create-project-model';
import { CardProject } from './components/project-card';
import { useStore } from './store';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function Projects() {
  const pagination = useStore((state) => state.pagination);
  const setPage = useStore((state) => state.setPage);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Pass query as param along with page and limit to the query hook
  const { data, isLoading, isFetching, isError, error } = useGetAccountsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...filters,
  });

  // Reset page to 1 when query changes to avoid empty page results
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleChange = (e) => setSearchQuery(e.target.value);

  const hasFilters = Object.keys(filters || {}).length > 0;

  if (
    !isError &&
    data?.data?.total === 0 &&
    !isLoading &&
    !searchQuery &&
    !hasFilters
  ) {
    return (
      <>
        <Helmet>
          <title>CSM | Environments </title>
        </Helmet>
        <EmptyScreen
          title="No Environments Found"
          subTitle="You have not connected any cloud environments yet!"
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <CreateProjectModel />
            </AuthorityGuard>
          }
        />
      </>
    );
  }

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <>
      <Helmet>
        <title> CSM | Environments </title>
      </Helmet>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <PageHeading
              title="Environments"
              description="Manage connected cloud environments and monitor their assets, configurations, and security posture from a centralized view."
            />
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <SearchInput
                value={searchQuery}
                onChange={handleChange}
                placeholder="Search Environments"
                isSearching={false}
              />
              {/* <TableToolbarFilters
                filters={filters}
                setFilters={setFilters}
                supportedFilters={data?.advanced_filters}
                isLoadingFilters={isLoading}
              /> */}
            </div>
          </div>

          {/* <AuthorityGuard forbidRoles={['Auditor']}>
            <CreateProjectModel />
          </AuthorityGuard> */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-5">
          {isFetching || isLoading
            ? [...Array(6)].map((_, index) => (
                <CardProject key={index} isLoading={true} />
              ))
            : data?.data?.accounts?.map((item, index) => (
                <CardProject
                  key={index}
                  id={item?._id}
                  name={
                    item?.title ||
                    item?.account_name ||
                    item?.user_provided_name
                  }
                  description={item?.description}
                  lastScan={item?.last_refresh}
                  team={item?.collaborators}
                  totalEndpoints={item?.scans_count}
                  totalThreats={item?.vuln_counts?.total}
                  vulnerabilities={item?.vuln_counts}
                  remedation={item?.remediation}
                  status={item?.status}
                  logo={item?.logo}
                  latestScan={item?.latestScan}
                  configuration={item?.configuration}
                  isConfigured={item?.is_connected}
                />
              ))}
        </div>
        {!isLoading &&
          data?.data?.accounts?.length == 0 &&
          (searchQuery || hasFilters) && (
            <NoSearchResultsFound subTitle="Nothing matched your filters or search criteria" />
          )}

        {data?.data?.totalPages > 1 && (
          <PaginationView
            currentPage={pagination.pageIndex + 1}
            totalPages={data?.data?.totalPages}
            onPageChange={setPage}
            className=" w-full mx-0 mt-4 justify-end"
          />
        )}
      </div>
    </>
  );
}

export default Projects;
