import { Plus } from 'lucide-react';
import { useGetAsmRulesQuery } from '@/services/asm/ruleApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../components/common/empty-screen';
import ExecuteActiveRules from './components/actions/execute-active-rules';
import SyncRules from './components/actions/sync-rules';
import TableToolbar from './components/filters';
import RuleTable from './components/rule-table';
import useStore from './store';

const SecurityRulesView = () => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);

  const {
    data: asmRules,
    isLoading,
    isFetching,
  } = useGetAsmRulesQuery({
    product: 'asm',
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
  });

  if (!asmRules?.totalResults && !isLoading && !Object.keys(filters).length)
    return (
      <EmptyScreen
        title="No rules found"
        subTitle="There are no rules created yet. Please create a rule to get started."
        engage={
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = '/casm/rules/guided-editor')
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Create Rule
            </Button>
            <Link to="/assetinventory/engine/policy/library">
              <Button variant="outline">Explore signal library</Button>
            </Link>
          </div>
        }
      />
    );

  return (
    <div className="min-h-screen  px-6 py-2">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-5">
          <PageHeading
            title="Rules"
            description={
              <p>
                List of rules to auto-classify assets as exposures.{' '}
                {/* <a
                  target="_blank"
                  className="text-sm text-blue-500 underline"
                  href="https://github.com/Snap-sec/Suite-Yaml-Rule-Guides/blob/main/rule-guides/asm.md"
                  rel="noreferrer"
                >
                  Guide
                </a> */}
              </p>
            }
          />
        </div>

        {/* Filters */}
        <Card className=" px-5 py-3 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TableToolbar supportedFilters={asmRules?.filters} />
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-sm ${!asmRules?.totalResults && 'hidden'}`}
              >
                {asmRules?.totalResults} rule
                {asmRules?.totalResults !== 1 ? 's' : ''}
              </span>
              <div className="h-6 w-px "></div>
              <Button
                variant="outline"
                onClick={() =>
                  (window.location.href = '/casm/rules/guided-editor')
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Create Rule
              </Button>
              <ExecuteActiveRules />
              {/* <ExecuteAllRules /> */}
              <SyncRules />
            </div>
          </div>
        </Card>

        {/* Rules List */}
        <RuleTable
          data={asmRules}
          loading={isLoading || isFetching}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </div>
  );
};

export default SecurityRulesView;
