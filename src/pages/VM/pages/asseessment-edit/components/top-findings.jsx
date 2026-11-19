import { Link } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Badge } from '@/components/ui/badge';
import { hasUnresolvedBlocker } from '@/lib/helpers';

const columns = [
  {
    id: 'title',
    accessorFn: (row) => row.title,
    header: ({ column }) => <DataGridColumnHeader title="Title" column={column} />,
    cell: ({ row }) => {
      const table = row.original;
      const isBlocked = hasUnresolvedBlocker(table?.comments);
      return (
        <div>
          <Link
            to={`/vm/vulnerability-report?id=${table?._id}&assessmentId=${table?.assessmentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="leading-none font-medium text-sm text-mono hover:text-primary line-clamp-2 flex items-center gap-1.5"
          >
            <span>{table.title}</span>
            {isBlocked && (
              <Badge size="sm" variant="destructive" appearance="outline">
                Blocked
              </Badge>
            )}
          </Link>
          {/* <p className="text-gray-500 whitespace-normal break-words text-xs mt-1">
            {table?.affectedAssets?.[0]?.assetName ||
              table?.affectedAssets?.[0]?.value ||
              'No Associated Asset'}
          </p> */}
        </div>
      );
    },
    enableSorting: false,
    size: 300,
    meta: {
      skeleton: (
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      ),
    },
  },
  {
    id: 'owner',
    accessorFn: (row) => row.assignee?.name,
    header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
    cell: ({ row }) => {
      const table = row.original;
      return table.assignee?.name && table.assignee?.email && table.assignee?.userId ? (
        <Profile
          name={table.assignee.name}
          email={table.assignee.email}
          showEmail={false}
          userId={table.assignee.userId}
          role={table.assignee.role}
        />
      ) : (
        <span className="text-muted-foreground">No Owner</span>
      );
    },
    enableSorting: false,
    size: 150,
    meta: {
      skeleton: (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col w-full gap-1">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-2.5 w-28 rounded-md" />
          </div>
        </div>
      ),
    },
  },
  {
    id: 'state',
    accessorFn: (row) => row.state,
    header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
    cell: ({ row }) => <StateLabels state={row.original.state} />,
    enableSorting: false,
    size: 120,
    meta: {
      skeleton: <Skeleton className="h-5 w-full rounded-full" />,
    },
  },
  {
    id: 'severity',
    accessorFn: (row) => row.cvssRating,
    header: ({ column }) => <DataGridColumnHeader title="Severity" column={column} />,
    cell: ({ row }) => <SeverityLabel severity={row.original.cvssRating} />,
    enableSorting: false,
    size: 120,
    meta: {
      skeleton: <Skeleton className="h-5 w-full rounded-md" />,
    },
  },
  {
    id: 'createdAt',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => <DataGridColumnHeader title="Reported" column={column} />,
    cell: ({ row }) => <DateFormatter date={row.original.createdAt} />,
    enableSorting: false,
    size: 120,
    meta: {
      skeleton: <Skeleton className="h-4 w-full rounded-md" />,
    },
  },
];

const TopFindings = ({ data = [], loading }) => {
  const [params] = useSearchParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500">Top 5 Vulnerabilities</CardTitle>
      </CardHeader>
      <CardContent className="p-0 border-t">
        <Table
          data={data}
          columns={columns}
          isLoading={loading}
          pagination={{ pageIndex: 0, pageSize: 5 }}
          grid
          cardHeading={false}
          showPagination={false}
          enableSearch={false}
          showColumnVisibility={false}
          className="border-none shadow-none rounded-none"
        />
      </CardContent>
      <CardFooter className="justify-center pt-6 border-t">
        {loading ? (
          <Skeleton className="h-4 w-36 rounded-md" />
        ) : (
          <Button mode="link" underlined="dashed" asChild>
            <Link to={`/vm/vulnerabilities?filters=assessmentId:${params.get('assessmentId')}`}>
              View All Vulnerabilities
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export { TopFindings };