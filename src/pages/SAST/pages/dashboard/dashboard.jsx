import { Plug} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useGetSastDashboardSummaryQuery } from '@/services/sast/dashboardApi';
import { useRunVulnerabilityScanMutation } from '@/services/sast/vulnerabilitiesApi';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import { DashboardCharts } from './components/dashboard-charts';
import { KpiCards } from './components/kpi-cards';
import { TopVulnerabilitiesTable } from './components/top-vulnerabilities-table';

export default function SASTDashboard() {
  const {
    data: apiRes,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetSastDashboardSummaryQuery();
  const [runVulnerabilityScan, { isLoading: isScanning }] =
    useRunVulnerabilityScanMutation();

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

  if (!isLoading && !isError && dashboardData?.metrics?.total_projects === 0) {
    return (
      <EmptyScreen
        title="No SAST Projects"
        subTitle="There are currently no SAST projects available."
        engage={
          <Link to="/ui-sast/integrations">
            <Button className="gap-2">
              <Plug /> Setup Integrations
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="p-4 flex flex-col gap-5 w-full">
      <Helmet>
        <title>SAST | Dashboard</title>
      </Helmet>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading title="Dashboard" />
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
