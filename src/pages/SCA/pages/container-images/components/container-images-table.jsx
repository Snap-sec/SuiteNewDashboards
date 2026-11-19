import React, { useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Table from '@/components/custom/table';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';
import { useAuth } from '@/auth/context/auth-context';

function getColumns(handleTriggerScanSingle, handleDeleteImage, isAuditor = false) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Container Image" column={column} />
      ),
      cell: ({ row }) => {
        const img = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span>{img.name}</span>
            {img.digest && (
              <span className="text-xs text-muted-foreground truncate max-w-[180px]" title={img.digest}>
                {img.digest}
              </span>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 200,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'tag',
      accessorFn: (row) => row.tag,
      header: ({ column }) => (
        <DataGridColumnHeader title="Tag" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          :{row.original.tag || 'latest'}
        </Badge>
      ),
      enableSorting: false,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'registry',
      accessorFn: (row) => row.registry,
      header: ({ column }) => (
        <DataGridColumnHeader title="Registry" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.registry}
        </Badge>
      ),
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'baseOs',
      accessorFn: (row) => row.baseOs,
      header: ({ column }) => (
        <DataGridColumnHeader title="Base OS / Arch" column={column} />
      ),
      cell: ({ row }) => {
        const img = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span>{img.baseOs}</span>
            <span className="text-xs text-muted-foreground">
              {img.architecture} • {img.size}
            </span>
          </div>
        );
      },
      enableSorting: false,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'packagesCount',
      accessorFn: (row) => row.packagesCount,
      header: ({ column }) => (
        <DataGridColumnHeader title="Packages" column={column} />
      ),
      cell: ({ row }) => {
        const img = row.original;
        return (
          <span>{img.packagesCount} pkgs ({img.layersCount} layers)</span>
        );
      },
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'vulnerabilityBreakdown',
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerability Breakdown" column={column} />
      ),
      cell: ({ row }) => {
        const img = row.original;
        return (
          <VulnerabilitiesBadges
            vulnerabilities={{
              critical: img.vulnCounts?.critical || 0,
              high: img.vulnCounts?.high || 0,
              medium: img.vulnCounts?.medium || 0,
              low: img.vulnCounts?.low || 0,
              info: img.vulnCounts?.info || 0,
            }}
            assetName={img.name}
          />
        );
      },
      enableSorting: false,
      size: 180,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'lastScan',
      accessorFn: (row) => row.lastScan,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Scan" column={column} />
      ),
      cell: ({ row }) => (
        <span>{row.original.lastScan || "-"}</span>
      ),
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    ...(!isAuditor
      ? [
          {
            id: 'actions',
            header: ({ column }) => (
              <DataGridColumnHeader title="" column={column} />
            ),
            cell: ({ row }) => {
              const img = row.original;
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      mode="icon"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() =>
                        handleTriggerScanSingle(img.id, img.name, img.tag)
                      }
                    >
                      <span>Trigger Image Scan</span>
                    </DropdownMenuItem>
                    {img.htmlUrl && (
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => window.open(img.htmlUrl, '_blank')}
                      >
                        <span>View GHCR Registry</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <span>Export CycloneDX SBOM</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <span>Export SPDX SBOM</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => handleDeleteImage(img.id, img.name)}
                    >
                      <span>Remove Image</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
            enableSorting: false,
            size: 60,
            meta: {
              cellClassName: 'text-center',
              skeleton: <Skeleton className="h-7" />,
            },
          },
        ]
      : []),
  ];
}

export function ContainerImagesTable({
  imagesList = [],
  advancedFilters,
  isLoading,
  isFetching,
  searchQuery,
  setSearchQuery,
  filters = {},
  setFilters,
  handleTriggerScanSingle,
  handleDeleteImage,
}) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const columns = useMemo(
    () =>
      getColumns(handleTriggerScanSingle, handleDeleteImage, isAuditor),
    [handleTriggerScanSingle, handleDeleteImage, isAuditor],
  );

  const supportedFilters = useMemo(
    () => advancedFilters || [],
    [advancedFilters],
  );

  return (
    <Table
      data={imagesList}
      columns={columns}
      isLoading={isLoading || isFetching}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search image name, tag or digest..."
      toolbar={
        <TableToolbarFilters
          supportedFilters={supportedFilters}
          filters={filters}
          setFilters={setFilters}
          isLoadingFilters={isLoading}
        />
      }
      manualPagination={false}
      enableSorting={true}
      className="mt-4"
    />
  );
}
