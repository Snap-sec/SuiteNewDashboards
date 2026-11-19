import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetVmRelevanceGroupsQuery, useTriggerVmRelevanceGroupsClassifyMutation } from '@/services/vm/relevanceGroupsApi';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { SearchInput } from '@/components/custom/search';
import useDebounce from '@/hooks/use-debounce';
import useStore from './store';
import { RelevanceGroupCards } from './components/cards/relevance-group-cards';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { RefreshCw, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function RelevanceGroups() {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setPagination = useStore((state) => state.setPagination);

  const search = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 12 });
  }, [searchQuery, setPagination]);

  const { data, isLoading, isFetching, isError, error } = useGetVmRelevanceGroupsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  const [triggerClassify, { isLoading: isClassifying }] = useTriggerVmRelevanceGroupsClassifyMutation();

  const handleClassify = async () => {
    try {
      await triggerClassify().unwrap();
      toast.success('Classification triggered successfully');
    } catch (error) {
      toast.error('Failed to trigger classification');
    }
  };

  if (!isError && !isLoading && data?.data?.length === 0 && !search) {
    return (
      <EmptyScreen
        title={'No Relevance Groups Found'}
        description={'Theres currently no data available. Please take an action to get started.'}
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <ButtonWithConfirm
              confirm
              onConfirm={handleClassify}
              disabled={isClassifying}
              confirmTitle="Trigger Classification"
              dialog="Are you sure you want to trigger relevance groups classification?"
              confirmVariant="info"
              underlined="dashed"
              variant="primary"
              className="flex items-center gap-2"
            >
              <Sparkles className={`size-4 ${isClassifying ? 'animate-spin' : ''}`} />
              Classify Groups
            </ButtonWithConfirm>
          </AuthorityGuard>
        }
      />
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="px-4 py-2">
      <Helmet>
        <title>UniRisk | Risk Relevance Groups</title>
      </Helmet>

      <div className="flex items-center justify-between w-full overflow-x-hidden">
        <PageHeading
          title={'Risk Relevance Groups'}
          description={`Categorize vulnerabilities based on their business impact and relevance to your organization.`}
        />

        <div className="flex items-center gap-4">
          {/* <SearchInput
            value={searchQuery || ''}
            placeholder="Search groups..."
            onChange={(e) => setSearchQuery(e.target.value)}
          /> */}
          <AuthorityGuard forbidRoles={['Auditor']}>
            <div className="shrink-0">
              <ButtonWithConfirm
                confirm
                onConfirm={handleClassify}
                disabled={isClassifying}
                confirmTitle="Refresh Relevance Groups"
                dialog="Are you sure you want to refresh relevance groups?"
                confirmVariant="info"
                mode="link"
                underlined="dashed"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`size-4 ${isClassifying ? 'animate-spin' : ''}`} />
                Refresh Groups
              </ButtonWithConfirm>
            </div>
          </AuthorityGuard>
        </div>
      </div>

      <div className='mt-4'>
        <RelevanceGroupCards
          data={data}
          isLoading={isLoading || isFetching}
        />
      </div>
    </div>
  );
}

export default RelevanceGroups;
