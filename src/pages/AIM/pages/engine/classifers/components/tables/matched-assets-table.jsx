import { useState } from 'react';
import { useGetPolicyMatchedAimAssetsQuery } from '@/services/asset-inventory/policyApi';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import useDebounce from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { formatDate } from '@/lib/helpers';

export default function MatchedAssetsTable({ policyId }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);
  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isLoading,
    isFetching,
  } = useGetPolicyMatchedAimAssetsQuery(
    {
      policyId,
      params: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        sort: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      },
    },
    { skip: !policyId }
  );

  const columns = [
    {
      id: 'assetValue',
      accessorFn: (row) => row.value,
      header: ({ column }) => <DataGridColumnHeader title="Asset" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <Badge variant="secondary" className="capitalize" title={GetAssetTypeInfo(row?.original?.type)?.label}>
              {GetAssetTypeInfo(row?.original?.type)?.icon}
            </Badge>
            <span className="text-secondary-foreground font-medium break-words truncate overflow-hidden whitespace-nowrap" title={row?.original?.value}>
              {row?.original?.value}
            </span>
          </div>
          <span className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap" title={row.original.name}>
            {row.original.name}
          </span>
        </div>
      ),
      enableSorting: false,
      size: 250,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
      cell: ({ row }) => (
        <span className="capitalize">{row?.original?.type || '-'}</span>
      ),
      enableSorting: true,
      size: 35,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => <DataGridColumnHeader title="Detected On" column={column} />,
      cell: ({ row }) => (
        <span className="text-[12px]">{formatDate(row?.original?.createdAt)}</span>
      ),
      enableSorting: true,
      size: 35,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
  ];

  return (
    <Table
      data={data?.data || []}
      columns={columns}
      enableSorting={true}
      isLoading={isLoading || isFetching}
      totalPages={data?.pagination?.totalPages || 0}
      totalCount={data?.pagination?.total || 0}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      search={search}
      setSearch={setSearch}
      manualPagination={true}
      manualSorting={true}
      enableSearch={true}
      searchPlaceholder="Search matched assets..."
    />
  );
}
