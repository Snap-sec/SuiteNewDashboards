import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';
import CustomFieldDropdown from './dropdowns/custom-field-dropdown';
import DataTypeBadge from '@/components/custom/data-type-badge';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const getColumns = (schema) => [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataGridColumnHeader title="Field" column={column} />,
    cell: ({ row }) => {
      const field = row.original;
      return (
        <div className="flex flex-col ">
          <span className="font-semibold text-sm">{field.name}</span>
          {field.description && (
            <span className="text-xs text-muted-foreground">{field.description}</span>
          )}
        </div>
      );
    },
    enableSorting: false,
    size: 200,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-10" />,
    },
  },
  {
    id: 'key',
    accessorKey: 'key',
    header: ({ column }) => <DataGridColumnHeader title="Field Key" column={column} />,
    cell: ({ row }) => {
      const field = row.original;
      return (
        <div>
          <span className="font-semibold text-sm">{field.key}</span>
        </div>
      );
    },
    enableSorting: false,
    size: 150,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-10" />,
    },
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
    cell: ({ row }) => {
      const field = row.original;
      const typeLabel = schema?.data_types?.find((t) => t.id === field.type)?.label || field.type;
      return <DataTypeBadge type={field.type} label={typeLabel} />;
    },
    enableSorting: false,
    size: 110,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'assetTypes',
    accessorKey: 'assetTypes',
    header: ({ column }) => <DataGridColumnHeader title="Applies To" column={column} />,
    cell: ({ row }) => {
      const field = row.original;
      const assetTypes = field.assetTypes || [];
      const firstApp = assetTypes[0];
      const remainingAssetTypes = assetTypes.slice(1);

      if (!firstApp) return null;

      const firstTypeInfo = GetAssetTypeInfo(firstApp);

      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge
            variant="secondary"
            className="capitalize flex items-center gap-1.5"
          >
            <span className="text-muted-foreground">{firstTypeInfo.icon}</span>
            {firstTypeInfo.label}
          </Badge>
          {remainingAssetTypes.length > 0 && (
            <DetailedHoverPopover
              popoverTitle="Applies To"
              buttonText={`+${remainingAssetTypes.length} more`}
              popoverContent={
                <div className="flex flex-wrap gap-1.5">
                  {remainingAssetTypes.map((app, idx) => {
                    const typeInfo = GetAssetTypeInfo(app);
                    return (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="capitalize flex items-center gap-1.5"
                      >
                        <span className="text-muted-foreground">{typeInfo.icon}</span>
                        {typeInfo.label}
                      </Badge>
                    );
                  })}
                </div>
              }
            />
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
    id: 'required',
    accessorKey: 'required',
    header: ({ column }) => <DataGridColumnHeader title="Required" column={column} />,
    cell: ({ row }) => {
      const field = row.original;
      return field.required ? (
        <div className="flex items-center gap-1.5 text-sm">
          <Check className="size-4 text-green-600" />
          <span className="font-medium text-foreground">Required</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Optional</span>
      );
    },
    enableSorting: false,
    size: 80,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
    cell: ({ row }) => <CustomFieldDropdown row={row} />,
    enableSorting: false,
    size: 40,
    meta: {
      headerClassName: '',
    },
  },
];

const CustomFieldsList = ({
  data = [],
  schema,
  paginationData,
  isLoading,
  search,
  setSearch,
  page,
  limit,
  setPage,
  setLimit,
  toolbar,
}) => {
  const [rowSelection, setRowSelection] = useState({});
  const columns = useMemo(() => getColumns(schema), [schema]);

  return (
    <Table
      data={data}
      columns={columns}
      isLoading={isLoading}
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search fields..."
      pagination={{ pageIndex: page - 1, pageSize: limit }}
      setPagination={(updater) => {
        if (typeof updater === 'function') {
          const next = updater({ pageIndex: page - 1, pageSize: limit });
          setPage(next.pageIndex + 1);
          setLimit(next.pageSize);
        } else {
          setPage(updater.pageIndex + 1);
          setLimit(updater.pageSize);
        }
      }}
      totalPages={paginationData?.totalPages || 0}
      totalCount={paginationData?.total || 0}
      toolbar={toolbar}
      enableSorting={false}
      searchWidth="60"
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
};

export default CustomFieldsList;
