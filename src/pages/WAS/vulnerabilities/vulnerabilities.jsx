import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { Button } from '../../../components/ui/button';
import { useGetApiSecVulnsQuery } from '../../../services/apisec/vulnerabilityApi';
import MetricsCard from './components/metrics-card';
import VulnList from './components/VulnList';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { ArrowRight, Link } from 'lucide-react';

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


function Vulnerabilities() {
  const navigate = useNavigate();

  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  // const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const sorting = useStore((state) => state.sorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const rawSearchQuery = useStore((state) => state.searchQuery);
  const debouncedSearch = useDebounce(rawSearchQuery, 400);

  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState(rawSearchQuery);

  const [params] = useSearchParams();

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, filters, setPagination]);

  const { data, isLoading, isFetching, error, isError } = useGetApiSecVulnsQuery({
    include: 'details',
    search: debouncedSearch,
    filters: params.get('filters'),
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, sortOrder: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isLoading &&
    !isFetching &&
    !data?.pagination?.total &&
    !rawSearchQuery &&
    Object?.keys(filters || {})?.length === 1 &&
    Object?.keys(filters)?.[0] === 'supressed'
  )
    return (
      <>
        <Helmet>
          <title>WAS | Vulnerabilities</title>
        </Helmet>
        <EmptyScreen
          title="No Vulnerabilities Found"
          subTitle="When new vulnerabilities are Found, they will show here."
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
            <Button
              onClick={() => {
                navigate('/was/projects');
              }}
            >
              <ArrowRight/>
              Goto Applications 
            </Button>
            </AuthorityGuard>
          }
        />
      </>
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>WAS | Vulnerabilities</title>
      </Helmet>

      <PageHeading
        title="Vulnerabilities"
        description="Identify, track, and manage vulnerabilities discovered across your applications and APIs."
      />

      <div>
        <MetricsCard metrics={data?.summary} isLoading={isLoading} />
      </div>

      <div className="mt-4">
        <VulnList
          data={{
            ...data?.data,
            totalPages: data?.pagination?.pages,
            totalItems: data?.pagination?.total,
            userVulns: data?.data,
          }}
          supported_filters={data?.advanced_filters}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

export default Vulnerabilities;