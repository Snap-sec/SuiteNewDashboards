import React, { useEffect, useMemo } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import CustomTable from '@/components/custom/table';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import useStore from '../store';
import VendorActionMenu from './VendorActionMenu';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

function getInitials(name) {
  return name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) : '?';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function VendorTable({
  vendors,
  totalCount,
  isLoading,
  onToggleActive,
  onMarkAsDefault,
  setEditVendor,
  setFormOpen,
  setDetailVendor,
  setDetailOpen,
  setDeleteVendor,
  setDeleteOpen
}) {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  // Clear selection when pagination changes
  useEffect(() => {
    setRowSelection(() => ({}));
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Service Vendor" column={column} />
        ),
        enableSorting: false,
        size: 350,
        minSize: 250,
        meta: {
          skeleton: (
            <div className="flex items-center gap-3 py-1">
              <Skeleton className="size-9 rounded-full" />
              <div className="w-full space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ),
        },
        cell: ({ row }) => {
          const vendor = row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <Avatar className="size-9">
                <AvatarImage src={vendor.logo_url} alt={vendor.name} />
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {getInitials(vendor.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p title={vendor.name} className="text-sm truncate ">
                    {vendor.name}
                  </p>
                  {vendor.isDefault && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded">
                      Default
                    </span>
                  )}
                </div>
                {/* {vendor.description && (
                  <p className="text-[11px] text-muted-foreground truncate max-w-[400px]">
                    {vendor.description}
                  </p>
                )} */}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'email',
        enableSorting: false,
        header: ({ column }) => (
          <DataGridColumnHeader title="Email" column={column} />
        ),
        meta: {
          skeleton: <Skeleton className="h-7" />
        },
        cell: ({ row }) => {
          const vendor = row.original;
          const contact = vendor.contact_details || {};
          const email = vendor.email || contact.email;

          return email ? (
            <span
              title={email}
              className="text-sm font-normal text-foreground truncate block max-w-[200px]"
            >
              {email}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: 'phone',
        enableSorting: false,
        header: ({ column }) => (
          <DataGridColumnHeader title="Phone Number" column={column} />
        ),
        meta: {
          skeleton: <Skeleton className="h-7" />
        },
        cell: ({ row }) => {
          const vendor = row.original;
          const contact = vendor.contact_details || {};
          const phone = vendor.phone || contact.phone;

          return phone ? (
            <span className="text-sm font-normal text-foreground">
              {phone}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: 'address',
        header: ({ column }) => (
          <DataGridColumnHeader title="Address" column={column} />
        ),
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
        cell: ({ row }) => {
          const contact = row.original.contact_details || {};
          const address = row.original.address || contact.address;
          return (
            <span className="text line-clamp-1 max-w-[200px]">
              {address || '—'}
            </span>
          );
        },
      },
      {
        accessorKey: 'assessmentCount',
        header: ({ column }) => (
          <DataGridColumnHeader title="Assessments" column={column} />
        ),
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-7 mx-auto" />,
        },
        cell: ({ row }) => (
          <div>
            {row.original.assessmentCount || 0}
          </div>
        ),
      },

      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataGridColumnHeader title="Added On" column={column} />
        ),
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-7 mx-auto" />,
        },
        cell: ({ row }) => (
          <div className="text tabular-nums">
            {formatDate(row.original.createdAt)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-center"></div>,
        meta: {
          headerClassName: 'text-center',
          cellClassName: 'text-center',
          skeleton: <Skeleton className="h-7 rounded-md mx-auto" />,
        },
        cell: ({ row }) => (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <VendorActionMenu
              vendor={row.original}
              onMarkAsDefault={onMarkAsDefault}
              setEditVendor={setEditVendor}
              setFormOpen={setFormOpen}
              setDetailVendor={setDetailVendor}
              setDetailOpen={setDetailOpen}
              setDeleteVendor={setDeleteVendor}
              setDeleteOpen={setDeleteOpen}
            />
          </AuthorityGuard>
        ),
        size: 70,
      },
    ],
    [
      onToggleActive,
      onMarkAsDefault,
      setEditVendor,
      setFormOpen,
      setDetailVendor,
      setDetailOpen,
      setDeleteVendor,
      setDeleteOpen,
    ],
  );

  return (
    <CustomTable
      data={vendors}
      columns={columns}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search..."
      cardHeading={true}
      manualPagination={true}
      manualSorting={true}
      isLoading={isLoading}
      totalCount={totalCount}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      showPagination={totalCount > pagination.pageSize || pagination.pageIndex > 0}
      pageSizeOptions={[10, 20, 50]}
      enableSorting={true}
      grid
    />
  );
}