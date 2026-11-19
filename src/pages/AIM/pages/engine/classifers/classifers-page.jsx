import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import SetupScreen from '@/components/common/setup-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import { ClassifierDetailsView } from './components/classifier-details-view';
import { ClassifierSidebar } from './components/classifier-sidebar';
import useStore from './store';

const TAB_HEADINGS = {
  active: {
    title: 'Active Policies',
    description:
      'Define and manage active classification policies to categorize and process assets automatically.',
  },
  disabled: {
    title: 'Disabled Policies',
    description:
      'Review and manage disabled classification policies and inactive automation rules across your inventory.',
  },
};

export default function Classifers() {
  const navigate = useNavigate();
  const currentTab = useStore((state) => state.currentTab);
  const sidebarSearch = useStore((state) => state.sidebarSearch);
  const [activeClassifier, setActiveClassifier] = useState(null);
  const [classifiersState, setClassifiersState] = useState({
    isLoading: true,
    isEmpty: false,
    isSystemEmpty: false,
    error: {},
    isError: false,
  });

  if (
    !classifiersState.isError &&
    !classifiersState.isLoading &&
    classifiersState.isSystemEmpty &&
    !sidebarSearch
  )
    return (
      <SetupScreen
        title="Setup Automation"
        subTitle="To get started, create a new policy to automatically classify your findings."
        steps={[
          {
            title: 'Create a new policy',
            description:
              'Click the Add Policy button below to start creating your first classification policy.',
          },
          {
            title: 'Define conditions',
            description:
              'Set up the rules that will determine which findings match this policy.',
          },
          {
            title: 'Set actions',
            description:
              'Choose what happens when a finding matches your policy conditions.',
          },
        ]}
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate(`/assetinventory/engine/policy/new`)}>
                <Plus className="w-4 h-4 mr-2" /> Create Policy
              </Button>
              <Link to="/assetinventory/engine/policy/library">
                <Button variant="secondary">
                  Explore signal library
                </Button>
              </Link>
            </div>
          </AuthorityGuard>
        }
      />
    );

  if (classifiersState?.isError)
    return <ApiErrorHandler error={classifiersState.error} />;

  const heading = TAB_HEADINGS[currentTab] || TAB_HEADINGS.active;

  return (
    <div className="flex p-4 flex-col bg-background h-[calc(100vh-90px)] min-h-0 flex-1 overflow-hidden">
      <Helmet>
        <title>{`AssetIQ | ${heading.title}`}</title>
      </Helmet>

      <div className="mb-1">
        <PageHeading
          title={heading.title}
          description={heading.description}
        />
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0 border rounded-md">
        <ClassifierSidebar
          onActiveClassifierChange={setActiveClassifier}
          onClassifiersStateChange={setClassifiersState}
        />

        {classifiersState.isEmpty ? (
          <main className="flex-1 bg-background flex flex-col justify-center items-center">
            <EmptyScreen
              title="No Policies Found"
              subTitle={
                sidebarSearch
                  ? `No policies match your search for "${sidebarSearch}".`
                  : "There are currently no policies matching your filters."
              }
              engage={
                !sidebarSearch && (
                  <AuthorityGuard forbidRoles={['Auditor']}>
                    <div className="flex items-center gap-4">
                      <Button onClick={() => navigate(`/assetinventory/engine/policy/new`)}>
                        <Plus className="w-4 h-4 mr-2" /> Create Policy
                      </Button>
                      <Link to="/assetinventory/engine/policy/library">
                        <Button variant="secondary">
                          Explore signal library
                        </Button>
                      </Link>
                    </div>
                  </AuthorityGuard>
                )
              }
            />
          </main>
        ) : (
          <ClassifierDetailsView
            activeClassifier={activeClassifier}
            isLoading={classifiersState.isLoading}
          />
        )}
      </div>
    </div>
  );
}
