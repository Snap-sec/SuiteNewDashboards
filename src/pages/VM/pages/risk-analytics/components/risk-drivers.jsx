import React, { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import Select from '@/components/custom/select';
import Table from '@/components/custom/table';

export default function RiskDrivers({ data, isLoading }) {
  const [viewMode, setViewMode] = useState('executive_insights');

  if (isLoading) {
    return (
      <Card className="bg-card h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-9 rounded-md" />
        </CardHeader>
        <CardContent className="flex-1 p-4 flex flex-col gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 border-b border-border/50 pb-3 last:border-0 last:pb-0"
            >
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const drivers = data?.executiveInsights || [];
  const rems = data?.remediation_opportunities || [];

  const selectOptions = [
    { value: 'executive_insights', label: 'Executive Insights' },
    { value: 'remediation_opportunities', label: 'Remediation Opportunities' },
  ];

  const columns = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataGridColumnHeader title="Remediation" column={column} />
      ),
      cell: ({ row }) => {
        const rem = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm text-foreground">
              {rem.name}
            </span>
            {rem.action && rem.action !== rem.name && (
              <span className="text-[11px] text-muted-foreground">
                {rem.action}
              </span>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 300,
      meta: {
        cellClassName: 'text-start',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Status"
          column={column}
          className="justify-center w-full"
        />
      ),
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() === 'open' ? 'destructive' : 'secondary'}
          appearance="outline"
          className="capitalize"
        >
          {getValue() || 'open'}
        </Badge>
      ),
      enableSorting: false,
      size: 40,
    },
    {
      accessorKey: 'assetCount',
      header: ({ column }) => (
        <DataGridColumnHeader title="Assets" column={column} />
      ),
      cell: ({ getValue }) => <span>{getValue()}</span>,
      enableSorting: false,
      size: 40
    },
    {
      accessorKey: 'openVulnCount',
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerabilities" column={column} />
      ),
      cell: ({ getValue }) => <span>{getValue()}</span>,
      enableSorting: false,
      size: 40,
    },
    {
      accessorKey: 'exposureScoreReduction',
      header: ({ column }) => (
        <DataGridColumnHeader title="Score Reduction" column={column} />
      ),
      cell: ({ getValue }) => {
        const val = Number(getValue()) || 0;
        const isReduction = val > 0;
        const deltaStr = isReduction ? `▼ -${val}` : `+0.0`;
        const variant = isReduction ? 'success' : 'secondary';
        
        return (
          <Badge
            variant={variant}
            appearance="light"
            className="font-bold"
          >
            {deltaStr}
          </Badge>
        );
      },
      size: 50,
      enableSorting: false,
    },
  ];

  return (
    <Card className="bg-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">
            {viewMode === 'executive_insights'
              ? 'Executive Insights'
              : 'Remediation Opportunities'}
          </h3>
          <DetailedHoverPopover
            buttonText={
              <CircleAlert className="h-4 w-4 text-muted-foreground" />
            }
            popoverTitle={
              viewMode === 'executive_insights'
                ? 'Executive Insights'
                : 'Remediation Opportunities'
            }
            popoverContent={
              <p className="text-muted-foreground">
                {viewMode === 'executive_insights'
                  ? 'Key high-level insights and observations to help executives prioritize risk mitigation efforts.'
                  : 'Specific remediation actions that will yield the highest reduction in organizational risk score.'}
              </p>
            }
            showBadge={false}
          />
        </div>
        <Select
          value={viewMode}
          options={selectOptions}
          onChange={(opt) => setViewMode(opt?.value || 'executive_insights')}
          enableSearch={false}
          className="w-[230px]"
        />
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {viewMode === 'executive_insights' ? (
          <div className="flex flex-col gap-5 p-4">
            {drivers.length > 0 ? (
              drivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start border-b border-border/50 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium leading-tight">
                      {driver.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {driver.description}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No executive insights identified.
              </div>
            )}
          </div>
        ) : (
          <Table
            data={rems}
            columns={columns}
            cardHeading={false}
            showPagination={false}
            manualPagination={false}
            manualSorting={false}
            showColumnVisibility={false}
            className="border-0 shadow-none bg-transparent"
          />
        )}
      </CardContent>
    </Card>
  );
}
