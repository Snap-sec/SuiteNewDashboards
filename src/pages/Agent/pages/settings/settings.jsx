import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeading from '@/components/custom/page-heading';
import { DataCollectionTab } from './components/data-collection-tab';
import { GeneralTab } from './components/general-tab';
import { useGetAgentGlobalSettingsQuery } from '@/services/agent/agentApi';
import { Skeleton } from '@/components/ui/skeleton';

export default function AgentSettingsTabsPage() {
  const { data: settingsResponse, isLoading } = useGetAgentGlobalSettingsQuery();
  const settingsData = settingsResponse?.configuration || {};

  return (
    <div className="p-4 flex flex-col gap-5">
      <Helmet>
        <title>Agent | Settings</title>
      </Helmet>

      <PageHeading
        title="Settings"
        description="Configure agent data collection and general preferences."
      />

      <Tabs defaultValue="data-collection" className="w-full">
        <TabsList variant="line">
          <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
          <TabsTrigger value="general">Vulnerability Scanning</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="mt-6 space-y-5">
            <Skeleton className="h-[280px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
        ) : (
          <>
            <TabsContent value="data-collection">
              <DataCollectionTab settingsData={settingsData} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="general" className="mt-4">
              <GeneralTab settingsData={settingsData} isLoading={isLoading} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
