import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import useDebounce from '@/hooks/use-debounce';
import { useGetAimPoliciesByTypeQuery } from '@/services/asset-inventory/policyApi';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { AlertDetailsView } from './components/alert-details-view';
import { AlertsSidebar } from './components/alerts-sidebar';
import useStore from './store';


export default function ViolationsAndAlerts() {
  const navigate = useNavigate();

  const search = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: policies,
    isLoading: policiesLoading,
    isFetching: policiesFetching,
  } = useGetAimPoliciesByTypeQuery({
    type: 'alert',
    search: debouncedSearch,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const [activeAlert, setActiveAlert] = useState(null);
  const [alertsState, setAlertsState] = useState({
    isLoading: true,
    isEmpty: false,
  });

  if (!policiesLoading && !policies?.length && !search)
    return (
      <>
        <Helmet>
          <title>AssetIQ | Alerts</title>
        </Helmet>

        <EmptyScreen
          title="No Alert Policies Found"
          subTitle="To get started, create a new alert policy"
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button
                onClick={() => navigate('/assetinventory/engine/alerts/new')}
              >
                <Plus /> Create Violation
              </Button>
            </AuthorityGuard>
          }
        />
      </>
    );

  return (
    <div className="flex flex-col bg-background h-[calc(100vh-90px)] overflow-hidden">
      <Helmet>
        <title>AssetIQ | Alerts</title>
      </Helmet>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <AlertsSidebar
          onActiveAlertChange={setActiveAlert}
          onAlertsStateChange={setAlertsState}
        />

        {alertsState.isEmpty ? (
          <main className="flex-1 bg-background flex flex-col justify-center items-center">
            <EmptyScreen
              title="No Alerts Found"
              subTitle="There are currently no alerts matching your filters."
              engage={
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <Button
                    onClick={() =>
                      navigate('/assetinventory/engine/alerts/new')
                    }
                  >
                    <Plus /> Create Violation
                  </Button>
                </AuthorityGuard>
              }
            />
          </main>
        ) : (
          <AlertDetailsView
            activeAlert={activeAlert}
            policies={policies}
            isLoading={policiesLoading}
            isFetching={policiesFetching}
          />
        )}
      </div>
    </div>
  );
}
