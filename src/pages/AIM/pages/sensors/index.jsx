import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import PageHeading from '@/components/custom/page-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisteredAgents from '../settings/components/registered-agents';
import AgentSettingsPage from '../sensor management/sensor-deployment';

export function SensorsPage({ defaultTab = 'inventory' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || defaultTab;

  const handleTabChange = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', val);
      return next;
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>AssetIQ | Sensor Management</title>
      </Helmet>

      <PageHeading
        title="Sensor Management"
        description="Monitor registered sensors and deploy new sensors across your infrastructure."
      />

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList
          variant="line"
          size="md"
          className="border-b w-full justify-start overflow-x-auto gap-6"
        >
          <TabsTrigger value="inventory">Sensor Inventory</TabsTrigger>
          <TabsTrigger value="deployment">Sensor Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-0">
          <RegisteredAgents hideHeading />
        </TabsContent>

        <TabsContent value="deployment" className="mt-0">
          <AgentSettingsPage hideHeading />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SensorsPage;

