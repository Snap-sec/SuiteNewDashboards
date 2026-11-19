import ReBarChart from '@/components/custom/charts/reui/bar-chart';

export function ProviderBarChart({ data, isLoading }) {
  const providerColors = {
    'AWS': '#f59e0b',
    'Azure': '#3b82f6',
    'GCP': '#22d3ee'
  };

  const providerData = (data || []).map(p => ({
    name: p.provider,
    value: p.findings,
    fill: providerColors[p.provider] || '#94a3b8'
  }));

  return (
    <ReBarChart
      data={providerData}
      xKey="name"
      keys={[{ key: 'value', label: 'Findings' }]}
      colors={['#f59e0b', '#3b82f6', '#22d3ee']}
      distributed={true}
      height={230}
      title="Findings by Cloud Provider"
      showBarLabel={true}
    />
  );
}

export default ProviderBarChart;
