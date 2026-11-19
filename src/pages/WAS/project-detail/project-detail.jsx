import { useState, useEffect } from 'react';
import { Rocket, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetApisecProjectQuery,
  useLaunchScanMutation,
} from '@/services/apisec/projectsApi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentLoader } from '@/components/common/content-loader';
import { EmptyScreen } from '@/components/common/empty-screen';
import { StatusBadge } from '../../../components/custom/status-badge';
import Endpoints from './components/Tabs/endpoints';
import MatricsTab from './components/Tabs/matrics';
import Rules from './components/Tabs/rules';
import ScanHistory from './components/Tabs/scan-history';
import ScanSettings from './components/Tabs/scan-settings';
import Threats from './components/Tabs/threats';
import WebAppScanner from './components/Tabs/web-app-scanner';
import InstantScanModal from './components/instant-scan-modal';
import ProjectSettings from './components/Tabs/settings';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '@/components/common/api-error-handler';

function ProjectDetail() {
  const [isInstantScanModalOpen, setIsInstantScanModalOpen] = useState(false);
  const params = useParams();
  const [shouldPoll, setShouldPoll] = useState(false);

  const {
    data: project,
    isLoading: projectDataLoading,
    isFetching: isProjectDataFetching,
    error: projectError,
    isError: isProjectError,
  } = useGetApisecProjectQuery(
    { projectId: params.id },
    {
      pollingInterval: shouldPoll ? 5000 : 0,
    }
  );


  useEffect(() => {
    const latestScanStatus = project?.data?.latestScan?.status;
    const isScanning = ['queued', 'crawling', 'scanning'].includes(latestScanStatus);
    setShouldPoll(isScanning);
  }, [project, setShouldPoll]);
  const [launchScan, { isLoading: isLaunching }] = useLaunchScanMutation();

  const handleLaunchScan = async (payload = {}) => {
    try {
      await launchScan({ projectId: params.id, payload: payload })?.unwrap?.();
      toast.success('Scan launched successfully');
      setIsInstantScanModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to launch scan');
      console.error('Error launching scan:', error);
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || (project?.data?.is_configured === false ? 'settings' : 'metrics');

  const handleTabChange = (value) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('tab', value);
        if (value !== 'Vulnerabilities') {
          newParams.delete('scannerId');
          newParams.delete('ruleId');
        }
        return newParams;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (!projectDataLoading && project?.data && !searchParams.get('tab')) {
      const defaultTab = project?.data?.is_configured === false ? 'settings' : 'metrics';
      handleTabChange(defaultTab);
    }
  }, [projectDataLoading, project?.data?.is_configured, searchParams.get('tab')]);

  if (isProjectError) return <ApiErrorHandler error={projectError} />;


  return (
    <div className="p-4">
      <Helmet>
        <title>WAS | Application Details</title>
      </Helmet>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col justify-center gap-2 mb-2">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-medium leading-none text-mono">
              {project?.data?.name}
            </h1>
            {project?.data?.latestScan && (
              <StatusBadge 
                status={project?.data?.latestScan?.status} 
                progress={project?.data?.latestScan?.progress}
                showProgress={true}
              />
            )}
          </div>
          <span className="text-sm text-secondary-foreground">
            {project?.data?.description}
          </span>
        </div>

        <AuthorityGuard forbidRoles={['Auditor']}>
          <div className="flex items-center gap-2">
            {!['pending', 'queued', 'crawling', 'scanning'].includes(project?.data?.latestScan?.status) && (
              <Button
                variant="outline"
                onClick={() => setIsInstantScanModalOpen(true)}
              disabled={isLaunching}
            >
              <Rocket className="w-4 h-4" />
              {isLaunching ? 'Scanning...' : 'Start Instant Scan'}
            </Button>
          )}
        </div>
        </AuthorityGuard>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList
          variant="line"
          size="md"
          className="border-b flex justify-between items-center"
        >
          <div className="flex items-center gap-6">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="endpoints">Requests & URL's</TabsTrigger>
            <TabsTrigger value="Vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="scan-history">Scan History</TabsTrigger>

            <AuthorityGuard forbidRoles={['Auditor']}>
              <TabsTrigger value="settings">Auth & Scope</TabsTrigger>
            </AuthorityGuard>

            <AuthorityGuard forbidRoles={['Auditor']}>
              <TabsTrigger value="rule-settings">Rules and Scanners</TabsTrigger>
            </AuthorityGuard>
          </div>
        </TabsList>

        <TabsContent value="metrics">
          <div className="p-4">
            <MatricsTab description={project?.data?.description} status={project?.data?.latestScan?.status} />
          </div>
        </TabsContent>

        <TabsContent value="endpoints">
          <div className="p-4">
            <Endpoints />
          </div>
        </TabsContent>


        <TabsContent value="Vulnerabilities">
          <div className="p-4">
            <Threats />
          </div>
        </TabsContent>
{/* 
        <TabsContent value="WebAppScanner">
          <div className="p-4">
            <WebAppScanner
              data={project}
              isLoading={projectDataLoading || isProjectDataFetching}
            />
          </div>
        </TabsContent> */}

        {/* <TabsContent value="scan-settings">
          <ScanSettings data={project?.data?.scanSettings} />
        </TabsContent> */}

        <TabsContent value="scan-history">
          <ScanHistory />
        </TabsContent>

        <AuthorityGuard forbidRoles={['Auditor']}>
          <TabsContent value="settings">
            <div className="p-4">
              <ProjectSettings projectData={project?.data} isLoading={projectDataLoading} />
            </div>
          </TabsContent>
        </AuthorityGuard>

        <AuthorityGuard forbidRoles={['Auditor']}>
          <TabsContent value="rule-settings">
            <div className="p-4">
              <Rules />
            </div>
          </TabsContent>
        </AuthorityGuard>
      </Tabs>

      <InstantScanModal
        open={isInstantScanModalOpen}
        onOpenChange={setIsInstantScanModalOpen}
        onLaunch={handleLaunchScan}
        isLaunching={isLaunching}
        projectId={params.id}
        projectName={project?.data?.name}
        projectDescription={project?.data?.description}
      />
    </div>
  );
}

export default ProjectDetail;
