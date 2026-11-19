import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import Table from '@/components/custom/table';

const columns = [
  {
    accessorKey: 'assetType',
    header: ({ column }) => (
      <DataGridColumnHeader title="Asset Type" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Badge variant="secondary" appearance="outline">
            {GetAssetTypeInfo(row?.original?.type).icon}
          </Badge>
          <p className="block font-medium text-sm text-mono break-words whitespace-normal">
            {GetAssetTypeInfo(row?.original?.type).label}
          </p>
        </div>
      );
    },
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },

  {
    id: 'currentCount',
    header: ({ column }) => (
      <DataGridColumnHeader title="Current Asset Count" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-base font-medium text-sm">
            {row?.original?.total}
          </span>
          <span className="text-xs text-muted-foreground">Assets</span>
        </div>
      );
    },
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },
  {
    id: 'Change',
    header: ({ column }) => (
      <DataGridColumnHeader title="Exposure Signals" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-baseline gap-1">
        <span className="text-base font-medium text-sm">
          {row?.original?.total_signals}
        </span>
        <span className="text-xs text-muted-foreground">Signals</span>
      </div>
    ),
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },
  {
    id: 'Change',
    header: ({ column }) => (
      <DataGridColumnHeader title="Exposures" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-baseline gap-1">
        <span className="text-base font-medium text-sm">
          {row?.original?.total_risks}
        </span>
        <span className="text-xs text-muted-foreground">Exposures</span>
      </div>
    ),
    enableSorting: false,
    size: 20,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },
];

function CurrentPostureTable({ data = [], isLoading }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base leading-none tracking-tight font-normal text-sm text-gray-500">
          Current Attack Surface Posture
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end items-stretch grow p-0 flexTheButton">
        <Table
          data={data}
          columns={columns}
          isLoading={isLoading}
          pagination={{ pageIndex: 0, pageSize: 5 }}
          // onRowClick={(row) => console.log('Row clicked:', row)}
          showPagination={false}
          cardHeading={false}
          grid
        />
      </CardContent>
    </Card>
  );
}

export default CurrentPostureTable;
