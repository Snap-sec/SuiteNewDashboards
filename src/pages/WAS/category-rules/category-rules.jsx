import { useParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { useGetApisecCategoryRulesQuery } from '../../../services/apisec/rulesApi';
import { RuleInfoCard, RuleInfoCardSkeleton } from './components/cards/rule-info-card';
import useStore from '../rule-categories/store';
import CreateUpdateRule from '../rule-categories/components/card/create-update-rule';
import { Modal } from '@/components/custom/modal';
import { Helmet } from 'react-helmet';
import ApiErrorHandler from '@/components/common/api-error-handler';

const CategoryRules = () => {
  const { categoryName } = useParams();
  const showModal = useStore((state) => state.showModal);
  const setShowModal = useStore((state) => state.setShowModal);
  const mode = useStore((state) => state.mode);
  const selectedRule = useStore((state) => state.selectedRule);

  const { data: rules = [], isLoading: isLoadingRules, error, isError } =
    useGetApisecCategoryRulesQuery(categoryName, {
      skip: !categoryName,
    });

  if (isError) return <ApiErrorHandler error={error} />;

  if (!isLoadingRules && rules?.data?.length === 0) {
    return (
      <>
      <Helmet>
        <title>WAS | Rules</title>
      </Helmet>

      <EmptyScreen
        title="No Rules Found"
        subTitle="No Rules added yet. Create one to get started."
      />
      </>
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>WAS | Rules</title>
      </Helmet>
      
      <div className="mb-2 flex items-center justify-between">
        <PageHeading title="Rules" description="Manage security rules used to detect and identify vulnerabilities in web applications and APIs." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {isLoadingRules
          ? Array.from({ length: 6 }).map((_, i) => (
              <RuleInfoCardSkeleton key={i} />
            ))
          : rules?.data?.map((rule) => (
              <RuleInfoCard key={rule.id} rule={rule} />
            ))}
      </div>

      <Modal open={showModal} setOpen={setShowModal} className="w-full max-w-[900px]">
        <CreateUpdateRule key={`${mode}-${selectedRule?._id || 'new'}`} />
      </Modal>
    </div>
  );
};

export default CategoryRules;
