import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetVmAssessmentStatsQuery,
  useGetVmAssessmentDetailsQuery,
} from '@/services/vm/assessmentsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceGuard from '@/components/custom/authority-guard/ServiceGuard';
import ActivityTab from './activity-log-tab';
import Vulnerabilities from './assessment-vulns/vulnerabilities-tab';
import AutomationTab from './automation-tab';
import BasicDetailsTab from './basic-details-tab';
import ChangeInfoTab from './change-info/change-info-tab';
import EvidenceTab from './evidences-tab';
import { MatricsTab } from './matrics-tab';
import NotificationsTab from './notifications-tab';
import Reports from './reports';
import Scope from './scope';
import { BasicDetails } from '../components/basic-details';

function AssessmentTabs() {
  const { user } = useAuth();
  const currentUserAccType = user?.account_type?.toLowerCase();

  const [params] = useSearchParams();

  const taskType = params.get('taskType');

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isFetching: statsFetching,
  } = useGetVmAssessmentStatsQuery(params.get('assessmentId'));

  const {
    data,
    isLoading,
    error: assessmentDetailsError,
    isError: isAssessmentDetailsError,
    refetch: refetchDetails,
    isFetching: detailsFetching,
  } = useGetVmAssessmentDetailsQuery(params.get('assessmentId'));

  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get('tab') || 'Matrics';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  const firstLoad = useRef(true);

  useEffect(() => {
    if (taskType === 'edit-assmt') {
      setActiveTab('Basic Details');

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', 'Basic Details');
        return next;
      });
    }
  }, [taskType]);

  return (
    <div className="flex flex-col gap-4">
      <div className="col-span-2">
        <BasicDetails
          data={stats?.data || stats}
          assessmentData={data?.data}
          loading={statsLoading || isLoading}
          refetchStats={refetchStats}
          refetchDetails={refetchDetails}
          isRefreshing={statsFetching || detailsFetching}
        />
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList variant="line" size="md" className="border-b">
        <TabsTrigger value="Matrics">Dashboard</TabsTrigger>

        {data?.data?.changeRequestData?.applicationServiceName && (
          <TabsTrigger value="change-info">Change Info</TabsTrigger>
        )}
        <TabsTrigger value="Vulnerabilities">Vulnerabilities</TabsTrigger>
        {/* <TabsTrigger value="Notification">Notification</TabsTrigger> */}
        <TabsTrigger value="Evidences">Docs & Evidences</TabsTrigger>
        <TabsTrigger value="Activity">Activity</TabsTrigger>
        <TabsTrigger value="Reports">Reports</TabsTrigger>
        <TabsTrigger value="Automation">Automation</TabsTrigger>

        {/* Show this tab only to service provider */}
        {currentUserAccType == 'service-provider' && (
          <TabsTrigger value="Scope">Scope</TabsTrigger>
        )}

        <TabsTrigger value="Basic Details">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="Matrics">
        <div className="p-4">
          <MatricsTab
            assessmentData={data?.data}
            data={stats}
            loading={isLoading || statsLoading}
            isError={isAssessmentDetailsError}
            error={assessmentDetailsError}
          />
        </div>
      </TabsContent>

      <TabsContent value="Basic Details">
        <div className="p-4">
          <BasicDetailsTab
            data={data?.data}
            stats={stats}
            loading={isLoading || statsLoading}
            error={assessmentDetailsError}
            isError={isAssessmentDetailsError}
          />
        </div>
      </TabsContent>

      {/* <TabsContent value="Notification">
        <div className="p-4">
          <NotificationsTab data={data?.data} loading={isLoading} />
        </div>
      </TabsContent> */}

      <TabsContent value="Evidences">
        <div className="p-4">
          <EvidenceTab data={data?.data} loading={isLoading || statsLoading} error={assessmentDetailsError} isError={isAssessmentDetailsError}/>
        </div>
      </TabsContent>

      <TabsContent value="change-info">
        <div className="p-4">
          <ChangeInfoTab changeRequestData={data?.data} statsData={stats?.data} loading={isLoading} error={assessmentDetailsError} isError={isAssessmentDetailsError}  />
        </div>
      </TabsContent>

      <TabsContent value="Activity">
        <div className="p-4">
          <ActivityTab assessmentId={params.get('assessmentId')} />
        </div>
      </TabsContent>

      <TabsContent value="Reports">
        <div className="p-4">
          <Reports />
        </div>
      </TabsContent>

      <TabsContent value="Automation">
        <div className="p-4">
          <AutomationTab
            assessmentId={params.get('assessmentId')}
            assessmentData={data?.data}
          />
        </div>
      </TabsContent>

      {/* Show this tab only to service provider */}
      {currentUserAccType == 'service-provider' && (
        <TabsContent value="Scope">
          <div className="p-4">
            <Scope />
          </div>
        </TabsContent>
      )}

      <TabsContent value="Vulnerabilities">
        <div className="p-4">
          <Vulnerabilities
            assessmentId={params.get('assessmentId')}
            // Forcing remount when assessmentId changes to reset internal state of Vulnerabilities component
            key={params.get('assessmentId')}
          />
        </div>
      </TabsContent>
    </Tabs>
    </div>
  );
}
export default AssessmentTabs;
