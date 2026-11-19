import { DropdownMenu2 } from '@/partials/dropdown-menu/dropdown-menu-2';
import { Download, EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import { StateLabels } from '@/components/custom/state-labels';

const TopFindings = ({ data }) => {
  const [params] = useSearchParams();

  const renderItem = (table, index) => {
    return (
      <TableRow key={index}>
        <TableCell className="text-sm text-foreground">
          {table._id?.slice(-7, -1)}
        </TableCell>
        <TableCell className="lg:text-start">
          <Link
            to={`/vm/vulnerability-report?id=${table?._id}&assessmentId=${table?.assessmentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="leading-none font-medium text-sm text-mono hover:text-primary"
          >
            {table.title}
          </Link>
        </TableCell>
        <TableCell className="text-sm text-foreground lg:text-start">
          {table.assignee ? (
            <Profile name={table.assignee.name} role={table.assignee.email} />
          ) : (
            <span className="text-muted-foreground">No Owner</span>
          )}
        </TableCell>
        <TableCell className="text-sm text-foreground lg:text-start">
          <StateLabels state={table.state} />
        </TableCell>
        <TableCell className="text-sm text-foreground lg:text-start">
          <DateFormatter date={table.createdAt} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Vulnerabilities</CardTitle>
        <Button variant="outline">
          <Download size={20} />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/60">
              <TableHead className="min-w-6 h-10">ID</TableHead>
              <TableHead className="min-w-50 text-start h-10">Title</TableHead>
              <TableHead className="min-w-50 text-start h-10">Owner</TableHead>
              <TableHead className="min-w-30 text-start h-10">Status</TableHead>
              <TableHead className="min-w-16 text-start h-10">
                Reported
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((table, index) => {
              return renderItem(table, index);
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center">
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
