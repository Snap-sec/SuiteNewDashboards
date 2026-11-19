import { ChartColumn, ShieldAlert } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardTab from './components/tabs/dashboard/dashboard-tab';
import { useSearchParams } from 'react-router-dom';
import EscalationsTab from './components/tabs/escalations/escalations-tab';

function RiskAcceptance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') ?? 'Dashboard';
  return (
    <div className="py-4 px-6">
      <Helmet>
        <title>UniRisk | Risk Acceptance</title>
      </Helmet>
      <Tabs defaultValue={currentTab} onValueChange={(value) => setSearchParams({ tab: value })}>
        <TabsList variant="line" size="md" className="border-b">
          <TabsTrigger value="Dashboard">
            <ChartColumn /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="Escalations">
            <ShieldAlert /> Escalations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Dashboard">
          <div className="py-4">
            <DashboardTab />
          </div>
        </TabsContent>

        <TabsContent value="Escalations">
          <div className="py-4">
            <EscalationsTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RiskAcceptance;
