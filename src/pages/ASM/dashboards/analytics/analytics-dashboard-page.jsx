import ApiErrorHandler from '@/components/common/api-error-handler';
import { Helmet } from 'react-helmet';
import { useGetAsmAttackSurfaceOverviewQuery } from '@/services/asm/dashboardApi';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import RecomputeDashboardAction from './components/actions/recompute-dashboard-action';
import MetricsCards from './components/cards/metrics-cards';
// New requested breakdown charts
import AssetsWithWithoutSignalsChart from './components/charts/assets-signals-chart';
import CertificatesChart from './components/charts/certificates-chart';
import IpAddressesChart from './components/charts/ip-addresses-chart';
import OpenPortsCountChart from './components/charts/open-ports-count-chart';
// Existing / original charts
import SubdomainsLiveDeadChart from './components/charts/subdomains-livedead-chart';
import WebServersStatusDistributionChart from './components/charts/web-servers-status-distribution-chart';


export default function AnalyticsDashboardPage() {
  const {
    data: responseData,
    error,
    isLoading,
    isFetching,
  } = useGetAsmAttackSurfaceOverviewQuery({});

  const apiData = responseData?.data;

  const totalAssets =
    apiData?.metrics?.dns +
      apiData?.metrics?.api +
      apiData?.metrics?.certificate +
      apiData?.metrics?.ip +
      apiData?.metrics?.port +
      apiData?.metrics?.subdomain +
      apiData?.metrics?.technology +
      apiData?.metrics?.web_server || 0;

  const any_exposures = apiData?.metrics?.totalTicketsEscalated || 0;

  if (error && !isLoading && !isFetching) {
    return <ApiErrorHandler error={error} />;
  }

  if (!isLoading && !isFetching && !(totalAssets || any_exposures)) {
    return <EmptyScreen engage={<RecomputeDashboardAction />} />;
  }

  const loadingState = isLoading || isFetching;

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Analytics Dashboard</title>
      </Helmet>

      <div className="flex items-end justify-between items-center gap-4 mb-1">
        <PageHeading
          title="Attack Surface Analytics"
          description="Analyze attack surface data, asset trends, exposure signals, and security insights."
        />
        <RecomputeDashboardAction />
      </div>

      <MetricsCards apiData={apiData} isLoading={loadingState} />

      {/* Row 1: Existing charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <AssetsWithWithoutSignalsChart
          apiData={apiData}
          isLoading={loadingState}
        />
        {/* <SubdomainsChart
          apiData={apiData}
          isLoading={loadingState}
        /> */}
        {/* <PortsChart apiData={apiData} isLoading={loadingState} /> */}
        <CertificatesChart
          apiData={apiData}
          isLoading={loadingState}
        />
        <IpAddressesChart
          apiData={apiData}
          isLoading={loadingState}
        />
      </div>

      {/* Row 3: New requested breakdown charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <WebServersStatusDistributionChart
          apiData={apiData}
          isLoading={loadingState}
        />
        <SubdomainsLiveDeadChart
          apiData={apiData}
          isLoading={loadingState}
        />
        <OpenPortsCountChart
          apiData={apiData}
          isLoading={loadingState}
        />
      </div>
    </div>
  );
}
