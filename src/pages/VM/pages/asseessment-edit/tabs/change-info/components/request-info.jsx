import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '../../../../../../../lib/helpers';

const RequestInformation = ({ changeRequestData, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="pt-3.5 pb-3.5 py-8 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  const items = [
    {
      label: 'Request Title',
      info: changeRequestData?.requestTitle || 'N/A',
    },
    {
      label: 'Requester',
      info: changeRequestData?.requesterNameOrTeam || 'N/A',
    },
    {
      label: 'Contact',
      info: changeRequestData?.contactEmailOrPhone || 'N/A',
    },
    {
      label: 'Date of Request',
      info: formatDate(changeRequestData?.dateOfRequest) || 'N/A',
    },
    {
      label: 'Ticket ID',
      info: changeRequestData?.changeRequestTicketId || 'N/A',
    },
    {
      label: 'Go-Live Date',
      info: formatDate(changeRequestData?.plannedGoLiveDate) || 'N/A',
    },
  ];

  const renderItems = (item, index) => (
    <TableRow key={index} className="border-0">
      <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
        {item.label}
      </TableCell>
      <TableCell className="text-sm text-mono pb-3 py-2">{item.info}</TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-3.5 pb-3.5 py-8">
        <Table>
          <TableBody>{items.map(renderItems)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { RequestInformation };
