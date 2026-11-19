import React from 'react';
import { Helmet } from 'react-helmet';
import PageHeading from '@/components/custom/page-heading';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetVsGroupsQuery } from '../../../../services/vs/groupApi';
import GroupComponent from './components/lists/group-comp';
import CreateGroupModal from './components/modals/post-group-modal';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

const Groups = () => {
  const { data: groupsData, isLoading, error, isError } = useGetVsGroupsQuery();

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (!isLoading && !groupsData?.groups?.length) return <EmptyScreen
    title="No Groups Found"
    subTitle="There are currently no groups to display."
    engage={<AuthorityGuard forbidRoles={['Auditor']}>
      <CreateGroupModal triggeredBtnText="Create a Group" />
    </AuthorityGuard>}
  />;

  return (
    <div className="p-4">
      <Helmet>
        <title>VS | Groups</title>
      </Helmet>

      {(isLoading || groupsData?.groups?.length > 0) && (
        <div className="w-full flex items-center justify-between pr-2 mb-2">
          {isLoading ? (
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-7 w-32 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
          ) : (
            <PageHeading title="Groups" description="View and organize assets into groups for streamlined vulnerability management." />
          )}

          {isLoading ? (
            <Skeleton className="h-9 w-32 rounded-md" />
          ) : (
            <AuthorityGuard forbidRoles={['Auditor']}>
              <CreateGroupModal />
            </AuthorityGuard>
          )}
        </div>
      )}

      <GroupComponent
        groupData={groupsData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Groups;
