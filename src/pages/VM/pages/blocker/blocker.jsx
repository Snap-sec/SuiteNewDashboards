import { useEffect, useState } from 'react';
import { ShieldOff, UserCheck } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '../../../../components/common/no-search-found';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import PageHeading from '../../../../components/custom/page-heading';
import { useGetAllVmBlockersQuery } from '../../../../services/vm/blockersApi';
import BlockerCardV2 from './components/card/blocker-card-v2';
import { SearchInput } from '@/components/custom/search';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import PaginationView from '@/components/custom/pagination';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function BlockerCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
          <Skeleton className="h-3 w-1/4 mt-1" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function BlockerList({ data, isLoading, isFetching, debouncedSearch, filters, setFilters }) {
  const showSkeleton = isLoading || isFetching;

  const hasActiveFilters = Object.keys(filters || {}).some(key => {
    const value = filters[key];
    if (!value) return false;
    if (key === 'status') {
      return !(value.length === 1 && value[0] === 'pending');
    }
    return Array.isArray(value) ? value.length > 0 : !!value;
  });

  return (
    <div className="space-y-3">
      {/* Toolbar / search row */}
      <div className="flex items-center gap-2">
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={data?.advanced_filters}
          isLoadingFilters={isLoading}
        />
      </div>

      {/* Cards */}
      {showSkeleton &&
        Array.from({ length: 5 }).map((_, i) => <BlockerCardSkeleton key={i} />)}

      {!showSkeleton &&
        data?.tasks?.map((item) => (
          <BlockerCardV2 key={item._id} item={item} />
        ))}

      {!showSkeleton && !data?.total && (debouncedSearch || hasActiveFilters) && (
        <NoSearchResultsFound
          title="No Blockers Found"
          subTitle={
            debouncedSearch
              ? `No results for "${debouncedSearch}".`
              : "No blockers match the selected filters."
          }
        />
      )}
    </div>
  );
}

function Blocker() {
  const [tab, setTab] = useState('my-blockers');
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');

  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const setPage = useStore((state) => state.setPage);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 10 }));
  }, [filters, search, tab]);

  const {
    data: blockers,
    isLoading: isBlockersLoading,
    isFetching: isBlockersFetching,
    isError: isBlockersError,
    error: blockersError,
  } = useGetAllVmBlockersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...filters,
    all: tab === 'all-blockers',
  });

  const hasActiveFilters = Object.keys(filters || {}).some(key => {
    const value = filters[key];
    if (!value) return false;
    if (key === 'status') {
      return !(value.length === 1 && value[0] === 'pending');
    }
    return Array.isArray(value) ? value.length > 0 : !!value;
  });

  const showEmptyScreen =
    !isBlockersLoading &&
    !isBlockersFetching &&
    !blockers?.total &&
    !debouncedSearch &&
    !hasActiveFilters;

  const totalPages = Math.ceil((blockers?.total || 0) / pagination.pageSize);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setInputValue('');
    setSearch('');
  };

  if (isBlockersError) return <ApiErrorHandler error={blockersError} />

  return (
    <div className="p-4">
      <Helmet>
        <title>UniRisk | Blockers</title>
      </Helmet>

      <div className="flex justify-between gap-4 items-center mb-1">
        <PageHeading
          title="Blockers"
          description="Track and resolve critical issues blocking the remediation of vulnerabilities."
        />

        {/* Search */}
        <SearchInput
          placeholder="Search blockers..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-64"
        />
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="text-sm text-muted-foreground">
        <TabsList variant="line" className="mb-5">
          <TabsTrigger value="my-blockers">
            <UserCheck className="size-4" /> My Blockers
          </TabsTrigger>
          <TabsTrigger value="all-blockers">
            <ShieldOff className="size-4" /> All Blockers
          </TabsTrigger>
        </TabsList>

        {['my-blockers', 'all-blockers'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue}>
            {showEmptyScreen ? (
              <EmptyScreen
                title="No Blockers Found"
                subTitle="Blockers can be created on the report detail page."
              />
            ) : (
              <>
                <BlockerList
                  data={blockers}
                  isLoading={isBlockersLoading}
                  isFetching={isBlockersFetching}
                  debouncedSearch={debouncedSearch}
                  filters={filters}
                  setFilters={setFilters}
                />

                <div className="flex grow justify-end pt-5 lg:pt-7.5">
                  {totalPages > 1 && (
                    <PaginationView
                      currentPage={pagination.pageIndex + 1}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      className="w-fit mx-0"
                    />
                  )}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default Blocker;
