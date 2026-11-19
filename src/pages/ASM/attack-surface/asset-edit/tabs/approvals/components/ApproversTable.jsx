import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Profile } from '@/components/custom/profile';
import { Check, X, RotateCcw } from 'lucide-react';
import { formatDateTime, debounce } from '@/lib/helpers';
import Table from '@/components/custom/table';
import DetailedHoverPopover from '@/components/custom/detailed-popover';


const ApproversTable = ({ data, user, onAction, onUndo, isLoading, onSearch }) => {
  const [localSearch, setLocalSearch] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((val) => {
      if (onSearch) onSearch(val);
    }, 500),
    [onSearch]
  );

  const handleSearch = (val) => {
    setLocalSearch(val);
    debouncedSearch(val);
  };

  const columns = useMemo(() => [
    {
      header: 'User',
      accessorKey: 'name',
      cell: ({ row }) => {
        const approver = row.original;
        return (
          <div className="flex items-center gap-3">
            <Profile
              email={approver.email}
              name={approver.name}
              role={approver.email}
              size={32}
              showEmail={false}
            />
          </div>
        );
      },
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => (
        <Badge variant="secondary" appearance="outline" className="text-[10px] uppercase font-bold tracking-wider">
          {row.original.role || 'Approver'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case 'accepted':
            return <Badge variant="success" appearance="outline" className="uppercase text-[10px] font-bold">Accepted</Badge>;
          case 'rejected':
            return <Badge variant="destructive" appearance="outline" className="uppercase text-[10px] font-bold">Rejected</Badge>;
          default:
            return (
              <div className="flex items-center gap-1.5 text-orange-500">
                <div className="size-1.5 rounded-full bg-orange-500" />
                <span className="uppercase text-[10px] font-bold tracking-wider">Pending</span>
              </div>
            );
        }
      },
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: ({ row }) => {
        const reason = row.original.reason;
        if (!reason) return <span className="text-sm text-muted-foreground italic">No reason provided</span>;

        return (
          <DetailedHoverPopover
            buttonText={
              <span className="text-sm truncate max-w-[200px] block">
                {reason}
              </span>
            }
            popoverTitle="Approval Reason"
            popoverContent={
              <div>
                <p className="text-sm">
                  {reason}
                </p>
              </div>
            }
            showBadge={false}
            trigger="hover"
            width="max-w-[400px]"
          />
        );
      },
    },
    {
      header: 'Last Updated',
      accessorKey: 'updatedAt',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.updatedAt ? formatDateTime(row.original.updatedAt) : '—'}
        </span>
      ),
    },
    {
      header: () => <div className="text-right">Actions</div>,
      id: 'actions',
      cell: ({ row }) => {
        const approver = row.original;
        const isCurrentUser = user?._id === approver.userId || user?.id === approver.userId;
        const status = approver.status;

        return (
          <div className="flex items-center justify-end gap-2">
            {status === 'pending' && isCurrentUser && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => onAction(approver.userId, 'accepted')}
                >
                  <Check className="size-3.5" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  appearance="destructive"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => onAction(approver.userId, 'rejected')}
                >
                  <X className="size-3.5" />
                  Reject
                </Button>
              </>
            )}
            {status !== 'pending' && isCurrentUser && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => onUndo(approver.userId)}
              >
                <RotateCcw className="size-3.5" />
                Undo
              </Button>
            )}
          </div>
        );
      },
    },
  ], [user, onAction, onUndo]);

  return (
    <Table
      data={data}
      columns={columns}
      isLoading={isLoading}
      enableSearch={true}
      search={localSearch}
      setSearch={handleSearch}
      searchPlaceholder="Search approvers..."
      showPagination={false}
      totalCount={data?.length || 0}
      cardHeading={true}
    />
  );
};

export default ApproversTable;
