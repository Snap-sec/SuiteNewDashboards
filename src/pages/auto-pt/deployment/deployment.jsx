import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PageHeading from '@/components/custom/page-heading';
import { useGetAptAgentSetupCommandsQuery } from '@/services/auto-pt/agentsApi';
import { InstallationCard } from './components/installation-card';
import { AgentManagementCard } from './components/agent-management-card';
import { DeploymentSkeleton } from './components/deployment-skeleton';
import ApiErrorHandler from '../../../components/common/api-error-handler';

function DeploymentPage() {
  const [selectedOS, setSelectedOS] = useState('linux');
  const [copiedField, setCopiedField] = useState(null);

  const { data: settingsResponse, isLoading,isFetching, isError, error} = useGetAptAgentSetupCommandsQuery();
  const installCommands = settingsResponse?.data || {};

  // If selectedOS is not in the response keys, select the first available OS
  useEffect(() => {
    const keys = Object.keys(installCommands);
    if (keys.length > 0 && !installCommands[selectedOS]) {
      setSelectedOS(keys[0]);
    }
  }, [installCommands, selectedOS]);

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if(isError && !isLoading || !isFetching)
    return <ApiErrorHandler error={error} />


  return (
    <div className="p-4 flex flex-col gap-5">
      <Helmet>
        <title>Strike | Deployment</title>
      </Helmet>

      <PageHeading
        title="Agent Deployment"
        description="Manage agent deployment, installation, and service commands."
      />

      {isLoading ? (
        <DeploymentSkeleton />
      ) : (
        <>
          <InstallationCard
            installCommands={installCommands}
            selectedOS={selectedOS}
            onSelectOS={setSelectedOS}
            copiedField={copiedField}
            onCopy={handleCopy}
          />

          <AgentManagementCard
            installCommands={installCommands}
            selectedOS={selectedOS}
            copiedField={copiedField}
            onCopy={handleCopy}
          />
        </>
      )}
    </div>
  );
}

export default DeploymentPage;
