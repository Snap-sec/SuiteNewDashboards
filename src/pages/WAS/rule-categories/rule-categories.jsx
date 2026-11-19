import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Modal } from '@/components/custom/modal';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '@/components/custom/search';
import { EmptyScreen } from '../../../components/common/empty-screen';
import { NoSearchResultsFound } from '../../../components/common/no-search-found';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import {
  useGetApisecRuleCategoriesQuery,
  useSyncDefaulApisecRulesMutation,
} from '../../../services/apisec/rulesApi';
import CreateUpdateRule from './components/card/create-update-rule';
import { RuleCategoryInfoCard, RuleCategoryInfoCardSkeleton } from './components/card/rule-category-info-card';
import useStore from './store';
import ApiErrorHandler from '@/components/common/api-error-handler';

function RuleCategories() {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState([]);
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(query, 400);

  const { data: ruleCategories, isLoading: isLoadingRuleCategories, isFetching, error, isError } =
    useGetApisecRuleCategoriesQuery({ search: debouncedSearch });
  const [syncDefaultRules] = useSyncDefaulApisecRulesMutation();


  const setMode = useStore((state) => state.setMode);
  const mode = useStore((state) => state.mode);
  const setSelectedRule = useStore((state) => state.setSelectedRule);
  const selectedRule = useStore((state) => state.selectedRule);
  const showModal = useStore((state) => state.showModal);
  const setShowModal = useStore((state) => state.setShowModal);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    // API refetch happens automatically on param change
  };

  const handleSyncDefaultRules = () => {
    toast.promise(syncDefaultRules().unwrap(), {
      loading: 'Syncing default rules',
      success: 'Default Rules synced successfully',
      error: 'Failed to sync default rules',
    });
  };

  const handleCreateRule = () => {
    setMode('create');
    setSelectedRule(null);
    setShowModal(true);
  };

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isLoadingRuleCategories &&
    !debouncedSearch &&
    !ruleCategories?.data?.length
  ) {
    return (
      <EmptyScreen
        title="No Rule categories available"
        subTitle="Looks like, you have not added any rule category, Add one to start"
        engage={
          <>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button variant="outline" onClick={handleCreateRule}>
                <Plus /> Create Rule
              </Button>
              <ButtonWithConfirm
                confirm={true}
                variant="outline"
                onConfirm={handleSyncDefaultRules}
              >
                <RefreshCw />
                Sync default rules
              </ButtonWithConfirm>
            </AuthorityGuard>
            <Modal
              open={showModal}
              setOpen={setShowModal}
              className="w-full max-w-[900px]"
            >
              <CreateUpdateRule key={`${mode}-${selectedRule?._id || 'new'}`} />
            </Modal>
          </>
        }
      />
    );
  }
  

  return (
    <div className="p-4">
      <Helmet>
        <title>WAS | Rule Categories</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <PageHeading
          title="Rule Categories"
          description="Organize and manage security rules used to identify vulnerabilities across applications and APIs."
        />

        <div className="flex gap-2 items-center">
          <SearchInput
            value={query}
            onChange={handleSearchChange}
            placeholder="Search Groups..."
            isSearching={false}
          />
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button variant="outline" onClick={handleCreateRule}>
              <Plus /> Create Rule
            </Button>
            <ButtonWithConfirm
              confirm={true}
              variant="outline"
              onConfirm={handleSyncDefaultRules}
            >
              <RefreshCw />
              Sync default rules
            </ButtonWithConfirm>
          </AuthorityGuard>
        </div>
      </div>

      <div className="grid sm:grid-cols-6 gap-5 mb-2 mt-2 2xl:grid-cols-8">
        {(isLoadingRuleCategories || isFetching) &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <RuleCategoryInfoCardSkeleton key={i} />
          ))}

        {!isLoadingRuleCategories && !isFetching &&
        ruleCategories?.data?.length > 0 &&
          ruleCategories?.data.map((cat) => (
            <RuleCategoryInfoCard
              key={cat?._id || cat?.category}
              id={cat?._id}
              logo="folder.svg"
              logoClassName={
                cat?.category?.toLowerCase() === 'custom rules'
                  ? 'hue-rotate-[75deg] saturate-[1.2]'
                  : ''
              }
              title={cat?.category}
              folders={cat}
              onClick={() => {
                navigate(`/was/category-rules/${cat?.category}`);
              }}
            />
          ))}
      </div>

       {!isLoadingRuleCategories && !isFetching &&
          !ruleCategories?.data?.length &&
          query?.length > 0 && (
            <NoSearchResultsFound
              title="No Rule categories found"
              subTitle="Looks like, you have not added any rule category, Add one to start"
            />
          )}

      <Modal
        open={showModal}
        setOpen={setShowModal}
        className="w-full max-w-[900px]"
      >
        <CreateUpdateRule key={`${mode}-${selectedRule?._id || 'new'}`} />
      </Modal>
    </div>
  );
}

export default RuleCategories;
