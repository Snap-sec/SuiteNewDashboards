import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import { useGetAutomationDashboardQuery } from '@/services/automation/dashboardApi';
import DashboardMetrics from './components/DashboardMetrics';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '@/components/common/empty-screen';
import { Button } from '@/components/ui/button';
import ApiErrorHandler from '@/components/common/api-error-handler';

export default function AutomationDashboard() {
  const { data: response, isLoading, isError, error } = useGetAutomationDashboardQuery();

  const dashboardData = response?.data?.data || response?.data || {};
  const tokenTrend = dashboardData?.tokenUsageTrend || [];

  // Consider empty if not loading and metrics are 0 or missing
  const hasData =
    isLoading ||
    Boolean(
      (dashboardData?.totalAgents && dashboardData.totalAgents > 0) ||
      (dashboardData?.totalWorkflows && dashboardData.totalWorkflows > 0) ||
      (dashboardData?.noOfWorkflows && dashboardData.noOfWorkflows > 0) ||
      (dashboardData?.totalSkills && dashboardData.totalSkills > 0) ||
      (dashboardData?.totalModels && dashboardData.totalModels > 0) ||
      (dashboardData?.totalRuns && dashboardData.totalRuns > 0) ||
      (dashboardData?.totalTokensUsed && dashboardData.totalTokensUsed > 0) ||
      (dashboardData?.totalCost && dashboardData.totalCost > 0) ||
      tokenTrend.length > 0
    );

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>Automation | Dashboard</title>
      </Helmet>

      {!hasData ? (
        <EmptyScreen
          title="No dashboard data yet"
          subTitle="Run some workflows to start seeing activity here."
          engage={
            <Link to="/ai-agent-builder/workflows/new">
              <Button>
                <Plus className="size-4 mr-2" />
                Create Workflow
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <PageHeading title="Dashboard" description="An overview of your automation agents and recent activity." />

          <DashboardMetrics data={dashboardData} isLoading={isLoading} />

          <ReAreaChart
            data={tokenTrend}
            xKey="date"
            keys={[{ key: 'tokens', label: 'Tokens Used' }]}
            colors={['hsl(217, 91%, 60%)']}
            title="Token Usage Trend"
            height={280}
            isLoading={isLoading}
            stacked={false}
            xTickFormatter={(v) => v?.slice(5)}
          />
        </>
      )}
    </div>
  );
}
