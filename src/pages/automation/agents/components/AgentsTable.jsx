import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@/components/custom/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from "@/components/common/empty-screen.jsx"
import { Skeleton } from '@/components/ui/skeleton';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { StatusBadge } from '@/components/custom/status-badge';
import { DateFormatter } from '@/components/custom/date-formatter';
import ApiErrorHandler from '@/components/common/api-error-handler';
import useDebounce from '@/hooks/use-debounce';
import { useGetAgentsQuery } from '@/services/automation/agentsApi';
import AgentListDropdown from './dropdowns/agent-list-dropdown';
import CreateAgentModal from './create-agent-modal.jsx';
import PageHeading from '@/components/custom/page-heading';
import RefreshAgents from './actions/refresh-agents.jsx';

function getColumns({ navigate, isLoading }) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Agent Name" column={column} />
      ),
      cell: ({ row }) => {
        if (isLoading) {
          return <Skeleton className="h-7" />;
        }
        const isSystem = Boolean(
          row.original.is_system_defined ?? row.original.isSystemDefined
        );

        return (
          <div
            className="flex flex-col cursor-pointer group"
            onClick={() =>
              navigate(`/ai-agent-builder/agents/${row.original._id || row.original.id}`)
            }
          >
            <div className="flex items-center gap-2">
              <span className="font-medium truncate group-hover:text-primary transition-colors">
                {row.original.name || 'Untitled Agent'}
              </span>
              {isSystem && (
                <Badge
                  variant="secondary"
                  appearance="outline"
                  size="lg"
                  className="uppercase tracking-wider font-semibold"
                >
                  System
                </Badge>
              )}
            </div>
            {row.original.description && (
              <span className="block text-muted-foreground text-xs truncate">
                {row.original.description}
              </span>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 400,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'status',
    //   accessorFn: (row) => row.status,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Status" column={column} />
    //   ),
    //   cell: ({ row }) =>
    //     isLoading ? (
    //       <Skeleton className="h-7" />
    //     ) : (
    //       <StatusBadge status={row.original.status || 'idle'} />
    //     ),
    //   enableSorting: true,
    //   size: 120,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
    {
      id: 'model',
      accessorFn: (row) => row.model,
      header: ({ column }) => (
        <DataGridColumnHeader title="Model" column={column} />
      ),
      cell: ({ row }) => {
        if (isLoading) {
          return <Skeleton className="h-7" />;
        }
        if (!row.original.model) {
          return <span className="text-muted-foreground text-xs">-</span>;
        }
        return (
          <span className="truncate">
            {row.original.model}
          </span>
        );
      },
      enableSorting: false,
      size: 70,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'skills',
      accessorFn: (row) => row.skills,
      header: ({ column }) => (
        <DataGridColumnHeader title="Skills" column={column} />
      ),
      cell: ({ row }) => {
        if (isLoading) {
          return <Skeleton className="h-7" />;
        }

        const rawSkills = row.original.skills;
        const skills = Array.isArray(rawSkills)
          ? rawSkills
            .map((s) => (typeof s === 'string' ? s : s?.name || s?.id || ''))
            .filter(Boolean)
          : [];

        if (skills.length === 0) {
          return <span className="text-muted-foreground text-xs">-</span>;
        }

        const visibleSkills = skills.slice(0, 2);
        const remaining = skills.length - 2;

        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {visibleSkills.map((skillName, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                appearance="outline"
                title={skillName}
              >
                {skillName}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge
                variant="secondary"
                appearance="outline"
                title={skills.slice(2).join(', ')}
              >
                +{remaining}
              </Badge>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'updatedAt',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Active" column={column} />
      ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton className="h-7" />
        ) : (
          <div>
            {row.original.updatedAt ? (
              <DateFormatter date={row.original.updatedAt} />
            ) : (
              '-'
            )}
          </div>
        ),
      enableSorting: true,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton className="h-8 w-8 rounded-md" />
        ) : (
          <div className="flex items-center justify-end">
            <AgentListDropdown row={row} />
          </div>
        ),
      enableSorting: false,
      size: 40,
      meta: {
        cellClassName: 'text-right',
        skeleton: <Skeleton className="h-8 w-8" />,
      },
    },
  ];
}

export default function AgentsTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const debouncedSearch = useDebounce(search, 400);

  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [pagination.pageIndex, pagination.pageSize, debouncedSearch]
  );

  const { data: apiData, isLoading, isFetching, isError, error } = useGetAgentsQuery(queryParams);

  const isTableLoading = isLoading || isFetching;

  const displayAgents = useMemo(() => {
    const raw =
      apiData?.data?.agents ||
      apiData?.data ||
      apiData?.agents ||
      (Array.isArray(apiData) ? apiData : []);

    const source = raw || [];

    if (!debouncedSearch?.trim()) return source;
    const q = debouncedSearch.toLowerCase();
    return source.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.model?.toLowerCase().includes(q) ||
        a.status?.toLowerCase().includes(q) ||
        (Array.isArray(a.skills) &&
          a.skills.some((s) =>
            (typeof s === 'string' ? s : s?.name || s?.id || '').toLowerCase().includes(q)
          ))
    );
  }, [apiData, debouncedSearch]);

  const columns = useMemo(
    () =>
      getColumns({
        navigate,
        isLoading: isTableLoading,
      }),
    [navigate, isTableLoading]
  );

  const totalCount =
    apiData?.meta?.total ??
    apiData?.total ??
    apiData?.pagination?.total ??
    displayAgents.length;
  const totalPages =
    apiData?.meta?.totalPages ??
    (Math.ceil(totalCount / pagination.pageSize) || 1);

  if (!isLoading && !isFetching && isError) {
    return <ApiErrorHandler error={error} />;
  }

  const showEmptyTable = !isLoading && displayAgents?.length === 0 && !debouncedSearch?.trim();
  if (showEmptyTable) {
    return (
      <EmptyScreen
        title="No agents found"
        subTitle={debouncedSearch?.trim() ? "No agents exist" : "Create an agent to get started"}
        engage={<CreateAgentModal />}
      />
    );
  }

  if (isError) {
    return (
      <div className="col-span-full">
        <ApiErrorHandler error={error} />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <PageHeading
          title="Agents"
          description="Manage your automation agents and view their performance."
        />
        <div className="flex gap-2">
        <RefreshAgents />
        <CreateAgentModal />
        </div>
      </div>
      <Table
        data={displayAgents}
        columns={columns}
        isLoading={isTableLoading}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search agents by name, model, or skills..."
        searchWidth="70"
        pagination={pagination}
        setPagination={setPagination}
        totalCount={totalCount}
        totalPages={totalPages}
        manualPagination={true}
        manualSorting={false}
        enableSorting={true}
        cardHeading={true}
      />
    </>
  );
}
