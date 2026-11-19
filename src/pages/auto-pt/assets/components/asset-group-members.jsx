import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import {
  useAddAssetGroupMembersMutation,
  useGetAssetGroupMembersQuery,
  useRemoveAssetGroupMemberMutation,
  useRemoveAssetGroupMembersMutation,
} from '@/services/asset-inventory/assets/assetGroupsApi';
import { useGetAimGlobalAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Table from '@/components/custom/table';

export default function AssetGroupMembers({ id }) {
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selection, setSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const debouncedSearch = useDebounce(search, 300);
  const debouncedType = useDebounce(type, 300);
  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    sortBy: sorting[0]?.id ?? 'createdAt',
    sort: sorting.length ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
  };
  const members = useGetAssetGroupMembersQuery(
    { id, ...params, ...(debouncedType ? { type: debouncedType } : {}) },
    { skip: adding },
  );
  const catalog = useGetAimGlobalAssetsQuery(params, { skip: !adding });
  const [addMembers, { isLoading: addPending }] =
    useAddAssetGroupMembersMutation();
  const [removeMembers, { isLoading: removePending }] =
    useRemoveAssetGroupMembersMutation();
  const [removeMember, { isLoading: removeOnePending }] =
    useRemoveAssetGroupMemberMutation();
  const busy = addPending || removePending || removeOnePending;
  const query = adding ? catalog : members;
  const response = query.currentData;
  const payload = response?.data;
  const rows = Array.isArray(payload) ? payload : (payload?.assets ?? []);
  const paging = payload?.pagination ?? response;
  const assetIds = Object.keys(selection).filter((key) => selection[key]);

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <DataGridTableRowSelectAll />
          </AuthorityGuard>
        ),
        cell: ({ row }) => (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <DataGridTableRowSelect row={row} />
          </AuthorityGuard>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        id: 'value',
        header: ({ column }) => (
          <DataGridColumnHeader title="Asset" column={column} />
        ),
        accessorFn: (row) => row.displayName || row.value || row._id,
        enableSorting: true,
      },
      {
        id: 'type',
        header: ({ column }) => (
          <DataGridColumnHeader title="Type" column={column} />
        ),
        accessorFn: (row) => row.type ?? '—',
        enableSorting: true,
      },
      {
        id: 'vulnerabilities',
        header: 'Vulnerabilities',
        accessorFn: (row) => row.security?.vulnerability_stats?.total ?? 0,
        enableSorting: false,
      },
      {
        id: 'remediation',
        header: 'Remediation',
        accessorFn: (row) => `${row.security?.remediation_progress ?? 0}%`,
        enableSorting: false,
      },
    ],
    [],
  );

  const reset = () => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    setSelection({});
  };
  const toggleMode = () => {
    setAdding(!adding);
    setSearch('');
    setType('');
    setSorting([]);
    reset();
  };
  const saveMembers = async () => {
    if (busy || !assetIds.length) return;
    try {
      const result = adding
        ? await addMembers({ id, assetIds }).unwrap()
        : assetIds.length === 1
          ? await removeMember({ id, assetId: assetIds[0] }).unwrap()
          : await removeMembers({ id, assetIds }).unwrap();
      const modifiedCount = result?.data?.modifiedCount;
      toast.success(
        modifiedCount === undefined
          ? adding
            ? 'Assets added to group'
            : 'Assets removed from group'
          : `${modifiedCount} asset${modifiedCount === 1 ? '' : 's'} ${adding ? 'added to' : 'removed from'} group`,
      );
      setSelection({});
      setPagination((previous) => ({ ...previous, pageIndex: 0 }));
      if (adding) {
        setAdding(false);
        setSearch('');
        setType('');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Unable to update group assets.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-sm font-medium">
          {adding ? 'Select catalog assets to add' : 'Member Assets'}
        </h3>
        <AuthorityGuard forbidRoles={['Auditor']}>
          <div className="flex gap-2">
            <Button variant="outline" disabled={busy} onClick={toggleMode}>
              {adding ? 'Back to Members' : 'Add Assets'}
            </Button>
            {adding ? (
              <Button disabled={busy || !assetIds.length} onClick={saveMembers}>
                {busy ? 'Adding…' : `Add Selected (${assetIds.length})`}
              </Button>
            ) : (
              <ButtonWithConfirm
                confirm
                variant="destructive"
                disabled={busy || !assetIds.length}
                onConfirm={saveMembers}
                confirmTitle="Remove Selected Assets?"
                dialog="The selected assets will be removed from this group. They will remain in the catalog."
              >
                {busy ? 'Removing…' : `Remove Selected (${assetIds.length})`}
              </ButtonWithConfirm>
            )}
          </div>
        </AuthorityGuard>
      </div>
      {!adding && (
        <Input
          aria-label="Filter members by asset type"
          placeholder="Filter by type (e.g. subdomain, ip)"
          value={type}
          disabled={busy}
          onChange={(event) => {
            setType(event.target.value);
            reset();
          }}
        />
      )}
      {query.isError ? (
        <div role="alert" className="space-y-2">
          <p className="text-sm text-destructive">
            {query.error?.data?.message || 'Unable to load assets.'}
          </p>
          <Button variant="outline" onClick={query.refetch}>
            Retry
          </Button>
        </div>
      ) : (
        <Table
          data={rows}
          columns={columns}
          isLoading={query.isLoading || query.isFetching || busy}
          totalPages={paging?.totalPages ?? 1}
          totalCount={paging?.total ?? 0}
          pagination={pagination}
          setPagination={(updater) => {
            setPagination((previous) => {
              const next =
                typeof updater === 'function' ? updater(previous) : updater;
              return next.pageSize !== previous.pageSize
                ? { ...next, pageIndex: 0 }
                : next;
            });
            setSelection({});
          }}
          rowSelection={selection}
          setRowSelection={setSelection}
          sorting={sorting}
          setSorting={(updater) => {
            setSorting(updater);
            reset();
          }}
          enableSorting
          search={search}
          setSearch={(value) => {
            setSearch(value);
            reset();
          }}
          searchPlaceholder="Search assets..."
        />
      )}
    </div>
  );
}
