import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { useGetVmArchivedVulnsQuery } from '../../../../services/vm/archivedVulnsApi';
import { Error403 } from '../../../error/403-error';
import ArchivedVulnsTable from './components/tables/archived-vulns';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function ArchivedVulnerabilities() {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const sorting = useStore((state) => state.sorting);

  const rawSearchQuery = useStore((state) => state.searchQuery);
  const setRawSearchQuery = useStore((state) => state.setSearchQuery);

  const debouncedSearch = useDebounce(rawSearchQuery, 400)

  const [params] = useSearchParams();

  const { data, isLoading, isFetching, isError, error } = useGetVmArchivedVulnsQuery({
    search: debouncedSearch,
    page: pagination?.pageIndex + 1,
    limit: pagination?.pageSize,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? {
        sortBy:
          sorting[0]?.id === 'Severity'
            ? 'cvssScore'
            : sorting[0]?.id === 'Actions'
              ? 'createdAt'
              : sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : {}),
  });

  // Set rawSearchQuery and filters when comming from assets cataloage by clicking on any 6M, 2L, 1N, 5C etc filter to keep UI consistant
  useEffect(() => {
    const filtersParam = params.get('filters');
    const searchParam = params.get('search');

    if (searchParam) {
      setRawSearchQuery(searchParam);
    }

    if (filtersParam) {
      const [key, value] = filtersParam.split(':');

      if (key && value) {
        setFilters((prev) => ({
          ...prev,
          [key]: value,
        }));
      }
    }
  }, [params]);

  // Reset page when filters change, to avoid wrong data fetching
  useEffect(() => {
    if (pagination?.pageIndex !== 0)
      setPagination(() => ({ pageIndex: 0, pageSize: 10 }));
  }, [JSON.stringify(filters)]);

  if (isError) {
    return <ApiErrorHandler error={error} />
  }

  if (
    !isLoading &&
    !isFetching &&
    !data?.data?.total &&
    !debouncedSearch &&
    !Object.keys(filters)?.length &&
    !isError
  )
    return (
      <EmptyScreen
        title="No Archived Vulnerabilities Found"
        subTitle="When vulnerabilities are Archived, they will show here."
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>UniRisk | Archived Vulnerabilities</title>
      </Helmet>

      <div className="flex items-center justify-between w-full overflow-x-hidden">
        <PageHeading
          title="Archived Vulnerabilities"
          description="Review and restore vulnerabilities that have been previously archived or dismissed."
        />
      </div>

      <div className="mt-4">
        <ArchivedVulnsTable
          data={data?.data}
          isLoading={isLoading}
          isFetching={isFetching}
          supportedFilters={data?.data?.advanced_filters}
        />
      </div>
    </div>
  );
}

export default ArchivedVulnerabilities;