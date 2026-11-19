import { ArrowRight, PlugZap2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '../../../components/common/empty-screen';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import PageHeading from '../../../components/custom/page-heading';
import { Button } from '../../../components/ui/button';
import { useGetApisecDashboardQuery } from '../../../services/apisec/dashboardApi';
import VulnStateMetrics from './components/cards';
import CweDistribution from './components/charts/cwe-distribution';
import VulnByAppsDistribution from './components/charts/vuln-by-app';
import VulnDistribution from './components/charts/vuln-distribution';
import Table from './components/top5-vulns';

function Dashboard() {
  const navigate = useNavigate();

  const {
    data: dashboardData = {},
    isLoading,
    error,
    isError,
  } = useGetApisecDashboardQuery({});

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isError &&
    !isLoading &&
    !dashboardData?.data?.metrics?.applications_with_active_scans &&
    !dashboardData?.data?.metrics?.total_applications &&
    !dashboardData?.data?.metrics?.total_critical &&
    !dashboardData?.data?.metrics?.total_vulns &&
    !dashboardData?.data?.metrics?.total_active
  )
    return (
      <EmptyScreen
        title="No dashboard data available"
        subTitle="You don't have any environments yet. Add one through integrations."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button onClick={() => navigate('/was/projects')}>
              <ArrowRight /> Goto Applications
            </Button>
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4 w-full">
      <Helmet>
        <title>WAS | Dashboard</title>
      </Helmet>

      <PageHeading
        title="Dashboard"
        description="Monitor application security, vulnerabilities, risks, scans, and overall security posture."
      />

      <div className="flex items-center gap-6 w-full mt-1">
        <VulnStateMetrics
          data={dashboardData?.data?.metrics}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7.5 mt-6">
        <VulnDistribution
          data={dashboardData?.data?.distribution_by_severity || {}}
          isLoading={isLoading}
        />
        <VulnByAppsDistribution
          data={dashboardData?.data?.project_vuln_distribution || []}
          isLoading={isLoading}
        />
        <CweDistribution
          data={dashboardData?.data?.cwe_distribution || {}}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-6 w-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-normal text-sm text-gray-500">
              Top 5 Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0">
            <Table
              grid
              data={dashboardData?.data?.top_vulns || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
