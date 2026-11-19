import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';

const getStatusBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'valid') {
    return (
      <Badge variant="success" appearance="light">
        Valid
      </Badge>
    );
  }
  if (!status || s === 'no expiry') {
    return (
      <Badge variant="secondary" appearance="light">
        No expiry
      </Badge>
    );
  }
  if (s === 'expired') {
    return (
      <Badge variant="destructive" appearance="light">
        Expired
      </Badge>
    );
  }
  if (s.includes('expires in') || s === 'expiring soon') {
    return (
      <Badge variant="warning" appearance="light" >
        {status}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" appearance="light" className="capitalize">
      {status}
    </Badge>
  );
};

const ActionCell = ({ row, onEdit, onDelete }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" mode="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Edit License
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={() => setIsDeleteOpen(true)}
              className="text-destructive"
            >
              Delete License
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {onDelete && (
        <ConfirmDialog
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          onConfirm={() => {
            setIsDeleteOpen(false);
            onDelete(row.original);
          }}
          variant="destructive"
          title="Delete License"
          dialog={
            <span>
              Are you sure you want to delete <strong>{row.original?.license?.name || row.original?.name || row.original?.value || 'this license'}</strong>? This action cannot be undone.
            </span>
          }
        />
      )}
    </>
  );
};

export const getLicensesTableColumns = ({ onDelete, onEdit } = {}) => [
  {
    id: 'name',
    accessorFn: (row) => row.license?.name || row.name || row.data?.name || row.value || '',
    header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
    cell: ({ row }) => {
      const l = row.original?.license || row.original?.data || row.original;
      const name = l?.name || row.original?.value || '—';
      return <span className="font-medium">{name}</span>;
    },
    enableSorting: true,
    size: 200,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'type',
    accessorFn: (row) => row.license?.type || row.type || row.data?.type || '',
    header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
    cell: ({ row }) => {
      const l = row.original?.license || row.original?.data || row.original;
      const type = l?.type || '—';
      return (
        <Badge variant="secondary" appearance="light">
          {type}
        </Badge>
      );
    },
    enableSorting: true,
    size: 130,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'key',
    accessorFn: (row) => row.license?.key || row.key || row.license?.license_key || row.license_key || row.data?.key || '',
    header: ({ column }) => <DataGridColumnHeader title="Key" column={column} />,
    cell: ({ row }) => {
      const l = row.original?.license || row.original?.data || row.original;
      const val = l?.key || l?.license_key || l?.licenseKey;
      return <span>{val || '—'}</span>;
    },
    enableSorting: false,
    size: 160,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'purchased',
    accessorFn: (row) => row.license?.purchased_at || row.purchased_at || row.license?.purchased || row.purchased || '',
    header: ({ column }) => <DataGridColumnHeader title="Purchased" column={column} />,
    cell: ({ row }) => {
      const l = row.original?.license || row.original?.data || row.original;
      const val = l?.purchased_at || l?.purchased;
      return (
        <DateFormatter
          date={val}
          mode="formatted"
          fallback="—"
        />
      );
    },
    enableSorting: true,
    size: 140,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'starts',
    accessorFn: (row) => row.license?.starts_at || row.starts_at || row.license?.starts || row.starts || '',
    header: ({ column }) => <DataGridColumnHeader title="Starts" column={column} />,
    cell: ({ row }) => {
      const l = row.original?.license || row.original?.data || row.original;
      const val = l?.starts_at || l?.starts;
      return (
        <DateFormatter
          date={val}
          mode="formatted"
          fallback="—"
        />
      );
    },
    enableSorting: true,
    size: 140,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'expires',
    accessorFn: (row) => row.license?.expires_at || row.expires_at || row.license?.expires || row.expires || '',
    header: ({ column }) => <DataGridColumnHeader title="Expires" column={column} />,
    cell: ({ row }) => {
      const l = row.original?.license || row.original?.data || row.original;
      const val = l?.expires_at || l?.expires;
      return (
        <DateFormatter
          date={val}
          mode="formatted"
          fallback="—"
        />
      );
    },
    enableSorting: true,
    size: 140,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'status',
    accessorFn: (row) => row.license?.status || row.status || row.data?.status || 'No expiry',
    header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
    cell: ({ row }) => {
      const l = row.original?.license || row.original?.data || row.original;
      const status = l?.status;
      return getStatusBadge(status);
    },
    enableSorting: true,
    size: 130,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'actions',
    header: () => null,
    cell: ({ row }) => <ActionCell row={row} onEdit={onEdit} onDelete={onDelete} />,
    enableSorting: false,
    size: 60,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
];
