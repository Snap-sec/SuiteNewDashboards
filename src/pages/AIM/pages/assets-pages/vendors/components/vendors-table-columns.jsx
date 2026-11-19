import React, { useState } from 'react';
import { Building2, ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
              Edit Vendor
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={() => setIsDeleteOpen(true)}
              className="text-destructive"
            >
              Delete Vendor
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
          title="Delete Vendor"
          dialog={
            <span>
              Are you sure you want to delete <strong>{row.original?.vendor?.name || row.original?.name || row.original?.value || 'this vendor'}</strong>? This action cannot be undone.
            </span>
          }
        />
      )}
    </>
  );
};

export const getVendorsTableColumns = ({ onDelete, onEdit } = {}) => {
  const userJSON = localStorage.getItem('user');
  const localUser = userJSON ? JSON.parse(userJSON) : null;
  const isAuditor = localUser?.role?.toLowerCase() === 'auditor';

  return [
    {
      id: 'name',
      accessorFn: (row) => row.vendor?.name || row.name || row.data?.name || row.value || '',
      header: ({ column }) => <DataGridColumnHeader title="Vendor" column={column} />,
      cell: ({ row }) => {
        const v = row.original?.vendor || row.original?.data || row.original;
        const logoUrl = v?.logo_url || v?.logoUrl;
        const vendorName = v?.name || row.original?.value || '—';
        return (
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={vendorName}
                className="size-6 rounded object-contain border bg-background"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="size-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-medium text-foreground">{vendorName}</span>
          </div>
        );
      },
      enableSorting: true,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'description',
      accessorFn: (row) => row.vendor?.description || row.description || row.data?.description || '',
      header: ({ column }) => <DataGridColumnHeader title="Description" column={column} />,
      cell: ({ row }) => {
        const v = row.original?.vendor || row.original?.data || row.original;
        const description = v?.description;
        return (
          <span className="text-muted-foreground line-clamp-1">
            {description || '—'}
          </span>
        );
      },
      enableSorting: false,
      size: 220,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'website',
      accessorFn: (row) => row.vendor?.website || row.vendor?.domain || row.website || row.data?.website || '',
      header: ({ column }) => <DataGridColumnHeader title="Website" column={column} />,
      cell: ({ row }) => {
        const v = row.original?.vendor || row.original?.data || row.original;
        const website = v?.website || v?.domain;
        if (!website) return <span className="text-muted-foreground">—</span>;
        const href = website.startsWith('http') ? website : `https://${website}`;
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
          >
            <span>{website.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        );
      },
      enableSorting: true,
      size: 160,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'email',
      accessorFn: (row) => row.vendor?.email || row.email || row.data?.email || '',
      header: ({ column }) => <DataGridColumnHeader title="Email" column={column} />,
      cell: ({ row }) => {
        const v = row.original?.vendor || row.original?.data || row.original;
        const email = v?.email;
        return (
          <span className="text-foreground">{email || '—'}</span>
        );
      },
      enableSorting: true,
      size: 180,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'phone',
      accessorFn: (row) => row.vendor?.phone || row.phone || row.data?.phone || '',
      header: ({ column }) => <DataGridColumnHeader title="Phone" column={column} />,
      cell: ({ row }) => {
        const v = row.original?.vendor || row.original?.data || row.original;
        const phone = v?.phone;
        return (
          <span className="text-muted-foreground">{phone || '—'}</span>
        );
      },
      enableSorting: false,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'address',
      accessorFn: (row) => row.vendor?.address || row.address || row.data?.address || '',
      header: ({ column }) => <DataGridColumnHeader title="Address" column={column} />,
      cell: ({ row }) => {
        const v = row.original?.vendor || row.original?.data || row.original;
        const address = v?.address;
        return (
          <span className="text-muted-foreground line-clamp-1">
            {address || '—'}
          </span>
        );
      },
      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    ...(isAuditor ? [] : [{
      id: 'actions',
      header: () => null,
      cell: ({ row }) => <ActionCell row={row} onEdit={onEdit} onDelete={onDelete} />,
      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    }]),
  ];
};
