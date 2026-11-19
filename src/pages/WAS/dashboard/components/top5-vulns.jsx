'use client';

import { useMemo, useState } from 'react';
import { DateFormatter } from '@/components/custom/date-formatter';
import SeverityLabel from '@/components/custom/severity-label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import VulnInfo from '../../vulnerabilities/components/vuln-info';
import { StateLabels } from '@/components/custom/state-labels';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import CustomTable from '@/components/custom/table';

const Top5VulnsTable = ({ data, isLoading }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverities, setSelectedSeverities] = useState([]);

  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      // Filter by severity
      const matchesSeverity =
        !selectedSeverities?.length ||
        selectedSeverities.includes(item.severity);

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery || item.title.toLowerCase().includes(searchLower);

      return matchesSeverity && matchesSearch;
    });
  }, [searchQuery, selectedSeverities, data]);

  const columns = useMemo(
    () => [
      {
        id: 'title',
        accessorFn: (row) => row.title,
        header: ({ column }) => (
          <DataGridColumnHeader title="Title" column={column} />
        ),

        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <VulnInfo data={row?.original} title={row?.original?.title} />

            <p className="flex items-center gap-2 text-sm truncate font-normal text-muted-foreground">
              {row.original?.evidence?.request?.url}
            </p>
          </div>
        ),

        enableSorting: false,
        size: 250,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-10" />,
        },
      },
      {
        id: 'state',
        accessorFn: (row) => row.eventType,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),

        cell: ({ row }) => (
          <StateLabels state={row?.original?.status} />
        ),

        enableSorting: false,
        size: 40,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'cvssScore',
        accessorFn: (row) => row.severity,
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),

        cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,

        enableSorting: false,
        size: 30,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-6" />,
        },
      },
      {
        id: 'detcted At',
        accessorFn: (row) => row.firstDetectedAt,
        header: ({ column }) => (
          <DataGridColumnHeader title="Application Name" column={column} />
        ),

        cell: ({ row }) => (
          <Badge className="h-fit">
            {row?.original?.application_name}
          </Badge>
        ),

        enableSorting: false,
        size: 40,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-6" />,
        },
      },
      {
        id: 'Found On',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => (
          <DataGridColumnHeader title="Reported On" column={column} />
        ),

        cell: ({ row }) => <DateFormatter date={row.original.createdAt} />,

        enableSorting: false,
        size: 40,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-5" />,
        },
      },
    ],

    [],
  );

  return (
    <CustomTable
      grid
      data={filteredData || []}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={setSearchQuery}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      enableSearch={false}
      showPagination={false}
      cardHeading={false}
      className="border-0 shadow-none rounded-none"
    />
  );
};

export default Top5VulnsTable;
