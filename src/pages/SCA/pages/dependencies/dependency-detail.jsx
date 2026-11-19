import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  FolderGit2,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  MoreHorizontal,
} from 'lucide-react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';
import { EmptyScreen } from '@/components/common/empty-screen';
import { useGetScaDependencyByIdQuery } from '@/services/sca/dependenciesApi';

import { DependencyDetailHeader } from './components/dependency-detail-header';
import { DependencyDetailKpiCards } from './components/dependency-detail-kpi-cards';
import { DependencyAdvisoriesTab } from './components/dependency-advisories-tab';
import { DependencyMetadataTab } from './components/dependency-metadata-tab';

function getAffectedProjectColumns(navigate) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Repository Name" column={column} />
      ),
      cell: ({ row }) => (
        <button
          onClick={() => navigate(`/sca/projects/${row.original.id || row.original.name}`)}
          className="text-xs font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-left cursor-pointer"
        >
          <FolderGit2 className="size-3.5 text-blue-500 shrink-0" />
          {row.original.name}
        </button>
      ),
      enableSorting: false,
      size: 240,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'branch',
      accessorFn: (row) => row.branch,
      header: ({ column }) => (
        <DataGridColumnHeader title="Branch" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
          <GitBranch className="size-3 text-muted-foreground" />
          <span>{row.original.branch || 'main'}</span>
        </div>
      ),
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'ecosystem',
      accessorFn: (row) => row.ecosystem,
      header: ({ column }) => (
        <DataGridColumnHeader title="Ecosystem" column={column} />
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-normal bg-[#f1f5f9] text-[#475569] dark:bg-slate-800/80 dark:text-slate-300">
          {row.original.ecosystem || 'Node.js (npm)'}
        </span>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => (
        row.original.status === 'Failed Policy' ? (
          <span className="bg-[#ffe8e8] text-[#e11d48] dark:bg-rose-950/60 dark:text-rose-400 rounded-md px-2.5 py-0.5 text-xs font-normal inline-flex items-center gap-1">
            <ShieldAlert className="size-3" />
            Policy Violation
          </span>
        ) : (
          <span className="bg-[#e6f4ea] text-[#16a34a] dark:bg-emerald-950/60 dark:text-emerald-400 rounded-md px-2.5 py-0.5 text-xs font-normal inline-flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            Passing
          </span>
        )
      ),
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataGridColumnHeader title="" column={column} />
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" mode="icon" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => navigate(`/sca/projects/${row.original.id || row.original.name}`)}
            >
              <span>View Repository</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: 'text-center',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export default function SCADependencyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('affected-projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [advSearchQuery, setAdvSearchQuery] = useState('');

  // Fetch Full Dependency View Data
  const { data: apiRes, isLoading, isFetching } = useGetScaDependencyByIdQuery(id);

  const dependency = apiRes?.data?.dependency || null;
  const affectedProjects = apiRes?.data?.affectedProjects || [];
  const vulnerabilitiesList = apiRes?.data?.vulnerabilities || [];
  const stats = apiRes?.data?.stats || {
    projectsCount: 0,
    vulnerabilitiesCount: 0,
    isOutdated: false,
    license: 'MIT',
  };

  const columns = useMemo(() => getAffectedProjectColumns(navigate), [navigate]);

  if (!isLoading && !isFetching && !dependency) {
    return (
      <div className="w-full px-6 py-8">
        <Button variant="ghost" size="sm" className="gap-2 mb-4" onClick={() => navigate('/sca/dependencies')}>
          <ArrowLeft className="size-4" />
          <span>Back to Dependencies</span>
        </Button>
        <EmptyScreen
          title="Dependency Not Found"
          subTitle={`Could not locate package record for '${id}'.`}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6 space-y-6">
      <Helmet>
        <title>{`SCA | Dependency - ${dependency?.name || id}`}</title>
      </Helmet>

      {/* Header */}
      <DependencyDetailHeader
        dependency={dependency}
        id={id}
        stats={stats}
        affectedProjectsCount={affectedProjects.length}
        vulnerabilitiesCount={vulnerabilitiesList.length}
        isLoading={isLoading || isFetching}
      />

      {/* Top Metrics Cards Row */}
      <DependencyDetailKpiCards
        stats={stats}
        dependency={dependency || {}}
        affectedProjectsCount={affectedProjects.length}
        isLoading={isLoading || isFetching}
      />

      {/* Navigation Line-Variant Tabs Matching Project Detail Page */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          variant="line"
          size="md"
          className="border-b w-full justify-start gap-6 bg-transparent px-0 mb-6"
        >
          <TabsTrigger
            value="affected-projects"
            className="font-medium text-sm text-gray-500 data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent pb-2 px-1 rounded-none shadow-none"
          >
            Importing Repositories ({affectedProjects.length})
          </TabsTrigger>
          <TabsTrigger
            value="advisories"
            className="font-medium text-sm text-gray-500 data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent pb-2 px-1 rounded-none shadow-none"
          >
            CVE Advisories ({vulnerabilitiesList.length})
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            className="font-medium text-sm text-gray-500 data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent pb-2 px-1 rounded-none shadow-none"
          >
            Provenance & Metadata
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Importing Repositories */}
        <TabsContent value="affected-projects" className="mt-0">
          <Table
            data={affectedProjects}
            columns={columns}
            isLoading={isLoading || isFetching}
            search={searchQuery}
            setSearch={setSearchQuery}
            searchPlaceholder="Search repository..."
            showPagination={false}
            manualPagination={false}
          />
        </TabsContent>

        {/* Tab 2: CVE Advisories */}
        <TabsContent value="advisories" className="mt-0">
          <DependencyAdvisoriesTab
            vulnerabilitiesList={vulnerabilitiesList}
            searchQuery={advSearchQuery}
            setSearchQuery={setAdvSearchQuery}
            isLoading={isLoading || isFetching}
          />
        </TabsContent>

        {/* Tab 3: Provenance & Metadata */}
        <TabsContent value="metadata" className="mt-0">
          <DependencyMetadataTab dependency={dependency} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
