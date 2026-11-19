import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { StateLabels } from '../../../../../components/custom/state-labels';
import SeverityLabel from '../../../../../components/custom/severity-label';

import { CustomTooltip } from '@/components/custom/tooltip';

const columns = [
  {
    accessorKey: 'assetType',
    header: ({ column }) => (
      <DataGridColumnHeader title="Asset Type" column={column} />
    ),
    cell: ({ row }) => (
      <p className="block font-medium text-sm text-mono break-words whitespace-normal">
        {row?.original?.associatedAsset?.subdomain}
      </p>
    ),
    size: 130,
    meta: {
      headerClassName: 'w-[130px]',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataGridColumnHeader title="Reason" column={column} />
    ),
    cell: ({ row }) => (
      <CustomTooltip text={row?.original?.reason || "N/A"}>
        <p className=" text-sm text-mono truncate max-w-[500px]">
          {row?.original?.reason || "N/A"}
        </p>
      </CustomTooltip>
    ),
    size: 200,
    meta: {
      headerClassName: 'w-[90px]',
      cellClassName: 'w-[90px]',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'currentCount',
    header: ({ column }) => (
      <DataGridColumnHeader title="State" column={column} />
    ),
    cell: ({ row }) => (
      <p className="block font-medium text-sm text-mono hover:text-primary break-words whitespace-normal">
        <StateLabels state={row?.original?.state} />
      </p>
    ),
    enableSorting: false,
    size: 80,
    meta: {
      headerClassName: 'w-[80px]',
      cellClassName: 'w-[80px]',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'Change',
    header: ({ column }) => (
      <DataGridColumnHeader title="Severity" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap text-success">
        <SeverityLabel severity={row?.original?.severity} />
      </div>
    ),
    enableSorting: false,
    size: 30,
    meta: {
      headerClassName: 'w-[30px]',
      cellClassName: 'w-[30px]',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'spacer',
    header: '',
    cell: () => null,
    enableSorting: false,
    size: 0,
    meta: {
      headerClassName: 'w-full',
      cellClassName: 'w-full',
    },
  },

];


function TopExposure({ data = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-normal text-sm text-gray-500">Top Critical Risks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
                <Skeleton className="h-5 w-100" />
                <Skeleton className="h-5 w-100" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500">Top Critical Risks</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-0">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 py-6 mt-20">
            No data available.
          </p>
        ) : (
          <Table
            data={data}
            columns={columns}
            onRowClick={(row) => console.log('Row clicked:', row)}
            showPagination={false}
            cardHeading={false}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default TopExposure;
