import Table from '@/components/custom/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';





const columns = [
  {
    accessorKey: 'assetType',
    header: ({ column }) => (
      <DataGridColumnHeader title="Asset Type" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-1'>
          {GetAssetTypeInfo(row?.original?.type).icon}
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
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    id: 'currentCount',
    header: ({ column }) => (
      <DataGridColumnHeader title="Current Asset Count" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <p className='className="block font-medium text-sm text-mono hover:text-primary break-words whitespace-normal"'>
          {row?.original?.total}
        </p>
      );
    },
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'Change',
    header: ({ column }) => (
      <DataGridColumnHeader title="Risks" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap text-success">
        {row?.original?.risks}
      </div>
    ),
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'Change',
    header: ({ column }) => (
      <DataGridColumnHeader title="Risks Reduced" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap text-success">
        {row?.original?.risks_resolved}
      </div>
    ),
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
];


function CurrentPostureTable({ data = [{}], isLoading }) {


  if (isLoading) {
    return (
      <Skeleton className="h-[200px]" />
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base leading-none tracking-tight font-normal text-sm text-gray-500">Current Attack Surface Posture</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end items-stretch grow p-0 flexTheButton">
        <Table
          data={data}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(row) => console.log('Row clicked:', row)}
          showPagination={false}
          cardHeading={false}
        />
      </CardContent>
    </Card>
  )
}

export default CurrentPostureTable;