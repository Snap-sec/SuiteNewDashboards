import { PlugZapIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router';
import PageHeading from '@/components/custom/page-heading';
import { ContentLoader } from '../../../components/common/content-loader';
import { EmptyScreen } from '../../../components/common/empty-screen';
import { Button } from '../../../components/ui/button';
import { useGetApiSecRequestsQuery } from '../../../services/apisec/requestsApi';
import EndpointsList from './components/endpoint-list';
import useStore from './store';
import { useGetApiSecTransformedRequestsQuery } from '../../../services/apisec/requestsApi';


function ScanDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const search = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);

  const {
    data: dataX,
    isLoading: isLoading,
    isFetching
  } = useGetApiSecTransformedRequestsQuery({
    scanId: id, 
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    search,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  }); 

 
  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>API-Sec | Scan Details</title>
        </Helmet>
        <ContentLoader />
      </>
    );
  }


  
  return (
    <div className="p-4">
      <Helmet>
        <title>ApiSec | Requests</title>
      </Helmet>

      <PageHeading
        title="API Requests"
        description="Manage and monitor your API requests."
      />

      <div className="mt-6">
        <EndpointsList
          data={dataX}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

export default ScanDetails;
