import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAsmDashboardStatsQuery } from '@/services/asm/dashboardApi';
import { useGetAsmSettingsQuery } from '@/services/asm/configApi';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '../../../../components/custom/page-heading';
import LaunchNewScan from '../../integrations/components/buttons/launch-new-scan';
import RecomputeDashboardAction from '../analytics/components/actions/recompute-dashboard-action';
import AssetDistributionChart from './components/asset-distribution-chart';
import CurrentPostureTable from './components/attack-surface-posture-table';
import MetricsCards from './components/cards/metrics-cards';
import PortDistribution from './components/port-distribution';
import RiskDistributionChart from './components/risk-distribution-chart';


function Dashboard() {
  const [filter] = useState('daily');
  const { data: statsData, isLoading, isError, error } = useGetAsmDashboardStatsQuery({ filter });
  const { data: asmSettingsData, isLoading: isLoadingSettings } = useGetAsmSettingsQuery();

  const has_data = statsData?.data?.metrics?.total_assets || statsData?.data?.metrics?.total_risks;
  const isScanConfigured = !!asmSettingsData?.data;

  if (isError && !isLoading) {
    return <ApiErrorHandler error={error} />;
  }
  
  if (!isLoading && !has_data) {
    return (
      <div className="p-4">
        <Helmet>
          <title>Xpose | Dashboard </title>
        </Helmet>

        {/* <div className="flex gap-4 items-center justify-between">
          <PageHeading
            title="Dashboard"
            description="Monitor overall attack surface exposure, risk trends, and security posture."
          />

          <div className="flex items-center gap-2">
            <RecomputeDashboardAction iconOnly />
          </div>
        </div> */}

        <EmptyScreen
          title="No data available"
          subTitle="There are no data to show, please create a scan to see dashboard data"
          engage={
            isLoadingSettings ? null : isScanConfigured ? (
              <>
              <RecomputeDashboardAction variant="primary" />
              <LaunchNewScan variant="primary" />
              </>
            ) : (
              <Link to={`/casm/settings`}>
                <Button>
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Setup
                </Button>
              </Link>
            )
          }
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Xpose | Dashboard </title>
      </Helmet>

      <div className="p-4">
        <div className="flex gap-4 items-center justify-between">
          <PageHeading
            title="Dashboard"
            description="Monitor overall attack surface exposure, risk trends, and security posture."
          />

          <div className="flex items-center gap-2">
            <RecomputeDashboardAction iconOnly />
          </div>
        </div>

        <div className="mt-1">
          <MetricsCards data={statsData?.data?.metrics} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:gap-6 h-full items-stretch">
          {/* <ClassificationPieChart
            data={statsData?.data?.classification}
            isLoading={isLoading}
          /> */}

          {/* <TrendGraph
            data={statsData?.data?.assets_vs_risks_trend}
            isLoading={isLoading}
            filter={filter}
            setFilter={setFilter}
          /> */}
        </div>

        <div className="grid grid-cols-3 gap-5 lg:gap-6 h-full items-stretch mt-6">
          <AssetDistributionChart
            data={statsData?.data?.attack_surface_posture}
            isLoading={isLoading}
          />

          <PortDistribution
            data={statsData?.data?.attack_surface_posture}
            isLoading={isLoading}
          />

          <RiskDistributionChart
            data={statsData?.data?.attack_surface_posture}
            isLoading={isLoading}
          />
        </div>

        {/* <div className="grid grid-cols-1 gap-5 lg:gap-7.5 h-full items-stretch mt-6">
          <TopExposure
            data={statsData?.data?.top_risks}
            isLoading={isLoading}
          />
        </div> */}

        <div className="mt-6">
          <CurrentPostureTable
            data={statsData?.data?.attack_surface_posture}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
