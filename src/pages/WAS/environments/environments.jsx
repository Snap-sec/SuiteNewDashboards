import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { useGetApisecEnvironmentsQuery } from '@/services/apisec/environmentApi';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../components/common/empty-screen';
import { Button } from '../../../components/ui/button';
import EnvironmentsTable from './components/table/environments-table';
import { PlusCircle, Plug } from 'lucide-react';
import useStore from './store';
import CreateEnvironmentModel from './components/create-environment-model';
import ApiErrorHandler from '@/components/common/api-error-handler';

import useDebounce from '@/hooks/use-debounce';

function environments() {
  const filters = useStore((state) => state.filters);
  const search = useStore((state) => state.searchQuery);
  const debouncedSearch = useDebounce(search, 400);

  const { data: environments, isLoading: isLoadingEnvs, isFetching, error, isError } =
    useGetApisecEnvironmentsQuery({
      ...filters,
      search: debouncedSearch,
    });


  const navigate = useNavigate();

  //   Show empty screen
  if (!isError && !isLoadingEnvs && !environments?.data?.length)
    return (
      <>
        <Helmet>
          <title>WAS | Environments</title>
        </Helmet>
        <EmptyScreen
          title="Environment Not available"
          subTitle="looks like ,You haven’t set up any environments yet. Add one to begin."
          engage={
            <div className='flex gap-2 items-center'>
              <Button onClick={() => navigate('/was/integrations')}>
                <Plug className='w-4 h-4' />
                Go to integrations
              </Button>
              <CreateEnvironmentModel />
            </div>
          }
        />
      </>
    );

      if (isError) return <ApiErrorHandler error={error} />;


  return (
    <div className="p-4">
      <Helmet>
        <title>WAS | Environments</title>
      </Helmet>



      <div className="flex items-center justify-between">
        <PageHeading
          title="Environments"
          description="View and manage the list of deployment and operational environments where your applications and services run."
        />
        <CreateEnvironmentModel />
      </div>

      <div className=" mt-4">
        <EnvironmentsTable
          data={environments?.data}
          isLoading={isLoadingEnvs}
          isFetching={isFetching}
          supportedFilters={environments?.filters}
        />
      </div>
    </div>
  );
}

export default environments;
