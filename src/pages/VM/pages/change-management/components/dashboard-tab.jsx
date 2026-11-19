import { useGetVmChangeManagementDashboardQuery } from '@/services/vm/changeManagementApi';
import PageHeading from '@/components/custom/page-heading';


import BusinessUnitsPieChart from './graphs/business-units-piechart';
import RecentActivity from './graphs/recent-activity';
import RequestByStatus from './graphs/request-by-status';
import SeverityDistribution from './graphs/severity-distribution';
import TopPriorityReqsTable from './table/top-priority-requests-table';

function DashboardTab() {
  const { data, isLoading } = useGetVmChangeManagementDashboardQuery();

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading
          title="Dashboard"
          description="Change management dashboard for tracking, reviewing, and managing security changes."
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <RequestByStatus
          data={data?.requestsByStatus}
          assetsLoading={isLoading}
        />

        <BusinessUnitsPieChart
          data={data?.changeRequestsPerBusinessUnit}
          loading={isLoading}
        />

        {/* <RecentActivity
          data={data?.recentActivities}
          assetsLoading={isLoading}
        /> */}

        <SeverityDistribution
          statsData={data?.severityDistribution}
          assetsLoading={isLoading}
        />
      </div>
      <TopPriorityReqsTable
        data={data?.topPriorityRequests}
        isLoading={isLoading}
      />
    </div>
  );
}

export default DashboardTab;
