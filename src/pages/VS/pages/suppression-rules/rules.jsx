import React, { useEffect } from 'react';
import {
  Plus,
} from 'lucide-react';
import {
  useGetVsSuppressionRulesQuery
} from '@/services/vs/vsApi';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import RuleTable from './components/RuleTable';
import useStore from './store';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { Link } from 'react-router-dom';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';


const SecurityRulesView = () => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: pagination.pageSize }));
  }, [searchQuery, filters]);

  const { data: suppressionRules, isLoading, isFetching, isError, error } = useGetVsSuppressionRulesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, sortAs: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    ...filters,
  });

  if (isError) return <ApiErrorHandler error={error} />;

  if (!isLoading && !isError && suppressionRules?.totalResults === 0 && !Object.keys(filters).length && !searchQuery) {
    return (
      <div className="min-h-screen px-6 py-2">
        <Helmet>
          <title>VS | Suppression Rules</title>
        </Helmet>
        <EmptyScreen
          title="No Suppression Rules Found"
          subTitle="You haven't created any suppression rules yet. Create a rule to start automatically suppressing vulnerabilities."
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Link to="/vs/suppression-rules/guided-editor">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" /> Create Rule
                </Button>
              </Link>
            </AuthorityGuard>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-2">
      <div className="w-full mx-auto">
        <Helmet>
          <title>VS | Suppression Rules</title>
        </Helmet>
        {/* Header */}
        <div className=" flex items-start justify-between">
          <PageHeading
            title="Suppression Rules"
            description="Create and manage rules for automatically suppressing vulnerabilities based on conditions."
          />
          <div className="flex items-center gap-3">
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Link to="/vs/suppression-rules/guided-editor">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" /> Create Rule
                </Button>
              </Link>
            </AuthorityGuard>
          </div>
        </div>

        {/* Rules Table */}
        <RuleTable
          data={suppressionRules}
          isLoading={isLoading}
          isFetching={isFetching}
        />

        {!isLoading && suppressionRules?.results?.length === 0 && !searchQuery && Object.keys(filters).length === 0 && (
          <div className="mt-10">
            <EmptyScreen
              title="No Results Found"
              subTitle="No rules match the selected filters or search. Try adjusting your search or filters."
              engage={
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Clear All Filters
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityRulesView;

