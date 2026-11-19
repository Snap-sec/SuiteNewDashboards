import { useMemo, useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { useGetAimGlobalAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { Button } from '@/components/ui/button';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import Table from '@/components/custom/table';

export default function AssetGroupAssetPicker({
  selection,
  setSelection,
  disabled = false,
}) {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(search, 300);
  const { currentData, isFetching, isLoading, error, refetch } =
    useGetAimGlobalAssetsQuery({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch,
    });
  const data = currentData?.data;
  const selectedCount = Object.values(selection).filter(Boolean).length;
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        id: 'value',
        header: 'Asset',
        accessorFn: (row) => row.displayName || row.value || row._id,
        enableSorting: false,
      },
      {
        id: 'type',
        header: 'Type',
        accessorFn: (row) => row.type ?? '—',
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {selectedCount} selected. Selections are kept across pages and
          searches.
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !selectedCount}
          onClick={() => setSelection({})}
        >
          Clear Selection
        </Button>
      </div>
      {error ? (
        <div role="alert" className="space-y-2">
          <p className="text-sm text-destructive">
            {error?.data?.message || 'Unable to load catalog assets.'}
          </p>
          <Button type="button" variant="outline" onClick={refetch}>
            Retry
          </Button>
        </div>
      ) : (
        <Table
          data={data?.assets ?? []}
          columns={columns}
          isLoading={isLoading || isFetching || disabled}
          pagination={pagination}
          setPagination={(updater) =>
            setPagination((previous) => {
              const next =
                typeof updater === 'function' ? updater(previous) : updater;
              return next.pageSize !== previous.pageSize
                ? { ...next, pageIndex: 0 }
                : next;
            })
          }
          totalPages={data?.pagination?.totalPages ?? 1}
          totalCount={data?.pagination?.total ?? 0}
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setPagination((previous) => ({ ...previous, pageIndex: 0 }));
          }}
          searchPlaceholder="Search catalog assets..."
          rowSelection={selection}
          setRowSelection={setSelection}
          showColumnVisibility={false}
        />
      )}
    </fieldset>
  );
}
