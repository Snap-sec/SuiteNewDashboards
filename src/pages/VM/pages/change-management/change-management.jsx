import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardTab from './components/dashboard-tab';
import PentestRequestTab from './components/pentest-request-tab';
import { useGetVmChangeManagementDashboardQuery } from '@/services/vm/changeManagementApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import CreateNewReqButton from './components/buttons/create-new-request-button';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

const isEmpty = (v) => {
  if (!v) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') {
    return Object.values(v).every(isEmpty);
  }
  return false;
};

function ChangeManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'Dashboard';
  const { data, isLoading, isError, error } = useGetVmChangeManagementDashboardQuery();

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  if (
    !isLoading &&
    isEmpty(data?.recentActivities) &&
    isEmpty(data?.requestsByStatus) &&
    isEmpty(data?.topPriorityRequests) &&
    isEmpty(data?.severityDistribution) &&
    !isError
  ) {
    return (
      <div className="py-4 px-6 h-[80vh] flex items-center justify-center">
        <Helmet>
          <title>UniRisk | Change Management</title>
        </Helmet>
        <EmptyScreen engage={<CreateNewReqButton />} />
      </div>
    );
  }

  if (isError) {
    return <ApiErrorHandler error={error} />
  }

  return (
    <div className="py-4 px-6">
      <Helmet>
        <title>UniRisk | Change Management</title>
      </Helmet>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList variant="line" size="md" className="border-b">
          <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="Change Requests">Change Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="Dashboard">
          <div className="py-4">
            <DashboardTab />
          </div>
        </TabsContent>

        <TabsContent value="Change Requests">
          <div className="py-4">
            <PentestRequestTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ChangeManagement;
