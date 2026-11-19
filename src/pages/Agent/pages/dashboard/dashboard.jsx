import { Helmet } from 'react-helmet';
import { AgentStatsCard } from './components/stat-card';
import { DeploymentCard } from './components/deployment-card';
import { AgentInventory } from './components/agent-inventory';
import { useGetDashboardMetricsQuery } from '@/services/agent/agentApi';

function AgentDashboard() {

  const { data: response, isLoading } = useGetDashboardMetricsQuery();


  return (
    <div className="p-6 space-y-6">
      <Helmet>
        <title>Snapsec Suite | Agent Dashboard</title>
      </Helmet>

      {/* Stats row — horizontal divided card like VulnStateMetrics */}
      <AgentStatsCard data={response?.data} isLoading={isLoading} />

      {/* Deployment & Installation */}
      <DeploymentCard
        setupCommands={response?.data?.setupCommands}
        agentSettings={response?.data?.agentSettings}
        isLoading={isLoading}
      />

      {/* Agent Inventory table */}
      <AgentInventory agents={response?.data?.agents || []} isLoading={isLoading} />
    </div>
  );
}

export default AgentDashboard;
