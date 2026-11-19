import { RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import {
  useGetCsmDashboardQuery,
  useGetCspmDashboardQuery,
} from '@/services/csm/dashboardApi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import CategoryDistributionChart from './components/charts/category-distribution-chart';
import CloudExposureChart from './components/charts/cloud-exposure-chart';
import CloudSecurityScoreChart from './components/charts/cloud-security-score-chart';
import FindingsTrendChart from './components/charts/findings-trend-chart';
import MetricsStrip from './components/metrics-strip';
import { useNavigate } from 'react-router-dom';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function DashboardPage() {
  const navigate = useNavigate();
  const { data: response, isLoading, isFetching, isError, error } = useGetCsmDashboardQuery();
  const { data: CSresponse, isLoading: CSisLoading, isFetching: CSisFetching, isError: CSisError, error: CSError } = useGetCspmDashboardQuery();

  const dashboardData = response?.data || {};

  const calculateProviderExposure = (accounts = []) => {
    const providerMap = {};
    const titleMap = {};

    accounts.forEach((acc) => {
      const provider = acc.provider?.toUpperCase();
      if (!provider) return;

      if (!titleMap[provider] && acc.title) {
        titleMap[provider] = acc.title;
      }

      const findings = acc.vulnCounts?.total || 0;
      if (providerMap[provider]) {
        providerMap[provider] += findings;
      } else {
        providerMap[provider] = findings;
      }
    });

    const formatProvider = (p) => {
      if (p === 'ORACLE') return 'Oracle';
      if (p === 'AWS') return 'AWS';
      if (p === 'AZURE') return 'Azure';
      if (p === 'GCP') return 'GCP';
      return p;
    };

    return Object.keys(providerMap).map((provider) => ({
      provider: formatProvider(provider),
      title: titleMap[provider] || formatProvider(provider),
      findings: providerMap[provider],
    }));
  };

  const dynamicProviderExposure = calculateProviderExposure(
    CSresponse?.data?.vulnBreakdownByAccount || [],
  );

  if (!isError && !isLoading && !isFetching && !dashboardData?.stats?.totalFindings) {
    return (
      <EmptyScreen
        title="No dashboard data available"
        subTitle="The dashboard will display information once assets are onboarded and scanned."
        engage={<Button onClick={() => navigate('/csp-m/integrations')}>Go to Integrations</Button>}
      />
    );
  }

  if(isError || CSisError) return <ApiErrorHandler error={error || CSError} />
  
  return (
    <div className="p-4">
      <Helmet>
        <title>CSM | Dashboard</title>
      </Helmet>

      {/* Header with Title and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <PageHeading
          title="Dashboard"
          description="Monitor cloud security posture across connected accounts, identifying misconfigurations, failed security checks, and risk across cloud resources and providers."
        />
      </div>

      {/* Top Stat Strip using MetricsCards */}
      <MetricsStrip data={dashboardData?.stats} isLoading={isLoading || isFetching} />

      {/* 3-Column Score & Compliance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <CloudSecurityScoreChart
          data={dashboardData?.cloudSecurityScore}
          stats={dashboardData?.stats}
          isLoading={isLoading || isFetching}
        />
        <CategoryDistributionChart
          data={dashboardData?.categoryDistribution}
          isLoading={isLoading || isFetching}
        />
        <CloudExposureChart
          data={dashboardData?.cloudExposure}
          providerData={dynamicProviderExposure}
          isLoading={isLoading || isFetching}
        />
      </div>

      {/* Trend and Category Charts Row */}
      <div className="mt-4">
        <FindingsTrendChart
          data={dashboardData?.findingsTrend}
          isLoading={isLoading || isFetching}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
