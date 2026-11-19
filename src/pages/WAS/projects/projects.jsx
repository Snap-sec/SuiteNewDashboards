import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '@/components/common/no-search-found.jsx';
import PageHeading from '@/components/custom/page-heading';
import PaginationView from '@/components/custom/pagination';
import { SearchInput } from '@/components/custom/search';
import { useGetApisecProjectsQuery } from '../../../services/apisec/projectsApi';
import CreateProjectModel from './components/create-project-model';
import { CardProject } from './components/project-card';
import { useStore } from './store';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '@/components/common/api-error-handler';

function Projects() {
  const pagination = useStore((state) => state.pagination);
  const setPage = useStore((state) => state.setPage);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Pass query as param along with page and limit to the query hook
  const { data, isLoading, isFetching, error, isError } = useGetApisecProjectsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...filters
  });


  // Reset page to 1 when query changes to avoid empty page results
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleChange = (e) => setSearchQuery(e.target.value);

  const hasFilters = Object.keys(filters || {}).length > 0;

    if (isError) return <ApiErrorHandler error={error} />;
    
  if (!debouncedSearch && !Object.keys(filters).length && data?.meta?.pagination?.totalItems === 0 && !isLoading && !hasFilters) {
    return (
      <>
        <Helmet>
          <title>WAS | Applications </title>
        </Helmet>
        <EmptyScreen
          title="No Applications Found"
          subTitle="You have not created any applications yet!"
          engage={<AuthorityGuard forbidRoles={['Auditor']}><CreateProjectModel /></AuthorityGuard>}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>WAS | Applications </title>
      </Helmet>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">

          <div className='flex flex-col'>
            <PageHeading
              title="Applications"
              description="Manage applications, configure security scans, and monitor application security."
            />
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <SearchInput
                value={searchQuery}
                onChange={handleChange}
                placeholder="Search Applications"
                isSearching={false}
              />
              <TableToolbarFilters
                filters={filters}
                setFilters={setFilters}
                supportedFilters={data?.advanced_filters}
                isLoadingFilters={isLoading}
              />
            </div>
          </div>

          <AuthorityGuard forbidRoles={['Auditor']}>
            <CreateProjectModel />
          </AuthorityGuard>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-5">
          {isFetching || isLoading ? (
            [...Array(6)].map((_, index) => (
              <CardProject key={index} isLoading={true} />
            ))
          ) : (
            data?.data?.map((item, index) => (
              <CardProject
                key={index}
                id={item?._id}
                name={item?.name}
                description={item?.description}
                lastScan={item?.last_scan}
                team={item?.collaborators}
                totalEndpoints={item?.endpointsCount}
                totalThreats={item?.closed_threats + item?.open_threats}
                remedation={item?.remediation}
                status={item?.latestScan?.status}
                latestScan={item?.latestScan}
                configuration={item?.configuration}
                isConfigured={item?.is_configured}
              />
            ))
          )}
        </div>
        {!isLoading && data?.data?.length == 0 && (searchQuery || hasFilters) && (
          <NoSearchResultsFound subTitle="Nothing matched your filters or search criteria" />
        )}

        {data?.meta?.pagination?.totalPages > 1 && (
          <PaginationView
            currentPage={pagination.pageIndex + 1}
            totalPages={data?.meta?.pagination?.totalPages}
            onPageChange={setPage}
            className=" w-full mx-0 mt-4 justify-end"
          />
        )}
      </div>
    </>
  );
}

export default Projects;
