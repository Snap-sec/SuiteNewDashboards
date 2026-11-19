import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import PaginationView from '@/components/custom/pagination';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import AssessmentsList from './components/lists/assessments-list';
import CreateAssessmentModel from './components/Modal/create-assessment-model';
import { useStore } from './store';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function Assessment() {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const setPage = useStore((state) => state.setPage);
  const sorting = useStore((state) => state.sorting);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const activeView = useStore((state) => state.activeView);

  const search = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 35 });
  }, [filters, searchQuery, setPagination]);

  const {
    data: assessments,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetVmAssessmentsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    search,
    ...filters,
  });

  if (
    !isLoading &&
    assessments?.data?.assessments.length == 0 &&
    !search &&
    !Object.keys(filters)?.length &&
    !isError
  )
    return (
      <EmptyScreen
        title="No Assessments Found"
        subTitle="To get started, create a new assessment"
        engage={
          <AuthorityGuard
            forbidRoles={['Auditor']}
            roles={['Admin', 'Manager']}
          >
            <CreateAssessmentModel />
          </AuthorityGuard>
        }
      />
    );

  if (isError) {
    return <ApiErrorHandler error={error} />
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>UniRisk | Assessments</title>
      </Helmet>

      <div className="w-full flex flex-row mb-1 justify-between items-center">
        <PageHeading
          title="Assessments"
          description="Manage and track all security assessments across your organization."
        />

          <AuthorityGuard
            forbidRoles={['Auditor']}
          >
            <CreateAssessmentModel />
          </AuthorityGuard>
      </div>

      <AssessmentsList
        assessments={assessments}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {activeView !== 'list' && (
        <div className="my-3 flex justify-end">
          {assessments?.data?.totalPages > 1 ? (
            <PaginationView
              currentPage={pagination.pageIndex + 1}
              totalPages={assessments?.data?.totalPages}
              onPageChange={setPage}
              className=" w-fit mx-0"
            />
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
}

export default Assessment;
