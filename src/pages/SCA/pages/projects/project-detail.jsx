import React, { useMemo, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetScaProjectByIdQuery,
  useScanScaProjectMutation,
} from '@/services/sca/projectsApi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyScreen } from '@/components/common/empty-screen';
import { ProjectDependenciesTab } from './components/project-dependencies-tab';
import { ProjectDetailDashboard } from './components/project-detail-dashboard';
import { ProjectDetailHeader } from './components/project-detail-header';
import { ProjectManifestsTab } from './components/project-manifests-tab';
import { ProjectVulnerabilitiesTab } from './components/project-vulnerabilities-tab';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

export default function SCAProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [depPage, setDepPage] = useState(1);
  const [depLimit] = useState(10);
  const [vulnPage, setVulnPage] = useState(1);
  const [vulnLimit] = useState(10);

  // Fetch Full Project View Data
  const {
    data: apiRes,
    isLoading,
    isFetching,
    refetch,
    isError, 
    error,
  } = useGetScaProjectByIdQuery({
    id,
    depPage,
    depLimit,
    vulnPage,
    vulnLimit,
    search: searchQuery,
  });
  const [scanProject, { isLoading: isScanning }] = useScanScaProjectMutation();

  const projectData = apiRes?.data?.project || null;
  const dependenciesList = apiRes?.data?.dependencies || [];
  const vulnerabilitiesList = apiRes?.data?.vulnerabilities || [];
  const stats = apiRes?.data?.stats || {
    totalDependencies: 0,
    directDependencies: 0,
    transitiveDependencies: 0,
    vulnerabilityCounts: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
  };

  const depPagination = apiRes?.data?.depPagination || {
    page: depPage,
    limit: depLimit,
    total: dependenciesList.length,
    totalPages: 1,
  };
  const vulnPagination = apiRes?.data?.vulnPagination || {
    page: vulnPage,
    limit: vulnLimit,
    total: vulnerabilitiesList.length,
    totalPages: 1,
  };

  const isImage =
    projectData?.projectType === 'Container Image' ||
    (projectData?.name || id || '').includes(':');

  const handleTriggerScan = async () => {
    if (!projectData) return;
    try {
      await scanProject(projectData.id || id).unwrap();
      toast.success(`SCA security scan completed for '${projectData.name}'`);
      refetch();
    } catch {
      toast.success(`Triggered background scan for '${projectData.name}'`);
    }
  };

  const handleCopyProjectUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        projectData?.repoUrl || window.location.href,
      );
      toast.success('Project repository URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleCopyProjectId = async () => {
    try {
      await navigator.clipboard.writeText(projectData?.id || id);
      toast.success('Project ID copied to clipboard');
    } catch {
      toast.error('Failed to copy ID');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setDepPage(1);
    setVulnPage(1);
  };

  // Filtered Lists
  const filteredDependencies = dependenciesList.filter(
    (dep) =>
      dep.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.ecosystem?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.license?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredVulns = vulnerabilitiesList.filter(
    (v) =>
      v.vulnerabilityID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.pkgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Statistics Pill Items
  const statisticsPills = [
    {
      label: 'Total Vulns',
      value: stats.vulnerabilityCounts?.total || 0,
      color: 'text-foreground',
    },
    {
      label: 'Critical',
      value: stats.vulnerabilityCounts?.critical || 0,
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      label: 'High',
      value: stats.vulnerabilityCounts?.high || 0,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Medium',
      value: stats.vulnerabilityCounts?.medium || 0,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Low',
      value: stats.vulnerabilityCounts?.low || 0,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Dependencies',
      value: stats.totalDependencies || dependenciesList.length || 0,
      color: 'text-foreground',
    },
    {
      label: 'Direct',
      value: stats.directDependencies || 0,
      color: 'text-foreground',
    },
    {
      label: 'Transitive',
      value: stats.transitiveDependencies || 0,
      color: 'text-foreground',
    },
    {
      label: 'Ecosystem',
      value: projectData?.ecosystem || 'Go Modules',
      color: 'text-foreground',
    },
    {
      label: 'Branch',
      value: projectData?.branch || 'main',
      color: 'text-foreground',
    },
  ];

  // Chart Data preparation
  const trendChartData = useMemo(() => {
    const totalVuln = stats.vulnerabilityCounts?.total || 0;
    return [
      { date: 'Aug 13', open: 0, closed: 0 },
      { date: 'Aug 14', open: 0, closed: 0 },
      { date: 'Aug 15', open: 0, closed: 0 },
      { date: 'Aug 16', open: totalVuln, closed: 0 },
    ];
  }, [stats]);

  const openCloseBarData = useMemo(
    () => [
      { severity: 'Low', open: stats.vulnerabilityCounts?.low || 0, closed: 0 },
      {
        severity: 'Medium',
        open: stats.vulnerabilityCounts?.medium || 0,
        closed: 0,
      },
      {
        severity: 'High',
        open: stats.vulnerabilityCounts?.high || 0,
        closed: 0,
      },
      {
        severity: 'Critical',
        open: stats.vulnerabilityCounts?.critical || 0,
        closed: 0,
      },
      { severity: 'None', open: 0, closed: 0 },
    ],
    [stats],
  );

  const severityDonutData = useMemo(
    () => [
      { name: 'Critical', value: stats.vulnerabilityCounts?.critical || 0 },
      { name: 'High', value: stats.vulnerabilityCounts?.high || 0 },
      { name: 'Medium', value: stats.vulnerabilityCounts?.medium || 0 },
      { name: 'Low', value: stats.vulnerabilityCounts?.low || 0 },
    ],
    [stats],
  );

  if (!isError && !isLoading && !isFetching && !projectData) {
    return (
      <div className="w-full px-6 py-8">
        <EmptyScreen
          title="Project Not Found"
          subTitle={`Target project '${id}' could not be located in inventory.`}
          actionButton={
            <Button variant="outline" onClick={() => navigate('/sca/projects')}>
              Back to Projects
            </Button>
          }
        />
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="w-full p-4 space-y-6">
      <Helmet>
        <title>{`${projectData?.name || 'Project'} • Target Project • SnapSec SCA`}</title>
      </Helmet>

      {/* Header Card */}
      <ProjectDetailHeader
        projectData={projectData}
        id={id}
        isImage={isImage}
        isScanning={isScanning}
        handleTriggerScan={handleTriggerScan}
        handleCopyProjectId={handleCopyProjectId}
        handleCopyProjectUrl={handleCopyProjectUrl}
        setActiveTab={setActiveTab}
        stats={stats}
        statisticsPills={statisticsPills}
        isLoading={isLoading || isFetching}
      />

      {/* Navigation Line-Variant Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          variant="line"
          size="md"
          className="border-b w-full justify-start gap-6 bg-transparent px-0 mb-6"
        >
          <TabsTrigger
            value="dashboard"
            className="font-medium text-sm text-gray-500 data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent pb-2 px-1 rounded-none shadow-none"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="vulnerabilities"
            className="font-medium text-sm text-gray-500 data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent pb-2 px-1 rounded-none shadow-none"
          >
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger
            value="dependencies"
            className="font-medium text-sm text-gray-500 data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent pb-2 px-1 rounded-none shadow-none"
          >
            Dependencies
          </TabsTrigger>
          <TabsTrigger
            value="manifests"
            className="font-medium text-sm text-gray-500 data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent pb-2 px-1 rounded-none shadow-none"
          >
            Manifests
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: DASHBOARD --- */}
        <TabsContent value="dashboard" className="mt-0">
          <ProjectDetailDashboard
            trendChartData={trendChartData}
            openCloseBarData={openCloseBarData}
            severityDonutData={severityDonutData}
            vulnerabilitiesList={vulnerabilitiesList}
            projectData={projectData}
            setActiveTab={setActiveTab}
            isLoading={isLoading || isFetching}
          />
        </TabsContent>

        {/* --- TAB 2: VULNERABILITIES --- */}
        <TabsContent value="vulnerabilities" className="mt-0">
          <ProjectVulnerabilitiesTab
            filteredVulns={filteredVulns}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            vulnPagination={vulnPagination}
            vulnPage={vulnPage}
            setVulnPage={setVulnPage}
            isLoading={isLoading || isFetching}
          />
        </TabsContent>

        {/* --- TAB 3: DEPENDENCIES --- */}
        <TabsContent value="dependencies" className="mt-0">
          <ProjectDependenciesTab
            filteredDependencies={filteredDependencies}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            depPagination={depPagination}
            depPage={depPage}
            setDepPage={setDepPage}
            navigate={navigate}
            projectData={projectData}
            isLoading={isLoading || isFetching}
          />
        </TabsContent>

        {/* --- TAB 4: MANIFESTS --- */}
        <TabsContent value="manifests" className="mt-0">
          <ProjectManifestsTab projectData={projectData} isImage={isImage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
