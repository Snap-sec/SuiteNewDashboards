import { ContentLoader } from '@/components/common/content-loader';
import { useGetApisecProjectDashboardQuery } from '../../../../../services/apisec/projectsApi';
import { BasicDetails } from '../basic-details';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ApiErrorHandler from '@/components/common/api-error-handler';

const capitalize = (word) =>
  word ? word.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : '';
function MatricsTab({ description, status }) {
  const projectId = window.location.pathname?.split('/')?.at(-1);

  const { data, isLoading, error, isError } = useGetApisecProjectDashboardQuery(projectId);


  const actualData = data?.data;

  // Transform state_distribution for ReBarChart
  const statusChartData = (actualData?.state_distribution || []).map(item => ({
    name: capitalize(item._id),
    count: item.count || 0
  }));

  // Transform cwe_distribution for ReBarChart
  const cweChartData = Object.entries(actualData?.cwe_distribution || {}).map(([name, count]) => ({
    name,
    count: count || 0
  }));

  // Transform severity_distribution for DonutChart
  const severityChartData = [
    { name: 'Critical', value: actualData?.severity_distribution?.critical || 0 },
    { name: 'High', value: actualData?.severity_distribution?.high || 0 },
    { name: 'Medium', value: actualData?.severity_distribution?.medium || 0 },
    { name: 'Low', value: actualData?.severity_distribution?.low || 0 },
    { name: 'Info', value: actualData?.severity_distribution?.info || 0 },
  ];

  const severityColors = [
    '#ef4444', // Critical - red-500
    '#f97316', // High - orange-500
    '#eab308', // Medium - yellow-500
    '#3b82f6', // Low - blue-500
    '#6b7280', // Info - gray-500
  ];

  const statusColors = ['#3b82f6'];

    if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div>
      <BasicDetails data={actualData} trueDescription={description} status={status} isLoading={isLoading} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ReBarChart
          title="Status Distribution"
          data={statusChartData}
          xKey="name"
          keys={[{ key: 'count', label: 'Findings' }]}
          height={300}
          colors={statusColors}
          distributed
          isLoading={isLoading}
        />

        <ReBarChart
          title="CWE Distribution"
          data={cweChartData}
          xKey="name"
          keys={[{ key: 'count', label: 'Findings' }]}
          height={300}
          colors={statusColors}
          distributed
          isLoading={isLoading}

        />

        <DonutChart
          title="Severity Distribution"
          data={severityChartData}
          colors={severityColors}
          height={300}
          centerLabel="Total Findings"
          isLoading={isLoading}

        />
      </div>
    </div>
  );
}

export default MatricsTab;
