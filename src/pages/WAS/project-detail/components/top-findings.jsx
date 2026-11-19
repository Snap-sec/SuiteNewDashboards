import { Download } from 'lucide-react';
import { Link } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Table from '@/components/custom/table';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import { StateLabels } from '@/components/custom/state-labels';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

const TopFindings = ({ data }) => {
  const [params] = useSearchParams();

  const columns = [
    {
      id: 'id',
      accessorFn: row => row._id,
      header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
      cell: ({ row }) => (
        <span className="text-sm text-foreground">
          {row.original._id?.slice(-7, -1)}
        </span>
      ),
      size: 100,
      enableSorting: false,
    },
    {
      id: 'title',
      accessorFn: row => row.title,
      header: ({ column }) => <DataGridColumnHeader title="Title" column={column} />,
      cell: ({ row }) => (
        <Link
          to={`/vm/vulnerability-report?id=${row.original?._id}&assessmentId=${row.original?.assessmentId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="leading-none font-medium text-sm text-mono hover:text-primary"
        >
          {row.original.title}
        </Link>
      ),
      size: 300,
      enableSorting: false,
    },
    {
      id: 'owner',
      accessorFn: row => row.assignee,
      header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
      cell: ({ row }) => (
        row.original.assignee ? (
          <Profile name={row.original.assignee.name} email={row.original.assignee.email} />
        ) : (
          <span className="text-muted-foreground text-sm">No Owner</span>
        )
      ),
      size: 200,
      enableSorting: false,
    },
    {
      id: 'status',
      accessorFn: row => row.state,
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => <StateLabels state={row.original.state} />,
      size: 150,
      enableSorting: false,
    },
    {
      id: 'reported',
      accessorFn: row => row.createdAt,
      header: ({ column }) => <DataGridColumnHeader title="Reported" column={column} />,
      cell: ({ row }) => <DateFormatter date={row.original.createdAt} />,
      size: 150,
      enableSorting: false,
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Vulnerabilities</CardTitle>
        <Button variant="outline">
          <Download size={20} />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table
          grid
          data={data || []}
          columns={columns}
          enableSearch={false}
          showPagination={false}
          cardHeading={false}
          className="border-0 shadow-none rounded-none"
        />
      </CardContent>
      <CardFooter className="justify-center border-t py-4">
        <Button mode="link" underlined="dashed" asChild>
          <Link
            to={`/vm/vulnerabilities?filters=assessmentId:${params.get('assessmentId')}`}
          >
            View All Vulnerabilities
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { TopFindings };
