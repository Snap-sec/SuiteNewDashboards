import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EditableTable } from '@/components/custom/editable-table';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../components/common/empty-screen';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  useGetApisecEnvironmentByIdQuery,
  useUpdateApisecEnvironmentValueMutation,
} from '../../../services/apisec/environmentApi';
import EnvironmentTableSkeleton from '../environments/components/skeletons/skeleton-loader';
import AddVariableModel from './components/add-variable-model';
import ApiErrorHandler from '@/components/common/api-error-handler';

function Environment() {
  const { envId } = useParams();
  const navigate = useNavigate();

  const { data: envData, isLoading: isLoadingEnvDetails, error, isError } =
    useGetApisecEnvironmentByIdQuery(envId);


  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [updateEnvValue] = useUpdateApisecEnvironmentValueMutation();

  const pageSize = 10;

  // Define columns for EditableTable
  const columns = [
    {
      accessorKey: 'key',
      title: 'Key',
      editable: { editable: false },
      size: 100,
    },
    {
      accessorKey: 'type',
      title: 'Type',
      editable: { editable: false, type: 'text' },
      size: 40,
    },
    {
      accessorKey: 'value',
      title: 'Value',
      editable: { editable: true, type: 'text' },
    },
  ];

  // Handle row update and send mutation
  const handleRowUpdate = async (rowId, columnId, newValue) => {
    const variable = envData?.data?.values.find(
      (variable) => String(variable._id || variable.key) === String(rowId),
    );
    if (!variable) {
      console.log('No variable found with id/key', rowId);
      return;
    }

    try {
      const result = await updateEnvValue({
        envId: envData?.data._id,
        variableKey: variable.key,
        data: { value: newValue },
      }).unwrap();
      toast.success('Variable Updated Successfully.');
      console.log('Mutation success:', result);
    } catch (err) {
      toast.error('Failed to Updated Variable.');
      console.error('Mutation error:', err);
    }
  };

  if (!isError && !isLoadingEnvDetails && !envData?.data)
    return (
      <EmptyScreen
        title="Environment Not available"
        subTitle="looks like ,You haven’t set up any environments yet. Add one to begin."
        engage={
          <Button onClick={() => navigate('/was/integrations')}>
            Go to integrations
          </Button>
        }
      />
    );

      if (isError) return <ApiErrorHandler error={error} />;


  return (
    <div className="p-4">
      <Helmet>
        <title>WAS | Environment details</title>
      </Helmet>

      <div className="flex items-center justify-between">
        {isLoadingEnvDetails ? (
          <div>
            <Skeleton className={' w-60 h-10'} />
            <Skeleton className={' w-80 h-10 mt-2'} />
          </div>
        ) : (
          <PageHeading
            title={envData?.data?.name}
            description="View and manage the list of Environment variables."
          />
        )}

        <AddVariableModel />
      </div>

      <div className="mt-4">
        <div className="py-4">
          {isLoadingEnvDetails ? (
            <EnvironmentTableSkeleton />
          ) : (
            <EditableTable
              data={envData?.data?.values || []}
              columns={columns}
              title="Variables"
              isLoading={true}
              searchable={true}
              searchPlaceholder="Search ..."
              onSearch={(search) => setSearch(search)}
              onRowUpdate={handleRowUpdate}
              mannualPagination={false}
              pageSize={limit}
              currentPage={page}
              totalPages={envData?.data?.values.length / pageSize || 0}
              totalItems={envData?.data?.values?.length || 0}
              onPaginationChange={({ page: newPage, limit: newLimit }) => {
                setPage(newPage);
                setLimit(newLimit);
              }}
              editTrigger="button"
              cursorStyle="cursor-text"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Environment;
