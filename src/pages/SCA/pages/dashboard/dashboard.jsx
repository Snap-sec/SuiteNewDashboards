import { Plug } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useGetScaDashboardSummaryQuery } from '@/services/sca/dashboardApi';
import { useRunScaVulnerabilityScanMutation } from '@/services/sca/vulnerabilitiesApi';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import { DashboardCharts } from './components/dashboard-charts';
import { KpiCards } from './components/kpi-cards';
import { TopVulnerabilitiesTable } from './components/top-vulnerabilities-table';


export default function SCADashboard() {
  const {
    data: apiRes,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetScaDashboardSummaryQuery();
  const [runVulnerabilityScan, { isLoading: isScanning }] =
    useRunScaVulnerabilityScanMutation();

  const dashboardData = apiRes?.data || {};

  const handleRunScan = async () => {
    try {
      const res = await runVulnerabilityScan('all').unwrap();
      toast.success(
        `Security scan completed! Scanned ${res.data?.scannedProjectsCount || 0} repos (${res.data?.totalVulnerabilitiesFound || 0} CVEs found).`,
      );
      refetch();
    } catch (err) {
      toast.error(`Security scan execution failed: ${err.message}`);
    }
  };

  if (isError) return <ApiErrorHandler error={error} />;

  if (!isLoading && !isError && !dashboardData?.metrics?.totalProjects)
    return (
      <EmptyScreen
        engage={
          <AuthorityGuard forbidRoles={'Auditor'}>
            <Link to="/sca-ui/integrations">
              <Button className="gap-2">
                <Plug /> Goto Integrations
              </Button>
            </Link>
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4 flex flex-col w-full">
      <Helmet>
        <title>SCA | Dashboard</title>
      </Helmet>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <PageHeading
          title="Dashboard"
          description="Identify and manage security risks in third-party libraries and open-source dependencies across your applications."
        />
      </div>

      {/* Metrics Row */}
      <KpiCards metrics={dashboardData.metrics} isLoading={isLoading} />

      {/* Charts Section */}
      <DashboardCharts data={dashboardData} isLoading={isLoading} />

      {/* Top Discovered Vulnerabilities Table */}
      <TopVulnerabilitiesTable
        vulnerabilities={dashboardData.topVulnerabilities}
        isLoading={isLoading}
        isScanning={isScanning}
        handleRunScan={handleRunScan}
      />
    </div>
  );
}