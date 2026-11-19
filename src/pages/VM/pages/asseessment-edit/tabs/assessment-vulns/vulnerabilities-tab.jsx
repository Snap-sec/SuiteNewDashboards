import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetVmVulnsQuery } from '@/services/vm/vulnerabilityApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import VulnList from './components/table/vulns-table';
import useStore from './store';
import useDebounce from '../../../../../../hooks/use-debounce';
import ApiErrorHandler from '../../../../../../components/common/api-error-handler';

// Utility to parse filters param (e.g., "listId:abc,severity:high")
function parseFiltersParam(filtersParam) {
  if (!filtersParam) return {};

  const separator = filtersParam.includes(';') ? ';' : ',';
  return filtersParam.split(separator).reduce((acc, pair) => {
    const [key, value] = pair.split(':');
    if (key && value) acc[key] = value;
    return acc;
  }, {});
}

function Vulnerabilities({ assessmentId }) {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  // const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const sorting = useStore((state) => state.sorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const rawSearchQuery = useStore((state) => state.searchQuery);
  const setRawSearchQuery = useStore((state) => state.setSearchQuery);

  const debouncedSearch = useDebounce(rawSearchQuery, 400)

  const [params] = useSearchParams();

  // Set rawSearchQuery and filters when comming from assets cataloage by clicking on any 6M, 2L, 1N, 5C etc filter to keep UI consistant
  useEffect(() => {
    const searchParam = params.get('search');

    if (searchParam) {
      setRawSearchQuery(searchParam);
    }

    if (assessmentId) {
      setFilters((prev) => ({
        ...prev,
        assessmentId: assessmentId,
      }));
    }
  }, [assessmentId]);

  let cache_buster_key = assessmentId

  const { data, isLoading, isFetching, isError, error } = useGetVmVulnsQuery({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    cache_buster: cache_buster_key,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? {
        sortBy:
          sorting[0]?.id === 'Severity'
            ? 'cvssScore'
            : sorting[0]?.id === 'Reported On'
              ? 'createdAt'
              : sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : {}),
  });

  // Reset page when filters or search query change, to avoid wrong data fetching
  useEffect(() => {
    if (pagination?.pageIndex !== 0)
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [JSON.stringify(filters), rawSearchQuery]);

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== 'assessmentId' && filters[key] !== undefined && filters[key]?.length > 0
  );

  if (
    !isError &&
    !isLoading &&
    !isFetching &&
    !data?.data?.totalItems &&
    !data?.data?.userVulns?.length &&
    !debouncedSearch &&
    !hasActiveFilters
  )
    return (
      <EmptyScreen
        title="No Vulnerabilities Found"
        subTitle="This Assessment doesn't have any vulnerabilities reported yet, they will show here."
      />
    );

    if(isError) return <ApiErrorHandler error={error}/>

  return <VulnList data={data?.data} isLoading={isLoading} isFetching={isFetching} />;
}

export default Vulnerabilities;
