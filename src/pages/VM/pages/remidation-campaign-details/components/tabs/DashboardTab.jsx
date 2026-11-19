import React from 'react';
import { useGetVmRemidationCampaignDashboardQuery } from '@/services/vm/remidationCampaignApi';
import ResolutionsTimelineChart from '../charts/ResolutionsTimelineChart';
import SeverityColumnChart from '../charts/SeverityColumnChart';
import StatePieChart from '../charts/StatePieChart';
import TopAssetsTable from '../charts/TopAssetsTable';
import VulnerabilityDonutChart from '../charts/VulnerabilityDonutChart';

function DashboardTab({ remediationCampaignId }) {
  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetVmRemidationCampaignDashboardQuery(remediationCampaignId, {
    skip: !remediationCampaignId,
  });

  const dashboardData = apiData?.data || apiData;
  const loading = isLoading || isFetching;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Resolutions Timeline Chart */}
      <div className="w-full">
        <ResolutionsTimelineChart
          dashboardData={dashboardData}
          isLoading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
        <VulnerabilityDonutChart
          counts={dashboardData?.counts}
          isLoading={loading}
        />
        <SeverityColumnChart
          severityCounts={dashboardData?.severityCounts}
          isLoading={loading}
        />
        <StatePieChart
          stateBreakdown={dashboardData?.stateBreakdown}
          isLoading={loading}
        />
      </div>

      {/* Top Assets Table */}
      {/* <div className="w-full">
        <TopAssetsTable
          topAssets={dashboardData?.topAssets}
          isLoading={loading}
        />
      </div> */}
    </div>
  );
}

export default DashboardTab;
