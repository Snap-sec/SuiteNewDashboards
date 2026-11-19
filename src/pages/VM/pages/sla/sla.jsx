import { Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import Dashboard from './pages/dashboard';
import LeaderBoard from './pages/leader-board';
import Report from './pages/report';
import Settings from './pages/settings';
import Violation from './pages/violation';


function Sla() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'Dashboard';

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="py-4 px-6">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList
          variant="line"
          size="md"
          className="border-b flex justify-between"
        >
          <div className="flex items-center gap-4">
            <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="Voilations">Violations</TabsTrigger>
            <TabsTrigger value="LeaderBoard">Leaderboard</TabsTrigger>

            {/* Show this to admin and member only*/}
            <AuthorityGuard forbidRoles={['Auditor']} roles={["Admin", "Manager"]}>
              <TabsTrigger value="Reports">Weekly Reports</TabsTrigger>
            </AuthorityGuard>

            {/* Show this to admin and member only*/}
            <AuthorityGuard forbidRoles={['Auditor']} roles={["Admin", "Manager"]}>
              <TabsTrigger value="Settings">Settings</TabsTrigger>
            </AuthorityGuard>
          </div>
        </TabsList>

        <TabsContent value="Dashboard">
          <div className="py-4">
            <Dashboard />
          </div>
        </TabsContent>

        <TabsContent value="LeaderBoard">
          <div className="py-4">
            <LeaderBoard />
          </div>
        </TabsContent>

        <TabsContent value="Voilations">
          <div className="py-4">
            <Violation />
          </div>
        </TabsContent>

        {/* Show this to admin and member only*/}
        <AuthorityGuard forbidRoles={['Auditor']} roles={['Admin', 'Manager']}>
          <TabsContent value="Reports">
            <div className="py-4">
              <Report />
            </div>
          </TabsContent>
        </AuthorityGuard>

        {/* Show this to admin and member only*/}
        <AuthorityGuard forbidRoles={['Auditor']} roles={['Admin', 'Manager']}>
          <TabsContent value="Settings">
            <div className="py-4">
              <Settings />
            </div>
          </TabsContent>
        </AuthorityGuard>
      </Tabs>
    </div>
  );
}

export default Sla;