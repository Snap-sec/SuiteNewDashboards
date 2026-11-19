import { ArrowRight, PlugZapIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import useDebounce from '@/hooks/use-debounce';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../components/common/empty-screen';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import { Button } from '../../../components/ui/button';
import { useGetApiSecRequestsQuery } from '../../../services/apisec/requestsApi';
import EndpointsList from './components/endpoint-list';
import useStore from './store';


function Requests() {
  const navigate = useNavigate();

  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const search = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);

  const debouncedSearch = useDebounce(search, 500);

  const {
    data: integrationData,
    isLoading: isIntLoading,
    isFetching,
    isError,
    error,
  } = useGetApiSecRequestsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    search: debouncedSearch,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  if (!isIntLoading && isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (

    !integrationData?.meta?.totalItems &&
    !isIntLoading &&
    !Object.keys(filters)?.length &&
    !debouncedSearch
  ) {
    return (
      <>
        {' '}
        <Helmet>
          <title>WAS | Requests</title>
        </Helmet>
        <EmptyScreen
          subTitle="Looks like there are no requests, Add one through integrations."
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button onClick={() => navigate('/was/projects')}>
                <ArrowRight /> Goto Applications
              </Button>
            </AuthorityGuard>
          }
        />
      </>
    );
  }
  return (
    <div className="p-4">
      <Helmet>
        <title>WAS | Requests</title>
      </Helmet>

      <PageHeading
        title="API Requests"
        description="Discover, inventory, and monitor API endpoints, applications, and associated vulnerabilities."
      />

      <div>
        <EndpointsList
          data={integrationData}
          isLoading={isIntLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

export default Requests;