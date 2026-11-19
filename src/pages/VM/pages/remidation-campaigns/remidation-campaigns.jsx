import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetVmRemidationCampaignQuery } from '@/services/vm/remidationCampaignApi';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import RecomputeRemidationCampaigns from './components/actions/recompute-remidation-campaigns';
import { RemidationCampaignCards } from './components/cards/remidation-campaign-cards';
import useStore from './store';
import { SearchInput } from '@/components/custom/search';
import useDebounce from '@/hooks/use-debounce';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function RemidationCampaigns() {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const search = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 12 });
  }, [searchQuery, setPagination, filters]);

  const { data, isLoading, isFetching, isError, error } = useGetVmRemidationCampaignQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    ...filters,
  });

  if (!isError && !isLoading && !isFetching && data?.items?.length === 0 && !search && Object.keys(filters || {}).length === 0) {
    return (
      <EmptyScreen
        title={'No Remidation Campaigns Found'}
        description={'No Remidation Campaigns Found'}
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <RecomputeRemidationCampaigns />
          </AuthorityGuard>
        }
      />
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="px-4 py-2">
      <Helmet>
        <title>UniRisk | Remidation Campaigns</title>
      </Helmet>

      <div className="flex items-center justify-between w-full overflow-x-hidden">
        <PageHeading
          title={'Remidation Campaigns'}
          description={`Track and manage the progress of your vulnerability remediation campaigns.`}
        />

        <div className="flex items-center gap-4">
          <SearchInput
            value={searchQuery || ''}
            placeholder="Type Campaign Name"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={data?.advanced_filters || data?.filters}
            isLoadingFilters={isLoading}
          />
          <AuthorityGuard forbidRoles={['Auditor']}>
            <div className="shrink-0">
              <RecomputeRemidationCampaigns />
            </div>
          </AuthorityGuard>
        </div>
      </div>

      <div className='mt-4'>
        <RemidationCampaignCards
          data={data}
          isLoading={isLoading || isFetching}
        />
      </div>
    </div>
  );
}

export default RemidationCampaigns;

