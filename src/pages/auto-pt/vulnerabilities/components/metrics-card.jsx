import MetricsCards from '../../../../components/custom/cards/metric-cards';

const MetricsCard = ({ metrics = {}, isLoading }) => {
  const stats = [
    {
      label: 'Critical',
      number: metrics?.critical || 0,
      state: 'In Review',
    },
    {
      label: 'High',
      number: metrics?.high || 0,
      state: 'In Progress',
    },
    {
      label: 'Medium',
      number: metrics?.medium || 0,
      state: 'In Progress',
    },
    {
      label: 'Low',
      number: metrics?.low || 0,
      state: 'In Progress',
    },

    {
      label: 'Info',
      number: metrics?.info || 0,
      state: 'In Progress',
    },
  ];

  return (
    <MetricsCards
      items={stats}
      statsLoading={isLoading}
      isLoading={isLoading}
    />
  );
};

export default MetricsCard;
