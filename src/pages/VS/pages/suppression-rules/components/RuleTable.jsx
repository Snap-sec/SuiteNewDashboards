import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useToggleVsSuppressionRuleMutation } from '@/services/vs/vsApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch, SwitchIndicator, SwitchWrapper } from '@/components/ui/switch';
import Table from '@/components/custom/table';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { useAuth } from '@/auth/context/auth-context';
import useStore from '../store';
import ActionColumn from './ActionColumn';

function RuleTable({ data, isLoading, isFetching }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const navigate = useNavigate();
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const [toggleRule] = useToggleVsSuppressionRuleMutation();

  const handleToggle = (rule, checked) => {
    toast.promise(toggleRule({ id: rule._id, enabled: checked }).unwrap(), {
      loading: 'Updating Status',
      success: 'Status Updated',
      error: 'Failed to update status',
    });
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        accessorFn: (row) => row.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Rule Name" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm">{row.original.name}</p>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {row.original.description}
            </p>
          </div>
        ),
        size: 400,
        enableSorting: false,
        meta: {
          skeleton: (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4" />
              <Skeleton className="h-3" />
            </div>
          ),
        },
      },
      {
        id: 'applies_to',
        accessorFn: (row) => row.suppressed_count || 0,
        header: ({ column }) => (
          <DataGridColumnHeader title="Applies To" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.suppressed_count || 0} vulnerabilities
          </div>
        ),
        size: 150,
        meta: {
          skeleton: <Skeleton className="h-5" />,
        },
      },
      ...(!isAuditor
        ? [
            {
              id: 'status',
              header: ({ column }) => (
                <DataGridColumnHeader title="Status" column={column} />
              ),
              cell: ({ row }) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <SwitchWrapper>
                    <Switch
                      checked={row.original.enabled !== false}
                      onCheckedChange={(checked) =>
                        handleToggle(row.original, checked)
                      }
                      size="md"
                    />
                    <SwitchIndicator state="on" className="text-[10px] font-bold">
                      ON
                    </SwitchIndicator>
                    <SwitchIndicator state="off" className="text-[10px] font-bold">
                      OFF
                    </SwitchIndicator>
                  </SwitchWrapper>
                </div>
              ),
              size: 100,
              meta: {
                skeleton: <Skeleton className="h-6 w-11 rounded-full" />,
              },
            },
            {
              id: 'actions',
              header: ({ column }) => (
                <DataGridColumnHeader
                  title=""
                  column={column}
                  className="justify-center"
                />
              ),
              cell: ({ row }) => <ActionColumn rule={row.original} />,
              size: 70,
              meta: {
                skeleton: (
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ),
              },
            },
          ]
        : []),
    ],
    [isAuditor],
  );

  return (
    <Table
      data={data?.results}
      columns={columns}
      enableSorting={true}
      isLoading={isLoading || isFetching}
      totalPages={data?.totalPages || 1}
      totalCount={data?.totalResults}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search rules..."
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={data?.advanced_filters || []}
          isLoadingFilters={isLoading}
          onReset={() =>
            navigate(window.location.pathname, { replace: true })
          }
        />
      }
      rightToolbar={null}
    />
  );
}

export default RuleTable;
