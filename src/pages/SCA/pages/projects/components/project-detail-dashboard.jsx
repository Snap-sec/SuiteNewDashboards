import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleAlert, ShieldAlert } from 'lucide-react';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import SeverityLabel from '@/components/custom/severity-label';

function getTop5Columns(projectData) {
  return [
    {
      id: 'title',
      accessorFn: (row) => row.title || row.vulnerabilityID,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),
      cell: ({ row }) => (
        <a
          href={row.original.primaryURL || `https://nvd.nist.gov/vuln/detail/${row.original.vulnerabilityID}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-normal text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <ShieldAlert className="size-3.5 text-rose-500 shrink-0" />
          <span>{row.original.title || `${row.original.vulnerabilityID} - ${row.original.pkgName}`}</span>
        </a>
      ),
      enableSorting: true,
      size: 240,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'owner',
      accessorFn: () => projectData?.owner || 'faizanalibhat',
      header: ({ column }) => (
        <DataGridColumnHeader title="Owner" column={column} />
      ),
      cell: () => (
        <span className="text-sm font-normal text-muted-foreground">
          {projectData?.owner || 'faizanalibhat'}
        </span>
      ),
      enableSorting: false,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'status',
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: () => (
        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium px-2.5 py-0.5 rounded-md">
          Un Resolved
        </span>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severity',
      accessorFn: (row) => row.severity,
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),
      cell: ({ row }) => (
        <SeverityLabel severity={row.original.severity} score={row.original.cvssScore} />
      ),
      enableSorting: true,
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'reported',
      accessorFn: () => projectData?.lastScan || 'Aug 16, 2026',
      header: ({ column }) => (
        <DataGridColumnHeader title="Reported" column={column} />
      ),
      cell: () => (
        <span className="text-sm font-normal text-muted-foreground">
          {projectData?.lastScan || 'Aug 16, 2026'}
        </span>
      ),
      enableSorting: false,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function ProjectDetailDashboard({
  trendChartData,
  openCloseBarData,
  severityDonutData,
  vulnerabilitiesList = [],
  projectData,
  setActiveTab,
  isLoading,
}) {
  const top5Vulns = useMemo(() => vulnerabilitiesList.slice(0, 5), [vulnerabilitiesList]);
  const columns = useMemo(() => getTop5Columns(projectData), [projectData]);

  return (
    <div className="mt-0 flex flex-col gap-6">
      {/* 3-Card Metrics Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Card 1: Vulnerability Trends */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full border border-border/80 shadow-sm rounded-xl">
            <CardHeader className="py-3.5 px-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
                Vulnerability Trends
                <DetailedHoverPopover
                  buttonText={
                    <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <CircleAlert className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  }
                  showBadge={false}
                  popoverTitle="About this Graph"
                  popoverContent={
                    <p className="text-xs text-muted-foreground">
                      This graph tracks the trend of open vs. closed vulnerabilities over time, helping monitor remediation progress.
                    </p>
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex flex-col justify-end items-stretch grow">
              <ReAreaChart
                noCard
                data={trendChartData}
                xKey="date"
                keys={[
                  { key: 'open', label: 'Open' },
                  { key: 'closed', label: 'Closed' },
                ]}
                colors={['#FF4560', '#00E396']}
                stacked={false}
                curveType="monotone"
                height={230}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 2: Open/Close Severity Distribution */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full border border-border/80 shadow-sm rounded-xl">
            <CardHeader className="py-3.5 px-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
                Open/Close Severity Distribution
                <DetailedHoverPopover
                  buttonText={
                    <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <CircleAlert className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  }
                  showBadge={false}
                  popoverTitle="About this Graph"
                  popoverContent={
                    <p className="text-xs text-muted-foreground">
                      This graph breaks down open and closed vulnerabilities by severity level across Low, Medium, High, Critical.
                    </p>
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ReBarChart
                noCard
                data={openCloseBarData}
                xKey="severity"
                keys={[
                  { key: 'open', label: 'Open' },
                  { key: 'closed', label: 'Closed' },
                ]}
                colors={['#FF4560', '#00E396']}
                height={230}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 3: Severity Distribution Donut */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full border border-border/80 shadow-sm rounded-xl">
            <CardContent className="p-3 h-full">
              <DonutChart
                data={severityDonutData}
                colors={['#ef4444', '#f97316', '#eab308', '#3b82f6']}
                title="Severity Distribution"
                titleBadge={
                  <DetailedHoverPopover
                    buttonText={
                      <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0">
                        <CircleAlert className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    }
                    showBadge={false}
                    popoverTitle="About this Graph"
                    popoverContent={
                      <p className="text-xs text-muted-foreground">
                        Breakdown of active vulnerabilities by severity level illustrating overall risk profile.
                      </p>
                    }
                  />
                }
                centerLabel="Total"
                showLegend={true}
                height={240}
                className="h-full"
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top 5 Vulnerabilities Preview Table */}
      <Card className="border border-border/80 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="py-3.5 px-4 border-b border-border/50">
          <CardTitle className="font-normal text-sm text-gray-500">
            Top 5 Vulnerabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            data={top5Vulns}
            columns={columns}
            isLoading={isLoading}
            showPagination={false}
            manualPagination={false}
            enableSorting={true}
          />
        </CardContent>
        <CardFooter className="justify-center py-3 border-t border-border/50">
          <Button
            variant="link"
            onClick={() => setActiveTab('vulnerabilities')}
            className="text-xs font-medium text-blue-500 hover:underline"
          >
            View All Vulnerabilities
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
