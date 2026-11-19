import { PlugZapIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import PageHeading from '@/components/custom/page-heading';
import { ContentLoader } from '@/components/common/content-loader';
import { EmptyScreen } from '@/components/common/empty-screen';
import { Button } from '@/components/ui/button';
import { useGetTmEndpointsQuery } from '@/services/tm/endpointApi';
import EndpointsList from './components/endpoint-list';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';

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
  } = useGetTmEndpointsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    search: debouncedSearch,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  if (isIntLoading) {
    return (
      <>
        <Helmet>
          <title>Threat Modeler | Requests</title>
        </Helmet>
        <ContentLoader />
      </>
    );
  }

  if (
    !integrationData?.total &&
    !isIntLoading &&
    !Object.keys(filters)?.length &&
    !search
  ) {
    return (
      <>
        {' '}
        <Helmet>
          <title>Threat Modeler | Requests</title>
        </Helmet>
        <EmptyScreen
          subTitle="You don’t have any endpoints yet. Add one through integrations."
          engage={
            <Button onClick={() => navigate('/threat-modeler/projects')}>
              <PlugZapIcon /> Goto Projects
            </Button>
          }
        />
      </>
    );
  }
  return (
    <div className="p-4">
      <Helmet>
        <title>Threat Modeler | Requests</title>
      </Helmet>

      <PageHeading
        title="Endpoints"
        description="Manage and monitor your Endpoints for threats."
      />

      <div className="mt-6">
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
