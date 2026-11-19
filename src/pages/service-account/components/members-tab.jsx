import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useGetOrgMembersQuery, useUpdateMemberAccessMutation } from '@/services/auth/orgApi';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/components/custom/profile';
import { EmptyScreen } from '@/components/common/empty-screen';
import { Skeleton } from '@/components/ui/skeleton';
import useDebounce from '@/hooks/use-debounce';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';

const CANONICAL_PRODUCTS = [
  { id: 'VM', name: 'VM', label: 'Vulnerability Management' },
  { id: 'ASM', name: 'ASM', label: 'Attack Surface Management' },
  { id: 'AIM', name: 'AIM', label: 'Asset Inventory Management' },
  { id: 'VS', name: 'VS', label: 'Vulnerability Scanner' },
  { id: 'WAS', name: 'WAS', label: 'Web Application Scanner' },
  { id: 'SCA', name: 'SCA', label: 'Software Composition Analysis' },
  { id: 'SAST', name: 'SAST', label: 'Static Application Security Testing' },
  { id: 'CSPM', name: 'CSPM', label: 'Cloud Security Management' },
];

export function MembersTab({ orgId, products }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [localAccessMap, setLocalAccessMap] = useState({});

  // Confirmation dialog state for checkbox toggle
  const [confirmState, setConfirmState] = useState({
    open: false,
    member: null,
    product: null,
    isRevoke: false,
  });

  const { data, isLoading, isFetching, isError, error } = useGetOrgMembersQuery(
    {
      orgId,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch || undefined,
    },
    { skip: !orgId }
  );

  const [updateMemberAccess] = useUpdateMemberAccessMutation();

  const members = useMemo(() => {
    return data?.data?.members || data?.members || [];
  }, [data]);

  const totalCount = data?.data?.total ?? data?.total ?? members.length;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  // Build the list of products for columns
  const productColumnsList = useMemo(() => {
    const list = [...CANONICAL_PRODUCTS];
    const existingIds = new Set(list.map((p) => p.id));

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p?.id && !existingIds.has(p.id)) {
          existingIds.add(p.id);
          list.push({ id: p.id, name: p.id, label: p.title || p.name || p.id });
        }
      });
    }

    return list;
  }, [products]);

  const getUserAccess = (member) => {
    const memberId = member._id || member.userId;
    if (localAccessMap[memberId] !== undefined) {
      return localAccessMap[memberId];
    }
    if (Array.isArray(member?.accessTo?.user)) {
      return member.accessTo.user;
    }
    if (Array.isArray(member?.accessTo)) {
      return member.accessTo;
    }
    return [];
  };

  const handleToggleAccess = (member, productId) => {
    const memberId = member._id || member.userId;
    if (!memberId) return;

    const currentAccess = getUserAccess(member);
    const isChecked = currentAccess.includes(productId);
    const newAccess = isChecked
      ? currentAccess.filter((p) => p !== productId)
      : [...currentAccess, productId];

    // Optimistic update
    setLocalAccessMap((prev) => ({
      ...prev,
      [memberId]: newAccess,
    }));

    toast.promise(
      updateMemberAccess({
        userId: memberId,
        accessTo: newAccess,
        orgId,
      }).unwrap(),
      {
        loading: `Updating ${productId} access...`,
        success: `${productId} access updated for ${member.name || member.email}!`,
        error: (err) => {
          // Revert on failure
          setLocalAccessMap((prev) => ({
            ...prev,
            [memberId]: currentAccess,
          }));
          return err?.data?.message || 'Failed to update access';
        },
      }
    );
  };

  const handleCheckboxClick = (member, product, isChecked) => {
    setConfirmState({
      open: true,
      member,
      product,
      isRevoke: isChecked,
    });
  };

  const handleConfirmToggle = () => {
    if (confirmState.member && confirmState.product) {
      handleToggleAccess(confirmState.member, confirmState.product.id);
    }
    setConfirmState({ open: false, member: null, product: null, isRevoke: false });
  };

  const columns = useMemo(() => {
    return [
      {
        id: 'name',
        accessorFn: (row) => row.name || row.email,
        header: ({ column }) => (
          <DataGridColumnHeader title="Name" column={column} />
        ),
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center gap-3 py-1 min-w-[220px]">
              <Profile
                size="34px"
                showEmail={false}
                showName={false}
                email={member.email}
                name={member.name}
                userId={member.userId || member._id}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-medium text-foreground truncate" title={member.name}>
                    {member.name || 'Unnamed member'}
                  </span>
                  {member.role && (
                    <Badge variant="outline" appearance="outline" className="text-[10px] h-4.5 px-1.5 font-normal">
                      {member.role}
                    </Badge>
                  )}
                  {member.status && (
                    <Badge
                      variant={member.status === 'active' ? 'success' : 'secondary'}
                      appearance="outline"
                      className="text-[10px] h-4.5 px-1.5 font-normal capitalize"
                    >
                      {member.status}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate" title={member.email}>
                  {member.email}
                </span>
              </div>
            </div>
          );
        },
        size: 280,
        meta: {
          skeleton: (
            <div className="flex items-center gap-3 py-1 min-w-[220px]">
              <Skeleton className="size-8.5 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 w-full max-w-[180px]">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ),
        },
      },
      ...productColumnsList.map((product) => ({
        id: `access_${product.id}`,
        header: ({ column }) => (
          <div className="flex flex-col items-center justify-center text-center w-full">
            <span className="text-xs font-semibold text-foreground" title={product.label}>
              {product.name}
            </span>
          </div>
        ),
        cell: ({ row }) => {
          const member = row.original;
          const userAccess = getUserAccess(member);
          const isChecked = userAccess.includes(product.id);

          return (
            <div className="flex items-center justify-center">
              <Checkbox
                className="cursor-pointer"
                checked={isChecked}
                onCheckedChange={() => handleCheckboxClick(member, product, isChecked)}
                aria-label={`${product.name} access for ${member.name || member.email}`}
              />
            </div>
          );
        },
        size: 70,
        enableSorting: false,
        meta: {
          skeleton: (
            <div className="flex items-center justify-center">
              <Skeleton className="size-4.5 rounded-md" />
            </div>
          ),
        },
      })),
    ];
  }, [productColumnsList, localAccessMap, members]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Members</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage organization members and configure per-product access permissions.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {totalCount} {totalCount === 1 ? 'member' : 'members'}
        </span>
      </div>

      <div className=" pt-2">
        {!isLoading && !isFetching && members.length === 0 && !debouncedSearch ? (
          <EmptyScreen
            title="No members found"
            description="There are currently no members in this organization."
            icon={<Users className="size-8 text-muted-foreground" />}
          />
        ) : (
          <Table
            data={members}
            columns={columns}
            search={searchQuery}
            setSearch={setSearchQuery}
            searchPlaceholder="Search members by name, email..."
            pagination={pagination}
            setPagination={setPagination}
            totalCount={totalCount}
            totalPages={totalPages}
            isLoading={isLoading || isFetching}
            showPagination={totalCount > pagination.pageSize}
            cardHeading={false}
            gird={false}
            className='w-full'
          />
        )}
      </div>

      {/* Reusable Confirmation Dialog for Granting/Revoking Product Access */}
      <ConfirmDialog
        open={confirmState.open}
        setOpen={(open) => {
          if (!open) {
            setConfirmState({ open: false, member: null, product: null, isRevoke: false });
          } else {
            setConfirmState((prev) => ({ ...prev, open }));
          }
        }}
        onConfirm={handleConfirmToggle}
        variant={confirmState.isRevoke ? 'destructive' : 'info'}
        title={confirmState.isRevoke ? 'Revoke Access' : 'Grant Access'}
        confirmButton={
          <Button variant={confirmState.isRevoke ? 'destructive' : 'primary'}>
            {confirmState.isRevoke ? 'Revoke Access' : 'Grant Access'}
          </Button>
        }
        dialog={
          <span>
            Are you sure you want to{' '}
            <span className="font-semibold text-foreground">
              {confirmState.isRevoke ? 'revoke' : 'grant'}
            </span>{' '}
            <span className="font-semibold text-foreground">
              {confirmState.product?.label && confirmState.product.label !== confirmState.product.name
                ? `${confirmState.product.name} (${confirmState.product.label})`
                : confirmState.product?.name || confirmState.product?.id}
            </span>{' '}
            access {confirmState.isRevoke ? 'from' : 'to'}{' '}
            <span className="font-semibold text-foreground">
              {confirmState.member?.name
                ? `${confirmState.member.name} (${confirmState.member.email})`
                : confirmState.member?.email}
            </span>
            ?
          </span>
        }
      />
    </div>
  );
}

export default MembersTab;
