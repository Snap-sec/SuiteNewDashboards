import { SquareChevronLeft, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useLocation } from "react-router-dom";
import { toast } from 'sonner';
import { useClapForUserMutation } from '@/services/vm/clapApi';
import { useGetVmStatsQuery, useRecomputeVmDashboardMutation } from '@/services/vm/dashboardApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import Members from './components/Card/members';
import SeverityOpenCloseDistribution from './components/Charts/severity-distribution-graph2';
import SlaOverview from './components/Charts/sla-overview';
import VulnerabilityDistribution from './components/Charts/VulnerabilityDistribution';
import VulnsBreakdownByBusinessUnits from './components/Charts/vulns-breakdown-by-business-units';
import CreateDashboardModel from './components/custom-dashboard/create-dashboard-model';
import SelectDashboard from './components/custom-dashboard/select-dashboard';
import UpdateDashboardModel from './components/custom-dashboard/update-dashboard';
import DashboardSkeleton from './components/dashboard-skeleton';
import SeverityHighlights from './components/SeverityHighlights';
import DepartmentTable from './components/table/departments-table';
import Projects from './components/table/project';
import Table from './components/table/table';
import AuthorityGuard from "@/components/custom/authority-guard/AuthorityGuard"
import VulnStateMetrics from './components/VulnStateMetrics';
import DistributionChart from './components/Charts/cwe-distribution';
import MeanTimeToClose from './components/Charts/MeanTimeToClose';
import VulnerabilityAge from './components/Charts/VulnerabilityAge';
import SourceFpDistribution from './components/table/source-fp-distribution';
import AverageAgeBySeverity from './components/table/average-age-by-severity';
import MeanDaysToCloseVuln from './components/table/mean-days-to-close-vuln';
import { CustomTooltip } from '@/components/custom/tooltip';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function Dashboard() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dashboardId = searchParams.get("id") || localStorage.getItem("dashboardId");

  const [clap] = useClapForUserMutation();
  const [recomputeDashboard, { isLoading: isRecomputing }] = useRecomputeVmDashboardMutation();
  const { data, isLoading, isFetching, error, isError } = useGetVmStatsQuery(
    dashboardId ? { dashboardId } : {},
  );

  const stats = data?.data;

  const handleRecompute = async () => {
    try {
      await recomputeDashboard().unwrap();
      toast.success('Dashboard recomputation started');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to recompute dashboard');
    }
  };

  if (!isLoading && isError) return (
    <ApiErrorHandler error={error} />
  )

  if (
    !isLoading &&
    stats?.totalVulns === 0
  )
    return (
      <div className="p-4">
        <Helmet>
          <title>UniRisk | Dashboard</title>
        </Helmet>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <PageHeading
                title={
                  dashboardId
                    ? data?.data?.customDashboards?.find(
                      (d) => d?._id === dashboardId,
                    )?.name || 'Default Dashboard'
                    : 'Dashboard'
                }
              />

              {dashboardId &&
                data?.data?.customDashboards?.some(
                  (d) => d?._id === dashboardId,
                ) && (
                  <UpdateDashboardModel
                    currentDashboard={
                      dashboardId
                        ? data?.data?.customDashboards?.find(
                          (d) => d?._id === dashboardId,
                        )
                        : null
                    }
                  />
                )}
            </div>
            <p className="-mt-4 mb-3">
              {dashboardId &&
                data?.data?.customDashboards?.find(
                  (d) => d?._id === dashboardId,
                )?.description}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <SelectDashboard
              data={data?.data?.customDashboards}
              currentId={dashboardId}
            />

            <AuthorityGuard forbidRoles={['Auditor']}>
              <CreateDashboardModel />
            </AuthorityGuard>

            <ButtonWithConfirm
              variant="outline"
              confirm
              confirmVariant="warning"
              confirmTitle="Recompute Dashboard?"
              dialog="This will trigger a full recomputation of all dashboard metrics. This may take a moment."
              onConfirm={handleRecompute}
              disabled={isRecomputing}
            >
              <RefreshCcw className={`w-4 h-4 ${isRecomputing ? 'animate-spin' : ''}`} />
            </ButtonWithConfirm>
          </div>
        </div>

        <EmptyScreen
          title="No Data Available"
          subTitle="Your dashboard does not have any data to display yet."

        />
      </div>
    );




  if (isLoading || isFetching) {
    return (
      <>
        <Helmet>
          <title>UniRisk | Operational Analytics</title>
        </Helmet>
        <DashboardSkeleton isLoading={true} />
      </>
    );
  }



  return (
    <>
      <div className="p-4">
        <Helmet>
          <title>UniRisk | Operational Analytics</title>
        </Helmet>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* text-sm text-secondary-foreground */}
              <PageHeading
                title={
                  dashboardId
                    ? data?.data?.customDashboards?.find(
                      (d) => d?._id === dashboardId,
                    )?.name || 'Default Dashboard'
                    : 'Operational Analytics'
                }
                description={
                  dashboardId
                    ? data?.data?.customDashboards?.find(
                      (d) => d?._id === dashboardId,
                    )?.description
                    : 'Monitor your organizations overall security posture with real-time vulnerability data and analytics.'
                }
              />

              {dashboardId &&
                data?.data?.customDashboards?.some(
                  (d) => d?._id === dashboardId,
                ) && (
                  <UpdateDashboardModel
                    currentDashboard={
                      dashboardId
                        ? data?.data?.customDashboards?.find(
                          (d) => d?._id === dashboardId,
                        )
                        : null
                    }
                  />
                )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">


            <AuthorityGuard forbidRoles={['Developer']}>
              <SelectDashboard
                data={data?.data?.customDashboards}
                currentId={dashboardId}
              />
            </AuthorityGuard>

            <AuthorityGuard forbidRoles={['Auditor', 'Developer']}>
              <CreateDashboardModel />
            </AuthorityGuard>

            <CustomTooltip
              text="Recompute Dashboard"
            >
              <ButtonWithConfirm
                variant="outline"
                confirm
                confirmVariant="warning"
                confirmTitle="Recompute Dashboard?"
                dialog="This will trigger a full recomputation of all dashboard metrics. This may take a moment."
                onConfirm={handleRecompute}
                disabled={isRecomputing}
              >
                <RefreshCcw className={`w-4 h-4 ${isRecomputing ? 'animate-spin' : ''}`} />
              </ButtonWithConfirm>
            </CustomTooltip>
          </div>
        </div>

        <div>
          <VulnStateMetrics data={stats} isLoading={isLoading || isFetching} />
        </div>

        <div className="mt-6">
          <VulnerabilityDistribution data={stats} isLoading={isLoading || isFetching} />
        </div>

        <div className="grid grid-cols-3 gap-5 lg:gap-6 h-full items-stretch mt-6">
          <SeverityHighlights data={stats} limit={5} isLoading={isLoading || isFetching} />

          {/* Total Open & Closed Vulns By Severity Chart */}
          <SeverityOpenCloseDistribution
            Data={stats}
            assetsLoading={isLoading || isFetching}
          />
          {dashboardId ? (
            <DepartmentTable
              title="Remediation Progress by Departments"
              assessments={stats?.topDepartments || []}
              isLoading={isLoading || isFetching}
            />
          ) : (
            <SlaOverview data={stats?.slaMetrics} isLoading={isLoading || isFetching} />
          )}
        </div>

        {/* Cve and Cwe distribution charts */}
        <div
          className={`grid ${dashboardId ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-5 mt-6 lg:gap-6 items-stretch`}
        >
          <div className={`${dashboardId ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            <Members
              title="Top Performing Members"
              members={stats?.topMembers || []}
              onClap={clap}
              isLoading={isLoading || isFetching}
            />
          </div>

          <div className={`${dashboardId ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            <AuthorityGuard
              forbidRoles={["Developer"]}
            >
              <VulnsBreakdownByBusinessUnits
                data={stats?.violationsByBusinessUnit}
                isLoading={isLoading || isFetching}
              />
            </AuthorityGuard>

            <AuthorityGuard
              forbidRoles={["Auditor", "Admin", "Manager"]}
            >
              <DistributionChart data={stats?.cweDistribution} isLoading={isLoading || isFetching} />
            </AuthorityGuard>
          </div>

          {!dashboardId && (
            <div className="lg:col-span-1">
              <DepartmentTable
                title="Remediation Progress by Departments"
                assessments={stats?.topDepartments}
                isLoading={isLoading || isFetching}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-5 mt-6 lg:gap-6 items-stretch">
          <MeanTimeToClose data={stats} isLoading={isLoading || isFetching} />
          <VulnerabilityAge data={stats} isLoading={isLoading || isFetching} />
          <SourceFpDistribution isLoading={isLoading || isFetching} data={stats?.vulnerabilitySources} />
        </div>

        {/* <div className="grid grid-cols-2 gap-5 mt-6 lg:gap-6 items-stretch">
          <AverageAgeBySeverity data={stats?.averageAgeBySeverity} />
          <MeanDaysToCloseVuln data={stats?.meanDaysToCloseVuln} />
        </div> */}

        {/* 
        <div className="grid lg:grid-cols-1 gap-5 mt-6 lg:gap-6 items-stretch">
          <div className={!dashboardId ? "lg:col-span-2" : "col-span-3"}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-normal">Top 5 Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-0">
                <Table data={stats?.top5} />
              </CardContent>
            </Card>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Dashboard;