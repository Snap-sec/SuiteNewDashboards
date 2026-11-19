import { useEffect } from 'react';
import { useGetVmRiskAcceptanceListQuery } from '@/services/vm/riskAcceptanceApi';
import PageHeading from '@/components/custom/page-heading';
import useDebounce from '../../../../../../../hooks/use-debounce';
import useStore from '../../../store';
import EscalationsTable from '../../tables/escalations-table';
import ApiErrorHandler from '../../../../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../../../../components/common/empty-screen';

function EscalationsTab() {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchQuery, JSON.stringify(filters)]);

  const { data, isLoading, isFetching, isError, error } = useGetVmRiskAcceptanceListQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearchQuery,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? {
          sortBy:
            sorting[0]?.id === 'CreatedAt'
              ? 'createdAt'
              : sorting[0]?.id,
          sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        }
      : {}),
  });

  const escalations = data?.data?.escalations || [];
  const total = data?.data?.total || 0;
  const supportedFilters = data?.data?.advanced_filters;

  if(isError) return <ApiErrorHandler error={error} />

  const hasActiveFilters = Boolean(debouncedSearchQuery || (filters && Object.keys(filters).length > 0));

  if(!isLoading && !data?.data?.total && !hasActiveFilters){
    return(
      <EmptyScreen
      title="No Escalations"
      subTitle="There are no escalations currently." />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading
          title="Escalations"
          description="Review, approve, and manage all security risk acceptance requests and escalations."
        />
        {/* Filter buttons could go here */}
      </div>

      <EscalationsTable
        data={escalations}
        isLoading={isLoading}
        isFetching={isFetching}
        total={total}
        supportedFilters={supportedFilters}
      />
    </div>
  );
}

export default EscalationsTab;
