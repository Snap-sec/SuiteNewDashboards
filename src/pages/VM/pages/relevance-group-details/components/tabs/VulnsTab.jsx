import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { useTriggerVmRelevanceGroupsBulkActionMutation } from '@/services/vm/relevanceGroupsApi';
import { useGetVmVulnsQuery } from '@/services/vm/vulnerabilityApi';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';


export default function VulnsTab({ groupId, groupName }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching } = useGetVmVulnsQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch || undefined,
      relevance_group_id: groupName,
    },
    {
      skip: !groupName,
    }
  );

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch]);

  const vulns = data?.data?.userVulns || data?.items || data?.data?.items || data?.data || [];
  const totalCount = data?.data?.totalItems || data?.pagination?.total || data?.total || data?.data?.total || data?.count || data?.data?.count || 0;
  const totalPages = data?.data?.totalPages || (data?.pagination
    ? Math.ceil(data.pagination.total / data.pagination.limit)
    : (data?.totalPages || data?.data?.totalPages || 0));

  const columns = useMemo(
    () => [
      {
        id: 'title',
        header: ({ column }) => <DataGridColumnHeader title="Title" column={column} />,
        accessorFn: (row) => row.cve || row.title,
        cell: ({ row }) => {
          return (
            <Link
              to={`/vm/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId?._id || row?.original?.assessmentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="leading-none font-medium text-sm text-mono hover:text-primary"
            >
              <div className="flex flex-col gap-1 lg:gap-2.5">
                <div className="flex items-center gap-1">
                  <p>
                    {row.original.title?.length > 50
                      ? `${row.original.title.substring(0, 50)}...`
                      : row.original.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        },
        meta: {
          cellClassName: 'max-w-[400px]',
          skeleton: <Skeleton className="h-14 w-full" />,
        },
      },
      {
        id: 'owner',
        header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
        accessorFn: (row) => row.assignee,
        cell: ({ row }) => {
          const assignee = row.original.assignee;
          if (!assignee) return <span className="text-muted-foreground">-</span>;
          return assignee.userId ? (
            <Profile
              email={assignee.email}
              name={assignee.name}
              userId={assignee.userId}
              size={24}
              showName={true}
            />
          ) : (
            <span>No Owner</span>
          );
        },
        size: 80,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'severity',
        header: ({ column }) => <DataGridColumnHeader title="Severity" column={column} />,
        accessorFn: (row) => row.severity,
        cell: ({ row }) => {
          const rawSeverity =
            row.original.severity || row.original.cvssRating || 'Low';
          const severity =
            rawSeverity.charAt(0).toUpperCase() +
            rawSeverity.slice(1).toLowerCase();
          return <SeverityLabel severity={severity} />;
        },
        size:50,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'state',
        header: ({ column }) => <DataGridColumnHeader title="State" column={column} />,
        accessorFn: (row) => row.state,
        cell: ({ row }) => <StateLabels state={row.original.state} />,
        size: 30,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },

    ],
    []
  );

  const rightToolbar = null;

  return (
    <Table
      data={vulns}
      columns={columns || []}
      search={search}
      setSearch={setSearch}
      rightToolbar={rightToolbar}
      manualPagination={true}
      manualSorting={false}
      showPagination={true}
      cardHeading={true}
      isLoading={isLoading || isFetching}
      pagination={pagination}
      setPagination={setPagination}
      totalCount={totalCount}
      totalPages={totalPages}
    />
  );
}