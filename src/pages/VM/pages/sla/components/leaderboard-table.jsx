import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import useStore from '../store';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters';
import { useMemo } from 'react';

function getColumns(isLoading) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
      cell: ({ row }) => {
        const o = row.original;
        const displayName = (o.firstName || o.lastName)
          ? `${o.firstName || ''} ${o.lastName || ''}`.trim()
          : (o.first_name || o.last_name)
          ? `${o.first_name || ''} ${o.last_name || ''}`.trim()
          : o.name || o.email;
          
        return <Profile name={displayName} email={o.email} role={o?.department?.name || ''} />;
      },
      enableSorting: false,
      size: 180,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'totalVulns',
      accessorFn: (row) => row.totalVulns,
      header: ({ column }) => <DataGridColumnHeader title="Total Vulnerabilities" column={column} />,
      cell: ({ row }) => <Badge appearance="outline">{row.original.totalVulns}</Badge>,
      size: 150,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'breachedVulns',
      accessorFn: (row) => row.breachedVulns,
      header: ({ column }) => <DataGridColumnHeader title="Breached" column={column} />,
      cell: ({ row }) => (
        <Badge variant="destructive" appearance="outline">
          {row.original.breachedVulns}
        </Badge>
      ),
      size: 100,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'atRiskVulns',
      accessorFn: (row) => row.atRiskVulns,
      header: ({ column }) => <DataGridColumnHeader title="At Risk" column={column} />,
      cell: ({ row }) => (
        <Badge variant="warning" appearance="outline">
          {row.original.atRiskVulns}
        </Badge>
      ),
      size: 100,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'compliantVulns',
      accessorFn: (row) => row.compliantVulns,
      header: ({ column }) => <DataGridColumnHeader title="Compliant" column={column} />,
      cell: ({ row }) => <Badge variant="success" appearance="outline">{row.original.compliantVulns}</Badge>,
      size: 150,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'complianceRate',
      accessorFn: (row) => row.complianceRate,
      header: ({ column }) => <DataGridColumnHeader title="Compliance %" column={column} />,
      cell: ({ row }) => (
        <Badge appearance="outline">{row.original.complianceRate}%</ Badge>
      ),
      size: 60,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
  ];
}

function LeaderboardTable({ data, isLoading }) {

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const columns = useMemo(() => getColumns(isLoading), [isLoading]);

  const rowData = data?.leaderboard || [];
  const totalItems = rowData.length;
  const totalPages = Math.ceil(totalItems / (data?.limit || 10));

  return (
    <Table
      data={rowData}
      columns={columns}
      isLoading={isLoading}
      totalPages={totalPages}
      totalCount={totalItems}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      search={searchQuery}
      setSearch={setSearchQuery}
      // toolbar={
      //   <TableToolbarFilters
      //     filters={filters}
      //     setFilters={setFilters}
      //     supportedFilters={transformedFilters}
      //     isLoadingFilters={isLoading}
      //   />
      // }
      enableSorting={true}
    />
  );
}

export default LeaderboardTable;
