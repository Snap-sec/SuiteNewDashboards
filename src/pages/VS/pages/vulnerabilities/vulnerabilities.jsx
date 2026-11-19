import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetVsVulnsQuery } from '@/services/vs/vsApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';
import MetricsCard from './components/metrics-card';
import VulnInfo from './components/vuln-info';
import VulnList from './components/VulnList';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import { useSearchParams } from 'react-router-dom';


function Vulnerabilities() {
  const [params] = useSearchParams();

  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const sorting = useStore((state) => state.sorting);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchQuery, JSON.stringify(filters)]);

  const { data, isLoading, isFetching, error, isError } = useGetVsVulnsQuery({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, sortAs: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    filters: params.get('filters') || '',
  });

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (!isLoading && !data?.global_total && !Object.keys(filters)?.length)
    return (
      <EmptyScreen
        title="No Vulnerabilities Found"
        subTitle="When new vulnerabilities are report, they will show here."
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>VS | Vulnerabilities</title>
      </Helmet>
      <PageHeading
        title="Vulnerabilities"
        description="View, filter, and manage vulnerabilities identified across all scanned targets."
      />

      <div>
        <MetricsCard metrics={data?.stats} isLoading={isLoading} />
      </div>

      <div className="mt-4">
        <VulnList data={data} isLoading={isLoading} isFetching={isFetching} />
      </div>

      <VulnInfo />
    </div>
  );
}

export default Vulnerabilities;
