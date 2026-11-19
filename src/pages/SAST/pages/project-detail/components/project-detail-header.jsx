import React from 'react';
import RemediationProgress from '@/pages/VM/pages/assets/components/ui/remediation-progress';
import {
  Box,
  Copy,
  ExternalLink,
  FolderGit2,
  Loader2,
  MoreHorizontal,
  Play,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectDetailHeader({
  projectData,
  id,
  isImage,
  isScanning,
  handleTriggerScan,
  handleCopyProjectId,
  handleCopyProjectUrl,
  setActiveTab,
  stats,
  statisticsPills = [],
  isLoading,
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="lg:py-7.5">
          <div className="flex flex-wrap gap-7.5">
            <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity animate-pulse">
              <Skeleton className="size-[70px] rounded-lg" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="flex flex-col gap-5 lg:gap-7.5 grow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-48 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                  <Skeleton className="h-4 w-64 rounded" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md min-w-[100px]"
                  >
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-3.5 w-8 rounded" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-6 lg:gap-12">
                <div className="flex flex-col gap-3.5 grow">
                  <Skeleton className="h-4 w-72 rounded" />
                  <Skeleton className="h-2 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="lg:py-7.5">
        <div className="flex flex-wrap gap-7.5">
          {/* Left Logo Container */}
          <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity">
            {isImage ? (
              <Box className="size-[70px] text-indigo-500 stroke-[1.5]" />
            ) : (
              <FolderGit2 className="size-[70px] text-emerald-500 stroke-[1.5]" />
            )}

            <span className="text-sm font-semibold text-mono text-center">
              {projectData?.name && projectData.name.length > 10
                ? `${projectData.name.substring(0, 10)}...`
                : projectData?.name}
            </span>
          </div>

          {/* Right Information & Statistics Area */}
          <div className="flex flex-col gap-5 lg:gap-7.5 grow">
            {/* Title Row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-semibold">
                    {projectData?.name}
                  </h2>

                  <Badge variant="secondary">
                    Testing Ongoing
                  </Badge>
                </div>
                <p className="text-sm text-secondary-foreground">
                  Comprehensive security assessment overview.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTriggerScan}
                  disabled={isScanning}
                  className="gap-2 text-xs font-medium"
                >
                  {isScanning ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Play />
                  )}
                  Run Scan
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[200px]"
                    side="bottom"
                    align="end"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleCopyProjectId}
                    >
                      Copy Project ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleCopyProjectUrl}
                    >
                      Copy Repo URL
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setActiveTab('vulnerabilities')}
                    >
                      View Vulnerabilities
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Statistics Pills */}
            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
              {statisticsPills.map((statistic, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md"
                >
                  <span className="text-mono text-sm leading-none font-medium">
                    {statistic.label}
                  </span>
                  <span
                    className={`text-xs ${statistic.color || 'text-secondary-foreground'}`}
                  >
                    {statistic.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Remediation Progress Bar Row */}
            <div className="flex flex-wrap gap-6 lg:gap-12">
              <div className="flex flex-col gap-3.5 grow">
                <div className="text-sm text-secondary-foreground">
                  Closed{' '}
                  <span className="text-sm font-medium text-mono">0</span> out
                  of{' '}
                  <span className="text-sm font-medium text-mono">
                    {stats?.vulnerabilityCounts?.total || 0}
                  </span>{' '}
                  Identified Vulnerabilities
                </div>

                <RemediationProgress progress={0} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
