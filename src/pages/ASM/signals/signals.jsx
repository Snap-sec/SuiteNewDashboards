import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { useGetAsmExposuresByIdsQuery } from '@/services/asm/exposureApi';
import { useGetAsmRuleQuery, useGetAsmRulesQuery } from '@/services/asm/ruleApi';

import useExposureStore from '@/pages/ASM/exposures/store';
import useStore2 from './store';
import useDebounce from '@/hooks/use-debounce';

import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import EditExposure from './components/edit-exposure';
import { SignalsSidebar } from './components/signals-sidebar';
import { RuleDetailsView } from './components/rule-details-view';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';

const TAB_HEADINGS = {
  'built-in': {
    title: 'Risk Signals',
    description:
      'Monitor and manage active risk signals detected across your organization’s attack surface.',
  },
  custom: {
    title: 'Disabled Risk Signals',
    description:
      'Review and manage disabled detection rules and inactive risk signals across your attack surface.',
  },
};

function Signals() {
  const currentTab = useStore2((state) => state.currentTab);
  const assetSearch = useStore2((state) => state.assetSearch);
  const ruleSearch = useStore2((state) => state.ruleSearch);

  const pagination = useExposureStore((state) => state.pagination);
  const setPagination = useExposureStore((state) => state.setPagination);
  const filters = useExposureStore((state) => state.filters);
  const sorting = useExposureStore((state) => state.sorting);

  const debouncedSearch = useDebounce(assetSearch, 400);
  const debouncedRuleSearch = useDebounce(ruleSearch, 400);

  const [activeRule, setActiveRule] = useState(null);
  const [rulesState, setRulesState] = useState({ isLoading: true, isEmpty: false });
  const [isPaginationSynced, setIsPaginationSynced] = useState(false);

  const [searchParams] = useSearchParams();
  const ruleIdParam = searchParams.get('ruleId');

  const {
    data: rulesOverview,
    isLoading: rulesLoading,
    isFetching: rulesFetching,
  } = useGetAsmRulesQuery({
    product: 'asm',
    limit: 10,
    page: 1,
    search: debouncedRuleSearch,
  });

  const { data: singleRule } = useGetAsmRuleQuery(ruleIdParam, {
    skip: !ruleIdParam,
  });

  const setActiveRuleId = useStore2((state) => state.setActiveRuleId);

  useEffect(() => {
    if (ruleIdParam) {
      setActiveRuleId(ruleIdParam);
    }
  }, [ruleIdParam, setActiveRuleId]);

  useEffect(() => {
    if (ruleIdParam && singleRule) {
      const ruleObj = singleRule.data || singleRule;
      setActiveRule(ruleObj);
    }
  }, [singleRule, ruleIdParam]);

  useEffect(() => {
    setPagination((prev) => ({ pageIndex: 0, pageSize: prev?.pageSize || 10 }));
    setIsPaginationSynced(true);
  }, [debouncedSearch, filters, activeRule?._id]);

  const { data: exposuresData, isLoading: exposuresLoading, isFetching: exposuresFetching } = useGetAsmExposuresByIdsQuery({
    ruleId: activeRule?._id,
    search: debouncedSearch,
    page: pagination?.pageIndex + 1,
    limit: pagination?.pageSize,
    ...filters,
    ...sorting,
  }, { skip: !activeRule || !isPaginationSynced });

  const heading = TAB_HEADINGS[currentTab] || TAB_HEADINGS['built-in'];

  if (
    !ruleIdParam &&
    !rulesLoading &&
    !rulesFetching &&
    (!rulesOverview?.totalResults || rulesOverview?.results?.length === 0) &&
    !debouncedRuleSearch
  ) {
    return (
      <EmptyScreen
        title="No Signals Found"
        subTitle="There are currently no signals available. Please create a rule to get started."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <div className="flex items-center gap-4">
              <Link to="/casm/rules/guided-editor">
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Create Rule
                </Button>
              </Link>
              <Link to="/casm/signal-library">
                <Button variant="secondary">
                  Explore signal library
                </Button>
              </Link>
            </div>
          </AuthorityGuard>
        }
      />
    );
  }

  return (
    <div className="flex p-4 flex-col bg-background h-[calc(100vh-90px)] min-h-0 flex-1 overflow-hidden">
      <Helmet>
        <title>{`Xpose | ${heading.title}`}</title>
      </Helmet>

      <div className="mb-1">
        <PageHeading
          title={heading.title}
          description={heading.description}
        />
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0 border rounded-md">
        <SignalsSidebar
          onActiveRuleChange={setActiveRule}
          onRulesStateChange={setRulesState}
          singleRule={singleRule}
        />

        {rulesState.isEmpty ? (
          <main className="flex-1 bg-background flex flex-col justify-center items-center">
            <EmptyScreen
              title="No Rules Found"
              subTitle="There are currently no rules available matching your filters."
              engage={
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <div className="flex items-center gap-4">
                    <Link to="/casm/rules/guided-editor">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" /> Create Rule
                      </Button>
                    </Link>
                    <Link to="/casm/signal-library">
                      <Button variant="secondary">
                        Explore signal library
                      </Button>
                    </Link>
                  </div>
                </AuthorityGuard>
              }
            />
          </main>
        ) : (
          <RuleDetailsView
            activeRule={activeRule}
            setActiveRule={setActiveRule}
            exposuresData={exposuresData}
            exposuresLoading={exposuresLoading}
            exposuresFetching={exposuresFetching}
            rulesLoading={rulesState.isLoading}
          />
        )}
      </div>

      <EditExposure />
    </div>
  );
}

export default Signals;
