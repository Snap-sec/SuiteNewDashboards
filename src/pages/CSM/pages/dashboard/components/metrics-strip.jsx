import MetricsCards from '@/components/custom/cards/metric-cards';

export function MetricsStrip({ data, isLoading }) {
  const stats = [
    { number: data?.totalFindings?.toLocaleString() || '0', label: 'Total Findings', tooltip: 'Total security findings detected' },
    { number: data?.critical?.toLocaleString() || '0', label: 'Critical', tooltip: 'Critical severity findings needing immediate action' },
    { number: data?.high?.toLocaleString() || '0', label: 'High', tooltip: 'High severity misconfigurations' },
    { number: data?.medium?.toLocaleString() || '0', label: 'Medium', tooltip: 'Medium risk findings' },
    { number: data?.low?.toLocaleString() || '0', label: 'Low', tooltip: 'Low priority issues' },
    { number: data?.cloudAccounts?.toLocaleString() || '0', label: 'Cloud Accounts', tooltip: 'Active connected cloud accounts' },
    { number: data?.resourcesScanned?.toLocaleString() || '0', label: 'Resources Scanned', tooltip: 'Total cloud resources evaluated' },
    { number: data?.failedChecks?.toLocaleString() || '0', label: 'Failed Checks', tooltip: 'Security policy compliance check failures' },
  ];

  return <MetricsCards items={stats} statsLoading={isLoading} />;
}

export default MetricsStrip;
