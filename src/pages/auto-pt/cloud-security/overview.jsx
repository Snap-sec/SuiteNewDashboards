import { PlugZap2, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAutoPtDashboardQuery } from '@/services/auto-pt/dashboardApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import CloudCweDistribution from './components/cloud-cwe-distribution';
import CloudMetrics from './components/cloud-metrics';
import CloudTop5Vulns from './components/cloud-top5-vulns';
import CloudVulnByProject from './components/cloud-vuln-by-project';
import CloudVulnDistribution from './components/cloud-vuln-distribution';


export default function CloudSecurityOverview() {
  const navigate = useNavigate();

  const {
    data: dashboardData = {},
    isLoading,
    error,
    isError,
  } = useGetAutoPtDashboardQuery({ type: 'cloud-security' });

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
    total_assets: rawData?.total_assets ?? rawData?.metrics?.total_assets ?? 0,
    organization_risk_score: rawData?.organization_risk_score ?? rawData?.riskOverview?.organizationRiskScore ?? 0,
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
        title="No cloud security data available"
        subTitle="You don't have any cloud security projects yet. Create one to get started."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button mode="link" underlined="dashed" asChild>
              <Link
                to="/apt/pentests/create?type=cloud"
                state={{ from: '/apt/cloud-security/findings?type=cloud' }}
              >
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
        <title>Strike | Cloud Security - Overview</title>
      </Helmet>

      <PageHeading
        title="Cloud Security Overview"
        description="Monitor cloud security posture, misconfigurations, and cloud asset vulnerabilities."
      />

      <div className="w-full mt-3">
        <CloudMetrics
          data={{ ...metrics, ...rawData, distribution_by_severity: distributionBySeverity }}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-7.5 mt-6">
        <CloudVulnDistribution
          data={distributionBySeverity}
          isLoading={isLoading}
        />
        <CloudVulnByProject
          data={distributionByProject}
          isLoading={isLoading}
        />
      </div>

      {Object.keys(cweDistribution).length > 0 && (
        <div className="mt-6 w-full">
          <CloudCweDistribution
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
            <CloudTop5Vulns
              data={topVulns}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}