import { useState } from 'react';
import Table from '@/components/custom/table';
import SeverityLabel from '@/components/custom/severity-label';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const providerBadgeConfig = {
  AWS: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Azure: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  GCP: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
};

export function TopResourcesTable({ data, isLoading }) {
  const [search, setSearch] = useState('');

  const resourcesData = data || [];

  const filteredData = resourcesData.filter(
    (item) =>
      item.resource?.toLowerCase().includes(search.toLowerCase()) ||
      item.issue?.toLowerCase().includes(search.toLowerCase()) ||
      item.account?.toLowerCase().includes(search.toLowerCase()) ||
      item.provider?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      id: 'resource',
      accessorKey: 'resource',
      header: ({ column }) => <DataGridColumnHeader title="Resource" column={column} />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-foreground font-semibold">
          {row.original.resource}
        </span>
      ),
    },
    {
      id: 'provider',
      accessorKey: 'provider',
      header: ({ column }) => <DataGridColumnHeader title="Provider" column={column} />,
      cell: ({ row }) => {
        const provider = row.original.provider;
        const colorClass = providerBadgeConfig[provider] || 'bg-secondary text-foreground';
        return (
          <Badge variant="outline" className={`font-semibold ${colorClass}`}>
            {provider}
          </Badge>
        );
      },
    },
    {
      id: 'issue',
      accessorKey: 'issue',
      header: ({ column }) => <DataGridColumnHeader title="Issue" column={column} />,
      cell: ({ row }) => (
        <span className="text-xs text-secondary-foreground">{row.original.issue}</span>
      ),
    },
    {
      id: 'severity',
      accessorKey: 'severity',
      header: ({ column }) => <DataGridColumnHeader title="Severity" column={column} />,
      cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,
    },
    {
      id: 'account',
      accessorKey: 'account',
      header: ({ column }) => <DataGridColumnHeader title="Account / Region" column={column} />,
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">{row.original.account}</span>
      ),
    },
  ];

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base leading-none tracking-tight font-normal text-sm text-gray-500">
          Top Misconfigured Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        {!isLoading && resourcesData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[230px] text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <Table
            data={filteredData}
            columns={columns}
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
            searchPlaceholder="Search misconfigured resources..."
            showPagination={false}
            showColumnVisibility={false}
            manualPagination={false}
            manualSorting={false}
            enableSearch={true}
            cardHeading={false}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default TopResourcesTable;
