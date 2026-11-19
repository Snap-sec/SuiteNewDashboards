import { PlugZap2, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router';
import { useGetAutoPtDashboardQuery } from '@/services/auto-pt/dashboardApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import CweDistribution from './components/charts/cwe-distribution';
import VulnByAppsDistribution from './components/charts/vuln-by-app';
import VulnByAssetType from './components/charts/vuln-by-asset-type';
import VulnDistribution from './components/charts/vuln-distribution';
import Metrics from './components/metrics';
import OrganizationRiskCard from './components/organization-risk-card';
import Table from './components/top5-vulns';


function Dashboard() {
  const navigate = useNavigate();

  const {
    data: dashboardData = {},
    isLoading,
    error,
    isError,
  } = useGetAutoPtDashboardQuery({});

  const rawData = dashboardData?.data?.data || dashboardData?.data || {};

  const distributionBySeverity = rawData?.distribution_by_severity || {};

  const metrics = {
    total_vulns: rawData?.total_vulns ?? rawData?.metrics?.total_vulns ?? 0,
    total_pentests: rawData?.total_pentests ?? rawData?.metrics?.total_applications ?? 0,
    total_criticals: rawData?.total_criticals ?? rawData?.metrics?.total_critical ?? distributionBySeverity?.critical ?? 0,
    total_high: rawData?.total_high ?? rawData?.metrics?.total_high ?? distributionBySeverity?.high ?? 0,
    total_medium: rawData?.total_medium ?? distributionBySeverity?.medium ?? 0,
    total_low: rawData?.total_low ?? distributionBySeverity?.low ?? 0,
    total_info: rawData?.total_info ?? distributionBySeverity?.info ?? distributionBySeverity?.none ?? 0,
    active_scans: rawData?.active_scans ?? rawData?.metrics?.applications_with_active_scans ?? 0,
    total_assets: rawData?.total_assets ?? rawData?.metrics?.total_assets ?? 142,
    total_endpoints: rawData?.total_endpoints ?? 384,
    organization_risk_score: rawData?.organization_risk_score ?? rawData?.riskOverview?.organizationRiskScore ?? 68,
  };
  const distributionByProject = rawData?.distribution_by_project || rawData?.project_vuln_distribution || [];
  const distributionByAssetType =
    rawData?.vuln_counts_by_type ||
    rawData?.vuln_count_by_vuln_type ||
    rawData?.distribution_by_vuln_type ||
    rawData?.distribution_by_asset_type ||
    rawData?.asset_type_distribution ||
    rawData?.asset_vuln_distribution ||
    {};
  const cweDistribution = rawData?.cwe_distribution || {};
  const topVulns = rawData?.top_5 || rawData?.top_vulns || [];

  const hasData =
    Boolean(metrics.total_pentests) ||
    Boolean(metrics.total_vulns) ||
    Boolean(metrics.total_criticals) ||
    Boolean(metrics.total_high) ||
    (Array.isArray(topVulns) && topVulns.length > 0) ||
    (Object.keys(distributionBySeverity).length > 0 &&
      Object.values(distributionBySeverity).some((v) => Number(v) > 0));

  if (isError) return <ApiErrorHandler error={error} />;

  if (!isError && !isLoading && !hasData && metrics.total_pentests === 0)
    return (
      <EmptyScreen
        title="No dashboard data available"
        subTitle="You don't have any pentests yet. Create one to get started."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button mode="link" underlined="dashed" asChild>
              <Link to="/apt/pentests/create">
                <Plus /> Create New Project
              </Link>
            </Button>
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4 w-full">
      <Helmet>
        <title>Strike | Dashboard</title>
      </Helmet>

      <PageHeading
        title="Dashboard"
        description="Monitor application security, vulnerabilities, risks, scans, and overall security posture."
      />

      {/* Top Severity Metrics Strip: Total, Critical, High, Medium, Low */}
      <div className="w-full mt-3">
        <Metrics
          data={{ ...metrics, ...rawData, distribution_by_severity: distributionBySeverity }}
          isLoading={isLoading}
        />
      </div>

      {/* Top Hero Section: Unified Overall Organization Risk Card with Concentric Gauge & Severity vs Asset Table */}
      <div className="w-full mt-6">
        <OrganizationRiskCard
          data={{ ...metrics, ...rawData }}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7.5 mt-6">
        <VulnDistribution
          data={distributionBySeverity}
          isLoading={isLoading}
        />
        <VulnByAppsDistribution
          data={distributionByProject}
          isLoading={isLoading}
        />
        <VulnByAssetType
          data={distributionByAssetType}
          isLoading={isLoading}
        />
      </div>

      {Object.keys(cweDistribution).length > 0 && (
        <div className="mt-6 w-full">
          <CweDistribution
            data={cweDistribution}
            isLoading={isLoading}
          />
        </div>
      )}

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
              data={topVulns}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;